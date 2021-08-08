 $(function(){

    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd:[
            /^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'
            ] ,
        samePwd:function(value){
            if(value===$('[name=oldPwd]').val()){
                return '新旧密码不能相同！';
            }
        },
        reSamePwd:function(value){
            if(value!==$('[name=newPwd]').val()){
                return '两次新密码不一致！';
            }
        }
    })

    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/modifypwd",
            data: $(this).serialize(),
            success: function (response) {
                if(response.flag==false&&response.code==20010){
                    //重置表单
                    $('.layui-form')[0].reset();
                    return layer.msg(response.message);
                }
                if(response.flag){
                    //重置表单
                    $('.layui-form')[0].reset();
                    return layer.msg(response.message);
                }else{
                    return layer.msg(response.message);
                }
            }
        });

    })




 })