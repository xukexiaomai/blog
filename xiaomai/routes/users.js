var express = require('express');
var User = require('../model/User');
var crypto = require('crypto')//md5加密
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res, next) {
  //当浏览到user路径时，自动跳转到注册页面
  res.redirect('/users/reg');
});

router.get('/reg', function(req, res, next) {
  res.render('user/reg');
});

router.post('/reg', function(req, res, next) {
  //res.send(req.body);
  //res.redirect('/');//定向跳转
  var username = req.body.username,
      yourname = req.body.yourname,
      password = req.body.password,
      repassword = req.body.repassword,
      email = req.body.email;
  if(!username){
    req.flash('error','用户名不能为空');
    return res.redirect('back');
  }
  if(!password || password !== repassword){
    req.flash('error','两次密码输入不一致');
    return res.redirect('back');
  }
  var md5 = crypto.createHash('md5');
  password = md5.update(password).digest('hex');
  var newUser = new User({
    username : username,
    password : password,
    email : email,
    yourname : yourname
  });
  User.get(username,function(err,user){
    if(err){
      req.flash('error','查询出错');
      return res.redirect('back');
    }else{
      if(user){
        req.flash('error','用户名已存在，请重新输入');
        return res.redirect('back');
      }else{
        newUser.save(function(err,user){
          if(err){
            req.flash('error','注册失败')
            return res.redirect('back');
          }else{
            req.session.user = user;
            req.session.yourname = user.yourname;
            req.flash('success','注册成功');
            res.redirect('/');
          }
        });
      }
    }
  });

});

module.exports = router;
