$(function () {
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  $('#link_login').on('click', function () {
    $('.reg-box').hide()
    $('.login-box').show()
  })

var form = layui.form
var layer = layui.layer
form.verify({
  username: [
    /^\w{6,12}$/,'必须由字母、数字、下划线组成，<br/>并且长度为6到12位'
       ] ,

  pwd: [
    /^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'
       ] ,
  repwd: function(value){
      var pwd=$(".reg-box [name=password]").val();
      if(pwd != value)
      {return '两次密码不一致'}
  }
  });   

  //监听注册表单的事件
  $("#form_reg").on('submit',function(e){
      //1.阻止默认的表单提交
       e.preventDefault()
       var data = {username:$("#form_reg [name=username]").val(),
                   password:$("#form_reg [name=password]").val()}
       //使用ajxa提交表单
       $.post("/user/hello",data,
               function(rep){
                 layer.msg(rep);
                 //模拟人的点击行为
                 $('#link_login').click();
               })
  })

  $("#form_login").submit(function (e) { 
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: "/user/hello",
      data: $(this).serialize(),
      success: function (response) {
        layer.msg(response);
      }
    });
  });

})

