/**
 * Created by Summer on 2016/12/11.
 */
var express=require("express");
var router=express.Router();
var Category=require("../models/category");
var Content=require("../models/content");

var data={};
//通用数据
router.use(function(req,res,next){
    data={
        userInfo:req.userInfo,
        categories:[],
        where:{}
    };
    if(req.query.category){
        data.where={category:req.query.category}
    }
    Category.find().then(function(categories){
        data.categories=categories;
        next();
    });

});

//首页
router.get("/",function(req,res,next){
    data.page= {
            _page:Number(req.query.page||1),
            limit: 5,
            pages:0
        };

    //获取分类信息
        Content.where(data.where).count().then(function(count){
        data.page.pages= Math.ceil(count/data.page.limit);
        data.page._page=Math.min(data.page._page,data.page.pages);
        data.page._page=Math.max(data.page._page,1);
        data.page.count=count;
        //data.page.url="";
        return Content.where(data.where).find().limit(data.page.limit).skip((data.page._page-1)*data.page.limit).populate(["category","user"]).sort({
            addTime:-1
        });
    }).then(function(contents){
        data.contents=contents;
        res.render("main/index",data);
    });

});

//详情
router.get("/view",function(req,res){
    var contertId=req.query.contentId;
    Content.findOne({
        _id:contertId
    }).then(function(content){
        data.content=content;
        content.views++;
        content.save();
        res.render("main/view",data)
    });
});
module.exports=router;