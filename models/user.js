/**
 * Created by Summer on 2017/10/17.
 */
var mongoose=require("mongoose");
var userSchema=require("../schemas/users");
module.exports=mongoose.model("User",userSchema);