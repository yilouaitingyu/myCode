/**
 * Created by lizhao on 2016/4/6.
 */
define(['Util',
        'Compts',
        'text!module/example/test.tpl'],
    function(Util,Compts,tpl){
        //系统变量-定义该模块的根节点
        var $el = $(tpl);
        //系统变量-构造函数
        var initialize = function(){

            //将根节点赋值给接口
            this.content = $el;
        };


        return initialize;
    });