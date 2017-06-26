	define(['Util','list','date','selectTree','select','dialog','indexLoad','crossAPI'],   
	function(Util,List,MyDate,selectTree,Select,Dialog,IndexLoad,CrossAPI){
		//结果显示页面
		var list;
		//员工号码
		var staffId;
		var _index;
		var _options;
		//员工姓名
		var staffName;
		var num = 0;//下拉框选中条数
		var pageArr = [5,10,15,20,30,50]; //定义列表每页显示的条数;
		var init = function()
		{
			//加载数据字典
			dictionaryInit();
			//省份下拉框加载
			cityInit();
			//按钮初始化绑定
			buttonInit();
			batchWorkItemInfoList();
		}
		//短信模板下拉框加载
		var smsTemplateInit = function(){
			var seleOptions = "";
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=selectSmsTemplateForBatch',{},function(result){
				$.each(result.beans,function(index,bean){
					seleOptions+="<option  value='"+bean.id+"'>"+bean.templateName+"</option>"
				});
				$("#nomalTemplate").append(seleOptions);
			},true);
			
			//为下拉框添加改变事件
			$("#nomalTemplate").change(nomalTemplateChange);
		}
		
		//短信模板下拉框改变事件
		var nomalTemplateChange = function(){
			//得到选择框中的id值
			var smsId = $("#nomalTemplate").val();
			if(smsId == null || smsId == ""){
				$("#smsContent").val("");
				return;
			}
			var smsParam = {"id":smsId};
			
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=selectSmsTemplateForBatch',smsParam,function(result){
				// 给输入框赋值
				$("#smsContent").val(result.beans[0].content);
			},true);
		}
		
		//省份下拉框加载
		var cityInit = function(){
			var seleOptions = "";
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryCitys',{},function(result){
				$.each(result.beans,function(index,bean){
					seleOptions+="<option  value='"+bean.sid+"'>"+bean.sname+"</option>"
				});
				$("#subsCity1").append(seleOptions);
				console.log(result);
			},true);
			
			//为下拉框添加改变事件
			$("#subsCity1").change(city1Change);
		}
		
		//城市点击后改变
		var city1Change = function(){
			var seleOptions = "";
			var sid = $("#subsCity1").val();
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryCitysBySid',{"sid":sid},function(result){
				$.each(result.beans,function(index,bean){
					seleOptions+="<option  value='"+bean.did+"'>"+bean.dname+"</option>"
				});
				//删除地市中所有的子节点
				deleteChildNode();
				//给地市附上新的下拉框
				$("#subsCity2").append(seleOptions);
				console.log(result);
			},true);
		}
		
		var getBaseUrl = function () {
 			var ishttps = 'https:' == document.location.protocol ? true: false;
 			var url = window.location.host;
 			if(ishttps){
 				url = 'https://' + url;
 			}else{
 				url = 'http://' + url;
 			}
 			return url;
 		}
		
		//打开详情
		 var openDetails = function (item){
	    	 if (item.data.workState == "30050004") {
					var lockdata = {
							"serialno":item.data.serialno,
							"handingStaff":staffId
					}
								crossAPI.createTab(
										'工单详情',
										getBaseUrl()+'/ngwf_he/src/module/workflow/processinfoDetail/processinfoDetail.html',
										{"serialno":item.data.serialno,
										 "workItemId":item.data.workItemId
										});
//							})
			}else{
				crossAPI.tips("该工单需先受理！",3000);
			}
	     }
		
		//删除所有的子节点
		var deleteChildNode = function(){
			 var city2 = document.getElementById("subsCity2");
		        while (city2.hasChildNodes()) {
		        	city2.removeChild(city2.firstChild);
		        }
		}
		
		//按钮初始化绑定方法
		var buttonInit =function(){
			//查询按钮绑定
			$("#searchButton").on("click",searchButton);
			//重置按钮绑定
			$("#resetButton").on("click",resetButton);
			//（短信发送）取消按钮绑定
			$("#cancelButton").on("click",cancelButton);
			//（短信发送）提交按钮绑定
			$("#submitButton").on("click",submitButton);
			//弹出框关闭按钮
			$("#closeWindow").on("click",function(){
				$("#nomalTemplate").val("");
				$("#smsContent").val("");
				$(".t-popup").css("display","none");
			})
		}
		
		//提交按钮绑定事件
		var submitButton = function(){
			$("#nomalTemplate").val("");
			$("#smsContent").val("");
			//界面隐藏
			$(".t-popup").css("display","none");
		}
		//取消按钮绑定事件
		var cancelButton = function(){
			$("#nomalTemplate").val("");
			$("#smsContent").val("");
			//界面隐藏
			$(".t-popup").css("display","none");
		}
		
		//查询按钮方法
		var searchButton = function(){
			validationForQuery(list);
		};
		//重置按钮方法
		var resetButton = function(){
			//重置时间
			new MyDate(dateConfig);
			$("#appendServiceContent").val("");
			$("#srTypeId").val("");
			$("#focusProblemType").val("");
			$("#subsNumber").val("");
			$("#subsCity1").val("");
			$("#subsCity2").val("");
		};
		
		//初始化数据字典加载方法
		var dictionaryInit = function()
		{
			loadDictionary('staticDictionary_get','HEBEI.DIC.PROCESSSTATE','processState');//加载工单状态
			
			loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.TYPE', 'wrkfmTypeCd');//加载业务类型信息
			
			loadDictionary('staticDictionary_get', 'HEBEI.QUESTION.TYPE', 'focusProblemType'); //加载集中问题分类信息
		}
		
		//list查询方法（带校验）
		var validationForQuery = function(list)
		{	
			var acceptTimeStart =  $("input[name='acceptTimeStart']")[0].value;
			var acceptTimeEnd =  $("input[name='acceptTimeEnd']")[0].value;
			var appendServiceContent = $("#appendServiceContent").val();
			var srTypeId = $("#srTypeId").val();
			var focusProblemType = $("#focusProblemType").val();
			var subsNumber = $("#subsNumber").val();
			var subsCity1 = $("#subsCity1").val();
			var subsCity2 = $("#subsCity2").val();
			var wrkfmTypeCd = $("#wrkfmTypeCd").val();
			
			if(acceptTimeStart == null || acceptTimeStart == "")
			{
				crossAPI.tips("开始时间不能为空",3000);
				return;
			}
			
			if(acceptTimeEnd == null || acceptTimeEnd == "")
			{
				crossAPI.tips("结束时间不能为空",3000);
				return;
			}
			
			var starTime = new Date(acceptTimeStart.replace(/-/g,"/"));
			var endTime = new Date(acceptTimeEnd.replace(/-/g,"/"));
			var m = (endTime.getTime()-starTime.getTime())/(1000*60*60*24);
			
			if(m<0)
			{
				crossAPI.tips("结束时间需要大于开始时间",3000);
				return ;
			}
			if(m>30)
			{
				crossAPI.tips("请查30天内消息",3000);
				return ;
			}
			
			var params = {
					"acceptTimeStart":acceptTimeStart,
					"acceptTimeEnd":acceptTimeEnd,
					"appendServiceContent":appendServiceContent,
					"srTypeId":srTypeId,
					"focusProblemType":focusProblemType,
					"subsNumber":subsNumber,
					"subsCity":subsCity2,
					"staffId":staffId,
					"wrkfmTypeCd":wrkfmTypeCd
			};
			list.search(params);
			$(".checkAllWraper>input").prop("checked",false);
		}
		
		//展示已批量认领的工单列表信息
		var batchWorkItemInfoList=function(){
			var config = {
				el:$('#listContainer'),
			    field:{
			    	boxType:'checkbox',
			        key:'id',
			        items: [
                            {text:'业务类型',name:'wrkfmTypeCd',
                            	render:function(item,val){
                            		return loadDictionaryForList('staticDictionary_get', 'HEBEI.WF.ORDER.TYPE',val);//加载业务类型信息
                            	}},
                            {text:'工单流水号',name:'serialno',className:'blueandpointer',
                            		render:function(item,val)
                            		{
                            			return "<a>"+val+"</a>";
                            		},
                            		click:function(e,item)
                            		{
                            			openDetails(item);
                            		}},
                            {text:'服务请求类别',name:'bizTypeId'},
                            {text: '星级信息', name: 'starLevel',
                            	render:function(item,val){
                            		return loadDictionaryForList('staticDictionary_get','HEBEI.CUSTOM.LEVEL',val);
                            	}},
                            {text:'联系电话',name:'contactPhone1'},
                            {text:'受理号码',name:'subsNumber'},
                            {text:'建单时间',name:'createDate'},
                            {text:'紧急程度',name:'urgentId',
                            	render:function(item,val){
                            		return loadDictionaryForList('staticDictionary_get','HEBEI.EDUCATION.TYPE',val);
                            	}},
                            {text:'处理组',name:'groupName'},
                            {text:'操作状态',name:'operstatus',
                            	render:function(item,val){
                            		return loadDictionaryForList('staticDictionary_get','HEBEI.DIC.OPERASTATUS',val);
                            	}},
                            {text:'是否受理',name:'isDealing',
                            		render:function(item,val){
                            			if(val == "1"){
                            				return "受理";
                            			}else
                            			{
                            				return "未受理"
                            			}
                            		}},
                            {text:'受理人',name:'handlingStaff'},
                           //标记需要使用图标来展示 （目前只有数据） 1.未完成，未超时 （灰色方块）2.未完成，已超时（红色方块）3.未完成未超时（绿色方块）4.已完成已超时（黄色方块）
                            {text:'标记',name:'flag',
                            	render:function(item,val){
                            		if(val == 1)
                            		{
                            			return '<div class="graycolor"></div>';
                            		}
                            		if(val == 2)
                            		{
                            			return '<div class="redcolor"></div>';
                            		}
                            		if(val == 3)
                            		{
                            			return '<div class="greencolor"></div>';
                            		}
                            		if(val == 4)
                            		{
                            			return '<div class="yellowcolor"></div>';
                            		}
                            		// 在classname那里更改class名，然后在agentWorkitems.css里面写该class名规定的样式颜色                           		
                            	}
                            },
                            {text:'是否潜在升级',name:'updateFlag',
                            	render:function(item,val){
                            		return loadDictionaryForList('staticDictionary_get','HEBEI.OR.COMMON',val);
                            	}
                            },
                            {text:'模板Id',name:"templateId",className:"hide"},
                            {text:'当前节点',name:'nodeId',className:"hide"},
                            {text:'当前节点类型',name:'nodeType',className:"hide"},
                            {text:'任务Id',name:'taskId',className:"hide"},
                            {text:'受理号码归宿地',name:'cityCode',className:"hide"},
                            {text:'工作项ID',name:'workItemId',className:'hide'},
                            {text:'',name:'processType',className:'hide'}
                    ]
			    },
			    page:{
			    	customPages:pageArr,
			        perPage:10,    
			        align:'right',
			        total:true,
			        button:{
                        className:'btnStyle',
                        items:[
							{
								text : "已选择0条工单",
								name : 'showMessage',
								click : function(e) {
								}
							},
                            {
                                text:'批量结单',
                                name:'statement',
                                click:statementFuntion
                            }, 
                             {
                                text:'批量下发短信',
                                name:'batchSendMsg',
                                click:batchSendMsg
                            },
                            {
                                text:'批量复核派发',
                                name:'batchRviewSend',
                                click:batchReviewSend
                            },
                             {
                                text:'释放',
                                name:'release',
                                click:releaseButton
                            },
                            {
                                text:'导出',
                                name:'export',
                                click:exportFunction
                            }
                        ]
                    }
			    },
			    data:{
			        url:'/ngwf_he/front/sh/workflow!execute?uid=batchWorkInfoQuery',
			    }
			}
			list = new List(config);
			validationForQuery(list);
			list.on('success',function(result){
			   num = 0;
		   var index =$.inArray(($(".selectPerPage").val()-0),pageArr);
				$(".selectPerPage option").eq(index+1).remove();
			   $(".selectNum>.btnCustom0").html(num); 
			   $(".checkAllWraper>input").prop("checked",false);
			});
			 
			//复选框条数
            $('.checkAllWraper > input').change(function(){
                if($('.checkAllWraper > input').prop("checked")){
                	num = $('.boxWraper > input').length;
                	$(".selectNum>.btnCustom0").html(num);
                }else{
                	num = 0;
                	$(".selectNum>.btnCustom0").html(num);
                }
             });
			//list绑定checkBox改变方法
			list.on('checkboxChange', function(e, item, checkedStatus) {// 事件处理代码
				if (checkedStatus == 1) {
					num++
					if(num==$('.boxWraper > input').length){
						$('.checkAllWraper > input').prop("checked",true);
					};
					$(".selectNum>.btnCustom0").html(num);
				} else {
					num--
					$('.checkAllWraper > input').prop("checked",false);
					$(".selectNum>.btnCustom0").html(num);
				};
			});
		};
		
		
		//为查询条件加载数据字典方法
		 var loadDictionary=function(mothedName,dicName,seleId){
				var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
				var seleOptions="";
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
					$.each(result.beans,function(index,bean){
						seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
					});
					$('#'+seleId).append(seleOptions);
					console.log(result);
				},true);
			};
			//为list集合加载数据字典
			var loadDictionaryForList=function(mothedName,dicName,val){
				var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
				var seleOptions="";
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
					$.each(result.beans,function(index,bean){
						if(val == bean.value)
						{
							seleOptions =  bean.name;
						}
					});
					console.log(result);
				},true);
				
				return seleOptions;
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
			time2 = time2.substr(0,10);
			time2 += " 23:59:59";
			//console.log(time2)
			// 当前时间减去5天为起始时间
			var t = nowDate.getTime() - 5 * 24 * 60 * 60 * 1000;
			var time1 = new Date(t).Format("yyyy/MM/dd hh:mm:ss");
			time1 = time1.substr(0,10);
			time1 += " 00:00:00";
			var dateConfig = {
					el : $('#createTime'),
					label : '开始时间',
					double : { // 支持一个字段里显示两个日期选择框
						start : {
							name : 'acceptTimeStart',
							format : 'YYYY/MM/DD hh:mm:ss',
							defaultValue:time1, //默认日期值
							//min: laydate.now(-1),
							//max : '2099/06/16 23:59:59',
							istime : true,
							istoday : false,
						choose: function(datas){
						//this.end.min = datas; //设置结束日期的最小限制
						//this.end.start = datas; //设置结束日期的开始值
						}
						},
						end : {
							name : 'acceptTimeEnd',
							format : 'YYYY/MM/DD hh:mm:ss',
							defaultValue:time2, //默认日期值
							//min: laydate.now(-1),
							//max : '2099/06/16 23:59:59',
							istime : true,
							istoday : false
						}
					}
				};
			var date1 = new MyDate(dateConfig);
	
			//导出方法
			var exportFunction = function(e)
			{
				var acceptTimeStart =  $("input[name='acceptTimeStart']")[0].value;
				var acceptTimeEnd =  $("input[name='acceptTimeEnd']")[0].value;
				var appendServiceContent = $("#appendServiceContent").val();
				var srTypeId = $("#srTypeId").val();
				var focusProblemType = $("#focusProblemType").val();
				var subsNumber = $("#subsNumber").val();
				var subsCity1 = $("#subsProvince").val();
				var subsCity2 = $("#subsCity").val();
				var wrkfmTypeCd = $("#wrkfmTypeCd").val();
				
				if(acceptTimeStart == null || acceptTimeStart == "")
				{
					crossAPI.tips("开始时间不能为空",3000);
					return;
				}
				
				if(acceptTimeEnd == null || acceptTimeEnd == "")
				{
					crossAPI.tips("结束时间不能为空",3000);
					return;
				}
				
				var starTime = new Date(acceptTimeStart.replace(/-/g,"/"));
				var endTime = new Date(acceptTimeEnd.replace(/-/g,"/"));
				var m = (endTime.getTime()-starTime.getTime())/(1000*60*60*24);
				
				if(m<0)
				{
					crossAPI.tips("结束时间需要大于开始时间",3000);
					return ;
				}
				if(m>30)
				{
					crossAPI.tips("请查30天内消息",3000);
					return ;
				}
				 
				var params = {
						"acceptTimeStart":acceptTimeStart,
						"acceptTimeEnd":acceptTimeEnd,
						"appendServiceContent":appendServiceContent,
						"srTypeId":srTypeId,
						"focusProblemType":focusProblemType,
						"subsNumber":subsNumber,
						"subsCity":subsCity2,
						"staffId":staffId,
						"wrkfmTypeCd":wrkfmTypeCd
				};
				var url = mapToUrl(params);
				window.open(url);
			};
		
			var mapToUrl = function(map)
			{
				var url = "/ngwf_he/front/sh/wordExport!batchDealWorkExport?uid=batchDealWorkExport";
				for(var key in map)
				{
					url += "&"+key+"="+map[key];
				}
				return url;
			}
			
			
			//得到选中的id
			var getSelectedId = function()
			{
				var id = "";
    			//得到所有的checkBox
    			var $checkBoxs = $("input[type='checkBox']");
    			//去掉第一个checkBox，全选checkBox i=1
    			for(var i=1;i<$checkBoxs.length;i++)
    			{
    				//如果被选中
    				if($checkBoxs[i].checked)
    				{
    					id += ","+$checkBoxs[i].value;
    				}
    			}
    			
    			if(id == "")
    			{
    				crossAPI.tips("请选择至少一条数据",3000);
    				return;
    			}
    			else
    			{
    				//去掉id前面的逗号
    				id = id.substring(1);
    				return id;
    			}
			};
			
			
			//得到选择框中选中的数据
			var getCheckList = function(handlingStaff,handlingDept,handlePer){
				var checkList = list.getCheckedRows();
				var paramsList = "[{";
				for(var i=0;i<checkList.length;i++){
					if(i>0)
					{
						paramsList += ",{";
					}
					paramsList += "'templateId':'"+checkList[i].templateId+"'";
					paramsList += ",'nodeId':'"+checkList[i].nodeId+"'";
					paramsList += ",'workItemId':'"+checkList[i].workItemId+"'"
					paramsList += ",'loginStaffId':'"+staffId+"'";
					paramsList += ",'taskId':'"+checkList[i].taskId+"'";
					paramsList += ",'wrkfmShowSwftno':'"+checkList[i].serialno+"'";
					paramsList += ",'handlingStaff':'"+handlingStaff+"'";
					paramsList += ",'handlingDept':'"+handlingDept+"'";
					paramsList += ",'nodeType':'"+checkList[i].nodeType+"'";
					paramsList += ",'handlePer':'"+checkList[i].handlePer+"'";
					paramsList += ",'serialno':'"+checkList[i].serialno+"'";
					paramsList += ",'cityCode':'"+checkList[i].cityCode+"'";
					paramsList += ",'loginStaffName':'"+staffName+"'";
					paramsList += ",'processType':'"+checkList[i].processType+"'";
					paramsList += "}";
				}
				paramsList += "]";
				var params = {"paramsList":paramsList};
				return params;
			}
			
			//批量结单按钮
			var statementFuntion = function(){
				var paramInfo = list.getCheckedRows(); 
				   if(paramInfo.length == 0)
				   {
					   crossAPI.tips("请至少选择一条数据",3000);
					   return;
				   }
				var params = getCheckList("","","");
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=batchStatement',params,function(result){
					crossAPI.tips(result.returnMessage,3000);
					validationForQuery(list);
				});
			}
			//批量发送信息按钮绑定
			var batchSendMsg = function(){
				var paramInfo = list.getCheckedRows(); 
				   if(paramInfo.length == 0)
				   {
					   crossAPI.tips("请至少选择一条数据",3000);
					   return;
				   }
				$(".t-popup").css("display","block");
				//短信模板下拉框加载
				smsTemplateInit();
			}
			
			//批量复合派发按钮
			var batchReviewSend = function(){
				   var paramInfo = list.getCheckedRows(); 
				   if(paramInfo.length == 0)
				   {
					   crossAPI.tips("请至少选择一条数据",3000);
					   return;
				   }
					var params = getCheckList("","","");
	            	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=batchReview',params,function(result){
	            		crossAPI.tips(result.returnMessage,3000);
	            		validationForQuery(list);
	            		});
			}
			
			//释放按钮绑定方法
			var releaseButton = function(){
					//释放
	            	 var dates = list.getCheckedRows();
						var str = "";
						if (dates.length == 0) {
							crossAPI.tips("请至少选择一条信息!",3000);
							return;
						}
						$.each(dates,function(index,obj){
							str+= obj.serialno + "#"
							+ obj.workItemId + "#"
							+ obj.wrkfmTypeCd
							+ "#" + obj.templateId
							+ "#" + obj.nodeId
							+ ",";
						});
						var date = {
							"workItemIds" : str,
							"dspsStaffNum":staffId,
							"dspsStaffName":staffName
						};
						// console.log(str);
						var url = "/ngwf_he/front/sh/workflow!execute?uid=release001";
						Util.ajax.postJson(url, date, function(
								result, isOk) {
							if (result.returnCode=='0') {
								crossAPI.tips("选择"+dates.length+"条工单,成功释放"+result.bean.successNum+"条工单",3000);
								//loadDataList();
								num = 0;
								$(".btnCustom0").text(num);
							} else {
								crossAPI.tips("释放不成功",3000);
								//loadDataList();
								num = 0;
								$(".btnCustom0").text(num);
							}
							validationForQuery(list);
						});
			};
			IndexLoad(function(index,option){
				_index = index;
				_options = option;
				//员工初始化方法
				CrossAPI.getIndexInfo(function(info){
		        	staffId=info.userInfo.staffId;
		        	staffName=info.userInfo.staffName;
		        	init();
		        });
			});	
});