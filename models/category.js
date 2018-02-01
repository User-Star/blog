/**
 * Created by Summer on 2017/10/17.
 */
var mongoose=require("mongoose");
var categorySchema=require("../schemas/categories");
module.exports=mongoose.model("Category",categorySchema);