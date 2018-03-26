/**
 * Created by Summer on 2018/3/16.
 */
//提交评论
$("#messageBtn").on("click",function(){
    $.ajax({
        type:"POST",
        url:"/api/comment/post",
        data:{
            contentId:$("#contentId").val(),
            content:$("#messageContent").val()
        },
        success:function(e){
            $("#messageContent").val("");
            readComments(e.data.comments);
            console.log(e);
        },error:function(e){
            console.log(e.message)
        }

    })
});
$.ajax({
    type:"get",
    url:"/api/comment?contentId="+$("#contentId").val(),
    success:function(e){
        readComments(e.data);
    },error:function(e){
        console.log(e.message)
    }
});
function readComments(data){
    var html="";
    for(var i=data.length-1;i>=0;i--){
        html+='<div class="panel panel-default"><div class="panel-heading">'+data[i].username+'</div><div class="panel-body"><p>'+data[i]._content+'</p></div><ul class="list-group"><li class="list-group-item">'+new Date(data[i].postTime).Format()+'</li></ul></div>';
    }
    $(".comment-list").html(html);
    $(".messageCount").text(data.length);
}

//格式化日期
Date.prototype.Format=function(){
    return this.getFullYear()+"年"+this.getMonth()+1+"月"+this.getDay()+"日 "+this.getHours()+":"+this.getMinutes()+":"+this.getSeconds();
};