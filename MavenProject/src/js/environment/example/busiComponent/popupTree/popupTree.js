/**
 * popupTree 组件示例
 */
define(['Util',
        'Compts',
        'text!module/example/component/popupTree/businessTree.tpl'],
    function(Util,Compts,tpl){

        //系统变量-定义该模块的根节点
        var $el = $(tpl), _indexModule;
        //系统变量-构造函数
        var initialize = function(indexModule, options,tabItem){
            _indexModule = indexModule;
            var selectTree = new Compts.BusinessSelectTree({
                el:$('#selectTree',$el),
                codeType:"SR.USER.LEVEL.SUBS_LEVEL"
            });
            selectTree.on('confirm',function(nodes){
                if(nodes&&nodes[0]){
                    if(nodes[0].isParent){
                        Util.dialog.tips("请选择一个子节点");
                        return false;
                    }
                }else{
                    Util.dialog.tips("请选择一个节点");
                    return false;
                }

            });

            new Compts.BusinessSelectTree({
                el:$('#selectTree1',$el),
                codeType:"SR.THE.USER.BELONGS"
            });
            new Compts.BusinessSelectTree({
                el:$('#selectTree2',$el),
                codeType:"SR.NODE.TYPE.CURR.NODE.TYPE"
            });
            new Compts.BusinessSelectTree({
                el:$('#selectTree3',$el),
                codeType:"SR.WORK.ORDER.OPERATION.TYPE"
            });
            //将根节点赋值给接口
            this.content = $el;
        };


        return initialize;
    });