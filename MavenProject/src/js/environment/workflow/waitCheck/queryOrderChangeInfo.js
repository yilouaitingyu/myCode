define(
		[ 'Util', 'date', 'list', 'select', 'dialog', 'crossAPI', 'jquery' ],
		function(Util, MyDate, List, Select, Dialog, CrossAPI, $) {
			var list;
			var state;
			var initialize = function() {
				Init();
				evenInit();
				orderCahngeList({});
			};
			
			var Init = function() {
				loadDictionary('staticDictionary_get', 'HEBEI.ORDER.STATE',
						'orderState');
				loadDictionary('staticDictionary_get', 'ECP.PUB.USERBRAND',
						'clientBrand');
				loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.LEVEL',
						'customerLevel');
				loadDictionary('staticDictionary_get', 'HEBEI.ACCEPT.CITY',
						'acceptArea');
				loadDictionary('staticDictionary_get', 'HEBEI.EDUCATION.TYPE',
						'urgentDegree');
				loadDictionary('staticDictionary_get', 'HEBEI.OPERATION.TYPE',
						'operationType');
			};
			
			var evenInit = function (){
				$('#searchButton').on('click',searchButton);
				$('#resetButton').on('click',resetBtn);
			}
			//查询
			var searchButton = function (){
				var serialno = $('#serialno').val();
				var acceptstaffname = $('#acceptstaffname').val();
				var startTime = $(".bg-date").eq(0).val();
				var endTime = $(".bg-date").eq(1).val();
				var reviser = $('#reviser').val();
				var masterTel = $('#masterTel').val();
				var acceptTel = $('#acceptTel').val();
				var orderState = $('#orderState').val();
				var customerLevel = $('#customerLevel').val();
				var acceptArea = $('#acceptArea').val();
				var urgentDegree = $('#urgentDegree').val();
				var operationType = $('#operationType').val();
				var data = {
						'serialno':serialno,
						'acceptstaffname':acceptstaffname,
						'startTime':startTime,
						'endTime':endTime,
						'reviser':reviser,
						'masterTel':masterTel,
						'acceptTel':acceptTel,
						'orderState':orderState,
						'customerLevel':customerLevel,
						'acceptArea':acceptArea,
						'urgentDegree':urgentDegree,
						'operationType':operationType
				};
				orderCahngeList(data);
			}
			//重置
			var resetBtn = function () {
				$('#serialno').val('');
				$('#acceptstaffname').val('');
				$(".bg-date").eq(0).val('');
				$(".bg-date").eq(1).val('');
				$('#reviser').val('');
				$('#masterTel').val('');
				$('#acceptTel').val('');
				$('#orderState').val('');
				$('#customerLevel').val('');
				$('#acceptArea').val('');
				$('#urgentDegree').val('');
				$('#operationType').val('');
			}

			// queryStaticDatadictRest
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
							console.log(result);
						}, true);
			};
			

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
			console.log(time2)
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
						max : '2099/06/16 23:59:59',
						istime : true,
						istoday : false
					},
					end : {
						name : 'acceptTimeEnd',
						format : 'YYYY/MM/DD hh:mm:ss',
						max : '2099/06/16 23:59:59',
						istime : true,
						istoday : false
					}
				}
			});
			// 时间设置结束
			// 列表详情开始 start
			var orderCahngeList = function(data){
				var num = 0; // 复选框选择工单条数
				var config = {
				el : $('#listContainer'),
				className : 'listContainer',
				field : {
					boxType : 'checkbox',
					key : 'id',
					items : [
							{
								text : '投诉类型', // 按钮文本
								name : 'description',render:function(item,val){ 
			                        if(val==null){
			                        	return '<a href="javascript:void(0)" style="color:blue">详情</a>';
			                        } 
								},
								click : function(e, item) { // 按钮点击时处理函数
									console.log(item);
										crossAPI.createTab(
														'工单详情',
														'http://localhost:8080/ngwf_he/src/module/workflow/processinfoDetail/processinfoDetail.html',
														{"serialno":item.data.serialno,
														 "workItemId":item.data.workitemid
														});

								}
							},

							{
								text : '工单流水号',
								name : 'serialno'
							},
							{
								text : '修改的字段',
								name : 'feildname'
							},
							{
								text : '修改人',
								name : 'dealstaff'
							},
							{
								text : '修改时间',
								name : 'mdfdate'
							},
							{
								text : '建单时间',
								name : 'wf_create'
							},
							{
								text : '紧急程度',
								name : 'urgentid'
							},
							{
								text : '修改详情',
								name : 'showInfo',render:function(item,val){ 
			                        if(val==null){
			                        	return '<a  style="color:blue">查看详情</a>';
			                        }
								}
							}]
				},
				page : {
					customPages : [ 2, 3, 5, 10, 15, 20, 30, 50 ],
					perPage : 2,
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
									text : '导出',
									name : 'deleter',
									click : function(e) {
										// 打印当前按钮的文本
										console.log('点击了删除按钮' + e + this.text)
									}
								}]
					}
				},
				data : {
					//url : '/ngwf_he/front/sh/workflow!execute?uid=operate002',
				}
			};
			// 按上面的配置创建新的列表
			var list = new List(config);
			list.search({});
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
			}
			
			return initialize();
		})
