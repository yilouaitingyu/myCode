define(['Util', 'selectList',
        'text!module/index/screen_loading.tpl', 'dialog','crossAPI'],
    function (Util,SelectList,srreeLoadingTpl,Dialog) {

    //初始化 initIndex 之前，先进行了 systemUserInfoInit
    var _index= $.extend({},crossAPI), _dialog, _param, _dialogId;
    var _root = getBaseUrl () + '/ngwf_he/';
    var objClass = function(callback){
        _index.getIndexInfo(function(param){
            _param=param;
            callback(extendIndex(param), param.iframe.businessOptions, param);
        });
    }
    function getBaseUrl () {
		var ishttps = 'https:' == document.location.protocol ? true: false;
		var url = window.location.host;
		if(ishttps){
			url = 'https://' + url;
		}else{
			url = 'http://' + url;
		}
		return url;
	}
    /**IE8不支持endsWith属性 @modify ywx415655*/
    String.prototype.endsWith = function(str) {
    	var reg = new RegExp(str+"$");
    	return reg.test(this);
    }
    function extendIndex(param){
        $.extend(_index,{
            showDialog:function(title, url, param){
                var config = {};
                if (typeof(title) == 'object') {
                    config = title;
                    config.businessOptions = title.param;
                    config.index = _index;
                } else {
                    config = {
                        title: title,
                        url: url,
                        businessOptions: param,
                        index: _index
                    }
                }
                if (config.url.endsWith('.html') || config.url.endsWith('.htm')){
                    config.url = _root + 'src/' + config.url;
                }else{
                    config.url = _root + 'gate.html#' + config.url;
                }
                // config.url=(_root+"#"+config.url);
                config.id=_dialogId=config.id?config.id:"ngwfDialog"+Math.random();
                crossAPI.showDialog(config)
            },
            showConfirmDialog:function(content,ok,cancel){
                var config = {};
                if (typeof(content) == 'object') {
                    config = content;
                    config.mode = 'confirm';
                    config.index = _index;
                } else {
                    config = {
                        content: content,
                        mode:'confirm',
                        ok: ok,
                        cancel: cancel,
                        index: _index
                    }
                }
                new Dialog(config);
            },
            showTipsDialog:function(content,delayRmove){
                var config = {};
                if (typeof(content) == 'object') {
                    config = content;
                    config.mode = 'tips';
                    config.index = _index;
                } else {
                    config = {
                        content: content,
                        delayRmove:delayRmove,
                        mode:'tips',
                        index: _index
                    }
                }
                new Dialog(config);
            },
            destroyDialog:function(id,param){
                crossAPI.destroyDialog(id?id:_dialogId,param);
            },
            createTab:function(title, url, option){
                var istTditle = '', distUrl = '', distOption = null;
                if (typeof(title) == 'object'){
                    distTitle = title.title;
                    distUrl = title.url;
                    distOption = title.option;
                }else{
                    distTitle = title;
                    distOption = option;
                    if (url.endsWith('.html') || url.endsWith('.htm')){
                        distUrl = _root + 'src/' + url;
                    }else{
                        distUrl = _root + 'gate.html#' + url;
                    }
                }
                crossAPI.createTab.apply(crossAPI, [distTitle, distUrl, distOption]);
            },
            destroyTab:function(){
                crossAPI.destroyTab.apply(crossAPI, agtDeal(arguments));
            },
            getActiveTab:function(){
                return param.iframe
            },
            currentPanel:currentPanel(param), 
            getUserInfo:function(){
                return param.userInfo;
            },
            selectListInit:selectListInit,
            screenLoading:screenLoading()
        });
        return _index
    }
    function agtDeal(agt){
        if(agt.length>1){
            var tmp=[];
            for(var i=0;i<agt.length;i++){
                tmp.push(agt[i])
            }
            return tmp;
        }else {
            return agt
        }
    }

    function currentPanel(param){

        return {
            glbTab:{
                curItem:{
                    data:param.iframe
                }
            }
        }
    }

    function selectListInit(options,param){
        var selectList = new SelectList(options), module = null;
        //options.url=_root+"#"+options.url;
        selectList.on('panelInit', $.proxy(function(){
            require.undef(options.url);
            require([options.url], $.proxy(function(Module){
                //_index.getIndexInfo(function(param){
                    module = new Module(extendIndex(_param),$.extend(_param.iframe.businessOptions,param));
                    selectList.setPanelContent(module.$el);
//                  });
            },this));
        },this));
        selectList.on('confirm', $.proxy(function(){
            if (!module.getChecked){
                console.log('您必须为弹出列表框中的模块设置getChecked方法');
                return false;
            }
            var textStr = '',valueStr = '';
            var items = module.getChecked();
            if (items && items.length){
                textStr = _.map(items, function(item){
                    return item[options.nameField || 'name'];
                }).join(',');
                valueStr = _.map(items, function(item){
                    return item[options.valueField || 'value'];
                }).join(',');
            }else{
                if (typeof(items) == 'object'){
                    textStr = items[options.nameField || 'name'];
                    valueStr = items[options.valueField || 'value'];
                }
            }
            selectList.setText(textStr);
            selectList.setValue(valueStr);
            selectList.trigger('moduleConfirm',items);
        },this));
        return selectList;
    }
    //提交数据的loading页面
    function screenLoading(){
        var $body=$("body"),
            loadingFun=function (is_show,text){
                var $loading=$(".Js_screen-loading");
                if(is_show){
                    if($loading.length){
                        $loading.eq(0).show()
                    }else{
                        var loadingHtml=Util.hdb.compile(srreeLoadingTpl);
                        $body.append(loadingHtml({text:text}))
                    }
                }else{
                    $loading.remove();
                }
            };

        return {
            show:function(text){
                loadingFun(true,text)
            },
            hide:function(){
                loadingFun()
            }
        }
    }

    function showDialog(title, url, param){
        var config = {};
        if (typeof(title) == 'object'){
            config = title;
            config.businessOptions = title.param;
            config.index=_index;

        }else{
            config = {
                title:title,
                url:url,
                businessOptions:param,
                index:_index
            }
        }
        if( new RegExp("^(http(s|)://)").test(config.url)){
            crossAPI.showDialog(config);
            return false
        }
        var dialogUrl = 'js/index/dialog';
        require.undef(dialogUrl);
        require([dialogUrl], $.proxy(function(Dialog){
            _dialog = new Dialog(config);
        },this));
    }

    return objClass;
});

