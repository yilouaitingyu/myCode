define(['Util','list',"detailPanel",'date','timer','selectTree','indexLoad','tab'],   
	function(Util,list,DetailPanel,Date,Timer,SelectTree,IndexLoad,Tab){
		var list;
		var $el;
		var _index;
		var _options;
		var aorTimerind;
		IndexLoad(function(indexModule, options) {
			_index=indexModule;
			_options=options;
		    	eventInit();
		    	aorTimerind();
		    	tabContainerInit();
//		    	add_model();// 投诉类型搜索model;
		    	detailPanelinfo();
		    	editStyle();
		});
		var eventInit=function(){
//			 $('#aor_Send').on('click',aorSend);//派发    现在这个按钮已经卸载  one_basic.js里面
			 $('#aor_Report').on('click',aorReport);//报一级客服
			 $('#aor_Eoms').on('click',aorEoms);//外派EOMS
			 $('#aor_Reagin').on('click',aorReagin);//报二线客服
			 $('#aor_Month').on('click',aorMonth);//接口派发
			 $('#aor_Bomc').on('click',aorBomc);//外派BOMC
			 $('#aor_Talk').on('click',aorTalk);//投诉类型查询
			 $('#chairput').on('click',chairPull);//抽屉的拖拉
			 $('#aor_Assign').on('click',assignDialog);//展示分派对话框
			 $('#selectedAcceptP').on('click',selectedAcceptP);//展示分派对话框
			 $("#closeHere").on('click',closeHere);//关闭分配窗口
			 $('#closeAgainHere').on('click',closeAgainHere);
			 $('#aor_submit').on('click',function(){
				 $('#aor_form').submit();
			 });
		};
		
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
		
//		//展示派发选择对话框
		var assignDialog = function(){
			$('.t-popup').addClass('hide').removeClass('show');
			$('.t-popupp').addClass('show').removeClass('hide');
			var config2 = {
                  el:$('#selectAcceptorPers'),
                  label:'多选弹出树',
                  check:true,
                  // async:true,         //是否启用异步树
                  name:'acceptorPers',
                  textField:'name',
                  valueFiled:'id',
                  expandAll:true,
                  childNodeOnly:false,
                  checkAllNodes:true,     //是否显示复选框“全选”
                  url:'../../../../data/selectTree.json',
              };
			var selectTree2 = new SelectTree(config2);
			selectTree2.on('confirm',function(nodes){
          	$.each(nodes, function(index, element){
          		if(element.isParent){
          			$('#paramValue').val(element.id);
          		}
          	});
          });
		};
		var selectedAcceptP = function(){
			var acceptorPers=$('input[name=sn-acceptorPers-text]').val();
			$('#aor_Operator').val(acceptorPers);
			$('#handlingstaffno').val(acceptorPers);
			$('#paramKey').val('fh');
			$('#loginStaffId').val('102');
			$('.t-popup').addClass('show').removeClass('hide');
		}

		//报一级客服按钮功能
		var aorReport = function(){
			console.log("报一级客服1");
			$('.t-popup').addClass('show').removeClass('hide');
		};
//		//外派EOMS按钮功能
		var aorEoms = function(){
			console.log("外派EOMS");
			$('.t-popup').addClass('show').removeClass('hide');
		};
//		//报二线客服按钮功能
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
			console.log("投诉类型查询");
			$('.t-popup').addClass('show').removeClass('hide');
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
		var tabContainerInit = function(){
			var config = {
				el:$('#aor_tabContainer'),
				direction:'horizontal',//布局方向 horizontal默认横向|vertical纵向 
				tabs:[
				      {
				    	  title:'投诉基本信息',
				    	  icon:'touzhujilu', //图标的class，用户配置该项时，在tab标题文字的前端生成一个span标签
				    	  click:function(e, tabData){
				    		  require(['js/workflow/consultationForm/consultationForm'],function(BasicMessage){
				    			  var basicMessage = new BasicMessage(_index,_options);
				    			  tab.content(basicMessage.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'流程记录',
				    	  click:function(e,tabData){
				    		  require(['js/workflow/consultationForm/con_flowRecord'],function(FlowRecord){
				    			  var flowRecord = new FlowRecord(_index,_options);
				    			  tab.content(flowRecord.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'操作信息',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/consultationForm/con_operateInfo'],function(operateInfo){
				    			  var operateInfo = new operateInfo(_index,_options);
				    			  tab.content(operateInfo.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'附件（0）',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/consultationForm/con_attach_update'],function(firserBag){
				    			  var firserBag = new firserBag(_index,_options);
				    			  tab.content(firserBag.content);
				    		  });
				    	  }
				      },
				      {
				    	  title:'历史工单查询',
				    	  click:function(e, tabData){
				    		  require(['js/workflow/consultationForm/con_historyWorkInfo'],function(historyWorkInfo){
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
         console.log($("#foundOrderinfo",$el))
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
});