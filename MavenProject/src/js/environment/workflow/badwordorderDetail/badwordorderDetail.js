define(['Util','list','date','detailPanel','timer','select','selectTree','dialog','indexLoad','tab','text!module/workflow/outlayer/dealreturn.html'],   
	function(Util,list,Date,DetailPanel,Timer,Select,SelectTree,Dialog,IndexLoad,Tab,dealreturn){
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
		    	dataInit();
            })
			var data = {
		    		"serialno":	options.serialno
		    };
		    Util.ajax.postJson(
		 		  '/ngwf_he/front/sh/workflow!execute?uid=detailData001',
		 			data, function(json, status) {
		 		//初始化基本信息
		 		processinfo=json.beans[0];
		 		console.log(_options);
		 		_options.processinfo = processinfo;
				_options.serviceId = processinfo.srvReqstId;
			    tabContainerInit();
		 	  });
			fafList({}); //初始化列表
		    eventInit();
		    editStyle();
		});	
		$('#chairputbuibot',$el).on('click',function(){
			if($('#foundOrderinfo').hasClass('hide')){
				$('#foundOrderinfo').removeClass('hide').addClass('show');
				$('#chairputbuibot .icon-212102').addClass('icon-2121021').removeClass('icon-212102');
			}else{
				$('#foundOrderinfo').removeClass('show').addClass('hide');
				$('#chairputbuibot .icon-2121021').addClass('icon-212102').removeClass('icon-2121021');
			}
		})
		var dataInit = function (){
		 	var wkdata = {
		 			"serialno":_options.serialno,
		 	        "loginStaffId":_options.loginStaffId,
		 			"workitemid":_options.workItemId
		 	};
		 	Util.ajax.postJson(
		 			'/ngwf_he/front/sh/workflow!execute?uid=detailData003',
		 			wkdata, function(json1, status) {
		 			
		 			workItem = json1.bean;
		 			_options.workItem = workItem;
		 			console.log(workItem);
		 			if(workItem != null){
		 				showButtonOfNode(processinfo,workItem);
		 				//初始化按钮
			 			var nodeData = {
			 					"templateId":processinfo.seqprcTmpltId,
			 					"activityparentId":workItem.prstNodeId
			 			};
			 			//请求后台添加操作按钮
			 			Util.ajax.postJson(
		            	 		'/ngwf_he/front/sh/workflow!execute?uid=nodeData003',
		            	 		nodeData, function(json2, status) {
		            	 		var beans = json2.beans;
		            	 		for(var item in beans){
		            	 			console.log(beans[item]);
		            	 			if(typeof(beans[item].action)!='undefined' && beans[item].action!=""){
		            	 				//解析 为工单添加按钮
			            	 			$("#node-action-button").append(
			            	 					"<a class='btn btn-blue fl' id='"+beans[item].lineid+"' actionId='"+beans[item].actionId+"'>"+beans[item].linename+"</a>");//添加节点按钮
			            	 			//为工单添加操作按钮事件
			            	 			$("#"+beans[item].lineid).bind('click',function(){
			            	 			     $("#nodeActionId").val($(this).attr("actionId"));//点击设置当前操作节点
			            	 			    //根据节点显示不同的操作页面 start
			            	 			    var nodeData = {
			            							"id":$("#nodeActionId").val()
			            					};
			            			         //请求后台获取id对应的nodeAction工单出口配置
			            				    Util.ajax.postJson(
			            	 						'/ngwf_he/front/sh/workflow!execute?uid=nodeData006',
			            	 						nodeData, function(json, status) {
			            	 			         var nodeActionInfo = json.bean;
			            	 			         _options.nodeActionInfo = nodeActionInfo;
			            	 			         require([''+nodeActionInfo.action],function(operateInfo){
			            	 		  			  var operateInfo = new operateInfo(_index,_options);
			            	 		  		      var config = {
			            	 		  		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//			            	 		  		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
			            	 		  		            title:nodeActionInfo.lineName,    //对话框标题
			            	 		  		            content:operateInfo.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
			            	 		  		            ok:function(){
			            	 		  		            	return operateInfo.but_commit(); //如果校验不通过返回false,组织窗口关闭
			            	 		  		            	}, //确定按钮的回调函数 
			            	 		  		            okValue: nodeActionInfo.lineName,  //确定按钮的文本
			            	 		  		            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
			            	 		  		            cancelValue: '取消',  //取消按钮的文本
			            	 		  		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
			            	 		  		            button: [],
			            	 		  		            width:operateInfo.width,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
			            	 		  		            height:operateInfo.height, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
			            	 		  		            skin:'dialogSkin',  //设置对话框额外的className参数
			            	 		  		            fixed:false, //是否开启固定定位 默认false不开启|true开启
			            	 		  		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
			            	 		  		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
			            	 		  		        }
			            	 		  		        var dialog = new Dialog(config)
			            	 		  		  });
			            	 			    })
			            	 			    //根据节点显示不同的操作页面 end
		                                });//添加节点按钮事件
		            	 			}
		            	 		}
		            	});
		 			}
		 	})
		};
		var srInfo = function(){
			var srdata = {
				    	"srId":processinfo.srvReqstId
				};
				Util.ajax.postJson(
				 		'/ngwf_he/front/sh/workflow!execute?uid=detailData004',
				 		srdata, function(json1, status) {
				 		var srInfo =json.beans[0];	
				 		//初始化页面数据
		 				$("input[name=callerno]").val(srInfo.callerno);
		 				
				})

		}
		var eventInit=function(){
			 $('#chairput').on('click',chairPull);//抽屉的拖拉
			 $('#faf_canpull').on('click',fafCanpull);//建单人基本信息
			 $('#trajectory_Search').on('click',add_trajectory);
			 $('#change_back').on('click',change_back);
			 $('#add_supplementComplant').on('click',add_supplementComplant);//补充投诉内容
			 
		};
		//根据配置添加特殊操作按钮
		var showButtonOfNode = function(processinfo,workItem){
			var buttonData = {
					"showPage":"02",
 					//"businessType":processinfo.seqprcTmpltId,
 					"srTypeId":processinfo.srvReqstTypeId,
 					"templateId":processinfo.seqprcTmpltId,
 					//"nodeType":processinfo.seqprcTmpltId,
 					"nodeId":workItem.prstNodeId
 			};
 			//请求后台添加操作按钮
 			Util.ajax.postJson(
        	 		'/ngwf_he/front/sh/workflow!execute?uid=nodeData007',
        	 		buttonData, function(json2, status) {
        	 		var buttons = json2.beans;
        	 		for(var item in buttons){
        	 			$("#add-node-button").append(
        	 					"<a class='btn btn-blue fl' id='"+buttons[item].buttonId+"'>"+buttons[item].buttonName+"</a>");//添加节点按钮
        	 			//为工单添加操作按钮事件
        	 			$("#"+buttons[item].buttonId).bind('click',function(){
        	 			    //根据节点显示不同的操作页面 start
        	 			    var nodeData = {
        							"buttonId":$(this).attr("id")
        					};
        			         //请求后台获取id对应的nodeAction工单出口配置
        				    Util.ajax.postJson(
        	 						'/ngwf_he/front/sh/workflow!execute?uid=nodeData008',
        	 						nodeData, function(json, status) {
        	 			         var commonButton = json.bean;
        	 			         _options.commonButton = commonButton;
        	 			         require([''+commonButton.callJs],function(operateInfo){
        	 		  			  var operateInfo = new operateInfo(_index,_options);
        	 		  		      var config = {
        	 		  		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//        	 		  		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
        	 		  		            title:commonButton.buttonName,    //对话框标题
        	 		  		            content:operateInfo.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
        	 		  		            ok:function(){
        	 		  		            	var result =  operateInfo.but_commit();
        	 		  		            	list.search({});
        	 		  		            	return result;//如果校验不通过返回false,组织窗口关闭
        	 		  		            	}, //确定按钮的回调函数 
        	 		  		            okValue: commonButton.buttonName,  //确定按钮的文本
        	 		  		            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
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
        	 			    })
        	 			    //根据节点显示不同的操作页面 end
                        });//添加节点按钮事件

        	 		}	
        	})
		}
		var add_supplementComplant =function (){
			
			//补充投诉内容；
			require(['js/workflow/outlayer/supplementComplant'],function(supplementComplant){
				  var cont=$("#aor_Secyellconaga").val();
				  _options.workItem=workItem;
				  _options.processinfo=processinfo;
				  _options.cont=cont;
     			  var supplementComplant = new supplementComplant(_index,_options);
     		      var config2 = {
     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//     		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
     		            title:"补充投诉内容",    //对话框标题
     		            content:supplementComplant.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
     		            ok:function(){
     		            	//console.log($("#sddasdasd").serializeObject());
     		            	var context=supplementComplant.supplementComplant();
     		            	
     		            	if(context==false)
     		            		return false;
     		            	else{
     		            		//补充投诉内容回显；
         		            	$("#aor_Secyellconaga").val(context);
         		            	list.search({});
     		            	}
     		            	
     		            	}, //确定按钮的回调函数 
     		            okValue: "确定",  //确定按钮的文本
     		            cancel: function(){
     		            	
     		            },  //取消按钮的回调函数
     		            cancelValue: '取消',  //取消按钮的文本
     		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
     		            button: [ 
     		            ],
     		            width:500,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
     		            height:122, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
     		            skin:'dialogSkin',  //设置对话框额外的className参数
     		            fixed:false, //是否开启固定定位 默认false不开启|true开启
     		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
     		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
     		        }
     		        var dialog = new Dialog(config2)

   		    	
   		    
     		  });
		}
		var change_back =function (){
			
			//追回
			require(['js/workflow/outlayer/dealreturn'],function(operateInfo){
				  _options.workItem=workItem;
				  _options.processinfo=processinfo;
     			  var operateInfo = new operateInfo(_index,_options);
     		      var config2 = {
     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//     		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
     		            title:"追回",    //对话框标题
     		            content:operateInfo.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
     		            ok:function(){
     		            	//console.log($("#sddasdasd").serializeObject());
     		            	operateInfo.but_commit();
     		            	}, //确定按钮的回调函数 
     		            okValue: "确定",  //确定按钮的文本
     		            cancel: function(){
     		            	
     		            },  //取消按钮的回调函数
     		            cancelValue: '取消',  //取消按钮的文本
     		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
     		            button: [ 
     		            ],
     		            width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
     		            height:210, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
     		            skin:'dialogSkin',  //设置对话框额外的className参数
     		            fixed:false, //是否开启固定定位 默认false不开启|true开启
     		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
     		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
     		        }
     		        var dialog = new Dialog(config2)

     		  });
		}
		//轨迹图
		 var add_trajectory=function (){
			//var processInstId =$("#processInstId").val();获取前端实例id;
			 var processInstId = processinfo.seqprcIstncId;
			 var resourceType = "image";
			 var loginStaffId = _options.loginStaffId;
            // 打印当前按钮的文本
        	 var config = {
        	            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
        	            title:'轨迹图',    //对话框标题
        	            content:"<img id=\"modal_t2\"  src='/ngwf_he/front/sh/trajectory!trajectory?uid=trajectoryData001&processInstId="+processInstId+"" +
        	            		"&resourceType="+resourceType+""+
        	            		"&loginStaffId="+loginStaffId+""+
        	            		"'>", //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
        	            ok:function(){
        	            	
        	            }, //确定按钮的回调函数 
        	            okValue: '关闭',  //确定按钮的文本
        	            cancelDisplay:false, //是否显示取消按钮 默认true显示|false不显示
        	            width:800,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
        	            height:380, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
        	            skin:'dialogSkin',  //设置对话框额外的className参数
        	            fixed:false, //是否开启固定定位 默认false不开启|true开启
        	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
        	            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
        	        }
        	 var dialog = new Dialog(config);
        
		 }
		 //轨迹图 end
		//建单人基本信息
		var fafCanpull = function(){
//			console.log("wowoow")
			if($('#faf_buiwasExit').hasClass('hide')){
//				console.log("aaa")
				$('#faf_buiwasExit').addClass('show').removeClass('hide');
				$('#faf_canpull i').addClass('icon-shanglajiantou').removeClass('icon-xialajiantou');
			}else if($('#faf_buiwasExit').hasClass('show')){
				$('#faf_buiwasExit').addClass('hide').removeClass('show');
				$('#faf_canpull i').addClass('icon-xialajiantou').removeClass('icon-shanglajiantou');
			}
		};
		
		//js动态生成选项卡
		var tabContainerInit = function(){
			var pageUrl;
			var routedata = {
	    			//"category":"SRPage", // 类别（目标类别）：SRPage、SRContentTemplate、PBHFlow
	    			"routeKey":processinfo.srvReqstTypeId
	    	}
			Util.ajax.postJson(
						'/ngwf_he/front/sh/workflow!execute?uid=routeTarget',
						routedata, function(json2, status) {
				pageUrl = json2.bean.pageUrl;
		    })
			var config = {
				el:$('#aor_tabContainer'),
				direction:'horizontal',//布局方向 horizontal默认横向|vertical纵向 
				tabs:[
				      {
				    	  title:'举报基本信息',
				    	  icon:'touzhujilu', //图标的class，用户配置该项时，在tab标题文字的前端生成一个span标签
				    	  click:function(e, tabData){
				    		  require(['js/workflow/badwordorderDetail/reportBasicMessage'],function(BasicMessage){
				    			  var basicMessage = new BasicMessage(_index,_options);
				    			  tab.content(basicMessage.content);
				    			  crossAPI.tips(222222222,3000)
				    			  if(_options== null || _options.nodeType!="01"){
				    				  crossAPI.tips("-----",3000)
				                    	// 在工单详情页面的输入框是不可编辑的状态
					                      $("#aor_complainInfo input").each(function() {
							    	           $(this).prop("disabled","disabled");
							    	      });
							    	      $("#aor_complainInfo select").each(function() {
							    	           $(this).prop("disabled","disabled");
							    	      });
							    	      $("#aor_complainInfo textarea").each(function(){
							    	           $(this).prop("disabled","disabled");
							    	      })
				                      }else{
				                    	  $("#saveAgain").removeClass("hide");
				                      }
				    		  });
				    	  }
				      },
				      {
				    	  title:'流程记录',
				    	  click:function(e,tabData){
				    		  $('#aor_complainInfo').removeClass('show').addClass('hide');
				    		  require(['js/workflow/oneservicecompain/flowRecord'],function(FlowRecord){
				    			  var flowRecord = new FlowRecord(_index,_options);
				    			  tab.content(flowRecord.content);
				    			  $(".t-table").each(function(index,element){
				    				  var _height = $(this).height();	  
				    				  $(".flowRecord_bar li").eq(index).css("height",_height+10+"px");
				    				  $(".flowRecord_bar li").eq(index).find(".flowRline").css("height",_height+"px");
				    				  $(".flowRecord_bar li").eq(index).find("span").css("height",_height+10+"px");
				    				  $(".flowRecord_bar").css("visibility","visible");
				    				  $("#detailPaneSecond").css("visibility","visible");
				    			  })
				    		  });
				    		  $("div.operateBtn").removeClass("show").addClass('hide');
				    		  $("#faf_impList").removeClass("show").addClass('hide');
				    	  }
				      },
				      {
				    	  title:'操作信息',
				    	  click:function(e, tabData){
				    		  $('#aor_complainInfo').removeClass('show').addClass('hide');
				    		  require(['js/workflow/oneservicecompain/operateInfo'],function(operateInfo){
				    			  var operateInfo = new operateInfo(_index,_options);
				    			  tab.content(operateInfo.content);
				    		  });
				    		  $("div.operateBtn").removeClass("show").addClass('hide');
				    		  $("#faf_impList").removeClass("show").addClass('hide');
				    	  }
				      },
				      {
				    	  title:'附件(0)',
				    	  click:function(e, tabData){
				    		  $('#aor_complainInfo').removeClass('show').addClass('hide');
				    		  require(['js/workflow/oneservicecompain/attachUpdate'],function(firserBag){
				    			  var firserBag = new firserBag(_index,_options);
				    			  tab.content(firserBag.content);
				    		  });
				    		  $("div.operateBtn").removeClass("show").addClass('hide');
				    		  $("#faf_impList").removeClass("show").addClass('hide');
				    	  }
				      },
				      {
				    	  title:'历史工单查询',
				    	  click:function(e, tabData){
				    		  $('#aor_complainInfo').removeClass('show').addClass('hide');
				    		  require(['js/workflow/oneservicecompain/historyWorkInfo'],function(historyWorkInfo){
				    			  var historyWorkInfo = new historyWorkInfo(_index,_options);
				    			  tab.content(historyWorkInfo.content);
				    		  });
				    		  $("div.operateBtn").removeClass("show").addClass('hide');
				    		  $("#faf_impList").removeClass("show").addClass('hide');
				    	  }
				      }
				      ]
                };
			var tab = new Tab(config);
		};
		
//		抽屉拖拉功能
		var chairPull = function(){
		     if($('.t-columns-group li').hasClass('hide')) {
		    	 $('.t-columns-group li.hide').addClass('show').removeClass('hide');
		         $(this).children('i').addClass('icon-xialajiantou').removeClass('icon-shanglajiantou');
		     } else if($('.t-columns-group li').hasClass('show')) {
		         $('.t-columns-group li.show').addClass('hide').removeClass('show');
		         $(this).children('i').addClass('icon-shanglajiantou').removeClass('icon-xialajiantou');
		     }
		 };
//      动态获取下拉框
		//queryStaticDatadictRest
			var loadDictionary=function(mothedName,dicName,seleId){
				var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
				var seleOptions="";
				
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
					$.each(result.beans,function(index,bean){
						seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
					});
					$('#'+seleId).append(seleOptions);
					console.log(seleOptions);
				},true);
			};
		
		
//		加载列表
		var fafList = function(data){
			var config = {
					el:$('#faf_impList'),
				    field:{ 
				        key:'id',         		        	
				        items: [
				                {text: '开始时间',name:'operatetime',
                        	       render : function(item, val) {
                        		        return val.substring(0,val.length-2);
                                   }
                                },		                       
	                            {text: '受理时间', name: 'operatetime',
                        	        render : function(item, val) {
                        		          return val.substring(0,val.length-2);
                                    }
                                },
	                            {text:'执行人',name:'operatorName'},
	                            {text:'动作',name:'operatetype',
	                            	render : function(item, val) {
	                            		return getActionName("HEBEI.ORDER.OPERATE.TYPE",val);//从数据字典中获取动作名称
                                  }
	                            },
	                            {text:'完成时间',name:'operatetime',
	                            	render : function(item, val) {
	                            		return val.substring(0,val.length-2);
	                                }
	                            },
	                            {text:'操作内容',name:'description'}
	                    ]
				        
				    },
				    page:{
				    	customPages:[5,10,15,20,30,50],
				        perPage:5,    
				        align:'right',
				        total:true
				    },
				    data:{
				        url:'/ngwf_he/front/sh/workflow!execute?uid=detailData002&processinstanceid='+_options.serialno
				    }
				}
			this.list = new list(config);
			this.list.search({});
		};
		// 建单人信息详情样式js修改
		 var editStyle = function($el){
				$("#foundOrderinfo .sn-detailPanel .detailList li label",$el).css("width","35%");
				$("#foundOrderinfo .sn-detailPanel .detailList .theOrderNum span",$el).css({
					"display":"inline-block",
				    "vertical-align":"middle",
				    "padding-bottom":"25px"
				});
		}
		//查询数据字典，根据value获取中文name值；
		var getActionName = function(typeId,value){
			 var actionName;
			 var params = {
		                method: 'staticDictionary_get',
		                paramDatas: '{typeId:"'+typeId+'"}'
            };
            
            Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF', params, function(result) {
                $.each(result.beans, function(index, bean) {
                    if(bean.value == value){
                    	actionName = bean.name;
                    	return false;
                    }
                });   
            },
            true);
            return actionName;
		}
	   // 序列化 输入框的值;
	    $.fn.serializeObject = function() {
	        var json = {};
	        var arrObj = this.serializeArray();
	        $.each(arrObj,function() {
	            if (json[this.name]) {
	                if (!json[this.name].push) {
	                    json[this.name] = [json[this.name]];
	                }
	                json[this.name].push(this.value || '');
	            } else {
	                json[this.name] = this.value || '';
	            }
	        });
	        return json;
	    };
});