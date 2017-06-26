define(
		[ 'Util', 'list', 'dialog', 'select', 'date', 'crossAPI', 'jquery','js/workflow/commonTip/commonTip'],
		function(Util, List, Dialog, Select, MyDate, CrossAPI, $,commonTip) {

			var num = 0;// 定义选择的条数;
			// ========定义全局变量开始
			// 当前nodetype，待复核，待处理，待反馈

			// 当前操作人handlingstaff
			var currentUser;
			var pop = new commonTip();
			var list;
			var pageArr=[ 5, 10, 15, 20, 30, 50 ];
			var initialize = function() {
				crossAPI.getIndexInfo(function(info) {
					currentUser = info.userInfo;
					eventInit();
					ctiList();
					getInfon();
				});
			}
			var eventInit = function() {
				loadDictionary('staticDictionary_get', 'HEBEI.ORDER.STATE',
				'opStsCD');// 加载工单状态
				loadDictionary('staticDictionary_get', 'HEBEI.TRASH.QUESTIONTYPE',
						'compltObjTypeCd');// 加载举报对象类型
				loadDictionary('staticDictionary_get', 'HEBEI.WF.TRASH.COMPLT_TYPE',
				'compltTypeCd');// 加载举报分类
				loadDictionary('staticDictionary_get', 'HEBEI.TRASH.CONTENTTYPE',
				'comppltCnttTypeNm');// 加载内容分类
				loadDictionary('staticDictionary_get', 'HEBEI.BADWORK.CHANNEL',
						'compltWayCd');// 举报途径
				loadDictionary('staticDictionary_get',
						'HEBEI.WF.ORDER.TARGET_PROVINCE',
						'byCompltNumBelgProvCode');//被举报号码归属省
				loadDictionary('staticDictionary_get',
						'HEIBEI.DIC.CUST.REGION', 'byCompltNumBelgCityCode');//被举报号码归属地
				loadDictionary('staticDictionary_get',
						'HEBEI.WF.ORDER.TARGET_PROVINCE', 'custProvCode');//举报号码归属省
				loadDictionary('staticDictionary_get',
						'HEIBEI.DIC.CUST.REGION', 'acptNumBelgCityCode');//举报号码归属地		 
				loadDictionary('staticDictionary_get',
						'HEBEI.BADWORK.CATEGORY', 'flowType');// 流程类别

				loadDictionary('staticDictionary_get',
						'HEBEI.OR.COMMON', 'isCallBack');				
				$('#badWorderOrder_Search').on('click', badWorderOrderInfo);
				$('#badWorderOrder_Reset').on('click', resetInfo);

			};

			// 加载举报内容信息
			var loadReport = function(parentId, elementId) {
				$("#" + elementId).empty();
				var seleOptions = "<option selected>请选择</option>"
				Util.ajax
						.postJson(
								'/ngwf_he/front/sh/workflow!execute?uid=queryReportByParentId',
								{
									'parentId' : parentId
								}, function(result) {
									$.each(result.beans, function(index, bean) {
										seleOptions += "<option  value='"
												+ bean.typeId + "'>"
												+ bean.typeName + "</option>";
									})
									$("#" + elementId).append(seleOptions)
								}, true)
			}
			// 举报对象的onchange事件
			var reportObjectChange = function() {
				var parentId = $("#compltObjTypeCd option:selected").val();
				loadReport(parentId, "compltTypeCd");
			}
			// 举报分类的onchange时间
			var reportTypeChange = function() {
				var parentId = $("#compltTypeCd option:selected").val();
				loadReport(parentId, "comppltCnttTypeNm");
			}

			// 字典
			var loadDictionary = function(mothedName, dicName, seleId) {
				var params = {
					method : mothedName,
					paramDatas : '{typeId:"' + dicName + '"}'
				};
				var seleOptions = "";
				Util.ajax.postJson(
						'/ngwf_he/front/sh/common!execute?uid=callCSF', params,
						function(result) {
							$.each(result.beans, function(index, bean) {
								// 品牌工单中保存的是品牌名{
								if ("subsbrand" == seleId) {
									seleOptions += "<option  value='"
											+ bean.name + "'>" + bean.name
											+ "</option>";
								} else
									seleOptions += "<option  value='"
											+ bean.value + "'>" + bean.name
											+ "</option>"
							});
							$('#' + seleId).append(seleOptions);
							console.log(seleOptions);
						}, true);
			};
			// 重置按钮
			var resetInfo = function() {

				$("input[name='startTime']")[0].value = '';
				$("input[name='endTime']")[0].value = '';
				$("input[name='compltTelNum']")[0].value = '';
				$("input[name='byCompltTelNum']")[0].value = '';
				$("input[name='wekfmShowSwftNo']")[0].value = '';
				$("input[name='acptUserName']")[0].value = '';
				$("input[name='bizCntt']")[0].value = ''

				// select取值

				$("select[name='opStsCD']")[0].value = '';
				$("select[name='compltObjTypeCd']")[0].value = '';
				$("select[name='compltTypeCd']")[0].value = '';
				$("select[name='comppltCnttTypeNm']")[0].value = '';
				$("select[name='urgentid']")[0].value = '';
				$("select[name='isCallBack']")[0].value = '';
				list.search({});
			};
			// 查询按钮事件
			var badWorderOrderInfo = function() {
				
				var startTime = $("input[name='startTime']")[0].value;
				var endTime = $("input[name='endTime']")[0].value;
				var compltTelNum = $("input[name='compltTelNum']")[0].value;
				var byCompltTelNum = $("input[name='byCompltTelNum']")[0].value;
				var wekfmShowSwftNo = ("input[name='wekfmShowSwftNo']")[0].value;
				var acptUserName = $("input[name='acptUserName']")[0].value;
				var bizCntt = $("input[name='bizCntt']")[0].value;
				var wrkfmShowSwftno = $("input[name='wrkfmShowSwftno']")[0].value;
				var dspsOpinDesc = $("input[name='dspsOpinDesc']")[0].value;
				var closeingSupplement = $("input[name='closeingSupplement']")[0].value;

				// select取值

				var opStsCD = $("select[name='opStsCD']")[0].value;
				var compltObjTypeCd = $("select[name='compltObjTypeCd']").val();
				if (compltObjTypeCd == "请选择") {
					compltObjTypeCd = '';
				}
				var compltTypeCd = $("select[name='compltTypeCd']")[0].value;
				var comppltCnttTypeNm = $("select[name='comppltCnttTypeNm']")[0].value;
				var compltWayCd = $("select[name='compltWayCd']")[0].value;
				var needRevstFlag = $("select[name='needRevstFlag']")[0].value;				
				var compltWayCd = $("select[name='compltWayCd']")[0].value;
				var byCompltNumBelgProvCode = $("select[name='byCompltNumBelgProvCode']")[0].value;
				var byCompltNumBelgCityCode = $("select[name='byCompltNumBelgCityCode']")[0].value;
				var custProvCode = $("select[name='custProvCode']")[0].value;
				var acptNumBelgCityCode = $("select[name='acptNumBelgCityCode']")[0].value;
				var data = {
					"startTime" : startTime,
					"endTime" : endTime,
					"compltTelNum" : compltTelNum,
					"byCompltTelNum" : byCompltTelNum,
					"wekfmShowSwftNo" : wekfmShowSwftNo,
					"acptUserName" : acptUserName,
					"bizCntt" : bizCntt,
					"opStsCD" : opStsCD,
					"compltObjTypeCd" : compltObjTypeCd,
					"compltTypeCd" : compltTypeCd,
					"comppltCnttTypeNm" : comppltCnttTypeNm,
					"compltWayCd" : compltWayCd,
					"needRevstFlag" : needRevstFlag,
					"nodeType" : "",
					"wrkfmShowSwftno" : wrkfmShowSwftno,
					"dspsOpinDesc" : dspsOpinDesc,
					"closeingSupplement" : closeingSupplement,
					"compltWayCd" : compltWayCd,
					"byCompltNumBelgProvCode" : byCompltNumBelgProvCode,
					"byCompltNumBelgCityCode" : byCompltNumBelgCityCode,
					"custProvCode" : custProvCode,
					"acptNumBelgCityCode" : acptNumBelgCityCode

				};
				list.search(data);
			};
			 Date.prototype.Format = function (fmt) { //author: meizz 
				    var o = {
				        "M+": this.getMonth() + 1, //月份 
				        "d+": this.getDate(), //日 
				        "h+": this.getHours(), //小时 
				        "m+": this.getMinutes(), //分 
				        "s+": this.getSeconds(), //秒 
				        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
				        "S": this.getMilliseconds() //毫秒 
				    };
				    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
				    for (var k in o)
				    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				    return fmt;
				}			
			//设置时间
				var nowDate = new Date();
				var time2 = nowDate.Format("yyyy/MM/dd 23:59:59");
				//console.log(time2)
				// 当前时间减去31天为起始时间
				var t = nowDate.getTime() - 30 * 24 * 60 * 60 * 1000;
				var time1 = new Date(t).Format("yyyy/MM/dd 00:00:00");
				var date1 = new MyDate({
					el : $('#dateContainer'),
					label : '建单起止时间',
					double : { // 支持一个字段里显示两个日期选择框
						start : {
							name : 'startTime',
							format : 'YYYY/MM/DD hh:mm:ss',
							defaultValue:time1, //默认日期值
							// min: laydate.now(-1),
							max : '2099/06/16 23:59:59',
							istime : true,
							istoday : false,
							choose: function(datas){
							}
						},
						end : {
							name : 'endTime',
							format : 'YYYY/MM/DD hh:mm:ss',
							defaultValue:time2, //默认日期值
							// min: laydate.now(-1),
							max : '2099/06/16 23:59:59',
							istime : true,
							istoday : false,
							choose: function(datas){
							}
						}
					}
				});
			// 加载历史预警信息列表
			var ctiList = function() {
				var config = {
					el : $('#historylist'),
					field : {
						boxType : 'checkbox',
						key : 'id',
						popupLayer : {
							text : "详情",
							width : 800,
							height : 250,
						},
						items : [ {
							text : '工单流水号',
							name : 'wrkfmShowSwftno',
							click : function(e, item) { // 按钮点击时处理函数
								console.log(item);
								openDetails(item);
							}
						}, {
							text : '举报号码',
							name : 'compltTelNum'
						}, {
							text : '举报人归属省',
							name : 'custProvCode'
						}, {
							text : '归属地',
							name : 'acptNumBelgCityCode'
						}, {
							text : '建单人',
							name : 'acptUserName'
						}, {
							text : '建单时间',
							name : 'createTime'
						}, {
							text : '被举报号码',
							name : 'byCompltTelNum'
						}, {
							text : '被举报号码级别',
							name : 'byCompltNumStarGrdCd'
						}, {
							text : '被举报号码归属省',
							name : 'byCompltNumBelgProvCode'
						}, {
							text : '被举报归属地',
							name : 'byCompltNumBelgCityCode'
						}, {
							text : '举报对象',
							name : 'compltObjTypeCd',
							render : function(item, val) {
				        		return getActionName("HEBEI.TRASH.QUESTIONTYPE",val);																											
							}
                        
						}, {
							text : '内容分类',
							name : 'compltCnttTypeNm',
							render : function(item, val) {
				        		return getActionName("HEBEI.WF.TRASH.COMPLT_TYPE",val);																											
							}
                        
						}, {
							text : '举报处理意见',
							name : 'dspsOpinDesc'
						}, {
							text : '举报途径',
							name : 'CompltWayCd',
							render : function(item, val) {
				        		return getActionName("HEBEI.WF.TRASH.COMPLT_TYPE",val);																											
							}
						}, {
							text : '紧急程度',
							name : 'UrgntExtentCd',
							render : function(item, val) {
				        		return getActionName("HEBEI.EDUCATION.TYPE",val);																											
							}
                        
						}, {
							text : '重复举报',
							name : 'dplctCompltFlag',
							render : function(item, val) {
				        		return getActionName("HEBEI.OR.COMMON",val);																											
							}
						}, {
							text : '操作状态',
							name : 'opStsCd',
							render : function(item, val) {
				        		return getActionName("HEBEI.DIC.OPERASTATUS",val);																											
							}
						}, ]
						
					},
					page : {
						customPages : pageArr,
						perPage : 10,
						total : true,
						align : 'right',
						button : {
							className : 'operateButtons',
							// url:'../js/list/autoRefresh',
							items : [
									{
										text : "已选择0条工单",
										name : 'deleter',
										click : function(e) {
											// 打印当前按钮的文本
											console.log('点击了删除按钮' + e
													+ this.text)
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
										text : '追回',
										name : 'stopToggle',
										click : function(e) {
											var dates = list.getCheckedRows();
											if (dates.length == 0) {												
												pop.text({text:"请选择一条工单。"});
												return;
											}
											if (dates.length > 1) {												
												pop.text({text:"请选择一条工单。"});
												return;
											}
											var ids="";
											for (var i = 0; i < dates.length; i++) {
												if (i = dates.length - 1) {
													ids +=dates[0].wrkfmShowSwftno;
												} else {
													ids +=dates[0].wrkfmShowSwftno + ",";
												}
											}
											var param = {
												ids : ids,
												staffNum : currentUser.staffId,
												workItemStsCd : '30050004',
												nodeType : "02"
													
											}
											Util.ajax.postJson(
													"/ngwf_he/front/sh/workflow!execute?uid=selectStaffIdforWorkInfo",
													param, function(result, isOk) {
														var bean = result.beans[0];
														if(result.beans.length>0){
															var data = {
																	"workItemIstncId" : bean.workItemIstncId,
																	"wrkfmSwftno" : bean.wrkfmSwftno,
																	"workItemId" : bean.workItemId,
																	"prstNodeId" : bean.prstNodeId,
																	"nextNodeId" : bean.nextNodeId,
																	"nodeNm" : bean.nodeNm,
																	"seqprcTmpltId" : bean.seqprcTmpltId,
																	"loginStaffId" : currentUser.staffId, // 操作员工号码
																	"loginStaffName" : currentUser.staffName,
																	"nodeTypeCd" : bean.nodeTypeCd,
																	"wrkfmTypeCd" : bean.wrkfmTypeCd
																}

																require(
																		[ 'js/workflow/badwordorderDetail/recoverwork' ],
																		function(remaind) {

																			var remaind = new remaind(
																					data);
																			var config2 = {
																				mode : 'normal', // 对话框模式，默认normal标准|tips浮动层|confirm确认对话框
																				// delayRmove:3,
																				// //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
																				title : "追回工单", // 对话框标题
																				content : remaind.content, // 对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
																				ok : function() {
																					// console.log($("#sddasdasd").serializeObject());
																					return remaind
																							.remaind_submit();

																				}, // 确定按钮的回调函数
																				okValue : "确定", // 确定按钮的文本
																				cancel : function() {

																				}, // 取消按钮的回调函数
																				cancelValue : '取消', // 取消按钮的文本
																				cancelDisplay : true, // 是否显示取消按钮
																										// 默认true显示|false不显示
																				button : [],
																				width : 500, // 对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
																				height : 122, // 对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
																				skin : 'dialogSkin', // 设置对话框额外的className参数
																				fixed : false, // 是否开启固定定位
																								// 默认false不开启|true开启
																				quickClose : false, // 点击空白处快速关闭
																									// 默认false不关闭|true关闭
																				modal : true
																			// 是否开启模态框状态
																			// 默认false不开启|true开启,confirm默认状态为true
																			}
																			var dialog = new Dialog(
																					config2)

																		});
														}else{
															
															pop.text({text:"你没有权限追回。"});
														}
														
													});
											

										}
									},
									{
										text : "催单",
										name : 'reminder',
										click : function(e) {

											var dates = list.getCheckedRows();
											if (dates.length == 0) {
												
												pop.text({text:"请选择一条工单。"});
												
												return;
											}
											if (dates.length > 1) {
												
												pop.text({text:"请选择一条工单。"});
												return;
											}
											
											var ids="";
											for (var i = 0; i < dates.length; i++) {
												if (i = dates.length - 1) {
													ids += dates[i].wrkfmShowSwftno;
												} else {
													ids += dates[i].wrkfmShowSwftno + ",";
												}
											}
											var param = {
													ids : ids,
													staffNum : "",
													workItemStsCd : '30050004',
													nodeType : "02"
														
												}
											Util.ajax.postJson(
													"/ngwf_he/front/sh/workflow!execute?uid=selectStaffIdforWorkInfo",
													param, function(result, isOk) {
														if(result.beans.length>0){
															var bean = result.beans[0];
															var wrkfmShowSwftno = dates[0].wrkfmShowSwftno;
															var workItemId = bean.workItemId;
															var seqprcTmpltId = bean.seqprcTmpltId;
															var nodeId = bean.prstNodeId;
															var wrkfmId = bean.wrkfmId;
															var opStaffNum = currentUser.staffId;
															var opStaffName = currentUser.staffName;
															// 获取当前登录人
															var opTypeCd = "0016";											
															var opRsnTypeCd = "催单";// 操作原因类型代码
															var wrkfmTypeCd = bean.wrkfmTypeCd; // 工单类型代码
															var data = {
																'wrkfmShowSwftno' : wrkfmShowSwftno,
																'workItemId' : workItemId,
																'seqprcTmpltId' : seqprcTmpltId, // 流程模板id
																'nodeId' : nodeId,
																'opCntt' : opStaffName + "【"
																		+ opStaffNum + "】",
																'wrkfmId' : wrkfmId,
																'opStaffNum' : opStaffNum,
																'opStaffName' : opStaffName,
																'opRsnTypeCd' : opRsnTypeCd,
																'wrkfmTypeCd' : wrkfmTypeCd,
																'opTypeCd' : opTypeCd

															}
															require(
																	[ 'js/workflow/outlayer/remaind' ],
																	function(remaind) {

																		var remaind = new remaind(
																				data);
																		var config2 = {
																			mode : 'normal', // 对话框模式，默认normal标准|tips浮动层|confirm确认对话框
																			// delayRmove:3,
																			// //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
																			title : "催办工单", // 对话框标题
																			content : remaind.content, // 对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
																			ok : function() {
																				// console.log($("#sddasdasd").serializeObject());
																				return remaind
																						.remaind_submit();

																			}, // 确定按钮的回调函数
																			okValue : "确定", // 确定按钮的文本
																			cancel : function() {

																			}, // 取消按钮的回调函数
																			cancelValue : '取消', // 取消按钮的文本
																			cancelDisplay : true, // 是否显示取消按钮
																									// 默认true显示|false不显示
																			button : [],
																			width : 500, // 对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
																			height : 122, // 对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
																			skin : 'dialogSkin', // 设置对话框额外的className参数
																			fixed : false, // 是否开启固定定位
																							// 默认false不开启|true开启
																			quickClose : false, // 点击空白处快速关闭
																								// 默认false不关闭|true关闭
																			modal : true
																		// 是否开启模态框状态
																		// 默认false不开启|true开启,confirm默认状态为true
																		}
																		var dialog = new Dialog(
																				config2)

																	});
														}else{
															
															pop.text({text:"催单失败。"});
														}
													
													})
											

											

										}
									},
									{
										text : '关单补充',
										name : 'stopToggle',
										click : function(e) {
											require(
													[ 'js/workflow/badwordorderDetail/closeSupplement' ],
													function(closeSupplement) {
														// 关单补充
														var dates = list
																.getCheckedRows();
														if (dates.length == 0) {
															
															pop.text({text:"请选择一条工单。"});
															return;
														}
														if (dates.length > 1) {
															
															pop.text({text:"请选择一条工单。"});
															return;
														}
														var wrkfmId = dates[0].wrkfmId;
														var data = {
															'wrkfmId' : wrkfmId
														}
														var remaind = new closeSupplement(
																data);
														var config2 = {
															mode : 'normal', // 对话框模式，默认normal标准|tips浮动层|confirm确认对话框
															// delayRmove:3,
															// //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
															title : "关单补充", // 对话框标题
															content : remaind.content, // 对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
															ok : function() {
																// console.log($("#sddasdasd").serializeObject());
																return remaind
																		.remaind_submit();

															}, // 确定按钮的回调函数
															okValue : "确定", // 确定按钮的文本
															cancel : function() {

															}, // 取消按钮的回调函数
															cancelValue : '取消', // 取消按钮的文本
															cancelDisplay : true, // 是否显示取消按钮
																					// 默认true显示|false不显示
															button : [],
															width : 500, // 对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
															height : 122, // 对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
															skin : 'dialogSkin', // 设置对话框额外的className参数
															fixed : false, // 是否开启固定定位
																			// 默认false不开启|true开启
															quickClose : false, // 点击空白处快速关闭
																				// 默认false不关闭|true关闭
															modal : true
														// 是否开启模态框状态
														// 默认false不开启|true开启,confirm默认状态为true
														}
														var dialog = new Dialog(
																config2)

													});
										}
									} ]
						}
					},
					data : {
						url : '/ngwf_he/front/sh/workflow!execute?uid=queryBadWorkOrder'
					}
				}
				list = new List(config);
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
					$(".btnCustom0").removeClass("btn");
					$(".btnCustom0").prop("disabled",true);
				});
				
				list.search({});
			}

		
			// 释放
			var release = function() {
				var dates = list.getCheckedRows();
				var str = "";
				if (dates.length == 0) {
					
					pop.text({text:"请至少选择一条信息!"});
					return;
				}
				var ids="";
				for (var i = 0; i < dates.length; i++) {
					if (i = dates.length - 1) {
						ids += dates[i].wrkfmShowSwftno;
					} else {
						ids += dates[i].wrkfmShowSwftno + ",";
					}
				}
				var param = {
					ids : ids,
					staffNum : currentUser.staffId,
					workItemStsCd : '30050004',
					nodeType : "",
				}
				
				Util.ajax.postJson(
								"/ngwf_he/front/sh/workflow!execute?uid=selectStaffIdforWorkInfo",
								param, function(result, isOk) {
									for (var i = 0; i < result.length; i++) {
										$.each(result, function(index, obj) {
											str += obj.wrkfmShowSwftno + "#"
													+ obj.workItemId + "#"
													+ obj.wrkfmTypeCd + "#"
													+ obj.seqprcTmpltId + "#"
													+ obj.prstNodeId + ",";
										});
									}

								});
				var date = {
					"workItemIds" : str,
					"dspsStaffNum" : currentUser.staffId,
					"dspsStaffName" : currentUser.staffName
				};
				// console.log(str);
				var url = "/ngwf_he/front/sh/workflow!execute?uid=release001";
				Util.ajax.postJson(url, date, function(result, isOk) {
					if (result.returnCode == '0') {
						
						pop.text({text:"选择" + dates.length + "条工单,成功释放"
								+ result.bean.successNum + "条工单"});
						list.search({});
						num = 0;
						$(".btnCustom0").val("已选择" + num + "条工单");
					} else {
						
						pop.text({text:"释放不成功"});
					 list.search({});
						list.search({});
					}
				});
			};

			/**
			 * 使用步骤： 1.在html页面添加：<div id="dialouge"></div> 容器
			 * 2.定义导出excel方法例子如下
			 */
			var excelExport = function() {
				// 定义导出excel查询类型（需要修改）
				var queryType = "01";
				require(
						[ 'js/workflow/common/exportExcelAlert' ],
						function(ex) {
							var excel = new ex();
							// 定义点击确定 按钮执行的事件（应为带着arr参数以及页面参数去请求excel文件下载）
							excel.confirm = function(arr) {
								var downloadUrl = "/ngwf_he/front/sh/workorderexport!export?uid=download&columns="
										+ arr;
								// 获取json格式的参数
								var pageParams = wrapParams();
								// 将参数添加到请求地址之后
								for (key in pageParams) {
									var value = pageParams[key];
									if (value != null && value != undefined
											&& value.trim() != '') {
										downloadUrl += "&" + key + "=" + value;
									}
								}
								// 下载excel资源
								location.href = downloadUrl;
							}
							excel.eventInit(queryType);
						});
			};
			//打开详情
			var openDetails = function (item){
				var param = {
						ids : item.data.wrkfmShowSwftno,
						staffNum : "",
						workItemStsCd : '30050004',
						nodeType : ""
							
					}
				Util.ajax.postJson(
						"/ngwf_he/front/sh/workflow!execute?uid=selectStaffIdforWorkInfo",
						param, function(result, isOk) {
							 if(result.beans.length>0){
								 CrossAPI.createTab(
											'工单详情',
											getBaseUrl()+'/ngwf_he/src/module/workflow/processinfoDetail/processinfoDetail.html',
											{"serialno":item.data.wrkfmShowSwftno,
											 workItemId:result.beans[0].workItemId
											});
							 }else{								 
								 pop.text({text:"工单未受理,无法查看详情"});
							 }
							
						})	    	
	               

				
		     }
		
			var getInfon = function() {
				$("#waitWork a").on("click", function() {
					var nodeType = $(this).attr("data-id");
					$(this).siblings().removeClass("activeButton");
					$(this).addClass("activeButton");
					list.search({});
				})
			};
			var getBaseUrl = function() {
				var ishttps = 'https:' == document.location.protocol ? true
						: false;
				var url = window.location.host;
				if (ishttps) {
					url = 'https://' + url;
				} else {
					url = 'http://' + url;
				}
				return url;
			}
			//查询数据字典，根据value获取中文name值；
			var getActionName = function(typeId,value){
				 var actionName;
				 var params = {
			                method: 'staticDictionary_get',
			                paramDatas: '{typeId:"'+typeId+'"}'
	            };
	            // 
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
			return initialize();
		});