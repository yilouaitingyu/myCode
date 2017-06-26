define(
		[ 'Util', 'date', 'list', 'select', 'dialog', 'crossAPI', 'jquery',
			'../query/commonQuery'],
		function(Util, MyDate, List, Select, Dialog, CrossAPI, $,commonQuery) {
            var num = 0;//定义选择的条数;
			//========定义全局变量开始
			//当前nodetype，待复核，待处理，待反馈
			var currentNodeType = "01";
			//当前操作人handlingstaff
			var currentUser;
			var pageArr = [ 5, 10, 15, 20, 30, 50 ];
			//是否代办页面
			var wait="";
			var list;
			var state;
			var sortField="tb1.crt_time";
			var sorting="desc";
			//========定义全局变量结束
			
			//设置时间
			var nowDate = new Date();
			var time2 = nowDate.Format("yyyy/MM/dd 23:59:59");
			//console.log(time2)
			// 当前时间减去31天为起始时间
			var t = nowDate.getTime() - 31 * 24 * 60 * 60 * 1000;
			var time1 = new Date(t).Format("yyyy/MM/dd hh:mm:ss");
			var date1 = new MyDate({
				el : $('#startTime'),
				label : '建单时间从：',
				double : { // 支持一个字段里显示两个日期选择框
					start : {
						name : 'acceptTimeStart',
						format : 'YYYY/MM/DD hh:mm:ss',
						defaultValue:time1, //默认日期值
						max : '2099/06/16 23:59:59',
						istime : true,
						istoday : false
					},
					end : {
						name : 'acceptTimeEnd',
						format : 'YYYY/MM/DD hh:mm:ss',
						defaultValue:time2, //默认日期值
						max : '2099/06/16 23:59:59',
						istime : true,
						istoday : false
					}
				}
			});
			// 时间设置结束
			// 定义数据字典加载方法
			var loadDictionary = function(mothedName, dicName, seleId) {
				var params = {
					method : mothedName,
					paramDatas : '{typeId:"' + dicName + '"}'
				};
				var seleOptions = "";
				//  
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',
						params, function(result) {
							$.each(result.beans, function(index, bean) {
								seleOptions += "<option  value='" + bean.value
										+ "'>" + bean.name + "</option>"
							});
							$('#' + seleId).append(seleOptions);
						}, true);
			};
			
			
			//定义初始化方法
			var Init = function() {
				loadDictionary('staticDictionary_get', 'HEBEI.TRASH.QUESTIONTYPE',
				'compltObjTypeCd');// 加载举报对象类型
				loadDictionary('staticDictionary_get', 'HEBEI.WF.TRASH.COMPLT_TYPE',
				'compltTypeCd');// 加载举报分类
				loadDictionary('staticDictionary_get', 'HEBEI.TRASH.CONTENTTYPE',
				'compltCnttTypeNm');// 加载内容分类
				loadDictionary('staticDictionary_get', 'HEBEI.WF.TRASH.FLOW_TYPE',
				'flowType');// 加载内容分类
				loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON',
				'needRevstFlag');// 加载是否电话回复
				loadDictionary('staticDictionary_get', 'HEBEI.WF.TRASH.COMPLT_WAY',
				'compltWayCd');// 加载举报途径
				loadDictionary('staticDictionary_get', 'HEBEI.ACCEPT.CITY',
				'byCompltNumBelgCityCode');// 加载被举报号码地区
				loadDictionary('staticDictionary_get', 'HEBEI.ACCEPT.CITY',
				'acptNumBelgCityCode');// 加载举报号码地区
				
				
				
				var href=location.href;
				var htmlPage=href.substring(href.lastIndexOf("/")+1);
				crossAPI.getIndexInfo(function(info){
					currentUser=info.userInfo;
					console.log(currentUser);
					if(htmlPage=="waitHandleTrashPool.html"){
						//加载数据
						wait="Y";
						currentNodeType="";
						loadDataList();
					}else if(htmlPage=="waitHandleTrash.html"){
						//加载数据
						wait="";
						currentNodeType="01";
						loadDataList();
					}
				});
			};
			
			//============定义加载数据方法配置开始
			var listConfig = {
					el : $('#listContainer'),
					className : 'listContainer',
					field : {
						boxType : 'checkbox',
						key : 'id',
						popupLayer : {
							text : "详情",
							width : 800,
							height : 250
						},
						items : [
							{
								text : '工单流水号', // 按钮文本
								name : 'wrkfmShowSwftno', // 按钮名称
								click : function(e, item) { // 按钮点击时处理函数
									openDetails(item);
								}
							},

							{
								text : '举报号码',
								name : 'acptNum'
							},
							{
								text : '举报人归属省',
								name : 'custProvCode'
							},
							{
								text : '被举报号码',
								name : 'byCompltTelnum'
							},
							{
								text : '被举报号码级别',
								name : 'byCompltCustLvlCd'
							},
							{
								text : '被举报号码归属省',
								name : 'byCompltNumBelgProvCode'
							},
							{
								text : '被举报归属地',
								name : 'byCompltNumBelgCityCode'
							},
							{
								text : '责任归属省',
								name : 'acptCityCode'
							},
							{
								text : '举报对象',
								name : 'compltObjTypeCd',
								render:function(item,val,$src){
									var obj=wrapDictionray("HEBEI.TRASH.QUESTIONTYPE");
									return obj[val];
								}
							},
							{
								text : '举报分类',
								name : 'compltTypeCd'
							},
							{
								text : '内容分类',
								name : 'compltCnttTypeNm',
								render:function(item,val,$src){
									var obj=wrapDictionray("HEBEI.TRASH.CONTENTTYPE");
									return obj[val];
								}
							},
							{
								text : '举报处理意见',
								name : 'dspsOpinDesc'
							},
							{
								text : '举报途径',
								name : 'compltWayCd'
							},
							{
								text : '紧急程度',
								name : 'urgntExtentCd'
							},
							{
								text : '重复举报',
								name : 'dplctCompltFlag'
							},
							{
								text : '分派时间',
								name : 'crtTimeItem'
							},
							{
								text : '操作状态',
								name : 'WRKFM_STS_CD'
							},
							{
								text : '是否受理',
								name : 'workItemStsCd',
								render : function(item, val) {
									if ( val == "30050004") {
										return "是";
									} else if(val == "30050002"){
										return "否"
									}
								}
							},
							{
								text : '受理人',
								name : 'currentLinkStaff',
								render : function(item, val) {
									return (val == "" || val == undefined || val == null) ? "无"
											: val;
								}
							},
							{
								text : '标记',
								name : 'upgdCmplntsFlag'
							},
							{
								text : '',
								name : 'workItemId',//工作项id
								className:'noborder',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',//工作项状态
								name : 'workItemStsCd',
								className:'noborder',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',
								name : 'prstNodeId',//当前节点id
								className:'noborder',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',
								name : 'workItemIstncId',//工作项实例id
								className:'noborder',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							// 模板id
							{
								text : '',
								name : 'seqprcTmpltId',
								className:'noborder',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',
								name : 'wrkfmTypeCd',//工单类别
								className:'noborder',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							} ],
					},
					page : {
						customPages :pageArr,
						perPage : 10,
						total : true,
						align : 'right',
						button : {
							className : 'operateButtons',
							items : [
									{
										text : "已选择0条工单",
										name : 'deleter',
										click : function(e) {
											// 打印当前按钮的文本
											console.log('点击了删除按钮' + e + this.text)
										}
									},
									{
										text : '受理',
										name : 'claim',
										click : function(e) {

											claim();

										}
									},
									{
										text : '释放',
										name : 'stopToggle',
										click : function(e) {
											release();
										}
									},
									{
										text : '导出',
										name : 'deleter',
										click : function(e) {
											excelExport();
										}
									},
									{
										text : "催单",
										name : 'reminder',
										click : function(e) {
											 
											var dates = list.getCheckedRows();
											if (dates.length == 0) {
												crossAPI.tips("请选择一条工单。",3000);
												return;
											}
											if (dates.length > 1) {
												crossAPI.tips("请选择一条工单。",3000);
												return;
											}
											var wrkfmShowSwftno = dates[0].wrkfmShowSwftno;
											var workItemId = dates[0].workItemId;
											var seqprcTmpltId = dates[0].seqprcTmpltId;
											var nodeId = dates[0].prstNodeId;
											var wrkfmId =dates[0].wrkfmId;
											var opStaffNum =currentUser.staffId;
											var opStaffName =currentUser.staffName;
											//获取当前登录人
											var opTypeCd ="0016";
											var opRsnTypeCd ="催单";//操作原因类型代码 
											var wrkfmTypeCd =dates[0].wrkfmTypeCd;  //工单类型代码
											var data = {
													'wrkfmShowSwftno' : wrkfmShowSwftno,
													'workItemId' : workItemId,
													'seqprcTmpltId' : seqprcTmpltId,  //流程模板id
													'nodeId' : nodeId,
													'opCntt' :opStaffName+"【"+opStaffNum+"】",
													'wrkfmId':wrkfmId,
													'opStaffNum':opStaffNum,
													'opStaffName':opStaffName,
													'opRsnTypeCd':opRsnTypeCd,
													'wrkfmTypeCd':wrkfmTypeCd,
													'opTypeCd':opTypeCd
													
												}

											require(['js/workflow/outlayer/remaind'],function(remaind){
												 
								     			  var remaind = new remaind(data);
								     		      var config2 = {
								     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
								     		            title:"催办工单",    //对话框标题
								     		            content:remaind.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
								     		            ok:function(){
								     		            	return remaind.remaind_submit();
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
									}, 
									]
						}
					},
					data : {
						url : '/ngwf_he/front/sh/workflow!execute?uid=queryWaitHandleTrashList',
					}
				};
			//============定义加载数据方法配置结束
			
			
			//============定义加载数据方法开始
			var list = new List(listConfig);
			list.on('success', function(result) {
				//解决条数选择框下面数字重复的问题
				var index =$.inArray(($(".selectPerPage").val()-0),pageArr);
				$(".selectPerPage option").eq(index+1).remove();
				//解决切换条数和点击上下页 已选择条数不置0,复选框不清除已选择的问题;
				$(".checkAllWraper>input").prop("checked",false);
				// 下面这个有些页面不需要 
				$(".allChecked").prop("checked",false);
				num = 0;
				//下面使用html  因为使用text()在  ie8下会报错;
				$(".btnCustom0").val("已选择"+num+"条工单");
               $(".btnCustom0").prop("disabled",true);
			});
            
			var wrapParams=function(){
				var serialno = $("#showSerialNo").val();// 流水号
				var acceptStaffNo = $("#acceptStaffNo").val();// 建单人
				var acceptTimeStart = $(".bg-date").eq(0).val();// 开始时间
				var acceptTimeEnd = $(".bg-date").eq(1).val();// 结束时间
				var subsnumber = $("#subsnumber").val();// 举报号码
				var byCompltTelnum = $("#byCompltTelnum").val();// 被举报号码
				var compltObjTypeCd = $("#compltObjTypeCd").val();// 举报对象
				var compltTypeCd = $("#compltTypeCd").val();// 举报分类
				var compltCnttTypeNm = $("#compltCnttTypeNm").val();// 举报内容
				var flowType = $("#flowType").val();// 流程类别
				var needRevstFlag = $("#needRevstFlag").val();// 是否需要电话回复
				var serviceContent = $("#serviceContent").val();//举报内容
				var csvcId = $("#csvcId").val();//一级客服流水号
				var compltWayCd = $("#compltWayCd").val();//举报途径
				var byCompltNumBelgProvCode = $("#byCompltNumBelgProvCode").val();//被举报号码归属省
				var byCompltNumBelgCityCode = $("#byCompltNumBelgCityCode").val();//被举报号码归属地
				var dspsOpinDesc = $("#dspsOpinDesc").val();//举报处理意见
				var closingSupplement = $("#closingSupplement").val();//关单补充
				var custProvCode = $("#custProvCode").val();//举报号码归属省
				var acptNumBelgCityCode = $("#acptNumBelgCityCode").val();//举报号码归属地
				
				
				var whetherAccept =$("#whetherAccept").val();//是否受理
				if(whetherAccept=="01"){
					whetherAccept="30050004";
				}
				if(whetherAccept=="02"){
					whetherAccept="30050002";
				}
				var searchData = {
					"showSerialNo" : serialno,
					"acceptStaffNo" : acceptStaffNo,
					"subsNumber" : subsnumber,
					"acceptTimeStart" : acceptTimeStart,
					"acceptTimeEnd" : acceptTimeEnd,
					"dspsStaffNum":currentUser.staffId,
					"serviceContent" : serviceContent,
					"workItemStsCd" : whetherAccept,
					"byCompltTelnum" : byCompltTelnum,
					"compltObjTypeCd" : compltObjTypeCd,
					"compltTypeCd" : compltTypeCd,
					"compltCnttTypeNm" : compltCnttTypeNm,
					"flowType" : flowType,
					"needRevstFlag" : needRevstFlag,
					"csvcId" : csvcId,
					"compltWayCd" : compltWayCd,
					"byCompltNumBelgProvCode" : byCompltNumBelgProvCode,
					"byCompltNumBelgCityCode" : byCompltNumBelgCityCode,
					"dspsOpinDesc" : dspsOpinDesc,
					"closingSupplement" : closingSupplement,
					"custProvCode" : custProvCode,
					"acptNumBelgCityCode" : acptNumBelgCityCode,
					"nodeTypeCd" : currentNodeType,
					"sorting":sorting,
					"sortField":sortField,
					"wait":wait
				};
				console.log(searchData);
				return searchData;
			}
			var loadDataList=function(){	
				list.search(wrapParams());
			}
			//============定义加载数据方法结束
			//清空按钮
			$('#restValue').click(function(){
				$('#queryForm')[0].reset();
			})
			//查询按钮
			$('#searchButton').click(function(){
				loadDataList();
			})
			//刷新按钮
			$('#refreshButton').click(function(){
				loadDataList();
			})
			
			
			// 进来之后默认显示的是 待办事宜里面的待处理 需要先请求后台请求权限;
			var config = {
				url : "data2.json", // 接受请求的地址
				success : function(data) {
					if($("#waitWork a").length<1){
						return;
						}
					$("#waitWork a")[0].innerHTML = data[0].description;
					for (var i = 0; i < data.length; i++) {
						$("#waitWork a")[i].innerHTML = data[i].description;
						$("#waitWork a")[i].className = "showall";
						$("#waitWork a")[i].setAttribute("my-data",
								data[i].nodetype);
						$("#waitWork a")[i].setAttribute("id", data[i].id);
						$("#waitWork a")[i].onclick = function() {
							var id = $(this).attr("id");
							currentNodeType = $(this).attr("my-data");
							if ("waitDealWork" == id) {
								$('#selectbox').hide();
								wait="Y";
								$(".operateButtons > input").eq(1).hide();
								$(".operateButtons > input").eq(2).show();
								loadDataList();
							} else {
								$('#selectbox').show();
								$(".operateButtons > input").eq(2).show();
								$(".operateButtons > input").eq(1).show();
								wait="";
								loadDataList();
							}
						}
					}	
					$("#waitWork a").eq(0).addClass("activeButton");
				}, // url调用成功后执行的回调函数
				data : {}, // 要传递给url的数据
				dataType : 'json', // 返回值的数据类型
			}
			Util.ajax.ajax(config);

			$(".orderDefer>a").click(
					function(e) {
						$(this).addClass('activeButton').siblings()
								.removeClass('activeButton');
						
					});
			// 选项卡效果设
			$('.t-tabs-items li').click(
					function() {
						var $t = $(this).index();
						$(this).addClass('active').siblings().removeClass(
								'active');
						$('.t-tabs-wrap li').eq($t).addClass('selected')
								.siblings().removeClass('selected');
					});

			// 选择框 隐藏 显示按钮点击事件;

			$('.t-list-search-more').click(
					function() {
						if ($('.t-columns-group li').hasClass('hide')) {
							$('.t-columns-group li.hide').addClass('show').removeClass('hide');
							$('#chairputbuibot .icon-212102').addClass('icon-2121021').removeClass('icon-212102');
							$('#chairputbuibots .icon-212102').addClass('icon-2121021').removeClass('icon-212102');
							$(".searchBtnRight").attr("id", "searchBtnRight");
						} else if ($('.t-columns-group li').hasClass('show')) {
							$('.t-columns-group li.show').addClass('hide').removeClass('show');
							$('#chairputbuibot .icon-2121021').addClass('icon-212102').removeClass('icon-2121021');
							$('#chairputbuibots .icon-2121021').addClass('icon-212102').removeClass('icon-2121021');
							$(".searchBtnRight").removeAttr("id");
						}
					});

			//创建节点放在受理后面
			//复选框条数
			$('.checkAllWraper>input').change(function(){
                if($('.checkAllWraper>input').prop("checked")){
                	$('.boxWraper > input').each(function(){
                		$(this).prop("checked",true);
                	});
                	num = $('.boxWraper > input').length;
                	$(".btnCustom0").val("已选择"+num+"条工单");
                }else{
                	$('.boxWraper > input').each(function(){
                		$(this).prop("checked",false);
                	});
                	num = 0;
                	$(".btnCustom0").val("已选择"+num+"条工单");
                }
             });

			
            list.on('checkboxChange', function(e, item, checkedStatus) {// 事件处理代码
				if (checkedStatus == 1) {
					num++
					if(num==$(".boxWraper>input").length){
						$('.checkAllWraper>input').prop("checked",true);
					}
					$(".btnCustom0").val("已选择"+num+"条工单");
				} else {
					num--
					$('.checkAllWraper>input').prop("checked",false);
					$(".btnCustom0").val("已选择"+num+"条工单");
				}
			})

			// 列表详情最 end
			
			//添加下拉列表
			var selectbox="<div> <select id='selectbox'><option value='1'>1</option>" +
					"<option value='5'>5</option>" +
					"<option value='10'>10</option><option value='20'>20</option>" +
					"<option value='30'>30</option><option value='50'>50</option>" +
					"<option value='100'>100</option></select></div>";
		     $(".btnCustom1").after($(selectbox))
			 $(selectbox).find("div").addClass("btn");
		     
		     
		     //受理
		     var claim=function(){
		    	 console.log('认领')
		    	 var str = "";
					var dates = list.getCheckedRows();
					//条件查询参数序列化
					var $form = $('#queryForm');
					var result = Util.form.serialize($form);
					console.log("查询条件"+result);
					var selectNum=$('#selectbox').val()-0;
					var total=Number(list.total);
					if (dates.length == 0) {
						var url;
						if(selectNum>total){
							//选的数大于查询的数目,受理所有查询的
							url="/ngwf_he/front/sh/workflow!execute?uid=queryWaitHandleList&nodetype="+currentNodeType+"&dspsStaffNum="+currentUser.staffId+"&start=0&limit="+total+"&wait="+wait;
						}else{
							//选的数小于查询的数目,受理前num条
							url="/ngwf_he/front/sh/workflow!execute?uid=queryWaitHandleList&nodetype="+currentNodeType+"&dspsStaffNum="+currentUser.staffId+"&start=0&limit="+selectNum+"&wait="+wait;
						}
						Util.ajax.postJson(url, result, function(result, isOk) {
							console.log(result.bean.total)
							//结果数
							var resultNum=result.bean.total;
							var dates=result.beans;
							var str;
							$.each(dates,function(index,obj){
								str+= obj.wrkfmShowSwftno + "#"
								+ obj.workItemId + "#"
								+ obj.wrkfmTypeCd
								+ "#" + obj.seqprcTmpltId
								+ "#" + obj.prstNodeId
								+ ",";
							});
							Util.ajax.postJson("/ngwf_he/front/sh/workflow!execute?uid=claim001",
									{"workItemIds" : str,"dspsStaffNum":currentUser.staffId,"dspsStaffName":currentUser.staffName},
									function(result,isOk){
										if(result.returnCode=='0'){
											crossAPI.tips("选择"+selectNum+"条工单,成功受理"+result.bean.successNum+"条工单",3000);
											loadDataList();
										}else{
											crossAPI.tips("受理不成功",3000)
											loadDataList();
										}
									})
						});
						return;
					}
					$.each(dates,function(index,obj){
						str+= obj.wrkfmShowSwftno + "#"
						+ obj.workItemId + "#"
						+ obj.wrkfmTypeCd
						+ "#" + obj.seqprcTmpltId
						+ "#" + obj.prstNodeId
						+ ",";
					});
					var date = {
						"workItemIds" : str,
						"dspsStaffNum":currentUser.staffId,
						"dspsStaffName":currentUser.staffName
					}
					// console.log(str);
					var url = "/ngwf_he/front/sh/workflow!execute?uid=claim001";
					Util.ajax.postJson(url,date,function(result, isOk) {
										if (result.returnCode=='0') {
											crossAPI.tips("选择"+dates.length+"条工单,成功受理"+result.bean.successNum+"条工单",3000);
											loadDataList();
											num = 0;
											$(".btnCustom0").val("已选择"+ num+ "条工单");
										} else {
											crossAPI.tips("受理不成功",3000);
											loadDataList();
										}
					});

		     };
		     
		     //释放
		     var release=function(){
		    	 var dates = list.getCheckedRows();
					var str = "";
					if (dates.length == 0) {
						crossAPI.tips("请至少选择一条信息!",3000);
						return;
					}
					for (var i = 0; i < dates.length; i++) {
						if (dates[i].workItemStsCd != '30050004') {
							crossAPI.tips("工单流水号"
									+ dates[i].showSerialNo
									+ "还没受理",3000);
							return;
						}
						;
						$.each(dates,function(index,obj){
							str+= obj.wrkfmShowSwftno + "#"
							+ obj.workItemId + "#"
							+ obj.wrkfmTypeCd
							+ "#" + obj.seqprcTmpltId
							+ "#" + obj.prstNodeId
							+ ",";
						});
					}
					var date = {
						"workItemIds" : str,
						"dspsStaffNum":currentUser.staffId,
						"dspsStaffName":currentUser.staffName
					};
					// console.log(str);
					var url = "/ngwf_he/front/sh/workflow!execute?uid=release001";
					Util.ajax.postJson(url, date, function(
							result, isOk) {
						if (result.returnCode=='0') {
							crossAPI.tips("选择"+dates.length+"条工单,成功释放"+result.bean.successNum+"条工单",3000);
							loadDataList();
							num = 0;
							$(".btnCustom0").val("已选择" + num + "条工单");
						} else {
							crossAPI.tips("释放不成功",3000);
							loadDataList();
						}
					});
				};
				//打开详情
				 var openDetails = function (item){
			    	 if (item.data.workItemStsCd == "30050004") {
							var lockdata = {
									"serialno":item.data.wrkfmShowSwftno,
									"handingStaff":currentUser.staffId
							}
										crossAPI.createTab(
												'工单详情',
												getBaseUrl()+'/ngwf_he/src/module/workflow/processinfoDetail/processinfoDetail.html',
												{"serialno":item.data.wrkfmShowSwftno,
												 "workItemId":item.data.workItemId,
												 "trashFlag":item.data.trashFlag
												});
//									})
					}else{
						crossAPI.tips("该工单需先受理！",3000);
					}
			     }
			/**
			 * 使用步骤：
			 * 1.在html页面添加：<div id="dialouge"></div> 容器
			 * 2.定义导出excel方法例子如下
			 */
			var excelExport=function(){
					//定义导出excel查询类型（需要修改）
					var queryType="03";
					var uid="waitTrashDownload";
					require(['js/workflow/common/exportExcelAlert'],function(ex){
		    			var excel = new ex();
		    			//定义点击确定 按钮执行的事件（应为带着arr参数以及页面参数去请求excel文件下载）
		    			excel.confirm=function(arr){
		    				var downloadUrl="/ngwf_he/front/sh/workorderexport!export?uid="+uid+"&columns="+arr+"&queryType="+queryType;
		    				//获取json格式的参数
		    				var pageParams=wrapParams();
		    				//将参数添加到请求地址之后
		    				for(key in pageParams){
		    					var value=pageParams[key];
		    					if(value!=null&&value!=undefined&&value.trim()!=''){
		    						downloadUrl+="&"+key+"="+value;
		    					}
		    				}
		    				//下载excel资源
		    				location.href=downloadUrl;
		    			}
						excel.eventInit(queryType);
		    		  });
			}
			
			
			return Init();
			// 最外层require
		})