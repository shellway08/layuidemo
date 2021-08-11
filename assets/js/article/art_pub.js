$(function(){

    var layer = layui.layer
    var form = layui.form

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    initCates();
    // 初始化富文本编辑器
    initEditor();
    function initCates(){
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (response) {
                //console.log(response);
                if(response.flag&&response.code==10041){
                    var htmlstr = template('tbl-artPub',response);
                    $('[name=cateId]').html(htmlstr);
                    form.render(); 
                }else{
                    return layer.msg(response.message);
                }
            }
        });
    }

    //点击选择封面按钮，模拟点击隐藏的文件按钮
    $('#btnChooseImg').on('click',function(){
        $('#coverImg').click();
    })

    //监听隐藏的文件按钮
    $('#coverImg').on('change',function(e){
        console.log(e);
        var len = e.target.files;
        if(len==0){
            return layer.msg('请选择图片');
        }
        //1、拿到用户选择的文件
        var file = e.target.files[0]
        //2、根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        //3、先销毁旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image.cropper('destroy').attr('src', newImgURL).cropper(options);

    })

    var state = '已发布';
    $('#btn-caogao').on('click',function(){
        state='草稿';
        console.log(state);
    })
       
    $('#form-pub-data').on('submit',function(e){
        //阻止表单的默认提交行为
        e.preventDefault();
        // console.log('OK');
        //基于form表单，快速创建一个FormData对象
        var fd = new FormData($('#form-pub-data')[0]);
        //循环打印fd对象
        // fd.forEach(function(k,v){
        //     console.log(k,v)
        // })
        // console.log(state);
        fd.append('state',state);
       // console.log(fd);
        $image.cropper('getCroppedCanvas', {width: 400,height: 280}).toBlob(function(blob) {
                 // 得到文件对象后，进行后续的操作
                    fd.append('coverPic',blob);
                    publishArticle(fd);
            })
        
    })

    function publishArticle(fd){
        //循环打印fd对象
        // fd.forEach(function(k,v){
        //     console.log(k,v)
        // })
        $.ajax({
            method: "POST",
            url: "/my/article/addArticle",
            data: fd,
            dataType:'json',
    //      async:true,
    //      cache:false,
            contentType: false,
            processData:false,
   //         dataType: "multipart/form-data",
  //          contentType: "application/json",
            success: function (response) {
                if(response.code==20010){
                    layer.msg(response.message);
                }
                location.href="/article/art_list.html"
                return layer.msg(response.message);
                
            }
        });

    }
})