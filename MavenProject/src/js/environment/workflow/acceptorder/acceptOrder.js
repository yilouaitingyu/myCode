define(['Util','list','date','timer','selectTree','dialog','indexLoad','tab'],   
	function(Util,list,Date,Timer,SelectTree,Dialog,IndexLoad,Tab){
		var list;
		var $el;
		var _index;
		var _options;
		var nodeActionId;
		IndexLoad(function(indexModule, options) {
			_index=indexModule;
			_options=options;
		    	eventInit();
		    	aorTimerind();
		    	tabContainerInit();
		    	dateInit();
		});
		var dateInit = function(){
			loadDictionary('staticDictionary_get','CSP.PUB.PROVINCE','aor_Basserpri');//加载省份信息
	    	loadDictionary('staticDictionary_get','HEBEI.CUSTOM.CITY','aor_Bassercity');//加载客户地市信息
	    	loadDictionary('staticDictionary_get','CSP.PUB.ACCEPTMODE','aor_Basaccway');//加载受理方式信息
	    	loadDictionary('staticDictionary_get','ECP.PUB.USERBRAND','aor_Basbrand');//加载客户品牌信息
	    	loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','aor_Basrange');//加载客级别信息
	    	loadDictionary('staticDictionary_get','HEBEI.SEND.TYPE','aor_Seccommit');//加载提交方式信息
	    	loadDictionary('staticDictionary_get','HEBEI.TEL.TYPE','aor_Secconcattel');//加载联系方式信息
	    	loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','aor_Bassosrange');//加载紧急程度信息
	    	loadDictionary('staticDictionary_get','HEBEI.FOLLOW.HANDLE','aor_Basfollow');//加载跟进处理信息
	    	loadDictionary('staticDictionary_get','HEBEI.COMPLAIN.METHOD','aor_Basaskway');//加载投诉途径信息
	    	loadDictionary('staticDictionary_get','HEBEI.NET.TYPE','aor_Basnetclass');//加载投诉途径信息
	    	loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','aor_Basacccity');//加载投诉途径信息
	    	loadDictionary('staticDictionary_get','HEBEI.QUESTION.TYPE','aor_Basallques');//加载集中问题分类信息
	    	loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Basdif');
	    	loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Secisrep');
	    	loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Basemotion');
	    	loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Bashidename');
	    	loadDictionary('staticDictionary_get','HEBEI.ORDER.MODEL','aor_Basmodule');
	    	//通过路由编码和目标类别查询服务请求列表路由目标
	    	var routedata = {
	    			"category":"PBHFlow", // 类别（目标类别）：SRPage、SRContentTemplate、PBHFlow
	    			"routeKey":"001006"
	    	}
			Util.ajax.postJson(
						'/ngwf_he/front/sh/workflow!execute?uid=routeTarget',
						routedata, function(json2, status) {
			var multiplexroute = json2.bean; //获取路由所对应的路由目标
			crossAPI.tips(multiplexroute.target,3000);
	    	var nodeData	 = {
						"templateId":multiplexroute.target,   //获取路由目标中的模板
						"activityType":"startEvent"
				};
				//请求后台添加操作按钮
				 Util.ajax.postJson(
 						'/ngwf_he/front/sh/workflow!execute?uid=nodeData005',
 						nodeData, function(json2, status) {
	 						var beans = json2.beans;
	 						for(var item in beans){
	 							//解析 为工单添加按钮
	 							$("div.startOperation").append(
	 									"<a class='btn btn-blue fl' id='"+beans[item].lineid+"'>"+beans[item].linename+"</a>");//添加节点按钮
	 							//为工单添加操作按钮事件
	 							$("#"+beans[item].lineid).bind('click',function(){
	 								nodeActionId=beans[item].id;//点击设置当前操作节点
	 								$('.t-popup').addClass('show').removeClass('hide');//显示派发窗口

	 						    });//添加节点按钮事件
	 						}
	 							$('#aor_Assign').on('click',assignDialog);//展示分派对话框
 								$('#selectedAcceptP').on('click',selectedAcceptP);//展示分派对话框
 								$('#aor_submit').on('click',action_submit);//确定 操作按钮
	 								
 						})		
 							
				})
		};
		var eventInit=function(){
			 $('#aor_Send').on('click',aorSend);//派发
			 $('#aor_Report').on('click',aorReport);//报一级客服
			 $('#aor_Eoms').on('click',aorEoms);//外派EOMS
			 $('#aor_Reagin').on('click',aorReagin);//报二线客服
			 $('#aor_Month').on('click',aorMonth);//接口派发
			 $('#aor_Bomc').on('click',aorBomc);//外派BOMC
			 $('#aor_Talk').on('click',aorTalk);//投诉类型查询
			 $('#chairput').on('click',chairPull);//抽屉的拖拉
			 $('#aor_Assign').on('click',assignDialog);//展示分派对话框
			 $('#selectedAcceptP').on('click',selectedAcceptP);//展示分派对话框
		};
//      动态获取下拉框
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
					console.log(seleOptions);
				},true);
			};
		
//		派发按钮功能
		var aorSend = function(){
			//$('#aor_form').submit();
			console.log("派发1");
			$('.t-popup').addClass('show').removeClass('hide');
		};
		//展示派发选择对话框
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
                    checkAllNodes:false,     //是否显示复选框“全选”
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
			$('#loginStaffId').val('102');
			$('#processId').val('complaint');
			$('.t-popup').addClass('show').removeClass('hide');
		}
		//操作按钮绑定
		var action_submit = function(){
			var nodeData = {
						"id":nodeActionId
				};
		    //请求后台获取id对应的nodeAction工单出口配置
			Util.ajax.postJson(
 						'/ngwf_he/front/sh/workflow!execute?uid=nodeData004',
 						nodeData, function(json, status) {
 			var nodeAction = json.bean;
 			console.log(json.bean);
 			//获取varMap json字符串
 			 
 			var varMap = varsOfWorkflow(nodeAction,$("#handlingRole").val(),$("#handlingStaff").val());	
 			
		    $("#vars").val(varMap);				
		    $('#aor_form').submit();
 		})
	}
		/**
		  * 功能：序列化form表单数据成Json对象
		  * 1.name均是简单的一级对象
		  * 2.同名的name属性，值会被序列化为数组，例如checkbox等控件
		  */
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
		//报一级客服按钮功能
		var aorReport = function(){
			console.log("报一级客服1");
			$('.t-popup').addClass('show').removeClass('hide');
		};
		//外派EOMS按钮功能
		var aorEoms = function(){
			console.log("外派EOMS");
			$('.t-popup').addClass('show').removeClass('hide');
		};
		//报二线客服按钮功能
		var aorReagin = function(){
			console.log("报二线客服");
			$('.t-popup').addClass('show').removeClass('hide');
		};
		//接口派发按钮功能
		var aorMonth = function(){
			console.log("接口派发");
			$('.t-popup').addClass('show').removeClass('hide');
		};
		//外派BOMC按钮功能
		var aorBomc = function(){
			console.log("外派BOMC");
			$('.t-popup').addClass('show').removeClass('hide');
		};
		//投诉类型查询按钮功能
		var aorTalk = function(){
			 var config = {
	      	            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
	      	            title:'投诉类型查询',    //对话框标题
	      	            content:"	<div class=\"t-popup-content\">"+
						"		<label class=\"coms\" for=\"comClass\">投诉类型:</label>"+
						"		<input type=\"text\" id=\"comClass\" name=\"comClass\" style=\"width:390px;height:25px;\">"+
						"		<a class=\"btn btn-dark bttn\"  id =\"complant_Search\">搜索</a>"+
						"		<div id=\"modal_b2\" class=\"modals\">"+
						"		</div>"+
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
						"	</div>", //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
	      	            ok:function(){
	      	            	$("input[name='comClass']")[0].value='';
		      	  			//var complaintype_hidden= $("input[name='complaintype_hidden']")[0].value;
		      	  			//$("input[name='complaintype']")[0].value=complaintype_hidden;
	      	            }, //确定按钮的回调函数 
	      	            okValue: '确定',  //确定按钮的文本
	      	            cancel: function(){
	      	            },  //取消按钮的回调函数
	      	            cancelValue: '取消',  //取消按钮的文本
	      	            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
	      	            width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
	      	            height:280, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
	      	            skin:'dialogSkin',  //设置对话框额外的className参数
	      	            fixed:false, //是否开启固定定位 默认false不开启|true开启
	      	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
	      	            modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
	      	        }
	      	 var dialog = new Dialog(config);
				 $('#complant_Search').on('click',modal_box);
				 modal_box();
			 }
			 //投诉类型，请求后台数据；
			 var modal_box =function (){
				 var fullname = $("input[name='comClass']")[0].value;
				 var params={method:"queryComplanitInfo",paramDatas:'{fullname:"'+fullname+'"}'};
				 $('#modal_b2').empty();
				 var searchOptions="";
				 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=complaintData001',params,function(result){
					 $('#modal_b2').empty();
					 $.each(result.beans,function(index,bean){
						 searchOptions+="<p name='"+bean.complaintid+"'>"+bean.fullname+"</p>"
					 });
						$('#modal_b2').append(searchOptions);
						$("#modal_b2 p").click(function(){
							var thiss = $(this);
							$(this).css("background","#cccccc").siblings().css('background','white');
							$("input[name='complainid_hidden']")[0].value=thiss.prop("name");
							var t = thiss.text();
							$("input[name='complaintype_hidden']")[0].value=t;
						});
					},true);	 
				 
			 }
		
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
				console.log(seleOptions);
			},true);
		};
		
		//js动态生成选项卡
		var tabContainerInit = function(){
			var config = {
				el:$('#aor_tabContainer'),
				direction:'horizontal',//布局方向 horizontal默认横向|vertical纵向 
				tabs:[
				      {
				    	  title:'投诉基本信息',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/acceptorder/basicMessage'],function(BasicMessage){
				    			  var basicMessage = new BasicMessage(_index,_options);
				    			  tab.content(basicMessage.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'流程记录',
				    	  click:function(e,tabData){
				    		  require(['js/workflow/acceptorder/flowRecord'],function(FlowRecord){
				    			  var flowRecord = new FlowRecord(_index,_options);
				    			  tab.content(flowRecord.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'操作信息',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/acceptorder/operateInfo'],function(operateInfo){
				    			  var operateInfo = new operateInfo(_index,_options);
				    			  tab.content(operateInfo.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'附件（0）',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/acceptorder/firserBag'],function(firserBag){
				    			  var firserBag = new firserBag(_index,_options);
				    			  tab.content(firserBag.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'历史工单查询',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/acceptorder/historyWorkInfo'],function(historyWorkInfo){
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
				}
				//console.log(aorHoura+":"+aorMinua);
				$('#aor_timerind').html(aorHoura+":"+aorMinua);
			},1000)
			
		};

//		入网时间
		var date=new Date({
			el:$('#aor_Secgonettime'),
            label:'',
            name:'datetime',    //开始日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});

//		抽屉拖拉功能
		var chairPull = function(){
		     if($('.t-columns-group li').hasClass('hide')) {
		    	 $('.t-columns-group li.hide').addClass('show').removeClass('hide');
		         $(this).children('i').addClass('icon-2121021').removeClass('icon-212102');
		     } else if($('.t-columns-group li').hasClass('show')) {
		         $('.t-columns-group li.show').addClass('hide').removeClass('show');
		         $(this).children('i').addClass('icon-212102').removeClass('icon-2121021');
		     }
		 };

});