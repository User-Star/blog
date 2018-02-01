/**
 * Created by Summer on 2016/12/11.
 */
var express=require("express");
var router=express.Router();
var User=require("../models/user");
var Category=require("../models/category");
var Content=require("../models/content");

router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        res.send("请联系管理员开通管理员权限！！！");
        return
    }
    next();
});

//后台首页
router.get("/",function(req,res,next){
    //res.send("管理首页");
    //console.log(req.userInfo);
    res.render("admin/index",{
        "userInfo":req.userInfo
    })
});

//分类管理页面展示
router.get("/category",function(req,res,next){
    //res.send("分类管理");
    var page ={},_page= Number(req.query.page||1),limit= 10;
    var pages= 0;

    Category.count().then(function(count){
        pages= Math.ceil(count/limit);
        _page=Math.min(_page,pages);
        _page=Math.max(_page,1);
        page.nowPage=_page;
        page.pages=pages;
        page.url="/admin/category";
        //1：升序；-1降序
        Category.find().sort({_id:-1}).limit(limit).skip((_page-1)*limit).then(function(categories){
            res.render("admin/category_index",{
                "userInfo":req.userInfo,
                "categories":categories,
                "page":page
            })
        });
    });
});

//后台用户管理
router.get("/user",function(req,res,next){
    //从数据库中获取用户列表
    /*
    * 分页查询
    * limit查询几条
    * skip忽略几条
    * */

    var page ={},_page= Number(req.query.page||1),limit= 10;
    var pages= 0;

    User.count().then(function(count){
        pages= Math.ceil(count/limit);
        _page=Math.min(_page,pages);
        _page=Math.max(_page,1);
        page.nowPage=_page;
        page.pages=pages;
        page.url="/admin/user";
        User.find().limit(limit).skip((_page-1)*limit).then(function(users){
            res.render("admin/user_index",{
                "userInfo":req.userInfo,
                "users":users,
                "page":page
            })
        });
    });
});

/*
* 添加分类页面
* */
router.get("/category/add",function(req,res,next){
    res.render("admin/category_add",{
        "userInfo":req.userInfo
    })
});

// 添加分类
router.post("/category/add",function(req,res){
    var name=req.body.name || "";
        var Obj={userInfo:req.userInfo,url:""};
        if(!name){
            Obj.class="panel-danger";
            Obj.message="名称不能为空";
            res.render("admin/message",{
            O:Obj
        });
        return;
    }
    Category.count({name:name}).then(function(count){
        if(count){
            Obj.class="panel-danger";
            Obj.message="该分类已存在";
            res.render("admin/message",{
                O:Obj
            });
            return Promise.reject();
        }else{
            return new Category({
                name:name
            }).save();
        }
    }).then(function(newCategory){
        Obj.class="panel-success";
        Obj.message="分类"+newCategory.name+"添加成功";
        Obj.url="/admin/category";
        res.render("admin/message",{
            O:Obj
        });
    });
});

//分类修改页面
router.get("/category/edit",function(req,res){
    //获取要修改分类信息
    var id=req.query.id || "";
    Category.findOne({_id:id}).then(function(category){
        if(!category){
            res.render("admin/message",{
                O:{
                    class:"panel-danger",
                    message:"分类信息不存在",
                    userInfo:req.userInfo,
                    url:""
                }
            });
            return Promise.reject();
        }else{
            res.render("admin/category_edit",{
                userInfo:req.userInfo,
                category:category
            });
        }
    });
});

//分类修改
router.post("/category/edit",function(req,res){
    var name=req.body.name || "";
    var id=req.query.id || "";
    var Obj={userInfo:req.userInfo,url:""};
    if(!name){
        Obj.class="panel-danger";
        Obj.message="分类名不能为空";
        res.render("admin/message",{
            O:Obj
        });
        return;
    } else{
        Category.findOne({_id:id}).then(function(category){

            if(!category){
                res.render("admin/message",{
                        O:{
                            class:"panel-danger",
                            message:"分类信息不存在",
                            userInfo:req.userInfo,
                            url:""
                        }
                });
                return Promise.reject();
            }else{
               if(name==category.name){
                   res.render("admin/message",{
                       O:{
                           class:"panel-danger",
                           message:"分类信息与原信息一致",
                           userInfo:req.userInfo,
                           url:""
                       }
                   });
                   return Promise.reject();
               }else{
                   Category.findOne({
                        name:name
                    }).then(function(category){
                       if(category){
                           res.render("admin/message",{
                               O:{
                                   class:"panel-danger",
                                   message:"已存在同名分类",
                                   userInfo:req.userInfo,
                                   url:""
                               }
                           });
                           return Promise.reject();
                       }else{
                          return  Category.update({
                               _id:id
                           },{
                               name:name
                           });
                       }
                   }).then(function(){
                       res.render("admin/message",{
                           O:{
                               class:"panel-success",
                               message:"分类名称修改成功",
                               userInfo:req.userInfo,
                               url:"/admin/category"
                           }
                       });
                   });
               }
            }
        });
    }
});

//分类删除
router.get("/category/delete",function(req,res){
    var id=req.query.id || "";
    var Obj={userInfo:req.userInfo,url:""};
    if(id){
        Category.findOne({
            _id:id
        }).then(function(category){
            if(category){
                Category.remove({_id:id}).then(function(){
                    res.render("admin/message",{
                        O:{
                            class:"panel-success",
                            message:"删除成功",
                            userInfo:req.userInfo,
                            url:"/admin/category"
                        }
                    });
                });
            }else{
                res.render("admin/message",{
                    O:{
                        class:"panel-danger",
                        message:"找不到该类别",
                        userInfo:req.userInfo,
                        url:""
                    }
                });
            }
        })
    }else{
        res.render("admin/message",{
            O:{
                class:"panel-danger",
                message:"类别ID不能为空",
                userInfo:req.userInfo,
                url:""
            }
        });
    }
});

//内容列表
router.get("/content",function(req,res,next){
    var page ={},_page= Number(req.query.page||1),limit= 10;
    var pages= 0;

    Content.count().then(function(count){
        pages= Math.ceil(count/limit);
        _page=Math.min(_page,pages);
        _page=Math.max(_page,1);
        page.nowPage=_page;
        page.pages=pages;
        page.url="/admin/content";
        Content.find().limit(limit).skip((_page-1)*limit).populate(["category","user"]).sort({
            addTime:-1
        }).then(function(contents){
            res.render("admin/content_index",{
                "userInfo":req.userInfo,
                "contents":contents,
                "page":page
            })
        });
    });
});

//内容修改页面
router.get("/content/edit",function(req,res){
    //获取要修改内容信息
    var id=req.query.id || "";
    Category.find().sort({_id:1}).then(function(categories){
        Content.findOne({_id:id}).then(function(content){
            if(!content){
                res.render("admin/message",{
                    O:{
                        class:"panel-danger",
                        message:"内容不存在",
                        userInfo:req.userInfo,
                        url:""
                    }
                });
                return Promise.reject();
            }else{
                res.render("admin/content_edit",{
                    userInfo:req.userInfo,
                    content:content,
                    categories:categories
                });
            }
        });
    });
});

//内容修改
router.post("/content/edit",function(req,res){
    var _Obj={};
    _Obj.title=req.body.title || "";
    _Obj.profile=req.body.profile;
    _Obj.content=req.body.content;
    _Obj.category=req.body.category;
    var id=req.query.id || "";
    var Obj={userInfo:req.userInfo,url:""};
    if(!_Obj.title){
        Obj.class="panel-danger";
        Obj.message="标题不能为空";
        res.render("admin/message",{
            O:Obj
        });
        return;
    } else{
        Content.findOne({_id:id}).then(function(content){
            if(!content){
                res.render("admin/message",{
                    O:{
                        class:"panel-danger",
                        message:"分类信息不存在",
                        userInfo:req.userInfo,
                        url:""
                    }
                });
                return Promise.reject();
            }else{
                if(_Obj.title!=content.title||_Obj.category!=content.category||_Obj.profile!=content.profile||_Obj.content!=content.content){

                    /*Content.findOne({
                        title:_Obj.title
                    }).then(function(__content){
                        if(__content){
                            res.render("admin/message",{
                                O:{
                                    class:"panel-danger",
                                    message:"该标题文章已存在",
                                    userInfo:req.userInfo,
                                    url:""
                                }
                            });
                            return Promise.reject();
                        }else{

                        }
                    })*/
                    Content.update({
                        _id:id
                    },_Obj).then(function(){
                        res.render("admin/message",{
                            O:{
                                class:"panel-success",
                                message:"内容修改成功",
                                userInfo:req.userInfo,
                                url:"/admin/content"
                            }
                        });
                    });
                }else{
                    res.render("admin/message",{
                        O:{
                            class:"panel-danger",
                            message:"分类信息与原信息一致",
                            userInfo:req.userInfo,
                            url:""
                        }
                    });
                    return Promise.reject();
                }
            }
        });
    }
});

//内容添加页面
router.get("/content/add",function(req,res,next){
    Category.find().sort({_id:1}).then(function(categories){
        res.render("admin/content_add",{
            userInfo:req.userInfo,
            categories:categories
        });
    });
});

//添加内容
router.post("/content/add",function(req,res,next){
    var _content=req.body;
    _content.user=req.userInfo._id;
    if(!_content.title){
        res.render("admin/message",{
            O:{
                class:"panel-danger",
                message:"内容标题不能为空",
                userInfo:req.userInfo,
                url:""
            }
        })
    }
    new Content(_content).save().then(function(rs){
        res.render("admin/message",{
            O:{
                class:"panel-success",
                message:"内容保存成功",
                userInfo:req.userInfo,
                url:"/admin/content"
            }
        })
    });
 });

//内容删除
router.get("/content/delete",function(req,res){
    var id=req.query.id || "";
    var Obj={userInfo:req.userInfo,url:""};
    if(id){
        Content.findOne({
            _id:id
        }).then(function(content){
            if(content){
                Content.remove({_id:id}).then(function(){
                    res.render("admin/message",{
                        O:{
                            class:"panel-success",
                            message:"删除成功",
                            userInfo:req.userInfo,
                            url:"/admin/content"
                        }
                    });
                });
            }else{
                res.render("admin/message",{
                    O:{
                        class:"panel-danger",
                        message:"找不到该内容",
                        userInfo:req.userInfo,
                        url:""
                    }
                });
            }
        })
    }else{
        res.render("admin/message",{
            O:{
                class:"panel-danger",
                message:"类别ID不能为空",
                userInfo:req.userInfo,
                url:""
            }
        });
    }
});
module.exports=router;