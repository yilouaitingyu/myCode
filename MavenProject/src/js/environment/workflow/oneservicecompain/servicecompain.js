define(['Util','list','validator',"detailPanel",'date','timer','selectTree','indexLoad','tab','crossAPI','dialog',
        'js/workflow/processinfoDetail/varsOfWorkflow'],   
	function(Util,list,Validator,DetailPanel,Date,Timer,SelectTree,IndexLoad,Tab,CrossAPI,Dialog,vars){
		var list;
		var $el;
		var _index;
		var _options;
		var aorTimerind;
		var pageUrl; //投诉类型对应page
		var flowId;  //对应的templateId
		var serviceId; //对应服务器请求Id
		var srTypeId;
		var nodeActionId;
		IndexLoad(function(indexModule, options) {
			_index=indexModule;
			_options=options;
			srTypeId = "001006"; //对应选择的投诉类型Id 
			//根据所选投诉类型 查询所映射的基本信息页面
			var routedata = {
	    			"routeKey":srTypeId
	    	}
			Util.ajax.postJson(
						'/ngwf_he/front/sh/workflow!execute?uid=routeTarget',
						routedata, function(json2, status) {
				console.log(json2.bean);
				pageUrl = json2.bean.pageUrl;
				flowId = json2.bean.flowId;
				serviceId = json2.bean.serviceId;
				_options.pageUrl = json2.bean.pageUrl;
				_options.serviceId = json2.bean.serviceId;
				_options.templateId = json2.bean.flowId;
				tabContainerInit(pageUrl);
				dateInit(); //初始化模板页面和按钮 
			})	       
		    	eventInit();
		    	aorTimerind();
		    	detailPanelinfo();
		    	editStyle();
		    	directReplyfn();
		});
		var dateInit = function(){    //初始化模板页面和按钮 
	    	var nodeData = {
						"templateId":flowId,   //获取路由目标中的模板
						"activityType":"startEvent"
				};
				//请求后台添加操作按钮
				 Util.ajax.postJson(
 						'/ngwf_he/front/sh/workflow!execute?uid=nodeData005',
 						nodeData, function(json2, status) {
	 						var beans = json2.beans;
	 						$("div.startOperation").empty(); //重新切换页面的时候先清空之前的按钮
	 						for(var item in beans){
	 							//解析 为工单添加按钮
	 							$("div.startOperation").append(
	 									"<a class='btn btn-blue fl' id='"+beans[item].lineid+"' actionId='"+beans[item].actionId+"'>"+beans[item].linename+"</a>");//添加节点按钮
	 							//为工单添加操作按钮事件
	 							$("#"+beans[item].lineid).bind('click',function(){
	 								if(form1.form()){
	 									nodeActionId=$(this).attr("actionId");//点击设置当前操作节点
	 									//根据节点显示不同的操作页面 start
		            	 			    var nodeData = {
		            							"id":nodeActionId
		            					};
		            			         //请求后台获取id对应的nodeAction工单出口配置
		            				    Util.ajax.postJson(
		            	 						'/ngwf_he/front/sh/workflow!execute?uid=nodeData006',
		            	 						nodeData, function(json, status) {
		            	 			         var nodeActionInfo = json.bean;
		            	 			         require([''+nodeActionInfo.action],function(operateInfo){
		            	 		  			  var operateInfo = new operateInfo(_index,_options);
		            	 		  		      var config = {
		            	 		  		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//		            	 		  		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
		            	 		  		            title:nodeActionInfo.linename,    //对话框标题
		            	 		  		            content:operateInfo.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
		            	 		  		            ok:function(){
		            	 		  		            	//console.log($("#sddasdasd").serializeObject());
		            	 		  		            	 
		            	 		  		            	var params={};
		            	 		  		            	params.hildleManId = $("#hildleManId").val();
		            	 		  		            	params.hildleGroupId = $("#hildleGroupId").val();
		            	 		  		            	params.dspsOpinDesc = $("#handingComment").val();
		            	 		  		            	action_submit(nodeActionInfo,params);
		            	 		  		            	}, //确定按钮的回调函数 
		            	 		  		            okValue: nodeActionInfo.linename,  //确定按钮的文本
		            	 		  		            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
		            	 		  		            cancelValue: '取消',  //取消按钮的文本
		            	 		  		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
		            	 		  		            button: [ //自定义按钮组
//		            	 		  		                {
//		            	 		  		                    value: '同意', //按钮显示文本
//		            	 		  		                    callback: function () { //自定义按钮回调函数
//		            	 		  		                        return false; //阻止窗口关闭
//		            	 		  		                    }
//		            	 		  		                }
		            	 		  		            ],
		            	 		  		            width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
		            	 		  		            height:400, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
		            	 		  		            skin:'dialogSkin',  //设置对话框额外的className参数
		            	 		  		            fixed:false, //是否开启固定定位 默认false不开启|true开启
		            	 		  		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
		            	 		  		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
		            	 		  		        }
		            	 		  		        var dialog = new Dialog(config)
		            	 		  		  });
		            	 			    })
		            	 			    //根据节点显示不同的操作页面 end
	 									//$('.t-popup').addClass('show').removeClass('hide');//显示派发窗口
	 								}else{
	 									return;
	 								}
	 				
	 						    });//添加节点按钮事件
	 						}
//	 							$('#aor_Assign').on('click',assignDialog);//展示分派对话框
// 								$('#selectedAcceptP').on('click',selectedAcceptP);//展示分派对话框
// 								$('#aor_submit').on('click',action_submit);//确定 操作按钮	
// 								$('#aor_Save').on('click',save_form);//保存 操作按钮
 							
				})
		};
		
		var eventInit=function(){
			showButtonOfNode();
         //请求员工权限,显示按钮
			reset();
			Util.ajax.postJson('../../../../data/userInfo.json',{},function(result){
				loginStaffId=result.bean.staffId;
				if(result.bean.roleName =="系统管理员"){
					$("#aor_directReply").removeClass("hide");
				}else{
					$("#aor_directReply").addClass("hide");
				}
			},true);
		};
		//根据配置添加特殊操作按钮
		var showButtonOfNode = function(){
			var buttonData = {
					"showPage":"01", //填单页面按钮
 					"srTypeId":srTypeId,
 					"templateId":flowId
 			};
 			//请求后台添加操作按钮
 			Util.ajax.postJson(
        	 		'/ngwf_he/front/sh/workflow!execute?uid=nodeData007',
        	 		buttonData, function(json2, status) {
        	 		var buttons = json2.beans;
        	 		for(var item in buttons){
        	 			$("#add-node-button").append(
        	 					"<a class='btn btn-blue fl' id='"+buttons[item].buttonid+"'>"+buttons[item].name+"</a>");//添加节点按钮
        	 		}	
        	})
		}
		var closeHere = function(){
			$("#popuplayer").addClass('hide').removeClass('show');
		}
		var closeAgainHere = function(){
			$('#workorderhandledialog').addClass('hide').removeClass('show');
		}
//      动态获取下拉框
		//queryStaticDatadictRest
			var loadDictionary=function(mothedName,dicName,seleId){
				var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
				var seleOptions="<option value=' '>请选择</option>";
				// 
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
					$.each(result.beans,function(index,bean){
						seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
					});
					$('#'+seleId).append(seleOptions);
				},true);
			};
		
//		//展示派发选择对话框
		var assignDialog = function(){
			$('.t-popup').addClass('hide').removeClass('show');
			$('.t-popupp').addClass('show').removeClass('hide');
			var config2 = {
                  el:$('#selectAcceptorPers'),
                  label:'单选弹出树',
                  check:false,
                  // async:true,         //是否启用异步树
                  name:'acceptorPers',
                  textField:'name',
                  valueFiled:'id',
                  expandAll:true,
                  childNodeOnly:false,
                  checkAllNodes:true,     //是否显示复选框“全选”
                  url:'../../../../data/selectTree.json'
              };
			var selectTree2 = new SelectTree(config2);
			selectTree2.on('confirm',function(nodes){
				if(nodes[0].isParent){
					$('#handlingStaff').attr("value","");
					$('#handlingRole').val(nodes[0].id);
			    }else{
			    	$('#handlingRole').attr("value","");
			    	$('#handlingStaff').val(nodes[0].id);
			    }
          });
		};
		var selectedAcceptP = function(){
			var acceptorPers=$('input[name=sn-acceptorPers-text]').val();
			$('#aor_Operator').val(acceptorPers);
			$('.t-popup').addClass('show').removeClass('hide');
		}
		//操作按钮绑定
		var action_submit = function(nodeActionInfo,params){
			//初始化信息
			$('#srvReqstId').val(_options.serviceId);
			$('#aor_Basclass').val(srTypeId);
			$('#reqstUrlAddr').val(_options.pageUrl);
			$('#seqprcId').val(_options.flowId);
			$('#processId').val('complaintProcess_kf');
			$('#processDefId').val('complaintProcess_kf:2:2414260656975063D18TH');
			var loginStaffId;
		   //请求后台员工信息.按权限加载按钮
			Util.ajax.postJson('../../../../data/userInfo.json',{},function(result){
				loginStaffId=result.bean.staffId;
			},true);
			$('#loginStaffId').val(loginStaffId);
			var nodeData = {
						"id":nodeActionId
				};
		    //请求后台获取id对应的nodeAction工单出口配置
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=nodeData006',nodeData, function(json, status) {
				var nodeAction = json.bean;
				console.log(json.bean);
				//获取varMap json字符串
				 
				var varMap = vars.varsOfWorkflow(nodeActionInfo,params.hildleGroupId,params.hildleManId);	
				//$("#vars").val(varMap);
				var formJson = $("#aor_form").serializeObject();
				formJson.vars = varMap;
				formJson.nodeId = nodeActionInfo.nodeId; //或者是 activityParentId
				formJson.nodeType = nodeActionInfo.nodeType;
				formJson.nextNodeId = nodeActionInfo.activityId;
				formJson.handlingRole = params.hildleGroupId;
				formJson.handlingStaff = params.hildleManId;
				formJson.dspsOpinDesc = params.dspsOpinDesc;
				formJson.nodeNm = nodeActionInfo.nodeName;
				formJson.nextNodeNm = nodeActionInfo.activityName;
				console.log(formJson);
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=acceptOrder001',formJson,function(result){
					if(result.returnCode =="0")
					{
						crossAPI.tips("添加工单成功",3000);
						CrossAPI.destroyTab('新建受理工单');
					}else{
						crossAPI.tips("添加工单失败，请联系系统管理员。",3000);
					}
				},true);
		    });

	};
	//保存受理工单草稿
	var save_form = function (){
		var config = {
                 el:$('#forms',$el),
                 dialog:true,    //是否弹出验证结果对话框
                 rules:{
                     callerno:"required|mobile",  //主叫号码必须有,并且是手机号格式
		                acceptstaffno:"required",           //受理工号.必须有
		                subslevel:"required",       //客户级别必须有;
		                acceptmode:"required",      //受理方式
		                subsname:"required",        //客户名字
		                contactphone1:'required|mobile', //联系电话1,必须有并且是手机号
		                subsprovince:"required",      //客户省份
		                subscity:"required",          //客户地市
		                furtherhandle:"required",     // 跟进处理
		                complainway:"required",       // 投诉途径
		                nettype:"required",           //网络类别
		                acceptcity:"required",        //受理地市
		                subordinatecounties:"required",  //下级县区输入框验证
		                potentialupgradeflag:"required",  //是否潜在升级
		                focusproblemtype :"required",     //集中问题分类
		                businesshallrelate:"required",   //营业厅相关
		                subsnumbersite:"required",       //受理号码归属地
		                complaincontent:"required|min-10", // 投诉内容
		                content:"required|min-10"           //设置name=content 的元素为必填项，并且字数不能小于10
                 },
                 messages:{
                     time:{ //设置name=startTime 元素的消息
                         required:"",            //用户未填写该字段时提示
                         date:"开始日期格式不正确"    //日期格式验证失败时提示
                     },
                     content:{
                         min:"内容输入字数不能少于10"
                     }
                 }
            };
	 	    var form1 = new Validator(config);
			if(form1.form()){
				$('#srvReqstId').val(_options.serviceId);
				$('#aor_Basclass').val(srTypeId);
				$('#reqstUrlAddr').val(_options.pageUrl);
				$('#seqprcId').val(_options.flowId);
				var formJson = $("#aor_form").serializeObject();
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=acceptOrder002',formJson,function(result){
					if(result.returnCode =="0")
					{
						crossAPI.tips("保存工单成功",3000);
						CrossAPI.destroyTab('新建受理工单');
					}else{
						crossAPI.tips("保存工单失败，请联系系统管理员。",3000);
					}
				},true);
			}else{
				return;
			    }		
	};
		//投诉类型查询模态框 start
		//model追加到html
		var add_model =function (){
				/*$('#complaintype').on('focus',modal_box);*/
				var model_div="<div class=\"t-popup t-popup-layer hide\" id=\"modal\">"+
						"<div class=\"t-popup-overlay\"></div>"+
						"<div class=\"t-popup-container\">"+
						"	<div class=\"t-popup-title\">"+
						"		<h3 style=\"width:95%;height:30px;text-align:center;\">投诉类型查询</h3>"+
							"	<a  title=\"关闭\"  href=\"#nogo\" id=\"cancelx\">×</a>"+
						"	</div>"+
						"	<div class=\"t-popup-content\">"+
						"		<label class=\"coms\" for=\"comClass\">投诉类型:</label>"+
						"		<input type=\"text\" id=\"comClass\" name=\"comClass\" style=\"width:390px;height:25px;\">"+
						"		<a class=\"btn btn-dark bttn\"  id =\"complant_Search\">搜索</a>"+
						"		<div id=\"modal_b\" class=\"modals\">"+
						"		</div>"+
						"	</div>"+
						"	<div class=\"t-popup-bottom\">"+
						"	 <a href=\"#\" class=\"btn btn-blue\" id=\"aor_submit1\">提交</a>"+
						"	 <a href=\"#nogo\" class=\"btn btn-blue\" id=\"cancels\">取消</a>"+
						"	</div>"+
						"</div>"+
						"<input id=\"complainid_hidden\" name=\"complainid_hidden\" type=\"hidden\" />"+
						"<input id=\"complaintype_hidden\" name=\"complaintype_hidden\" type=\"hidden\" />"+
						"<style>  "+
						".modals{"+
						"				margin-left:5% ;"+
						"				margin-top:20px;"+
						"				width: 90%;"+
						"				height: 150px;"+
						"				border: 1px solid #339DD9;"+
						"				overflow-y:auto;"+
						"			}"+
						"#modal_b p{"+
						"				width:100%;"+
						"				height:20px;"+
						"				line-height:20px;"+
						"				"+
						"			}"+
						"</style>"+
						"</div> ";
				$(document.body).append(model_div); 
				 $("#cancels").on('click',cancelss);
				 $("#cancelx").on('click',cancelss);
				 $("#aor_submit1").on('click',aor_submit1);
				 
				 $('#complant_Search').on('click',aorTalk);
				
		}
		 //提交，投诉类型回填
		 var aor_submit1 =function (){
			 $("#modal").addClass("hide");
			 /*$("input[name='comClass']")[0].value='';
			var complaintype_hidden= $("input[name='complaintype_hidden']")[0].value;
			$("input[name='complaintype']")[0].value=complaintype_hidden;*/
		 }
		
//		 弹出框获取投诉类型
		 var aorTalk = function(){
			 var fullname = $("input[name='comClass']")[0].value;
			 var params={method:"queryComplanitInfo",paramDatas:'{fullname:"'+fullname+'"}'};
			 $('#modal_b').empty();
			 var searchOptions="";
			 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=complaintData001',params,function(result){
				 $('#modal_b').empty();
				 $.each(result.beans,function(index,bean){
					 searchOptions+="<p name='"+bean.complaintid+"'>"+bean.fullname+"</p>"
				 });
					$('#modal_b').append(searchOptions);
					$("#modal_b p").click(function(){
						var thiss = $(this);
						$(this).css("background","#cccccc").siblings().css('background','white');
						$("input[name='complainid_hidden']")[0].value=thiss.prop("name");
						var t = thiss.text();
						$("input[name='complaintype_hidden']")[0].value=t;
					});
				},true);
		 	$("#modal").removeClass("hide");
		 }
		 //关闭弹框；搜索框重新置空；
		 var cancelss = function(){
			$("#modal").addClass("hide");
			 $("input[name='comClass']")[0].value='';
		 }
		 
		//投诉类型查询模态框 end
		//queryStaticDatadictRest
		var loadDictionary=function(mothedName,dicName,seleId){
			var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
			var seleOptions="";
			// 
			Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
				$.each(result.beans,function(index,bean){
					seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
				});
				$('#'+seleId).append(seleOptions);
			},true);
		};
		
		//js动态生成选项卡
		var tabContainerInit = function(target){
			var config = {
				el:$('#aor_tabContainer'),
				direction:'horizontal',//布局方向 horizontal默认横向|vertical纵向 
				tabs:[
				      {
				    	  title:'投诉基本信息',
				    	  icon:'touzhujilu', //图标的class，用户配置该项时，在tab标题文字的前端生成一个span标签
				    	  className:'complainInfo',
				    	  click:function(e, tabData){
				    		  require([''+target],function(BasicMessage){
				    			  var basicMessage = new BasicMessage(_index,_options);
				    			  tab.content(basicMessage.content);
				    			  console.log(_options);
				    			  $("input[name='nettime']").attr("id","nettime");
                                  $("input[name='backtime']").attr("id","backtime");
                                  if(Object.keys(_options).length>15){
                                	  setInputsVal();
                                  }else{
                                	  return;
                                  }
				    		  });
				    	  }
				      },
				      {
				    	  title:'流程记录',
				    	  className:'flowRecord',
				    	  click:function(e,tabData){
				    		  console.log($("input"))
				    		  require(['js/workflow/oneservicecompain/one_flowRecord'],function(FlowRecord){
				    		  	  getInputsVal();
				    			  var flowRecord = new FlowRecord(_index,_options);
				    			  tab.content(flowRecord.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'操作信息',
				    	  className:'operationRecord',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/oneservicecompain/one_operateInfo'],function(operateInfo){
				    			  getInputsVal();
				    			  var operateInfo = new operateInfo(_index,_options);
				    			  tab.content(operateInfo.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'附件(0)',
				    	  className:"attachmentFile",
				    	  click:function(e, tabData){
				    		  require(['js/workflow/oneservicecompain/one_attach_update'],function(firserBag){
				    			  getInputsVal();
				    			  var firserBag = new firserBag(_index,_options);
				    			  tab.content(firserBag.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'历史工单查询',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/oneservicecompain/one_historyWorkInfo'],function(historyWorkInfo){
				    			  getInputsVal();
				    			  var historyWorkInfo = new historyWorkInfo(_index,_options);
				    			  tab.content(historyWorkInfo.content);
				    		  });
				    	  }
				      }
				     ]
                };
			var tab = new Tab(config);
		};
		
         
//		倒计时功能
		var aorTimerind = function(){
//			console.log($('#aor_timerind').html());
			var timer=$('#aor_timerind').html();
			var time=timer.split(":");
//			console.log(time[1]);
			var aorHour=time[0];
			var aorMinu=time[1];
			
			var mytimer=setInterval(function(){
				if(aorMinu=="00"){
					aorMinu=60;
					aorHour--;
				}
				aorMinu--;
				if(aorMinu<10){
					var aorMinua="0"+aorMinu;
				}else{
					var aorMinua=aorMinu;
				}
				if(aorHour<10){
					var aorHoura="0"+aorHour;
				}else{
					var aorHoura=aorHour;
				}
				if(aorHoura=="00"&&aorMinua=="00"){
					clearInterval(mytimer);
					CrossAPI.destroyTab('新建受理工单');
				}
				//console.log(aorHoura+":"+aorMinua);
				$('#aor_timerind').html(aorHoura+":"+aorMinua);
			},1000)
			
		};
	   // 点击投诉基本类型的时候.要进行数据回填;
	   var setInputsVal = function(){
		   $("input[name='innettime']").attr("id","nettime");
           $("input[name='expectedfeedbacktime']").attr("id","backtime");
	   	   var mark;
	   	   $("input").each(function(){
            	 mark = $(this).attr("id");
                 $(this).val( _options[mark]); 
            });
            $("select").each(function(){
            	mark = $(this).attr("id");
            	if(_options[mark]=="请选择"){
            		$(this).children("option:first").attr("selected","selected");
            	}else{
            	$(this).val(_options[mark]);	
            	}
            });
             $("#aor_Secyellcon").val(_options.aor_Secyellcon);
            $("#aor_Secyellconaga").val(_options.aor_Secyellconaga) ;
	   };
       //  点击的时候获取input框的val()并存储;
		var getInputsVal = function(){
			var mark;
            $("input[name='innettime']").attr("id","nettime");
            $("input[name='expectedfeedbacktime']").attr("id","backtime");
            $("input").each(function(){
            	 mark = $(this).attr("id");
                 _options[mark] = $(this).val(); 
            });
            $("select").each(function(){
            	mark = $(this).attr("id");
                 _options[mark] = $(this).val();
            });
            if(_options.aor_Secyellcon==undefined){
            	 _options.aor_Secyellcon = $("#aor_Secyellcon").val();
            }
            if(_options.aor_Secyellconaga==undefined){
            	_options.aor_Secyellconaga =$("#aor_Secyellconaga").val(); 
            };   
            console.log(_options)
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
//		 建单人信息列表
		 var detailPanelinfo = function(){
             var json = {
             name:'李四',
             age:'15',
             address:'<a href="#">河南省郑州市</a>',
             country:{
                 language:'中文', 
                 name:'中国'
             },
             tel:'13888888888',
             qq:'666666666',
             profession:'学生'
         };
         var starConfig = {
             el:$("#foundOrderinfo",$el),    //组件绑定的容器
             className:'formContent',    //组件外围的className
//           title:'',   //组件的标题
             column:4,   //组件的总列数,默认为1
             items:[     //组件的数据配置项
                 {
                     label:'编号',     //数据的label
                     key:'name',     //对应json数据的key
                     className:'name' //该数据项对应的className
                    },
                 {
                     label:'来源序号',
                     key:'age',
                     className:'age'
                 },
                 {
                     label:'一级客户流水号',
                     key:'address',
                     className:'address'
                 },
                 {
                     label:'整体时限',
                     key:'country',
                     className:'country'
                 },
                 {
                     label:'流水号',
                     key:'tel',
                     className:'tel'
                 },
                 {
                     label:'建单人',
                     key:'qq'
                 },
                 {
                     label:'建单部门',
                     key:'profession'
                 },
                 {
                     label:'工作状态',
                     key:'qq'
                 },
                 {
                     label:'建单时间',
                     key:'qq'
                 },
                 {
                     label:'派发时间',
                     key:'qq'
                 },
                 {
                     label:'完成时间',
                     key:'qq'
                 },
                 {
                     label:'关闭时间',
                     key:'qq'
                 },
                 {
                     label:'本工单，南区派发走的派发次数',
                     key:'qq',
                     className:'theOrderNum'
                 },
                 {
                     label:'震荡工单',
                     key:'qq'
                 },
             ], 
             data:json
         }
         var detailPanel = new DetailPanel(starConfig);
		}
        //  建单人信息详情样式js修改
		 var editStyle = function($el){
				$("#foundOrderinfo .sn-detailPanel .detailList li label",$el).css("width","35%");
				$("#foundOrderinfo .sn-detailPanel .detailList .theOrderNum span",$el).css({
					"display":"inline-block",
				    "vertical-align":"middle",
				    "padding-bottom":"25px"
				});
			}
	  // 点击获取servisid  和当前serviceid做比较
		 var reset = function(){
			 var num = 0;
			 $("#editpage").on("click",function(){
			 	var arr = ['001006','001001','002','001002','001'];
			    num = num+1;;
			 	if(num==5){
			 		num=0;
			 	}
			 	srTypeId = arr[num];
			 	$("#srTypeSelect").find("option").eq(""+num).attr("selected","selected");
			 	
			 	var routedata = {
		    			"routeKey":srTypeId
		    	}
				Util.ajax.postJson(
							'/ngwf_he/front/sh/workflow!execute?uid=routeTarget',
							routedata, function(json2, status) {
					getInputsVal();
					pageUrl = json2.bean.pageUrl;
					flowId = json2.bean.flowId;
					serviceId = json2.bean.serviceId;
					_options.pageUrl = json2.bean.pageUrl;
					_options.serviceId = json2.bean.serviceId;
					_options.templateId = json2.bean.flowId;
					tabContainerInit(pageUrl);
					dateInit();
				})
			 })
		 };

		 $.fn.serializeObject = function() {
			    var json = {};
			    var arrObj = this.serializeArray();
			    $.each(arrObj, function() {
			      if (json[this.name]) {
			           if (!json[this.name].push) {
			            json[this.name] = [ json[this.name] ];
			           }
			           json[this.name].push(this.value || '');
			      } else {
			           json[this.name] = this.value || '';
			      }
			    });
			    return json;
			};
      //点击直接回复时弹出弹框;
	   var  directReplyfn = function(){
	   	 $("#aor_directReply").on("click",function(){
	   	 	var directDialouge; //弹窗的内容
	   	 	 require(['js/workflow/outlayer/repeatcheck'],function(Repeatcheck){
				    			  var Repeatcheck = new Repeatcheck(_index,_options);
				    			  directDialouge = Repeatcheck.content;
				    			  var config = {
						            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//						            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
						            title:'标题',    //对话框标题
						            content:directDialouge, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
						            ok:function(){console.log('点击了确定按钮')}, //确定按钮的回调函数 
						            okValue: '确定',  //确定按钮的文本
						            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
						            cancelValue: '取消',  //取消按钮的文本
						            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
						            button: [ //自定义按钮组
						                {
						                    value: '同意', //按钮显示文本
						                    callback: function () { //自定义按钮回调函数
						                        return false; //阻止窗口关闭
						                    }
						                }
						            ],
						            width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
						            height:400, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
						            skin:'dialogSkin',  //设置对话框额外的className参数
						            fixed:false, //是否开启固定定位 默认false不开启|true开启
						            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
						            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
						        }
						        var dialog = new Dialog(config)
				    		 });
	   	 })
	   }
	   			
});