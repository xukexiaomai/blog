var express = require('express');
var path = require('path');
var favicon = require('serve-favicon'); //收藏图标中间件
var logger = require('morgan'); //日志中间件
var cookieParser = require('cookie-parser'); //解析cookie中间件
var bodyParser = require('body-parser'); //解析body数据中间件
var session = require("express-session")
var flash = require('connect-flash');//
var routes = require('./routes/index'); //路由  分模块实现路由  首页
var users = require('./routes/users');    //用户
var login = require('./routes/login')
var article = require('./routes/article');

var app = express();

// view engine setup 设置模板引擎和模板存放路径
app.set('views', path.join(__dirname, 'views')); // 拼接路径
app.set('view engine', 'ejs');

app.use(session({
  secret:'xiaomai',
  resave:false
  //saveUninitialized:
}))
app.use(flash())
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //静态文件
app.use(function(req,res,next){
  res.locals.error = req.flash('error').toString();
  res.locals.success = req.flash('success').toString();
  res.locals.yourname = req.session.yourname;
  res.locals.user = req.session.user || req.flash('yourname').toString();
  next()
})
app.use('/', routes);
app.use('/users', users);
app.use('/login', login);

// catch 404 and forward to error handler
//捕获404请求，第一个路径参数为空，所以没有上面的路径就会走这里哈哈
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
