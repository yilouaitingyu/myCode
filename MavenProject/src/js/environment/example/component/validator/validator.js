/**
 * Created by lizhao on 2016/2/29.
 * editor 组件示例
 */

define(['Util','Compts','jquery.fileuploader',
    'text!module/example/component/validator/validator.tpl'],
    function(Util,Compts,fileupload,tpl){

        //系统变量-定义该模块的根节点
        var $el = $(tpl),  
        _indexModule = null,
        initialize = function(indexModule, options){
            _indexModule = indexModule;

            //表单验证
            var validator = new Compts.Validator({
                el: $("form", $el),
                submitBtn: $(".btnSearch", $el),
                dialog:true,
                rules:{
                    email:'required|email',
                    mobile:'required|mobile',
                    brand:"required",
                    textarea:"required|min-10"
                },
                messages:{
                    email:{
                        required:"email不能为空",
                        email:"email格式不正确"
                    },
                    mobile:{
                        required:"手机号不能为空",
                        mobile:"手机号格式格式不正确"
                    },
                    brand:{
                        required:"请选择用户品牌"
                    },
                    textarea:{
                        required:"内容不能为空",
                        min:"内容输入字数不能少于10"
                    }
                }
            });

            //验证成功回调
            validator.on("success", function () {
                console.log("验证成功");
            });
            $('#fileupload',$el).fileupload({
                url: 'assets/lib/jqueryPlugin/jQuery-File-Upload/server/php/',
                dataType: 'json',
                done: function (e, data) {
                    $.each(data.result.files, function (index, file) {
                        $('<p/>').text(file.name).appendTo(document.body);
                    });
                }
            });

            //将根节点赋值给接口
            this.content = $el;
        };


        return initialize;
    });