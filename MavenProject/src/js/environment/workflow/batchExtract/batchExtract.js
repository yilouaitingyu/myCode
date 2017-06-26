define(
		['Util', 'date', 'list', 'select','jquery','crossAPI','js/workflow/commonTip/commonTip','../query/commonQuery'],
		function(Util, MyDate, List, Select,$,CrossAPI,commonTip){
		var list;
		var handlingorgacode;
		var currentUser;
		var staffName;
		var  commonTip = new commonTip();
		var sortField="tb1.crt_time";
		var sorting="desc";
		var pageArr = [ 5, 15, 20, 30, 50 ];
		var initialize = function(){
			//得到员工ID
			CrossAPI.getIndexInfo(function(info){
				currentUser=info.userInfo.staffId;
	        	staffName=info.userInfo.staffName;
	        	showList({"acceptTimeStart":time1,"acceptTimeEnd":time2,"currentUser":currentUser});
	        })
			dictionaryInit();
		};
		
		//下拉框加载数据字典方法
	    var loadDictionary=function(mothedName,dicName,seleId){
					var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
					var seleOptions="";
					Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
						$.each(result.beans,function(index,bean){
							seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
						});
						$('#'+seleId).append(seleOptions);
					},true);
	    };
	    
	    var dictionaryInit = function()
	    {
	    	$('#fd_search').on('click',queryOrder);
	    	loadDictionary('staticDictionary_get','HEBEI.QUESTION.TYPE','focusProblemType');//集中问题分类
	    	loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','serviceCity');//归属地市
	    	loadDictionary('staticDictionary_get','HEBEI.WF.ORDER.TYPE','businessType');//归属地市
	    }
		
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
		var time2 = nowDate.Format("yyyy-MM-dd 23:59:59");
		// 当前时间减去5天为起始时间
		var t = nowDate.getTime() - 30 * 24 * 60 * 60 * 1000;
		var time1 = new Date(t).Format("yyyy-MM-dd 00:00:00");
		var date1 = new MyDate({
			el : $('#startTime'),
			label : '建单时间',
			double : { // 支持一个字段里显示两个日期选择框
				start : {
					name : 'acceptTimeStart',
					format : 'YYYY-MM-DD hh:mm:ss',
					defaultValue:time1, //默认日期值
					max : '2099-06-16 23:59:59',
					istime : true,
					istoday : false
				},
				end : {
					name : 'acceptTimeEnd',
					format : 'YYYY-MM-DD hh:mm:ss',
					defaultValue:time2, //默认日期值
					max : '2099-06-16 23:59:59',
					istime : true,
					istoday : false
				}
			}
		});
		
		var showList = function(data){
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
				        	 text : '',
								name : 'wrkfmTypeCd',//工单类别
								className:"hide"
								},
								{
								text : '',
								name : 'workItemId',//工作项id
								className:"hide"
							},{
								text : '',
								name : 'prstNodeId',//当前节点id
								className:"hide"
							},{
								text : '',
								name : 'seqprcTmpltId',
								className:"hide"
							},

						{
							text : '业务类型',
							name : 'wrkfmTypeCd',
							render:function(item,val,$src){
								var obj=wrapDictionray("HEBEI.WF.ORDER.TYPE");
								return obj[val];
							}
						},
						{
							text : '工单流水号',
							name : 'wrkfmShowSwftno'
						},
						{
							text : '服务请求类别',
							name : 'srvReqstTypeId'
						},
						{
							text : '星级信息',
							name : 'custStargrdCd',
							render:function(item,val,$src){
								var obj=wrapDictionray("CCT_CUSTSTARLEVEL");
								return obj[val];
							}
						},
						{
							text : '受理号码',
							name : 'acptNum'
						},
						{
							text : '紧急程度',
							name : 'urgntExtentCd',
							render:function(item,val,$src){
								var obj=wrapDictionray("HEBEI.EDUCATION.TYPE");
								return obj[val];
							}
						},
						{
							text : '处理组/人',
							name : 'currentLinkGroup'
						},
						{
							text : '分派时间',
							name : 'anoceRecStsCdShow'
						},
						{
							text : '剩余处理时间',
							name : 'od'
						},
						{
							text : '整体时间',
							name : 'odrOp'
						},
						{
							text : '操作状态',
							name : 'opStsCd'
						},
						{
							text : '是否受理',
							name : 'odrOpe',
							render : function(item, val) {
								if (val==null) {
									return "否";
								}
							}
						} ,
						{
							text : '标记',
							name : ''
						} ,
						{
							text : '是否潜在升级',
							name : 'upgdCmplntsFlag',
							render:function(item,val,$src){
								return val=="true"?"是":"否";
							}
						} 
						
						],
			},
			page : {
				customPages : pageArr,
				perPage : 10,
				total : true,
				align : 'right',
				button : {
					className : 'operateButtons',
					items : [
							{
								text : "已选择0条工单",
								name : 'deleter'
							},
							{
								text : '提取工单',
								name : 'claim',
								click : function(e) {
									var str = "";
									var rows = list.getCheckedRows();
									if (rows.length == 0) {
										commonTip.text({text:"请至少选择一条信息!"});
										return;
									}
									for (var i = 0; i < rows.length; i++) {
										// 将工单流水号和工作项号拼接
										str += rows[i].wrkfmShowSwftno + "#"
												+ rows[i].workItemId + "#"
												+ rows[i].wrkfmTypeCd
												+ "#" + rows[i].seqprcTmpltId
												+ "#" + rows[i].prstNodeId
												+ ",";
									}
									var data = {
										"workItemIds" : str,
										"dspsStaffNum" : currentUser,
										"dspsStaffName":staffName
									}
									console.log(data);
									var url = "/ngwf_he/front/sh/workflow!execute?uid=claim001";
									Util.ajax.postJson(url,data,function(result) {
										if (result.returnCode=='0') {
											commonTip.text({text:"受理成功!"});
											list.search({});
											num = 0;
											$(".btnCustom0").val("已选择"+ num+ "条工单");
										} else {
											commonTip.text({text:"受理不成功!"});
											list.search({});
											num = 0;
										}
									});
								}
							}
						 ]
				}
			},
			data : {
				url : "/ngwf_he/front/sh/workflow!execute?uid=queryWaitHandleList&workItemStsCd=30050002&dspsStaffNum="+currentUser+"&sortField="+sortField+"&sorting="+sorting,
			}
		};
		// 按上面的配置创建新的列表
		list = new List(config);
		list.search(data);
		//每次成功加载数据以后都执行以下函数
		list.on('success',function(result){
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
		 //复选框条数
             $('.checkAllWraper > input').change(function(){
             	var num=$("input[type='checkbox']:checked").length;
             	if(num=='0'){
             		$(".btnCustom0").val("已选择" + num + "条工单")
             	}else{
             		$(".btnCustom0").val("已选择" + (num-1) + "条工单")
             	}
             });
		}
		//查询
		var queryOrder =function(){
				var startTime = $('#startTime div input[name="acceptTimeStart"]').val();
				var endTime = $('#startTime div input[name="acceptTimeEnd"]').val();
					if (startTime==""||endTime=="") {
						commonTip.text({text:"时间不能为空!"});
					}else{
						var endTimeDate = new Date(endTime);
						var startTimeDate = new Date(startTime);
						var times = endTimeDate.getTime()-startTimeDate.getTime();
						if (times>0) {
							var allowTimes = 31*24*60*60*1000;
							if (times>allowTimes) {
								commonTip.text({text:"请选择31天内进行查询"});
							}
						}else{
							commonTip.text({text:"开始时间不能大于结束时间！"});
						}
					}
				var businessType = $('#businessType').val();
				var serviceType = $('#serviceType').val();
				var focusProblemType = $('#focusProblemType').val();
				var subsNumber =$('#subsNumber').val().trim();
				var serviceCity =$('#serviceCity').val();
				var serviceContent =$('#serviceContent').val();
				var data = {
						"subsNumber":subsNumber,
						"acceptCity":serviceCity,
						"srTypeId":serviceType,
						"acceptTimeStart":startTime,
						"acceptTimeEnd":endTime,
						"casetypeCode":businessType,
						"cnctQuType":focusProblemType,
						"serviceContent":serviceContent
				};
				showList(data);
		};
		
		//清空按钮
		$('#fd_reset').click(function(){
			$('.resetInfo').val("");
			$('#startTime div input[name="acceptTimeStart"]').val(time1);
			$('#startTime div input[name="acceptTimeEnd"]').val(time2);
		})
		return initialize();
});