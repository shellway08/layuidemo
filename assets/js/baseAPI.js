//注意：每次调用$.get() 或者$.post() 或者$.ajax()的时候
//会先调用ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options){
    //console.log(options.url);
    //在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = "http://localhost:8888" + options.url
    //console.log(options);
    //console.log(options.url);

    //统一为有权限的接口设置Header参数
    if(options.url.indexOf('/my/')!==-1){
        var storage = window.localStorage; 
        options.headers={
            token:storage.getItem('Authorization')||'' 
        }
    }

    //全局统一挂载回调函数：
    options.complete=function(res){
       // console.log(res);

        if(res.responseJSON.flag==false&&res.responseJSON.code==30020){
             //1.强制清除token
            localStorage.removeItem('Authorization');
            //2.强制跳转回登陆页面 res.responseJSON.flag==false||
            location.href='/login.html';
        }
    }

})