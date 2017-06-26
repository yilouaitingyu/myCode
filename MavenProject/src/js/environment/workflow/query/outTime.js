define(['Util','list','date','selectTree','select','dialog','indexLoad','crossAPI',
        'js/workflow/query/groupDealPage',
        'js/workflow/query/reminderForOutTime',
        'js/workflow/query/reject'],   
	function(Util,List,MyDate,selectTree,Select,Dialog,IndexLoad,CrossAPI,GroupDeal,Reminder,Reject) {
			var _index;
			var _options;
			//员工登陆名字
			var staffId;
			//员工姓名
			var staffName;
			//查询list
			var list;
			
			//初始化方法
			IndexLoad( function(index,option){
				_index = index;
				_options = option;
				CrossAPI.getIndexInfo(function(info){
					staffId=info.userInfo.staffId;
		        	//占时使用
		        	staffId = "chenzheng";
		        	staffName=info.userInfo.staffName;
					//加载数据字典
					dictionaryInit();
					//初始化查询方法
					outTimeListInit();
					//隐藏框初始化
					hideButtonInit();
					//初始化按钮绑定事件
					eventInit();
				});
			});	
			
			
			/**
			 * 初始化按钮绑定事件
			 */
			var eventInit = function()
			{
				//查询按钮绑定事件
				$("#searchButton").on("click",searchButton);
				//重置按钮绑定事件
				$("#restValue").on("click",restValue);
			}
			
			/**
			 * 催办处理
			 */
			var reminderDealButton = function(data)
			{
				var reminder = $("#descriptionForReminder").val();
				var wrkfmShowSwftno = data.serialno;
				var workItemId = data.workItemId;
				var seqprcTmpltId = data.templateId;
				var nodeId = data.nodeId;
				var wrkfmId = data.workId;
				var opStaffNum = staffId;
				var opStaffName = staffName;
				//获取当前登录人
				
				var opRsnTypeCd ="催单";//操作原因类型代码 
				var wrkfmTypeCd ="01"; //工单类型代码
				
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
					'wrkfmTypeCd':wrkfmTypeCd
					
				}
				Util.ajax.postJson(url,date,function(result,isOk) {
									if (result.returnCode=='0') {
										crossAPI.tips('催单成功!',3000)
										
									} else {
										crossAPI.tips("添加催单事由失败",3000);
									}

								});
			}
			/**
			 * 催办页面
			 */
			var reminderDeal = function(e,item)
			{
				 
				var dataInfo = item.data;
	 		  			  var reminder = new Reminder(_index,_options);
	 		  		      var config = {
	 		  		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//	 		  		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
	 		  		            title:'工单催办',     //对话框标题
	 		  		            content:reminder.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
	 		  		            ok:function()
	 		  		            {
	 		  		            	reminderDealButton(dataInfo);
	 		  		            },
	 		  		            okValue: "催办",  //确定按钮的文本
	 		  		            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
	 		  		            cancelValue: '取消',  //取消按钮的文本
	 		  		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
	 		  		            width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
	 		  		            height:400, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
	 		  		            skin:'dialogSkin',  //设置对话框额外的className参数
	 		  		            fixed:false, //是否开启固定定位 默认false不开启|true开启
	 		  		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
	 		  		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
	 		  		        }
	 		  		        var dialog = new Dialog(config);
			}
			
			
			/**
			 * 集团接口查询界面
			 */
			var groupInteQueryPage = function(e,item)
			{
	     			  var groupDeal = new GroupDeal(_index,_options);
	     		      var config = {
	     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//	     		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
	     		            title:"集团查询界面",    //对话框标题
	     		            content:groupDeal.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
	     		            ok:function(){
	     		            	backWorkPageInit(e,item);
	     		            	}, //确定按钮的回调函数 
	     		            okValue: "驳回",  //确定按钮的文本
	     		            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
	     		            cancelValue: '取消',  //取消按钮的文本
	     		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
	     		            width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
	     		            height:400, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
	     		            skin:'dialogSkin',  //设置对话框额外的className参数
	     		            fixed:false, //是否开启固定定位 默认false不开启|true开启
	     		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
	     		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
	     		        }
	     		        var dialog = new Dialog(config)
			}
			
			/**
			 * 驳回页面
			 */
			var backWorkPageInit = function(e,item)
			{
				 
					var data = item.data;
					 _options.wrkfmSwftno = data.serialno;
					 _options.workItemId = data.workItemId;
					 _options.prstNodeId = data.nodeId;
					 _options.nodeNm = data.nodeName;
					 _options.lstoneNodeId = data.lastNodeId;
					 _options.seqprcTmpltId = data.templateId;
					 _options.loginStaffId  = staffId;
					 _options.nodeTypeCd = data.nodeType;
					 _options.taskId = data.taskId;
	     			  var reject = new Reject(_index,_options);
	     		      var config = {
	     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//	     		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
	     		            title:"驳回页面",    //对话框标题
	     		            content:reject.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
	     		            ok:function(){
	     		            	//console.log($("#sddasdasd").serializeObject());
	     		            	reject.but_commit();
	     		            	}, //确定按钮的回调函数 
	     		            okValue: "确定",  //确定按钮的文本
	     		            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
	     		            cancelValue: '取消',  //取消按钮的文本
	     		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
	     		            width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
	     		            height:400, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
	     		            skin:'dialogSkin',  //设置对话框额外的className参数
	     		            fixed:false, //是否开启固定定位 默认false不开启|true开启
	     		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
	     		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
	     		        }
	     		        var dialog = new Dialog(config)
			}
			
			/**
			 * 重置按钮绑定事件
			 */
			var restValue = function()
			{
				//工单流水号
				$("#serialno").val("");
				//建单人
				$("acceptstaffname").val("");
				//客户品牌
				$("#clientBrand").val("");
				//客户级别
				$("#customerLevel").val("");
				//受理地区
				$("#acceptArea").val("");
				//紧急程度
				$("#urgentDegree").val("");
				//超时时长
				$("#deadTime").val("");
				//工单类别
				$("#casetypeCode").val("");
				//业务类型
				$("#serviceType").val("");
				//投诉类型
				$("#srTypeId").val("");
				//受理号码
				$("#subsnumber").val("");
				//联系电话1
				$("#contactphone1").val("");
				//主叫号码
				$("#callerno").val("");
				//投诉内容
				$("#complainContent").val("");
				//工单类型
				$("#caseTypeCode").val("");
				//重置时间
				var date1 = new MyDate(dateConfig);
			}
			/**
			 * 查询按钮事件
			 */
			var searchButton = function()
			{
				validationForQuery(list);
			}
			/**
			 * 隐藏框初始化
			 */
			var hideButtonInit = function(){
				$(".iconfont").on("click",function(){
					var displayState = $(".t-columns-group").css("display");
					if(displayState != "none"){
						$(".t-columns-group").css("display","none");
					}
					else{
						$(".t-columns-group").css("display","block");
					}
				});
			}
			/**
			 * 检验查找方法
			 */
			var validationForQuery = function(list){
				//工单流水号
				var serialno = $("#serialno").val();
				//建单人
				var acceptstaffname = $("acceptstaffname").val();
				//建单开始 时间
				var acceptTimeStart =  $("input[name='acceptTimeStart']")[0].value;
				//建单结束时间
				var acceptTimeEnd =  $("input[name='acceptTimeEnd']")[0].value;
				//客户品牌
				var clientBrand = $("#clientBrand").val();
				//客户级别
				var customerLevel = $("#customerLevel").val();
				//受理地区
				var acceptArea = $("#acceptArea").val();
				//紧急程度
				var urgentDegree = $("#urgentDegree").val();
				//超时时长
				var deadTime = $("#deadTime").val();
				//工单类别
				var casetypeCode = $("#casetypeCode").val();
				//业务类型
				var serviceType = $("#serviceType").val();
				//投诉类型
				var srTypeId = $("#srTypeId").val();
				//受理号码
				var subsnumber = $("#subsnumber").val();
				//联系电话1
				var contactphone1 = $("#contactphone1").val();
				//主叫号码
				var callerno = $("#callerno").val();
				//投诉内容
				var complainContent = $("#complainContent").val();
				//工单类型
				var caseTypeCode = $("#caseTypeCode").val();
				
				var param = {"serialno":serialno,
							"acceptstaffname":acceptstaffname,
							"acceptTimeStart":acceptTimeStart,
							"acceptTimeEnd":acceptTimeEnd,
							"clientBrand":clientBrand,
							"customerLevel":customerLevel,
							"acceptArea":acceptArea,
							"urgentDegree":urgentDegree,
							"deadTime":deadTime,
							"casetypeCode":casetypeCode,
							"serviceType":serviceType,
							"srTypeId":srTypeId,
							"subsnumber":subsnumber,
							"contactphone1":contactphone1,
							"callerno":callerno,
							"complainContent":complainContent,
							"caseTypeCode":caseTypeCode};
				
				list.search(param);
			}
			
			/**
			 * 导出方法
			 */
			var exportFunction = function(){
				var checkList = list.getCheckedRows();
				var selectId = "";
				for(var i=0;i<checkList.length;i++)
				{
					if(i == 0)
					{
						selectId += checkList[i].id;
					}
					else
					{
						selectId += ","+checkList[i].id;
					}
				}
				
				window.open('http://localhost:8080/ngwf_he/front/sh/wordExport!outTimeExport?uid=outTimeExport&selectId='+selectId);
			}
			//数据字典加载方法
			var dictionaryInit = function(){
				//加载客户品牌
				//loadDictionary('staticDictionary_get','HEBEI.DIC.SUBSBRAND','clientBrand');
				//加载客户级别
				//loadDictionary('staticDictionary_get','CSP.PUB.SUBSLEVEL','customerLevel');
			}
			
			//为查询条件加载数据字典方法
			 var loadDictionary = function(mothedName,dicName,seleId){
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
				//初始化查询方法
				var outTimeListInit = function(){
					var config = {
							el:$('#listContainer'),
						    field:{
						    	boxType:'checkbox',
						        key:'id',
						        items: [
			                            {text:'投诉类型',name:'srTypeId',
			                            	render:function(item,val){
			                            		loadDictionaryForList('staticDictionary_get','HEBEI.COMPLAIN.TYPE',val);
			                            	}},
			                            {text:'工单类别',name:'workordertype',
			                            		render:function(item,val){
				                            		loadDictionaryForList('staticDictionary_get','HEBEI.ORDER.TYPE',val);
				                            	}},
			                            {text:'工单流水号', name: 'serialno'},
			                            {text:'星级信息',name:'starLevel',
			                            	render:function(item,val){
			                            		loadDictionaryForList('staticDictionary_get','CSP.PUB.SUBSLEVEL',val);
			                            	}},
			                            {text:'受理号码',name:'subsNumber'},
			                            {text:'建单人',name:'acceptStaffId'},
			                            {text:'紧急程度',name:'urgentId',
			                            	render:function(item,val){
			                            		loadDictionaryForList('staticDictionary_get','HEBEI.EDUCATION.TYPE',val);
			                            	}},
			                            {text:'处理组/人',name:'deptAndStaff'},
			                            {text:'分派时间',name:'createTime'},
			                            {text:'超时时长',name:'outTime'},
			                            {text:'整体时限',name:'expireDate'},
			                            {text:'工作项ID',name:'workItemId',className:'hide'},
			                            {text:'流程模板ID',name:'templateId',className:'hide'},
			                            {text:'节点ID',name:'nodeId',className:'hide'},
			                            {text:'工作项表ID',name:'workId',className:'hide'},
			                            {text:'工单类型',name:'workTypeId',className:'hide'},
			                            {text:'被催办的人',name:'reminder',className:'hide'},
			                            {text:'当前节点名称',name:'nodeName',className:'hide'},
			                            {text:'上一个节点Id',name:'lastNodeId',className:'hide'},
			                            {text:'节点类型',name:'nodeType',className:'hide'},
			                            {text:'任务Id',name:'taskId',className:'hide'},
			                            {text:'',name:'extdId',className:'hide'},
			                            {text:'操作状态',name:'operstatus',
			                            	render:function(item,val){
			                            		loadDictionaryForList('staticDictionary_get','HEBEI.DIC.OPERASTATUS',val);
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
			                            {text:'受理人',name:'acceptStaffNo'},
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
			                            {
			                            	text:'操作',name:'caseTypeCode1',
			                            	render:function(item,val)
			                            	{
			                            			return '<div><a>处理催办</a></div>';
			                            	},
			                            	click:function(e,item)
			                            	{
			                            		reminderDeal(e,item);
			                            	}
			                            },
			                            {
			                            	text:'',name:'caseTypeCode',
			                            	render:function(item,val)
			                            	{
			                            			return '<div><a>集团处理查询</a></div>';
			                            	},
			                            	click:function(e,item)
			                            	{
			                            		 
			                            		groupInteQueryPage(e,item);
			                            	}
			                            }
			                    ]
						    },
						    page:{
						    	customPages:[5,10,15,20,30,50],
						        perPage:10,    
						        align:'right',
						        total:true,
						        button:{
			                        className:'btnStyle',
			                        items:[
										{
											text : "已选择0条工单",
											name : 'showMessage'
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
						        url:'/ngwf_he/front/sh/workflow!execute?uid=outTimeQueryList'
						    }
						}
						list = new List(config);
						validationForQuery(list);
						//复选框条数
			            $('.checkAllWraper > input').change(function(){
			                if($('.checkAllWraper > input').prop("checked")){
			                	num = $('.boxWraper > input').length;
			                	$(".btnCustom0").val("已选择" + num + "条工单")
			                }else{
			                	num = 0;
			                	$(".btnCustom0").val("已选择" + num + "条工单")
			                }
			             });
						//list绑定checkBox改变方法
						list.on('checkboxChange', function(e, item, checkedStatus) {// 事件处理代码
							if (checkedStatus == 1) {
								num++
								$(".btnCustom0").val("已选择" + num + "条工单")
							} else {
								num--
								$(".btnCustom0").val("已选择" + num + "条工单")
							}
						})
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
				//console.log(time2)
				// 当前时间减去30天为起始时间
				var t = nowDate.getTime() - 30 * 24 * 60 * 60 * 1000;
				var time1 = new Date(t).Format("yyyy/MM/dd hh:mm:ss");
				var dateConfig = {
						el : $('#startTime'),
						label : '建单时间',
						double : { // 支持一个字段里显示两个日期选择框
							start : {
								name : 'acceptTimeStart',
								format : 'YYYY/MM/DD hh:mm:ss',
								defaultValue:time1, //默认日期值
								istime : true,
								istoday : false,
							choose: function(datas){
							}
							},
							end : {
								name : 'acceptTimeEnd',
								format : 'YYYY/MM/DD hh:mm:ss',
								defaultValue:time2, //默认日期值
								istime : true,
								istoday : false
							}
						}
					};
				var date1 = new MyDate(dateConfig);
})
