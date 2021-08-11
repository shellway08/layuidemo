$(function(){
    var layer=layui.layer
    var form = layui.form
    var laypage = layui.laypage;
  // 定义美化时间的过滤器

  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
  var query = {
    pageNum:1, // 页码值，默认请求第一页的数据
    pageSize:10, // 每页显示几条数据，默认每页显示10条
    cateId: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }


    initArtList();
    initArtCate();
function initArtList(){

    $.ajax({
        method: "POST",
        url: "/my/article/list",
        data:JSON.stringify(query),
        contentType: "application/json",
        success: function (response) {
           // console.log(response);
            if(response.flag){
                var htmlstr = template('tpl-table',response);
                $('tbody').html(htmlstr);
                pageRender(response.message);
            }
        }
    });
}

function initArtCate(){
     $.ajax({
        method: "GET",
         url: "/my/article/cates",
//         data:$('query').serialize(),
//         data:JSON.stringify(query),
//         contentType: "application/json",
         success: function (response) {
             if(response.flag){
                var htmlstr = template('tpl-xiala',response);
               // console.log(response);
                $('[name=cate_id]').html(htmlstr);
                form.render();
             }
         }
     });
}

$('#form-artile').on('submit',function(e){
    e.preventDefault();
    var cate_id=$('[name=cate_id]').val();
    var state=$('[name=state]').val();
    //console.log(cate_id);
    //console.log(state);
    query.cateId=cate_id;
    query.state=state;
    initArtList();
})


function pageRender(total){
      //执行一个laypage实例
  laypage.render({
    elem: 'fenyetiao', //注意，这里的 test1 是 ID，不用加 # 号
    count: total, //数据总数，从服务端得到
    curr:query.pageNum,
    limit:query.pageSize,
    limits:[10, 20, 30, 50],
    layout:['count','limit','prev', 'page', 'next','skip'],
    jump: function(obj, first){
        query.pageNum=obj.curr;
       // console.log(query.pageNum);
        query.pageSize=obj.limit;
        //首次不执行
        if(!first){
          //do something
          initArtList();
        }
      }
  });
}

$('tbody').on('click','.btn-delete',function(){
    var deleteid=$(this).attr('delete-id')
    //获取当前的删除按钮还剩的数量
    var btnCount=$('.btn-delete').length
    console.log(btnCount);

    layer.confirm('确定要删除吗?', {icon: 3, title:'提示'}, function(index){
        //do something
        $.ajax({
            method: "GET",
            url: "/my/article/artDelete/"+deleteid,
            success: function (response) {
                if(response.flag&&response.code==10021){
                    //判断当前的删除按钮还剩的数量是不是1
                    if(btnCount==1){
                        //当前页数减1，前提是当前页不能是第一页
                        query.pageNum=query.pageNum==1?1:query.pageNum-1
                    }
                    layer.msg(response.message);
                    initArtList();
                }else{
                    return  layer.msg(response.message);
                }
            }
        });
        layer.close(index);
      });
})




})