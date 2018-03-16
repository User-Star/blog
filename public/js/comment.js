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
            $("#messageContent").val("")
            readComments(e.data);
            console.log(e);
        },error:function(e){
            console.log(e.message)
        }

    })
});

function readComments(){

}