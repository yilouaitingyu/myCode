define(
		[ 'Util', 'date', 'list', 'select', 'dialog', 'crossAPI', 'jquery',
				'./commonQuery' ],
		function(Util, MyDate, List, Select, Dialog, CrossAPI, $, commonQuery) {
			// list表格
			var list;

			// 所有初始化入口
			var init = function() {
				// 定义List
				defineList();
				// 定义日期框
				defineDate();
				// 定义查询重置按钮
				defineBtns();
				// 获取各下拉框
				defineSelects();
			};

			// 日期框
			var defineDate = function() {
				var date1 = new MyDate({
					el : $('#accepttime'),
					label : '建单时间',
					double : { // 支持一个字段里显示两个日期选择框
						start : {
							name : 'acceptTimeStart',
							format : 'YYYY/MM/DD hh:mm:ss',
							// defaultValue:time1, //默认日期值
							// min: laydate.now(-1),
							max : '2099/06/16 23:59:59',
							istime : true,
							istoday : false,
							choose : function(datas) {
								this.end.min = datas; // 设置结束日期的最小限制
								// this.end.start = datas; //设置结束日期的开始值
								var date = new Date(datas);
								var t = new Date(date.getTime() + 5 * 24 * 60
										* 60 * 1000);
								this.end.max = t.Format("yyyy/MM/dd hh:mm:ss"); // 设置结束日期的开始值
							}
						},
						end : {
							name : 'acceptTimeEnd',
							format : 'YYYY/MM/DD hh:mm:ss',
							// defaultValue:time2, //默认日期值
							// min: laydate.now(-1),
							max : '2099/06/16 23:59:59',
							istime : true,
							istoday : false,
							choose : function(datas) {
								var date = new Date(datas);
								var t = new Date(date.getTime() - 5 * 24 * 60
										* 60 * 1000);
								this.start.min = t
										.Format("yyyy/MM/dd hh:mm:ss"); // 设置结束日期的开始值
							}
						}
					}
				});
			}
			var defineBtns = function() {
				// 重置按钮
				$('#restValue').click(function() {
					$('#queryForm')[0].reset();
				});

				// 查询按钮
				$('#searchButton').click(function() {
					list.search(wrapParams());
				});
			}
			var defineSelects = function() {
				// 受理方式
				loadDictionary('staticDictionary_get', 'HEBEI.DIC.ACCEPTMODE',
						'acceptmode');
				// 客户品牌
				loadDictionary('staticDictionary_get', 'ECP.PUB.USERBRAND',
						'subsbrand');
				// 客户级别
				loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.LEVEL',
						'subslevel');
				// 受理地市
				loadDictionary('staticDictionary_get', 'HEBEI.ACCEPT.CITY',
						'acceptcity');
				// 网络类别
				loadDictionary('staticDictionary_get', 'HEBEI.NET.TYPE',
						'nettype');
			}

			// 获取查询参数
			var wrapParams = function() {
				var serialno = $("#serialno").val();// 流水号
				var acceptstaffname = $("#acceptstaffname").val();// 建单人
				var acceptTimeStart = $(".bg-date").eq(0).val();// 开始时间
				var acceptTimeEnd = $(".bg-date").eq(1).val();// 结束时间
				var callerno = $("#callerno").val();// 主叫号码
				var subsnumber = $("#subsnumber").val();// 受理号码
				var subsbrand = $("#subsbrand").val();// 客户品牌
				var custLvlCd = $("#subslevel").val();// 客户级别
				var acceptcity = $("#acceptcity").val();// 受理地区
				var currentNodeType = "";// 节点类型
				var searchData = {
					"showSerialNo" : serialno,
					"acceptStaffNo" : acceptstaffname,
					"subsNumber" : subsnumber,
					"acceptTimeStart" : acceptTimeStart,
					"acceptTimeEnd" : acceptTimeEnd,
					"callerNo" : callerno,
					"custLvlCd" : custLvlCd,
					"subsBrand" : subsbrand,
					"acceptCity" : acceptcity,
					"workItemStsCd" : "30010005",
					"nodeTypeCd" : currentNodeType
				};
				console.info(searchData);
				return searchData;
			}
			// 配置list
			var defineList = function() {
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
									text : '工单类别', // 按钮文本
									name : 'wrkfmTypeCd', // 按钮名称
								},
								{
									text : '工单流水号', // 按钮文本
									name : 'wrkfmShowSwftno', // 按钮名称
									click : function(e, item) { // 按钮点击时处理函数
										console.log(item);
										openDetails(item);
									}
								},

								{
									text : '服务类型',
									name : 'srvReqstTypeId',
								},
								{
									text : '客户星级',
									name : 'custStargrdCd'
								},
								{
									text : '受理渠道',
									name : 'acptChnlId'
								},
								{
									text : '工单类型',
									name : 'wrkfmTypeCd'
								},
								{
									text : '受理号码',
									name : 'acptNum'
								},
								{
									text : '建单人',
									name : 'acptStaffNum'
								},
								{
									text : '紧急程度',
									name : 'urgntExtentCd'
								},
								{
									text : '处理组/人',
									name : 'dspsWorkGrpId'
								},
								{
									text : '上一环节处理人',
									name : 'lstoneDspsStaffNum'
								},
								{
									text : '分配时间',
									name : 'crtTimeItem'
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
									name : 'WRKFM_STS_CD'
								},
								{
									text : '是否受理',
									name : 'workItemStsCd',
									render : function(item, val) {
										if (val == "30050004") {
											return "是";
										} else if (val == "30050002") {
											return "否"
										}
									}
								},
								{
									text : '受理人',
									name : 'dspsStaffNum',
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
									text : '是否潜在升级',
									name : 'upgdCmplntsFlag'
								},
								{
									text : '',
									name : 'workItemId',// 工作项id
									render : function(item, val) {
										return "<p style='display:none;'>"
												+ val + "</p>";
									}
								},
								{
									text : '',// 工作项状态
									name : 'workItemStsCd',
									render : function(item, val) {
										return "<p style='display:none;'>"
												+ val + "</p>";
									}
								},
								{
									text : '',
									name : 'prstNodeId',// 当前节点id
									render : function(item, val) {
										return "<p style='display:none;'>"
												+ val + "</p>";
									}
								},
								{
									text : '',
									name : 'workItemIstncId',// 工作项实例id
									render : function(item, val) {
										return "<p style='display:none;'>"
												+ val + "</p>";
									}
								},
								// 模板id
								{
									text : '',
									name : 'seqprcTmpltId',
									render : function(item, val) {
										return "<p style='display:none;'>"
												+ val + "</p>";
									}
								},
								{
									text : '',
									name : 'wrkfmTypeCd',// 工单类别
									render : function(item, val) {
										return "<p style='display:none;'>"
												+ val + "</p>";
									}
								} ]
					},
					page : {
						customPages : [ 5, 10, 15, 20, 30, 50 ],
						perPage : 10,
						total : true,
						align : 'right'
					},
					data : {
						url : '/ngwf_he/front/sh/workflow!execute?uid=queryAllOrderList',
					}
				};
				// 加载数据
				list = new List(listConfig);
				list.search(wrapParams());
			}

			// 打开详情
			var openDetails = function(item) {
				var lockdata = {
					"serialno" : item.data.wrkfmShowSwftno,
					"handingStaff" : currentUser.staffId
				}
				crossAPI.createTab(
								'工单详情',
								getBaseUrl()
										+ '/ngwf_he/src/module/workflow/processinfoDetail/processinfoDetail.html',
								{
									"serialno" : item.data.wrkfmShowSwftno,
									"workItemId" : item.data.workItemId
								});
			}

			// 定义数据字典加载方法
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
								seleOptions += "<option  value='" + bean.value
										+ "'>" + bean.name + "</option>"
							});
							$('#' + seleId).append(seleOptions);
						}, true);
			};

			return init();

		})
