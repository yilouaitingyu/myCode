define(
		[ 'Util', 'date', 'list', 'select', 'dialog', 'crossAPI', 'jquery',
			'./commonQuery'],
			function(Util, MyDate, List, Select, Dialog, CrossAPI, $,commonQuery) {
			
				var loginStaffId;
		
		var init=function init (options) {
			 crossAPI.getIndexInfo(function(info){
				 loginStaffId=info.userInfo.staffId;
	            })
			loadDictionary('staticDictionary_get', 'HEBEI.ACCEPT.CITY',
			'acceptcity');// 加载受理地区
			loadDictionary('staticDictionary_get','CSP.PUB.ACCEPTMODE','acceptmode');//加载受理方式信息
			loadDictionary('staticDictionary_get','HEBEI.DIC.PROCESSSTATE','processstate');//工单状态
			loadDictionary('staticDictionary_get','ECP.PUB.USERBRAND','subsbrand');//加载客户品牌信息
			loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','subslevel');//加载客级别信息
			//loadDictionary('staticDictionary_get','CSP.PUB.YESNO','newOldBuniess');//加载新旧业务
			loadDictionary('staticDictionary_get', 'HEBEI.DIC.CONTACTCHANNEL',
			'acceptChannel');// 受理渠道
			loadDictionary('staticDictionary_get', 'CCT_CUSTSTARLEVEL',
			'rank');// 客户星级
			loadDictionary('staticDictionary_get','HEBEI.DEPARTMENT.DEAL','department');//加载处理部门
			loadDictionary('staticDictionary_get','HEBEI.NET.TYPE','nettype');//网络类别
			loadDictionary('staticDictionary_get', 'HEBEI.COUNTY.COMPANY', 'handelConteryCom'); //处理县公司
			loadDictionary('staticDictionary_get','HEBEI.QUESTION.TYPE','proplemClass');//加载集中问题分类信息
			loadDictionary('staticDictionary_get','HEBEI.EVALUATE.DEGREE','PlaybackRank');//满意度
			loadDictionary('staticDictionary_get', 'HEBEI.OR.COMPLAIN',
			'playback');// 是否回访
			//创建日期框
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
						choose: function(datas){
							this.end.min = datas; //设置结束日期的最小限制
							//this.end.start = datas; //设置结束日期的开始值
							var date=new Date(datas);
							var t = new Date(date.getTime() + 5 * 24 * 60 * 60 * 1000);
							this.end.max = t.Format("yyyy/MM/dd hh:mm:ss"); //设置结束日期的开始值
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
						choose: function(datas){
							var date=new Date(datas);
							var t = new Date(date.getTime() - 5 * 24 * 60 * 60 * 1000);
							this.start.min = t.Format("yyyy/MM/dd hh:mm:ss"); //设置结束日期的开始值
						}
					}
				}
			});
			// 时间设置结束
			
			
			loadDataList();
			
			
			
		};
		
		//清空按钮
		$('#restValue').click(function(){
			$('#queryForm')[0].reset();
		})
		
		//查询按钮
		$('#searchButton').click(function(){
			loadDataList();
		})
		
		var wrapParams = function(){
			var serialno = $("#serialno").val();// 流水号
			var acceptstaffname = $("#acceptstaffname").val();// 建单人
			var subsnumber = $("#subsnumber").val();// 受理号码
			var callerno = $("#callerno").val();// 主叫号码
			var acceptmode = $("#acceptmode").val();// 受理方式
			var processstate = $("#processstate").val();//工单状态
			var subsbrand = $("#subsbrand").val();// 客户品牌
			var subslevel = $("#subslevel").val();// 客户级别
			var acceptcity = $("#acceptcity").val();  //受理地市
			var contactphone1 = $("#contactphone1").val(); //联系电话1
			//var newOldBuniess = $("#newOldBuniess").val(); //新旧业务
			var transparencyNo = $("#transparencyNo").val(); //透明化短号码
			var starCustomer = $("#starCustomer").val();  //星级客户状态
			var rank = $("#rank").val(); //星级客户等级
			var requestType = $("#requestType").val(); //服务请求类别
			var playback = $("#playback").val();  //是否回访
			var PlaybackRank = $("#PlaybackRank").val(); //回访满意度
			var complaintPlace = $("#complaintPlace").val(); ///投诉归属地
			var acceptChannel = $("#acceptChannel").val(); //受理渠道
			var department = $("#department").val();    //部门
			var nettype = $("#nettype").val();			//网络类别
			var handelConteryCom = $("#handelConteryCom").val();//处理县公司
			var proplemClass = $("#proplemClass").val(); //集中问题分类
			var acceptTimeStart = $(".bg-date").eq(0).val();// 开始时间
			var acceptTimeEnd = $(".bg-date").eq(1).val();// 结束时间
			
			var searchData = {
				//工单表未匹配的字段
				"showSerialNo" : serialno,
				"acptNum" : subsnumber,
				"callingNum" : callerno,
				"acceptTimeStart" : acceptTimeStart,
				"acceptTimeEnd" : acceptTimeEnd,
				"acptModeCd" : acceptmode,
				"wrkfmStsCd" : processstate,
				"custTypeCd" : subsbrand,
				"acptNumBelgCityCode" : acceptcity,
				"fstConcTelnum" : contactphone1,
				"custStargrdCd" : rank,
				"needRevstFlag":playback,
				"acptChnlId":acceptChannel,
				"acptDeptId":department,
				"webTypeCd":nettype,
				"custStsCd" : starCustomer,
				"acptStaffNum" : acceptstaffname,
				"srvReqstTypeId":PlaybackRank,
				"srvReqstId" : requestType,
				

				//未匹配的字段 start
				"handelConteryCom":handelConteryCom,
				"proplemClass":proplemClass,
				//"newOldBuniess" : newOldBuniess,
				//未匹配字段end
				//工单扩展表v  ACPT_NUM_BELG_CITY_CODE
				"acptNumBelgCityCode":complaintPlace,
				"custLvlCd" : subslevel,
				"trsprtSmsIsudFlag" : transparencyNo
				
				
				
				
				
			};
			console.log(searchData);
			return searchData;
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
							text : '工单类别', // 按钮文本
							name : 'wrkfmTypeCd', // 按钮名称
							render:function(item,val,$src){
								var obj=wrapDictionray("HEBEI.WF.ORDER.TYPE");
								return obj[val];
							}
						},
						{
							text : '工单流水号', // 按钮文本
							name : 'wrkfmShowSwftno', // 按钮名称
							click : function(e, item) { // 按钮点击时处理函数
								openDetails(item);
							}
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
							text : '建单时间',
							name : 'crtTime'
						},
						{
							text : '紧急程度',
							name : 'urgntExtentCd',
                        	render:function(item){
                        		return matchDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE',item.urgntExtentCd);
                        	}
						},
						{
							text : '完成时间',
							name : 'dspsComplteTime'
						},
						{
							text : '操作状态',
							name : 'opStsCd'
						},
						{
							text : '是否潜在升级',
							name : 'upgdCmplntsFlag',
							render:function(item){
								return item.upgdCmplntsFlag=="true"?"是":"否";
							}
						},
						{
							text : '透明化短号码',
							name : ''
						}]
				},
				page : {
					customPages : [ 5, 10, 15, 20, 30, 50 ],
					perPage : 10,
					total : true,
					align : 'right',
					button : {
						className : 'operateButtons',
						items : [
						         
						         ]
					}
				},
				data : {
					url : '/ngwf_he/front/sh/workflow!execute?uid=queryAllOrderList01',
				}
		};
		//加载数据
		var list=new List(listConfig);
		//============定义加载数据方法配置结束
		var loadDataList = function(){
			list.search(wrapParams());
		}
		
		// 定义数据字典加载方法
		var loadDictionary = function(mothedName, dicName, seleId) {
			var params = {
				method : mothedName,
				paramDatas : '{typeId:"' + dicName + '"}'
			};
			var seleOptions = "";
			Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',
					params, function(result) {
						$.each(result.beans, function(index, bean) {
							seleOptions += "<option  value='" + bean.value
									+ "'>" + bean.name + "</option>"
						});
						$('#' + seleId).append(seleOptions);
						//console.log(result);
					}, true);
		};
		var matchDictionary = function(mothedName, dicName, value) {
			var params = {
				method : mothedName,
				paramDatas : '{typeId:"' + dicName + '"}'
			};
			var name=value;
			Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',
					params, function(result) {
						$.each(result.beans, function(index, bean) {
							if(value== bean.value)
								name=bean.name;
						});
					}, true);
			return name;
		};
		//打开详情
		 var openDetails = function (item){
			 var wkdata = {
			 			"serialno":item.data.wrkfmShowSwftno,
			 	        "loginStaffId":loginStaffId,
			 	};
			 	Util.ajax.postJson(
			 			'/ngwf_he/front/sh/workflow!execute?uid=detailData003',
			 			wkdata, function(json1, status) {
			 			workItem = json1.bean;
			 			console.log(workItem);
			 			if(workItem != null && workItem.workItemStsCd == "30050004"){
			 				crossAPI.createTab(
									'工单详情',
									getBaseUrl()+'/ngwf_he/src/module/workflow/processinfoDetail/processinfoDetail.html',
									{"serialno":item.data.wrkfmShowSwftno,
									 "workItemId":workItem.workItemId
									});
			 				
			 			}else
			 				crossAPI.tips("工单未受理，无法查看详情！",3000);
			 			});
			
		 }
		return init();
})



