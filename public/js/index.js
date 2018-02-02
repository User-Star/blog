/**
 * Created by Summer on 2017/10/18.
 */
$(function(){
    var $loginBox=$("#loginBox");
    var $registerBox=$("#registerBox");
    //切换注册
    $loginBox.find("a.colMint").on("click",function(){
        $registerBox.show();
        $loginBox.hide();
    });
    //切换登录
    $registerBox.find("a.colMint").on("click",function(){
        $loginBox.show();
        $registerBox.hide();
    });
    //注册
    $registerBox.find("button").on("click",function(){
        $.ajax({
            type:"post",
            url:"/api/user/register",
            data:{
                username:$registerBox.find("[name='username']").val(),
                password:$registerBox.find("[name='password']").val(),
                respassword:$registerBox.find("[name='respassword']").val()
            },
            dataType:"json",
            success:function(result){
                $registerBox.find(".colWarning").html(result.message);
                if(!result.code){
                    //注册成功
                    $loginBox.show();
                    $registerBox.hide();
                }
            },
            err:function(err){
                console.log(err);

            }
        })
    });

    //登录
    $loginBox.find("button").on("click",function(){
        $.ajax({
            type:"post",
            url:"/api/user/login",
            data:{
                username:$loginBox.find("[name='username']").val(),
                password:$loginBox.find("[name='password']").val()
            },
            dataType:"json",
            success:function(result){
                $loginBox.find(".colWarning").html(result.message);
                if(!result.code){
                    //登录成功
                    window.location.reload();
                }
            },
            err:function(err){
                console.log(err);
            }
        })
    });

    //退出
    $("#logout").on("click",function(){
        $.ajax({
            type:"get",
            url:"/api/user/logout",
            success:function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        });

    });


});