/**
 * Created by Summer on 2016/12/11.
 */
var express=require("express");
//路由模块
var router=express.Router();
var user=require("../models/user");
var content=require("../models/content");
//统一返回格式
var responseData;
router.use(function(res,req,next){
    responseData={
        code:0,
        message:""
    };
    next();
});


router.get("/user",function(req,res,next){
    res.send("api-user");
});
//注册
/*
* 注册逻辑
* 1、用户名不能为空
* 2、密码不能为空
* 3、两次密码一致
*
* 1、用户是否被注册
*   数据库处理
* */
router.post("/user/register",function(req,res,next){
    //注册信息req.body
    var username=req.body.username;
    var password=req.body.password;
    var respassword=req.body.respassword;
    if(username==""){
        responseData.code=1;
        responseData.message="用户名不能为空";
        res.json(responseData);
        return;
    }
    if(password==""){
        responseData.code=2;
        responseData.message="密码不能为空";
        res.json(responseData);
        return;
    }
    if(password!==respassword){
        responseData.code=3;
        responseData.message="密码不一致";
        res.json(responseData);
        return;
    }

    //数据库用户验证
    user.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            responseData.code=4;
            responseData.message="用户名已经被注册";
            res.json(responseData);
            return;
        }else{
            var _user=new user({
                username:username,
                password:password
            });
            return _user.save();
        }
    }).then(function(newUserInfo){
        responseData.message="注册成功!";
        res.json(responseData);
    });
});

//登录
/*
* 登录逻辑
* 1、验证用户名不能为空
* 2、验证密码不能为空
*
* 1、是否有该用户
* */

router.post("/user/login",function(req,res,next){
    //登录信息验证
    var username=req.body.username;
    var password=req.body.password;
    if(username==""||password==""){
        responseData.code=1;
        responseData.message="用户名或密码不能为空";
        res.json(responseData);
        return;
    }

    //数据库中查询用户名和密码
    user.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        //console.log(userInfo);
        if(userInfo){
            responseData.message="登录成功!";
            responseData.userInfo=userInfo;
            req.cookies.set("userInfo",JSON.stringify(userInfo));
            res.json(responseData);
            return;
        }else{
            responseData.code=2;
            responseData.message="用户名或密码错误!";
            res.json(responseData);
            return;
        }
    });
});

//退出登录
router.get("/user/logout",function(req,res,next){
    req.cookies.set("userInfo",null);
    res.json(responseData);
});

//评论提交
router.post("/comment/post",function(req,res,next){
    var contentId=req.body.contentId||"";
    var postData={
        userId:req.userInfo._id,
        username:req.userInfo.username,
        postTime:new Date(),
        _content:req.body.content
    };
    //查询当前内容信息
    content.findOne({
        _id:contentId
    }).then(function(Content){
        Content.comments.push(postData);
        return Content.save();
    }).then(function(newContent){
        responseData.code=0;
        responseData.message="评论提交成功！";
        responseData.data=newContent;
        res.json(responseData);
    });
});

module.exports=router;