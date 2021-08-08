$(function(){

    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnFileUpload').on('click',function(){
        $('#file').click();
    })

    $('#file').on('change',function(e){
        console.log(e);
       var fileChose=e.target.files
       if(fileChose.length==0){
        return layer.msg('请选择图片');
       }

       //拿到用户选择的文件
       var file = e.target.files[0];
       //根据选择的文件，创建一个对应的 URL 地址：
       var newImgURL = URL.createObjectURL(file);
       $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

    })

    $('#sureFileUpload').on('click',function(e){

        var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                   }).toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar:dataURL
            },
            success: function (response) {
                if(response.flag&&response.code==10031){
                    //调用父类的getUserInfo()方法同步更新左菜单栏的头像
                    window.parent.getUserInfo();
                    return layer.msg(response.message);
                }
                layer.msg(response.message);

            }
        });

    })


})