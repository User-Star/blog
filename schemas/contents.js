/**
 * Created by Summer on 2016/12/17.
 */
var mongoose=require("mongoose");
/*
* 内容的表结构
* */
module.exports = new mongoose.Schema({
    //关联字段---内容 分类Id
    category:{
        //数据库ObjectId类型
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    //关联字段---用户 用户Id
    user:{
        //数据库ObjectId类型
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    //添加时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //点击量
    views:{
        type:Number,
        default:0
    },
    title:String,
    profile:{
        type:String,
        default:""
    },
    content:{
        type:String,
        default:""
    },
    comments:{
        type:Array,
        default:[]
    }
});