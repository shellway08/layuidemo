$(function(){
    //调用getUserInfo()获取用户基本信息
    getUserInfo();

    var layer = layui.layer;
    $('#btnLogout').on('click',function(){
        layer.confirm('确定要退出吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            //1.关闭localStorage
            localStorage.removeItem('Authorization');
            //2.跳转回登陆页面
            location.href='/login.html';
            layer.close(index);
          });
    })

})

//获取用户的基本信息
function getUserInfo(){
    var storage = window.localStorage; 
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers:{
        //     token:storage.getItem('Authorization')||'',
        // },
        success: function (response) {
            if(response.code==10020){
                return layui.layer.msg(response.message);
            }
            //调用renderAvatar渲染用户头像
            renderAvatar(response.data);
        },

        //无论成功还是失败，都会执行的函数
        // complete:function(res){
        //     console.log(res);
        //     //1.清除token
        //     localStorage.removeItem('Authorization');
        //     //2.跳转回登陆页面
        //     if(res.responseJSON.flag==false||res.responseJSON.code==10040||res.responseJSON.code==10020){
        //         location.href='/login.html';
        //     }
        // }
    });

}

function renderAvatar(user){
    //1、获取用户昵称，没有昵称，则显示用户名
    var name = user.nickName ||user.userName;
    //2、设置显示昵称
    $('#welcome').html('欢迎&nbsp;&nbsp'+name);
    //3、设置用户头像，按需设置
    if(user.userPic!==null){
        //3.1渲染图片头像
        $('.layui-nav-img').attr('src',user.userPic).show();
        $('.text-avatar').hide();
    }else{
        //3.2渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();

    }
}

