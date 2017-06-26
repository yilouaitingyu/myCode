define(['Util','list','date','detailPanel','timer','select','selectTree','dialog','indexLoad','tab'],   
	function(Util,list,Date,DetailPanel,Timer,Select,SelectTree,Dialog,IndexLoad,Tab){
		var list;
		var $el;
		var processinfo;
		var workItem;
		var _index;
		var _options
		IndexLoad(function(indexModule, options) {
			_index=indexModule;
			_options=options;
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
		    //获取登录人信息 放到_options里边
		    crossAPI.getIndexInfo(function(info){
		    	_options.loginStaffId=info.userInfo.staffId;
		    	_options.loginStaffName=info.userInfo.staffName;
		    	_options.userInfo = info.userInfo;
            })
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
		
		
		var eventInit=function(){
			 $('#chairput').on('click',chairPull);//抽屉的拖拉
			 $('#faf_canpull').on('click',fafCanpull);//建单人基本信息			 
			 $('#trajectory_Search').on('click',add_trajectory);			 
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
        	 		  		            	return operateInfo.but_commit(); //如果校验不通过返回false,组织窗口关闭
        	 		  		            	}, //确定按钮的回调函数 
        	 		  		            okValue: commonButton.buttonName,  //确定按钮的文本
        	 		  		            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
        	 		  		            cancelValue: '取消',  //取消按钮的文本
        	 		  		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
        	 		  		            button: [ //自定义按钮组
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
				  _options.processinfo=processinfo;
     			  var supplementComplant = new supplementComplant(_index,_options);
     		      var config2 = {
     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//     		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
     		            title:"补充投诉内容",    //对话框标题
     		            content:supplementComplant.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
     		            ok:function(){
     		            	var context=supplementComplant.supplementComplant();
     		            	//补充投诉内容回显；
     		            	$("#aor_Secyellconaga").val(context);
     		            	
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
        	            okValue: '确定',  //确定按钮的文本
        	            cancel: function(){
        	            },  //取消按钮的回调函数
        	            cancelValue: '取消',  //取消按钮的文本
        	            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
        	            width:800,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
        	            height:380, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
        	            skin:'dialogSkin',  //设置对话框额外的className参数
        	            fixed:false, //是否开启固定定位 默认false不开启|true开启
        	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
        	            modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
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
				    	  title:'投诉基本信息',
				    	  icon:'touzhujilu', //图标的class，用户配置该项时，在tab标题文字的前端生成一个span标签
				    	  click:function(e, tabData){
				    		  require([''+pageUrl],function(BasicMessage){
				    			  var basicMessage = new BasicMessage(_index,_options);
				    			  tab.content(basicMessage.content);
				    			  // 建单人基本信息列表
			                  		require(['js/workflow/outlayer/staffBasicInfo'], function(StaffBasicInfo) {
			                        	new StaffBasicInfo(_options,basicMessage.getOrderInfo());
			                    	});
			                  		// 建单人信息列表样式修改
			                        editStyle();
			                      if (Object.keys(_options).length > 15) {
			                          setInputsVal();
			                      };
			                     
			                    	// 在工单详情页面的输入框是不可编辑的状态
				                      $("#aor_tabContainer input").each(function() {
						    	           $(this).prop("disabled","disabled");
						    	      });
						    	      $("#aor_tabContainer select").each(function() {
						    	           $(this).prop("disabled","disabled");
						    	      });
						    	      $("#aor_tabContainer textarea").each(function(){
						    	           $(this).prop("disabled","disabled");
						    	      })			                     			                     
				    		  });
				    	  }
				      },
				      {
				    	  title:'流程记录',
				    	  click:function(e,tabData){
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
				    	  }
				      },
				      {
				    	  title:'操作信息',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/oneservicecompain/operateInfo'],function(operateInfo){
				    			  var operateInfo = new operateInfo(_index,_options);
				    			  tab.content(operateInfo.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'附件(0)',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/oneservicecompain/attachUpdate'],function(firserBag){
				    			  var firserBag = new firserBag(_index,_options);
				    			  tab.content(firserBag.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'历史工单查询',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/oneservicecompain/historyWorkInfo'],function(historyWorkInfo){
				    			  var historyWorkInfo = new historyWorkInfo(_index,_options);
				    			  tab.content(historyWorkInfo.content);
				    		  });
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
	                            		if(val=="0045"){
	                            			return "创建并启动工单";
	                            		}else if(val=="0051"){
	                            			return "派单";
	                            		}else if(val=="0052"){
	                            			return "处理"
	                            		}else if(val=="0061"){
	                            			return "工单回复"
	                            		}else if(val=="0004"){
	                            			return "指派工单";
	                            		}else if(val=="0008"){
	                            			return "认领工单";
	                            		}else if(val=="0009"){
	                            			return "释放工单";
	                            		}else if(val=="0005"){
	                            			return "回退工单";
	                            		}else if(val=="0010"){
	                            			return "阶段建议";
	                            		}else if(val=="0016"){
	                            			return "催办工单";
	                            		}else if(val=="1001"){
	                            			return "加入白班工单池";
	                            		}else if(val=="1002"){
	                            			return "加入夜班工单池";
	                            		}else if(val=="0035"){
	                            			return "终止工单";
	                            		}
                                  }
	                            },
	                            //{text: '负责组/人', name: 'operator'},
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