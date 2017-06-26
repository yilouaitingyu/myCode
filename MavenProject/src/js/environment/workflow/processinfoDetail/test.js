define(['Util','list','date','detailPanel','timer','select','selectTree','dialog','indexLoad','tab','text!module/workflow/outlayer/reject.html'
        ,'text!module/workflow/outlayer/dealback.html','text!module/workflow/outlayer/dealreturn.html'],   
	function(Util,list,Date,DetailPanel,Timer,Select,SelectTree,Dialog,IndexLoad,Tab,reject,dealback,dealreturn){
		var list;
		var $el;
		var processinfo;
		var workItem;
		var _index;
		var _options;
		 
		IndexLoad(function(indexModule, options) {
			_index=indexModule;
			_options=options;
			//获取登录人信息 放到_options里边
		    crossAPI.getIndexInfo(function(info){
		    	_options.loginStaffId=info.userInfo.staffId;
		    	_options.loginStaffName=info.userInfo.staffName;
		    	_options.userInfo = info.userInfo;
            })
		    eventInit();
		});	
		var eventInit=function(){
			 $('#oneCustom').on('click',oneCustom);//报一级客服
			 $('#sendEmos').on('click',sendEmos);//外派EMOS
			 $('#twoCustom').on('click',twoCustom);//报二线客服
			 $('#portSend').on('click',portSend);//借口派发
			 $('#assignBomc').on('click',assignBomc);//外派BMOC
		};
		var oneCustom =function (){
			 
			//报一级客服
			require(['js/workflow/outlayer/pandect'],function(operateInfo){
				  _options.workItem=workItem;
				  _options.processinfo=processinfo;
     			  var operateInfo = new operateInfo(_index,_options);
     		      var config = {
     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
     		            title:"上报一级客服",    //对话框标题
     		            content:operateInfo.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
     		            ok:function(){
     		            	operateInfo.but_commit();
     		            	}, //提交按钮的回调函数 
     		            okValue: "提交",  //提交按钮的文本
     		            cancel: function(){
     		            	
     		            },  //取消按钮的回调函数
     		            cancelValue: '取消',  //取消按钮的文本
     		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
     		            button: [ 
     		            ],
     		            width:operateInfo.width,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
	  		            height:operateInfo.height, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
     		            skin:'dialogSkin',  //设置对话框额外的className参数
     		            fixed:false, //是否开启固定定位 默认false不开启|true开启
     		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
     		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
     		        }
     		        var dialog = new Dialog(config)
     		  });
		}
		var sendEmos =function (){
			 
			//外派EMOS
			require(['js/workflow/outlayer/eomcbuild'],function(operateInfo){
				  _options.workItem=workItem;
				  _options.processinfo=processinfo;
     			  var operateInfo = new operateInfo(_index,_options);
     		      var config = {
     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//     		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
     		            title:"工单外派EMOS",    //对话框标题
     		            content:operateInfo.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
     		            ok:function(){
     		            	//console.log($("#sddasdasd").serializeObject());
     		            	operateInfo.but_commit();
     		            	}, //提交按钮的回调函数 
     		            okValue: "提交",  //提交按钮的文本
     		            cancel: function(){
     		            	
     		            },  //取消按钮的回调函数
     		            cancelValue: '取消',  //取消按钮的文本
     		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
     		            button: [ 
     		            ],
     		            width:operateInfo.width,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
	  		            height:operateInfo.height, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
     		            skin:'dialogSkin',  //设置对话框额外的className参数
     		            fixed:false, //是否开启固定定位 默认false不开启|true开启
     		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
     		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
     		        }
     		        var dialog = new Dialog(config)
     		  });
		}
		var twoCustom =function (){
			 
			//报二线客服
			require(['js/workflow/outlayer/reportSecService'],function(operateInfo){
				  _options.workItem=workItem;
				  _options.processinfo=processinfo;
     			  var operateInfo = new operateInfo(_index,_options);
     		      var config = {
     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//     		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
     		            title:"上报二线客服",    //对话框标题
     		            content:operateInfo.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
     		            ok:function(){
     		            	//console.log($("#sddasdasd").serializeObject());
     		            	operateInfo.but_commit();
     		            	}, //提交按钮的回调函数 
     		            okValue: "提交",  //提交按钮的文本
     		            cancel: function(){
     		            	
     		            },  //取消按钮的回调函数
     		            cancelValue: '取消',  //取消按钮的文本
     		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
     		            button: [ 
     		            ],
     		            width:operateInfo.width,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
	  		            height:operateInfo.height, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
     		            skin:'dialogSkin',  //设置对话框额外的className参数
     		            fixed:false, //是否开启固定定位 默认false不开启|true开启
     		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
     		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
     		        }
     		        var dialog = new Dialog(config)
     		  });
		};
		var portSend =function (){
			 
			//外派BMOC
			require(['js/workflow/outlayer/portSend'],function(operateInfo){
				  _options.workItem=workItem;
				  _options.processinfo=processinfo;
     			  var operateInfo = new operateInfo(_index,_options);
     		      var config = {
     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//     		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
     		            title:"接口派发",    //对话框标题
     		            content:operateInfo.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
     		            ok:function(){
     		            	//console.log($("#sddasdasd").serializeObject());
     		            	operateInfo.but_commit();
     		            	}, //提交按钮的回调函数 
     		            okValue: "提交",  //提交按钮的文本
     		            cancel: function(){
     		            	
     		            },  //取消按钮的回调函数
     		            cancelValue: '取消',  //取消按钮的文本
     		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
     		            button: [ 
     		            ],
		  		        width:operateInfo.width,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
 		  		        height:operateInfo.height, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
     		            skin:'dialogSkin',  //设置对话框额外的className参数
     		            fixed:false, //是否开启固定定位 默认false不开启|true开启
     		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
     		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
     		        }
     		        var dialog = new Dialog(config)
     		  });
		};
		var assignBomc =function (){
			 
			//外派BMOC
			require(['js/workflow/outlayer/systemreturn'],function(operateInfo){
				  _options.workItem=workItem;
				  _options.processinfo=processinfo;
     			  var operateInfo = new operateInfo(_index,_options);
     		      var config = {
     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//     		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
     		            title:"外派BMOC",    //对话框标题
     		            content:operateInfo.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
     		            ok:function(){
     		            	//console.log($("#sddasdasd").serializeObject());
     		            	operateInfo.but_commit();
     		            	}, //提交按钮的回调函数 
     		            okValue: "提交",  //提交按钮的文本
     		            cancel: function(){
     		            	
     		            },  //取消按钮的回调函数
     		            cancelValue: '取消',  //取消按钮的文本
     		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
     		            button: [ 
     		            ],
		  		        width:operateInfo.width,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
 		  		        height:operateInfo.height, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
     		            skin:'dialogSkin',  //设置对话框额外的className参数
     		            fixed:false, //是否开启固定定位 默认false不开启|true开启
     		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
     		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
     		        }
     		        var dialog = new Dialog(config)
     		  });
		}
});