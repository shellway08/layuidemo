$(function(){

    var form = layui.form
    var layer = layui.layer
    //定义输入框验证信息
    form.verify({
        nickname:function(value){
            if(value.length>6){
                return '昵称的长度在1~6个字符之间';
            }
        }
    })

    initUserInfo();
    //定义初始化个人基本信息数据
    function initUserInfo(){
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (response) {
                if(response.flag==false){
                    layer.msg(response.message)
                }
                //弹框提醒获取数据情况
                //layer.msg(response.message)
                //调用form.val()方法快速填充表单，
                //要求name的属性值与实体类的属性名称一致
                form.val('formUserInfo',response.data);
            }
        });
    }

    //重置表单的数据
    $('#btnReset').on('click',function(e){
        //阻止表单的默认重置行为
        e.preventDefault();
        //
        initUserInfo();
    })

    $('.layui-btn').on('click',function(e){
        e.preventDefault();
        var reqdata = form.val("formUserInfo"); 
       //$(this).serialize()
        $.ajax({
            method: "POST",
            url: "/my/userUpdate",
            data: JSON.stringify(reqdata),
 //           dataType : 'JSON',
           contentType: "application/json",
 //            contentType: "application/json;charset=UTF-8",
            success: function (response) {
                
                if(response.flag){
                    window.parent.getUserInfo();
                }else{
                    layer.msg(response.message);
                }
            }
        });
    })

})