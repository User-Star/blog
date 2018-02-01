/**
 * Created by Summer on 2017/10/17.
 */
var mongoose=require("mongoose");
var contentSchema=require("../schemas/contents");
module.exports=mongoose.model("Content",contentSchema);