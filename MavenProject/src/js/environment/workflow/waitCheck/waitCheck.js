define(
		[ 'Util','validator', 'date', 'list', 'select', 'dialog', 'crossAPI', 'jquery' ],
		function(Util,Validator, MyDate, List, Select, Dialog, CrossAPI, $) {
			//当前nodetype，待复核，待处理，待反馈
			var currentNodeType = "01";
			//当前操作人handlingstaff
			var currentUser;
			var _formValidator;
			$.ajax({
				url:"/ngwf_he/data/userInfo.json",
				dataType:"json",
				async:false,
				success:function(data){
					currentUser=data.bean.staffId;
				}
			});
			//是否代办页面
			var isWait="";
			var list;
			var state;
			var initialize = function() {
				Init();
			};

			// queryStaticDatadictRest
			var loadDictionary = function(mothedName, dicName, seleId) {
				var params = {
					method : mothedName,
					paramDatas : '{typeId:"' + dicName + '"}'
				};
				var seleOptions = "";
				// debugger;
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',
						params, function(result) {
							$.each(result.beans, function(index, bean) {
								seleOptions += "<option  value='" + bean.value
										+ "'>" + bean.name + "</option>"
							});
							$('#' + seleId).append(seleOptions);
						}, true);
			};
			var Init = function() {
				loadDictionary('staticDictionary_get', 'ECP.PUB.USERBRAND',
						'clientBrand');// 加载客户品牌
				loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.LEVEL',
						'customerLevel');// 加载客户级别
				loadDictionary('staticDictionary_get', 'HEBEI.ACCEPT.CITY',
						'acceptArea');// 加载受理地区
				loadDictionary('staticDictionary_get', 'HEBEI.OR.COMPLAIN',
						'whetherAccept');// 是否受理
				loadDictionary('staticDictionary_get', 'HEBEI.EDUCATION.TYPE',
						'urgentDegree');// 加载紧急程度
				loadDictionary('staticDictionary_get', 'HEBEI.SERVICETYPE',
						'serviceType');// 加载业务类型
				loadDictionary('staticDictionary_get', 'HEBEI.OR.COMPLAIN',
						'whetherRepeat');// 是否重复投诉
				loadDictionary('staticDictionary_get',
						'HEBEI.COMPLAIN.CONTENT', 'complainContent');// 投诉内容
				loadDictionary('staticDictionary_get', 'HEBEI.COMPLAIN.METHOD',
						'complaintWay');// 投诉途径
			};
			// queryStaticDatadictRest
			// 进来之后默认显示的是 待办事宜里面的待处理 需要先请求后台请求权限;
			var config = {
				url : "data2.json", // 接受请求的地址
				success : function(data) {
					$("#waitWork a")[0].innerHTML = data[0].description;
					for (var i = 0; i < data.length; i++) {
						$("#waitWork a")[i].innerHTML = data[i].description;
						$("#waitWork a")[i].className = "showall";
						$("#waitWork a")[i].setAttribute("my-data",
								data[i].nodetype);
						$("#waitWork a")[i].setAttribute("id", data[i].id);
						$("#waitWork a")[i].onclick = function() {
							var id = $(this).attr("id");
							console.log(id)
							currentNodeType = $(this).attr("my-data");
							if ("waitDealWork" == id) {
								$('#selectbox').hide();
								state = "30050004";
								isWait="Y";
								$(".operateButtons > input").eq(1).hide();
								$(".operateButtons > input").eq(2).show();
								list.search({
									"wait" : "Y",
									"handlingstaff" : currentUser
								});
							} else {
								$('#selectbox').show();
								$(".operateButtons > input").eq(2).hide();
								$(".operateButtons > input").eq(1).show();
								state = "30050002";
								isWait="";
								list.search({
									"nodetype" : currentNodeType,
									"handlingstaff" : currentUser
								});
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
						$("#orderNext select").val($(this).attr("id"));

						//
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
							$('.t-columns-group li.hide').addClass('show')
									.removeClass('hide');
							$(this).children('i').addClass(
									'icon-iconfontjiantou-copy').removeClass(
									'icon-iconfontjiantou-copy-copy');
							$(".searchBtnRight").attr("id", "searchBtnRight");
						} else if ($('.t-columns-group li').hasClass('show')) {
							$('.t-columns-group li.show').addClass('hide')
									.removeClass('show');
							$(this).children('i').addClass(
									'icon-iconfontjiantou-copy-copy')
									.removeClass('icon-iconfontjiantou-copy');
							$(".searchBtnRight").removeAttr("id");
						}
					});

			// 添加时间对象原形.设置时间格式;
			Date.prototype.Format = function(fmt) { // author: meizz
				var o = {
					"M+" : this.getMonth() + 1, // 月份
					"d+" : this.getDate(), // 日
					"h+" : this.getHours(), // 小时
					"m+" : this.getMinutes(), // 分
					"s+" : this.getSeconds(), // 秒
					"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
					"S" : this.getMilliseconds()
				// 毫秒
				};
				if (/(y+)/.test(fmt))
					fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
							.substr(4 - RegExp.$1.length));
				for ( var k in o)
					if (new RegExp("(" + k + ")").test(fmt))
						fmt = fmt.replace(RegExp.$1,
								(RegExp.$1.length == 1) ? (o[k])
										: (("00" + o[k])
												.substr(("" + o[k]).length)));
				return fmt;
			}

			var nowDate = new Date();
			var time2 = nowDate.Format("yyyy/MM/dd hh:mm:ss");
			//console.log(time2)
			// 当前时间减去5天为起始时间
			var t = nowDate.getTime() - 5 * 24 * 60 * 60 * 1000;
			var time1 = new Date(t).Format("yyyy/MM/dd hh:mm:ss");
			var date1 = new MyDate({
				el : $('#startTime'),
				label : '开始时间',
				double : { // 支持一个字段里显示两个日期选择框
					start : {
						name : 'acceptTimeStart',
						format : 'YYYY/MM/DD hh:mm:ss',
						// defaultValue:time1, //默认日期值
						// min: laydate.now(-1),
						max : '2099/06/16 23:59:59',
						istime : true,
						istoday : false
					},
					end : {
						name : 'acceptTimeEnd',
						format : 'YYYY/MM/DD hh:mm:ss',
						// defaultValue:time2, //默认日期值
						// min: laydate.now(-1),
						max : '2099/06/16 23:59:59',
						istime : true,
						istoday : false
					}
				}
			});
			// 时间设置结束
			// 列表详情开始 start

			var num = 0; // 复选框选择工单条数
			var config = {
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
								text : '详情', // 按钮文本
								name : 'serialno', // 按钮名称
								click : function(e, item) { // 按钮点击时处理函数
									console.log(item);
									if (item.data.state == "30050004") {
										var lockdata = {
												"serialno":item.data.serialno,
												"handingStaff":currentUser
										}
										Util.ajax.postJson(
												'/ngwf_he/front/sh/workflow!execute?uid=detailDataLock',
												lockdata, function(json2, status) {
													CrossAPI.createTab(
															'工单详情',
															'http://localhost:8080/ngwf_he/src/module/workflow/processinfoDetail/processinfoDetail.html',
															{"serialno":item.data.serialno,
															 "workItemId":item.data.workitemid
															});
												})
									}

								}
							},

							{
								text : '服务类型',
								name : 'srtypeid'
							
							},
							{
								text : '工单类别',
								name : 'csvcprocesstype',
								className : 'w120'
							},
							{
								text : '工单流水号',
								name : 'serialno'
							},
							{
								text : '星级信息',
								name : 'starlevelinfo'
							},
							{
								text : '受理电话',
								name : 'subsnumber'
							},
							{
								text : '建单人',
								name : 'acceptstaffname'
							},
							{
								text : '紧急程度',
								name : 'urgentid'
							},
							{
								text : '处理组/人',
								name : 'handlingorgacode'
							},
							{
								text : '上一环节处理人',
								name : 'prehandlingstaff'
							},
							{
								text : '分配时间',
								name : 'creationtime'
							},
							{
								text : '剩余处理时间',
								name : 'od'
							},
							{
								text : '剩余派单时间',
								name : 'odr'
							},
							{
								text : '整体时限',
								name : 'odrOp'
							},
							{
								text : '操作状态',
								name : 'processstate'
							},
							{
								text : '是否受理',
								name : 'state',
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
								name : 'handlingstaff',
								render : function(item, val) {
									return (val == "" || val == undefined || val == null) ? "无"
											: val;
								}
							},
							{
								text : '是否潜在升级',
								name : 'upgradeflag'
							},
							{
								text : '',
								name : 'workitemid',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',
								name : 'state',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',
								name : 'nodeid',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',
								name : 'workiteminstid',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							// 模板id
							{
								text : '',
								name : 'templateid',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',
								name : 'processtype',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							} ],
				},
				page : {
					customPages : [ 5, 10, 15, 20, 30, 50 ],
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
												url="/ngwf_he/front/sh/workflow!execute?uid=queryOrderList&nodetype="+currentNodeType+"&handlingstaff="+currentUser+"&start=0&limit="+total+"&wait="+isWait;
											}else{
												//选的数小于查询的数目,受理前num条
												url="/ngwf_he/front/sh/workflow!execute?uid=queryOrderList&nodetype="+currentNodeType+"&handlingstaff="+currentUser+"&start=0&limit="+selectNum+"&wait="+isWait;
											}
											Util.ajax.postJson(url, result, function(result, isOk) {
												console.log(result.bean.total)
												//结果数
												var resultNum=result.bean.total;
												var dates=result.beans;
												var str;
												for(var i=0;i<dates.length;i++){
													//将需要的数据拼接
													str += dates[i].serialno + "#"+ dates[i].workitemid + "#"
													+ dates[i].processtype+ "#" + dates[i].templateid
													+ "#" + dates[i].nodeid+ ",";
												}
												Util.ajax.postJson("/ngwf_he/front/sh/workflow!execute?uid=claim001",
														{"workitemIds" : str,"handlingstaff":currentUser,},
														function(result,isOk){
															if(result.returnCode=='0'){
																CrossAPI.tips("选择"+dates.length+"条工单,成功受理"+result.bean.successNum+"条工单",3000);
																list.search({
																	"nodetype" : currentNodeType,
																	"handlingstaff":currentUser,
																	"wait":isWait
																});
															}else{
																CrossAPI.tips("受理不成功",3000)
																list.search({
																	"nodetype" : currentNodeType,
																	"handlingstaff":currentUser,
																	"wait":isWait
																});
															}
														})
											});
											return;
										}
										$.each(dates,function(index,obj){
											str+= obj.serialno + "#"
											+ obj.workitemid + "#"
											+ obj.processtype
											+ "#" + obj.templateid
											+ "#" + obj.nodeid
											+ ",";
										});
										var date = {
											"workitemIds" : str
										}
										// console.log(str);
										var url = "/ngwf_he/front/sh/workflow!execute?uid=claim001";
										Util.ajax.postJson(url,date,function(result, isOk) {
															if (result.returnCode=='0') {
																CrossAPI.tips("选择"+dates.length+"条工单,成功受理"+result.bean.successNum+"条工单",3000);
																list.search({
																	"nodetype" : currentNodeType,
																	"handlingstaff":currentUser,
																	"wait":isWait
																		});
																num = 0;
																$(".btnCustom0").val("已选择"+ num+ "条工单");
															} else {
																CrossAPI.tips("受理不成功",3000);
																list.search({
																	"nodetype" : currentNodeType,
																	"handlingstaff":currentUser,
																	"wait":isWait
																		});
															}
														});

									}
									}
								,
								{
									text : '释放',
									name : 'stopToggle',
									click : function(e) {
										var dates = list.getCheckedRows();
										var str = "";
										if (dates.length == 0) {
											CrossAPI.tips("请至少选择一条信息!",3000);
											return;
										}
										for (var i = 0; i < dates.length; i++) {
											if (dates[i].state != '30050004') {
												CrossAPI.tips("工单流水号"
														+ dates[i].serialno
														+ "还没受理",3000);
												return;
											}
											;
											str += dates[i].serialno + "#"
													+ dates[i].workitemid + "#"
													+ dates[i].processtype
													+ "#" + dates[i].templateid
													+ "#" + dates[i].nodeid
													+ ",";
										}
										var date = {
											"workitemIds" : str
										};
										// console.log(str);
										var url = "/ngwf_he/front/sh/workflow!execute?uid=release001";
										Util.ajax.postJson(url, date, function(
												result, isOk) {
											if (result.returnCode=='0') {
												CrossAPI.tips("选择"+dates.length+"条工单,成功释放"+result.bean.successNum+"条工单",3000);
												list.search({
													"nodetype" : currentNodeType,
													"handlingstaff":currentUser,
													"wait":isWait
												});
												num = 0;
												$(".btnCustom0").val("已选择" + num + "条工单");
											} else {
												CrossAPI.tips("释放不成功",3000);
												list.search({
													"nodetype" : currentNodeType,
													"handlingstaff":currentUser,
													"wait":isWait
												});
											}
										});
									}
								},
								{
									text : '导出',
									name : 'deleter',
									click : function(e) {
										// 打印当前按钮的文本
										console.log('点击了删除按钮' + e + this.text)
									}
								},
								{
									text : "催单1",
									name : 'reminder',
									click : function(e) {
										
										var dates = list.getCheckedRows();
										if (dates.length == 0) {
											CrossAPI.tips("请至少选择一条信息!",3000);
											return;
										}
										if (dates.length > 1) {
											CrossAPI.tips("请选择一条信息",3000);
											return;
										}
										
										// 打印当前按钮的文本
										var config = {
											mode : 'normal', // 对话框模式，默认normal标准|tips浮动层|confirm确认对话框
											title : '催单事由', // 对话框标题
											content : "<textarea id='reminder' name='reminder' cols='68' rows='8'>", // 对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
											ok : function() {
												var reminder = $("#reminder").val();
												var wrkfmShowSwftno = dates[0].wrkfmShowSwftno;
												var workItemId = dates[0].workItemId;
												var seqprcTmpltId = dates[0].seqprcTmpltId;
												var nodeId = dates[0].prstNodeId;
												var wrkfmId =dates[0].wrkfmId;
												debugger;
												var opStaffNum =currentUser.staffId;
												var opStaffName =currentUser.staffName;
												var opRsnTypeCd ="催单";//操作原因类型代码 
												var wrkfmTypeCd =dates[0].wrkfmTypeCd; //工单类型代码
												var opTypeCd ="0016";
												var url = "/ngwf_he/front/sh/workflow!execute?uid=reminder";
												var date = {
													'wrkfmShowSwftno' : wrkfmShowSwftno,
													'workItemId' : workItemId,
													'seqprcTmpltId' : seqprcTmpltId,  //流程模板id
													'nodeId' : nodeId,
													'opCntt' : reminder,
													'wrkfmId':wrkfmId,
													'opStaffNum':opStaffNum,
													'opStaffName':opStaffName,
													'opRsnTypeCd':opRsnTypeCd,
													'wrkfmTypeCd':wrkfmTypeCd,
													'opTypeCd':opTypeCd
													
												}
												Util.ajax.postJson(url,date,function(result,isOk) {
																	if (result.returnCode=='0') {
																		CrossAPI.tips('催单成功!',3000)
																		
																	} else {
																		CrossAPI.tips("添加催单事由失败",3000);
																	}

																});
											}, // 确定按钮的回调函数
											okValue : '确定', // 确定按钮的文本
											cancel : function() {
											}, // 取消按钮的回调函数
											cancelValue : '取消', // 取消按钮的文本
											cancelDisplay : true, // 是否显示取消按钮
																	// 默认true显示|false不显示
											width : 500, // 对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
											height : 180, // 对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
											skin : 'dialogSkin', // 设置对话框额外的className参数
											fixed : false, // 是否开启固定定位
															// 默认false不开启|true开启
											quickClose : false, // 点击空白处快速关闭
																// 默认false不关闭|true关闭
											modal : true
										// 是否开启模态框状态
										// 默认false不开启|true开启,confirm默认状态为true
										}
										var dialog = new Dialog(config);
										
										
									}
								}, ]
					}
				},
				data : {
					url : '/ngwf_he/front/sh/workflow!execute?uid=queryOrderList',
				}
			};
			// 按上面的配置创建新的列表
			var list = new List(config);
			list.search({
				"nodetype" : currentNodeType,
				"handlingstaff":currentUser,
				"wait":isWait
				//"state" : "30050002"
			});
			//创建节点放在受理后面
			list.on('checkboxChange', function(e, item, checkedStatus) {// 事件处理代码
				if (checkedStatus == 1) {
					num++
					$(".btnCustom0").val("已选择" + num + "条工单")
				} else {
					num--
					$(".btnCustom0").val("已选择" + num + "条工单")
				}
			})
			// 点击查询按钮时的事件
			$("#searchButton").click(function() {
				var serialno = $("#serialno").val();// 流水号
				var acceptstaffname = $("#acceptstaffname").val();// 建单人
				var acceptTimeStart = $(".bg-date").eq(0).val();// 开始时间
				var acceptTimeEnd = $(".bg-date").eq(1).val();// 结束时间
				var contactphone1 = $("#contactphone1").val();// 联系电话
				var callerno = $("#callerno").val();// 主叫号码
				var subsnumber = $("#subsnumber").val();// 受理号码
				var whetherAccept =$("#whetherAccept").val();//是否受理
				if(whetherAccept=="01"){
					whetherAccept="30050004";
				}
				if(whetherAccept=="02"){
					whetherAccept="30050002";
				}
				var subsbrand = $("#clientBrand").val();// 客户品牌
				var subslevel = $("#customerLevel").val();// 客户级别
				var acceptcity = $("#acceptArea").val();// 受理地区
				var urgentid = $("#urgentDegree").val();// 紧急程度
				var complaincontent = $("#complaincontent").val();
				var orderNext = $("#orderNext").val();// 工单类型
				var repeatflag = $("#whetherRepeat").val();// 是否重复投诉
				var complainway = $("#complaintWay").val();// 投诉途径
				var searchData = {
					"serialno" : serialno,
					"acceptstaffname" : acceptstaffname,
					"subsnumber" : subsnumber,
					"acceptTimeStart" : acceptTimeStart,
					"acceptTimeEnd" : acceptTimeEnd,
					"contactphone1" : contactphone1,
					"callerno" : callerno,
					"subsbrand" : subsbrand,
					"subslevel" : subslevel,
					"acceptcity" : acceptcity,
					"urgentid" : urgentid,
					"repeatflag" : repeatflag,
					"complaincontent" : complaincontent,
					"complainway" : complainway,
					"state" : whetherAccept,
					"nodetype" : currentNodeType,
					"handlingstaff":currentUser,
					"wait":isWait
				};
				console.log(searchData);
				list.search(searchData);

			})
			list.on('success', function(result) {
				console.log(result)
			})
			$('#btn').on('click', function() {
				list.load(arr);
			})
			
			$(".orderClassify > a").click(function(){
				var orderType = $(this).attr("my-data");
				var serialno = $("#serialno").val();// 流水号
				var acceptstaffname = $("#acceptstaffname").val();// 建单人
				var acceptTimeStart = $(".bg-date").eq(0).val();// 开始时间
				var acceptTimeEnd = $(".bg-date").eq(1).val();// 结束时间
				var contactphone1 = $("#contactphone1").val();// 联系电话
				var callerno = $("#callerno").val();// 主叫号码
				var subsnumber = $("#subsnumber").val();// 受理号码
				var subsbrand = $("#clientBrand").val();// 客户品牌
				var subslevel = $("#customerLevel").val();// 客户级别
				var acceptcity = $("#acceptArea").val();// 受理地区
				var urgentid = $("#urgentDegree").val();// 紧急程度
				var complaincontent = $("#complaincontent").val();
				var orderNext = $("#orderNext").val();// 工单类型
				var repeatflag = $("#whetherRepeat").val();// 是否重复投诉
				var complainway = $("#complaintWay").val();// 投诉途径
				var searchData = {
					"serialno" : serialno,
					"acceptstaffname" : acceptstaffname,
					"subsnumber" : subsnumber,
					"acceptTimeStart" : acceptTimeStart,
					"acceptTimeEnd" : acceptTimeEnd,
					"contactphone1" : contactphone1,
					"callerno" : callerno,
					"subsbrand" : subsbrand,
					"subslevel" : subslevel,
					"acceptcity" : acceptcity,
					"urgentid" : urgentid,
					"repeatflag" : repeatflag,
					"complaincontent" : complaincontent,
					"complainway" : complainway,
					"nodetype" : currentNodeType,
					"handlingstaff":currentUser,
					"wait":isWait,
					"srtypeid":orderType
				};
				console.log(searchData);
				list.search(searchData);
			});
			// 列表详情最 end
			//清空按钮
			$('#restValue').click(function(){
				$('#queryForm')[0].reset();
			})
			//添加下拉列表
			var selectbox="<div> <select id='selectbox'><option value='1'>1</option>" +
					"<option value='5'>5</option>" +
					"<option value='10'>10</option><option value='20'>20</option>" +
					"<option value='30'>30</option><option value='50'>50</option>" +
					"<option value='100'>100</option></select></div>";
		     $(".btnCustom1").after($(selectbox))
			 $(selectbox).find("div").addClass("btn");
		     
		   //复选框条数
             $('.checkAllWraper > input').change(function(){
             	var num=$("input[type='checkbox']:checked").length;
             	if(num=='0'){
             		$(".btnCustom0").val("已选择" + num + "条工单")
             	}else{
             		$(".btnCustom0").val("已选择" + (num-1) + "条工单")
             	}
             });
            var  validateForm =function() {
		    	 var config = {
		    	            el: $el,
		    	            rules: {
		    	                // 主叫号码必须有,并且是手机号格式
		    	            	supplementComplant:"required|max-300"
		    	            },
		    	            messages:{
		    	            	supplementComplant:{
		                            "required":"投诉内容不能为空",
		                            "max":"投诉内容长度做大为300"
		                        }
		                    }
		    	 
			    	 };
			    _formValidator = new Validator(config);
            }
			return initialize();
			// 最外层require
		})
