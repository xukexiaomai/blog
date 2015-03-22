var express = require('express');
var router = express.Router()
var User = require('../model/User');
var crypto = require('crypto')//md5加密


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login/login');

});
router.get('/logout', function(req, res, next) {
    req.session.user = null;
    req.session.yourname = null;
    req.flash('success','退出成功');
    res.redirect('/');
});

router.post('/', function(req, res, next) {
    var password = crypto.createHash('md5').update(req.body.password).digest('hex');
    User.get(req.body.username,function(err,user){
        if(err){
            req.flash('error','查询出错');
            return res.redirect('back');
        }else {
            if(user){
                if(user.password != password){
                    req.flash('error','密码错误,请重新输入');
                    return res.redirect('back');
                }else{
                    req.session.user = user;
                    req.session.yourname = user.yourname;
                    req.flash('success','登录成功');
                    req.flash('yourname',user.yourname);
                    res.redirect('/');
                }
            }else{
                req.flash('error','用户名不存在,请重新输入');
                return res.redirect('back');
            }
        }
    });
})

module.exports = router;
