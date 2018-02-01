/**
 * Created by Summer on 2016/12/11.
 */
var express=require("express");
var router=express.Router();
var Category=require("../models/category");
var Content=require("../models/content");
//首页
router.get("/",function(req,res,next){
    var data={
        userInfo:req.userInfo,
        categories:[],
        page: {
            _page:Number(req.query.page||1),
            limit: 10,
            pages:0
        }
    };
    //获取分类信息
    Category.find().then(function(categories){
        data.categories=categories;
        return Content.count();
    }).then(function(count){
        data.page.pages= Math.ceil(count/data.page.limit);
        data.page._page=Math.min(data.page._page,data.page.pages);
        data.page._page=Math.max(data.page._page,1);
        data.page.count=count;
        //data.page.url="";
        return Content.find().limit(data.page.limit).skip((data.page._page-1)*data.page.limit).populate(["category","user"]).sort({
            addTime:-1
        });
    }).then(function(contents){
        data.contents=contents;
        res.render("main/index",data);
    });
    //console.log(req.userInfo);

});
module.exports=router;