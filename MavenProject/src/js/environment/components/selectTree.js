/**
 * Created by lizhao on 2016/3/28.
 */
define(['Util','selectTree'],
    function(Util,Select){

        var fieldsSetting = {
            'SR.USER.LEVEL.SUBS_LEVEL':{ name:'requestTypeBusiness',title:'业务组件弹出树', label:'业务弹出树',childNodeOnly:true,check:true,value:'2'},
            'SR.THE.USER.BELONGS':{ name:'customerAttr', label:'工作组维护', title:'工作组维护', value:'',url:'data/zTree_safe.json'},
            'SR.NODE.TYPE.CURR.NODE.TYPE':{ name:'currNodeType', label:'统一配置平台' , title:'统一配置平台',check:false,value:'',url:'data/zTree_config.json'},
            'SR.WORK.ORDER.OPERATION.TYPE':{ name:'lastOperateType', label:'公告类别' , title:'公告类别', value:'',url:'data/zTree_type.json'}
        };
        var objClass = function(options){
            var field={};
            if (options.codeType){
               field = fieldsSetting[options.codeType] || {
                        label:'字段',
                        name:'name',
                        title:'弹框标题'
                    };
                field.url =( field.url?field.url:'data/selectTree.json');
            }
            var config = $.extend(field,options);
            return new Select(config);

        };

        return objClass;
    });