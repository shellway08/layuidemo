$(function(){

    var layer = layui.layer
    //初始化文章分类数据
    initArtCateList();
    function initArtCateList(){
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (response) {
                //console.log(response);
                if(response.flag){
             //只要导入了第一步的模板引擎JS文件，就可以调用template()函数
                 var htmlStr = template('tpl-table',response);
                    $('tbody').html(htmlStr);
                   // return layer.msg(response.message);
                }else{
                    return layer.msg(response.message);
                }
            }
        });
    }


    var addArtlayer=null;
    $('#btnAddCate').on('click',function(){
        addArtlayer=layer.open({
            type:1,
            title: '添加文章分类',
            area:['500px','250px'],
            content: $('#dialog-add').html()
          });  
    })

    //通过body来代理form-add点击事件，
    //因为这个页面是动态加入的，不能直接绑定form-add点击事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();

        $.ajax({
            method: "POST",
            url: "/my/article/addArtCate",
            data: $(this).serialize(),
            success: function (response) {
                if(response.flag&&response.code==10041){
                   initArtCateList();
                   layer.close(addArtlayer);
                   return layer.msg(response.message);
                }
                layer.msg(response.message);
            }
        });
    })

    var form = layui.form
    var editArtlayer=null;
    $('tbody').on('click','#btnEditCate',function(){
        editArtlayer=layer.open({
            type:1,
            title: '修改文章分类',
            area:['500px','250px'],
            content: $('#dialog-edit').html()
          }); 
     //     console.log(allData);

        var id = $(this).attr('data-id');
        //console.log(id);
        $.ajax({
            method: "GET",
            url: "/my/article/cates/"+id,
            success: function (response) {
                //console.log(response.data)
                if(response.flag&&response.code==10041){
                    form.val('formToValue', response.data);
                }else{
                    return layer.msg(response.message);
                }
            }
        });
    })


    //通过body来代理form-edit点击事件，
    //因为这个页面是动态加入的，不能直接绑定form-edit点击事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/editArtCate",
            data: $(this).serialize(),
            success: function (response) {
                if(response.flag&&response.code==10041){
                   layer.close(editArtlayer);
                   initArtCateList();
                   layer.msg(response.message);
                }else{
                    return layer.msg(response.message);
                }
                
            }
        });
    })

    
    $('tbody').on('click','.btn-delete',function(e){
        e.preventDefault();
        //拿到删除按钮对应的属性值
        var deleteId= $(this).attr('data-id');
        console.log(deleteId);
        layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: "POST",
                url: "/my/article/deleteArtCate/"+deleteId,
                success: function (response) {
                    if(response.flag&&response.code==10021){
                        layer.msg(response.message);
                        layer.close(index);
                        initArtCateList();
                    }else{
                        return layer.msg(response.message);
                    }
                }
            });
          });
    })

})