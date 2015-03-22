var mongoose = require('../db');
var crypto = require('crypto')//md5加密
var userSchema = new mongoose.Schema({
    //字段类型定义
    username : String,
    password : String,
    yourname : String,
    email : String,
    avatar : String
},{collection:'user'});
//定义模型，用来执行与数据库的操作
var userModel = mongoose.model('User',userSchema);

function User(user){
    this.username = user.username;
    this.yourname = user.yourname;
    this.password = user.password;
    this.email = user.email;
};

User.prototype.save = function(callback){
    var md5 = crypto.createHash('md5');
    emailMd5 = md5.update(this.email.toLowerCase()).digest('hex');
    avatar = 'https://secure.gravatar.com/avtar/'+emailMd5+'?s=48';

    var newUser = new userModel({
        username : this.username,
        password : this.password,
        yourname : this.yourname,
        email : this.email,
        avatar : avatar
    });

    newUser.save(function(err,user){
        if(err){
            callback(err)
        }else{
            callback(null,user);
        }
    });

}

User.get = function(username,callback){
    userModel.findOne({username:username},function(err,user){
        if(err)
            return callback(err);
        else{
            callback(null,user);
        }
    });
}

module.exports = User;