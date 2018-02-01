/**
 * Created by Summer on 2016/12/11.
 * 应用程序启动入口
 */

//加载express模块
var express=require("express");
//加载模板模块
var swig=require("swig");
//加载数据库模块
var mongoose=require("mongoose");
//加载body parser模块
var bodyParser=require("body-parser");
//加载cookie模块
var cookies=require("cookies");
//引入models文件
var User=require("./models/user");
//创建应用
var app= express();

//设置静态文件托管
//当用户访问public目录下文件直接返回文件，不做处理
app.use("/public",express.static(__dirname+"/public"));

//配置应用模板
//定义当前应用使用的模板引擎
//第一个参数：模板引擎名称（模板的后缀）第二个参数：解析模板引擎内容的方法
app.engine("html",swig.renderFile);

//设置模板文件存放的目录第一个参数必须是views 第二个是目录
app.set("views","./views");
//注册所使用的模板引擎，第一个参数必须是view engine，第二个参数必须和app.engine中定义的模板引擎保持一致
app.set("view engine","html");
swig.setDefaults({cache:false});

//bdoyParser设置
app.use(bodyParser.urlencoded({extended:true}));

//设置cookie
app.use(function(req,res,next){
    req.cookies=new cookies(req,res);

    //解析用户登录信息
    req.userInfo={};
    var _userInfo=req.cookies.get("userInfo");
    if(_userInfo){
        try{
            req.userInfo=JSON.parse(_userInfo);
            //判断用户是否是管理员
            User.findById(req._userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
                next();
            });
        }
        catch(e){
            next();
        }
    }else{
        next();
    }

});

/*app.get('/',function(req,res,next){
    //res.send("<h1>欢迎来到我的博客</h1>");
    /!*
    * 读取指定目录下的文件,解析并返回给客户端
    * 第一个参数，模板的文件，相当于view目录
    * *!/
    res.render("index");
    swig.setDefaults({cache:false})
});*/
//根据不同的功能分模块处理
app.use("/admin",require("./routers/admin"));//后台管理
app.use("/api",require("./routers/api"));//相关接口
app.use("/",require("./routers/main"));//页面展示
/*app.get("/main.css",function(req,res,next){
    res.setHeader("content-type","text/css");
    res.send("body {background:red;}");
});*/

/*
*连接mongoose数据库
* */
mongoose.connect("mongodb://localhost:27017/blog",{useMongoClient: true},function(err){
    if(err){
        console.log("err");
    }else{
        console.log("connected");
    }
});
//监听http请求
app.listen(8080);