define(['crossAPI','Util', 'dialog','validator', 'select', 'selectTree', 'date', 'indexLoad', "detailPanel", "hdb", 'text!module/workflow/outlayer/orderAssigning.html'],
function(CrossAPI,Util,Dialog,Validator, Select, SelectTree, Mydate, IndexLoad, DetailPanel, Hdb, Html_basicMessage) {
    var $el;
	var form1 ;
	var _formValidator;
	var _options ;
		var initialize = function(index, options){
			 $el = $(Html_basicMessage);
		        _index = index;
		        _options = options;
		        this.pageInit();
		};	
		$.extend(initialize.prototype, {
			pageInit: function() {
				
				var config = {
	                    mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
	                    delayRmove:0,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
	                    title:'工单外派EOMS',    //对话框标题
	                    content:$el, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
	                    ok:function(){console.log('点击了确定按钮')}, //确定按钮的回调函数 
	                    okValue: '提交',  //确定按钮的文本
	                    cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
	                    cancelValue: '取消',  //取消按钮的文本
	                    cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
	                    button: [
	                    ],
	                    width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
	                    height:150, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
	                    skin:'dialogSkin',  //设置对话框额外的className参数
	                    fixed:false, //是否开启固定定位 默认false不开启|true开启
	                    quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
	                    modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
	                }
	                var dialog = new Dialog(config)
	        },
		});
		
	return initialize;
});