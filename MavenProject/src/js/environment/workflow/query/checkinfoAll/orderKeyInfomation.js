define(['Util','list','date','validator'],   
	function(Util,List,MyDate,Validator){
		var list;
		var processState;
		//全局变量查询默认间隔最大时间
		var day;
		//获取系统参数配置			
		$.ajax({
			url:'/ngwf_he/front/sh/workflow!execute?uid=getSystemParams',
			//data:{'itemId':'221002001'},
			dataType:"json",
			async:false,
			success:function(result){
				
				day=result.beans[0].value;
				console.log('day======='+day)
			}
		});	
		var initialize = function(){
		    	eventInit();
		    	loadDataList();
		};		
		
		 var eventInit=function(){
			 
			 
		 };

         // 添加时间对象原形.设置时间格式;
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
			$(function(){
				console.log(day)
				//设置时间
				var nowDate = new Date();
				var time2 = nowDate.Format("yyyy/MM/dd hh:mm:ss");
				console.log(time2)
				// 当前时间减去31天为起始时间
				var t = nowDate.getTime() - day * 24 * 60 * 60 * 1000;
				var time1 = new Date(t).Format("yyyy/MM/dd hh:mm:ss"); 
			 
				 
//				 建单开始时间
				var date=new MyDate({
					el:$('#harry_buildstartTime'),
		            label:'建单开始时间',
		            name:'buildStartTime',    //开始日期文本框name
		            format: 'YYYY/MM/DD hh:mm:ss',    //日期格式
		            defaultValue:time1,     //默认日期值
					max : '2099/06/16 23:59:59',
		            istime: true,    
		            istoday: false,
		            choose:function(){
		            }
				});
//				建单结束时间
				var enddate=new MyDate({
					el:$('#harry_buildendTime'),
		            label:'建单结束时间',
		            name:'buildEndTime',    //结束日期文本框name
		            format: 'YYYY/MM/DD hh:mm:ss',    //日期格式
		            defaultValue:time2,     //默认日期值
					max : '2099/06/16 23:59:59',
		            istime: true,    
		            istoday: true,
		            choose:function(){
		            	
		            }
				});
//				归档开始时间
				var enddate=new MyDate({
					el:$('#com_backstartTime'),
		            label:'归档开始时间',
		            name:'backStartTime',    //结束日期文本框name
		            format: 'YYYY/MM/DD hh:mm:ss',    //日期格式
		            //defaultValue:time1,     //默认日期值
					max : '2099/06/16 23:59:59',
		            istime: true,    
		            istoday: false,
		            choose:function(){
		            }
				});
//				归档结束时间
				var enddate=new MyDate({
					el:$('#com_backendTime'),
		            label:'归档结束时间',
		            name:'backEndTime',    //结束日期文本框name
		            format: 'YYYY/MM/DD hh:mm:ss',    //日期格式
		           // defaultValue:time2,     //默认日期值
					max : '2099/06/16 23:59:59',
		            istime: true,    
		            istoday: true,
		            choose:function(){
		            }
				});
			});	
		
		//加载历史预警信息列表
				var config = {
						el:$('#harryOrderList'),
					    field:{ 
					        key:'id',         		        	
					        items: [
					                {text: '工单流水号',name:'wrkfmShowSwftno'},		                       
		                            {text: '建单时间(月)', name: 'crtTime',
					                	render:function(item,val,$src){
					                		if(val.length!='0'){
					                			var yearTime=val.substring(0,4);
					                			var monthTime=val.substring(5,7);
					                			return yearTime+'年'+monthTime+'月';
					                		}
		                                }
		                            },
		                            {text: '建单时间(日)', name: 'crtTime',
		                            	render:function(item,val,$src){
		                            		if(val.length!='0'){
		                            			var dayTime=val.substring(8,10);
		                            			return dayTime+'日';
		                            		}
		                            	}
		                            
		                            },
		                            {text: '建单时间(精确到秒)', name: 'crtTime',
		                            	render:function(item,val,$src){
		                            		if(val.length!='0'){
		                            			var dayTime=val.substring(11,19);
		                            			return dayTime;
		                            		}
		                            	}
		                            
		                            },
		                            {text: '受理方式', name: 'acptModeCd'},
		                            {text: '受理号码', name: 'acptNum'},
		                            {text: '联系电话', name: 'fstConcTelnum'},
		                            {text: '业务类型', name: 'wrkfmTypeCd'},
		                            {text: '投诉类型', name: 'srvReqstTypeId'},
		                            {text: '投诉途径', name: 'cmplntsWayNm'},
		                            {text: '建单人单位', name: 'orgaName'},
		                            {text: '建单人部门', name: 'deptName'},
		                            {text: '建单人所属组', name: 'groupName'},
		                            {text: '建单人', name: 'staffName'},
		                            {text: '建单是否超时', name: 'crtTimeIsOver'},//受理时间-创建时间
		                            {text: '受理地市', name: 'acptCityCode'},
		                            {text: '受理号码归属地', name: 'acptNumBelgCityCode'},
		                            {text: '是否疑难投诉', name: 'difcltCmplntsFlag',
		                            	render:function(item,val,$src){
		                            	}
		                            },
		                            {text: '终端设备厂家', name: 'trmnTypeCd'},//
		                            {text: '终端设备类型', name: 'trmnTypeCd'},
		                            {text: '星级信息', name: 'custStargrdCd'},
		                            {text: '来源序号', name: 'wrkfmId'},
		                            {text: '投诉内容', name: 'bizCntt'},
		                            {text: '工单状态', name: 'orderState'},
		                            {text: '当前处理人', name: 'curentHandler'},
		                            {text: '当前处理人所在组', name: 'curentHandGroup'},
		                            {text: '当前处理人所在部门', name: 'curentHandDepart'},//
		                            {text: '当前处理人所在单位', name: 'curentHandOrga'},//
		                            {text: '归档时间(月)', name: 'arcTime',//2017-04-09 14:45:44.0
		                            	render:function(item,val,$src){
		                            		if(val!=null && val!="" && val!=undefined){
					                			var yearTime=val.substring(0,4);
					                			var monthTime=val.substring(5,7);
					                			return yearTime+'年'+monthTime+'月';
					                		}
		                                }
		                            },
		                            {text: '归档时间(日)', name: 'arcTime',
		                            	render:function(item,val,$src){
		                            		if(val!=null && val!="" && val!=undefined){
		                            			var dayTime=val.substring(8,10);
		                            			return dayTime+'日';
		                            		}
		                            	}
		                            },
		                            {text: '归档时间(具体到秒)', name: 'arcTime',
		                            	render:function(item,val,$src){
		                            		if(val!=null && val!="" && val!=undefined){
		                            			var dayTime=val.substring(11,19);
		                            			return dayTime;
		                            		}
		                            	}
		                            },
		                            {text: '预设处理组', name: 'preGroupName'},
		                            {text: '预设处理组(人员信息)', name: 'preGroupStaffName'},
		                            {text: '预设处理组归属部门', name: 'preGroupDepart'},//
		                            {text: '预设处理组归属单位', name: 'preGroupOrga'},//
		                            {text: '是否自动派单', name: 'isAutoDistrubute'},//
		                            {text: '首次接单人', name: 'firstConnectOrderStaff'},
		                            {text: '首次接单人组', name: 'firstConnectOrderGroup'},
		                            {text: '首次接单人单位', name: 'firstConnectOrderDepart'},//
		                            {text: '首次接单人部门', name: 'firstConnectOrderOrga'},//
		                            {text: '首次接单人结束动作', name: 'firstConnectOrderNodeNm'},
		                            {text: '首次处理人', name: 'firstHandOrderStaff'},
		                            {text: '首次处理组', name: 'firstHandOrderGroup'},
		                            {text: '首次处理人部门', name: 'firstHandOrderDepart'},
		                            {text: '首次处理人单位', name: 'firstHandOrderOrga'},
		                            {text: '首次处理人结束动作', name: 'firstHandOrderNodeNm'},
		                            {text: '最后处理人', name: 'lastHandStaff'},
		                            {text: '最后处理组', name: 'lastHandGroup'},
		                            {text: '最后处理人部门', name: 'lastHandDepart'},
		                            {text: '最后处理人单位', name: 'lastHandOrga'},
		                            {text: '最后处理人结束动作', name: 'lastHandAction'},
		                            {text: '处理结果', name: 'dspsOpinDesc'},
		                            {text: '反馈是否自动处理', name: 'isAutoFeed'},
		                            {text: '反馈处理人', name: 'feedBackOrderStaff'},
		                            {text: '反馈处理组', name: 'feedBackOrderGroup'},
		                            {text: '反馈处理人部门', name: 'feedBackOrderDepart'},
		                            {text: '反馈处理人单位', name: 'feedBackOrderOrga'},
		                            {text: '反馈处理人结束动作', name: 'feedBackOrderNodeNm'},
		                            {text: '是否抄送', name: 'isCopy',
		                            	render:function(item,val,$src){
		                            		var name=item.copyStaffName;
		                            		if(name!=null && name!="" && name!=undefined){
		                            			return "是抄送";
		                            		}	else{
		                            			return "否";
		                            		}
		                                }
		                            },
		                            {text: '抄送发起人', name: 'copyStaffName'},
		                            {text: '抄送发起组', name: 'copyStaffGroupName'},
		                            {text: '抄送发起部门', name: 'copyStaffdeptName'},
		                            {text: '抄送发起单位', name: 'copyStafforgaName'},
		                            {text: '抄送人', name: 'copyToStaffName'},
		                            {text: '抄送组', name: 'copyToGroupName'},
		                            {text: '抄送部门', name: 'copyToStaffDeptNames'},
		                            {text: '抄送单位', name: 'copyToStaffOragNames'},
		                            {text: '抄送人意见', name: 'copyToStaffOption'},//?
		                            {text: '抄送流程结果', name: 'coptyToResult'},//暂时不显示
		                            {text: '工单整体用时', name: 'workOrderTime'},
		                            {text: '是否超时', name: 'dspsTmoutTlmtTime',
		                            	render:function(item,val,$src){
		                            		if(val==null || val == '' | val== undefined){
		                            			return "否";
		                            		}else{
		                            			return "已超时";
		                            		}	
		                                }
		                            },
		                            {text: '是否重复投诉', name: 'dplctCmplntsTmsCnt',//!
		                            	render:function(item,val,$src){
		                            		if(val=='1' ){
		                            			return "是";
		                            		}else{
		                            			return "否";
		                            		}	
		                                }
		                            },
		                            {text: '工单流转次数', name: 'rotateTmsCnt'},
		                            {text: '是否震荡工单', name: 'vibrateflag',
		                            	render:function(item,val,$src){
		                            		if(val=='1'){
		                            			return "是";
		                            		}else{
		                            			return "否";
		                            		}	
		                                }
		                            },
		                            {text: '是否催办', name: 'urgeFlag',
		                            	render:function(item,val,$src){
		                            		if(val==null || val == '' | val== undefined){
		                            			return "否";
		                            		}else{
		                            			return "已催办";
		                            		}	
		                                }
		                            
		                            },
		                            {text: '中途意见添加次数', name: 'adviceCount',
		                            	render:function(item,val,$src){
		                            		return val+'次';
		                                }
		                            
		                            },//
		                            {text: '导致客户投诉原因部门', name: 'resonDepart'},//不显示
		                            {text: '导致客户投诉原因', name: 'complainReason'},
		                           // {text: '导致客户投诉原因2', name: 'disContent2'},//删除
		                            {text: '是否回访', name: 'needRevstFlag',
		                            	render:function(item,val,$src){
		                            		if(val=='1' ){
		                            			return "是";
		                            		}else{
		                            			return "否";
		                            		}	
		                                }
		                            },
		                            {text: '回访方式', name: 'revstModeCd'},
		                            {text: '回访结果', name: 'name'}
		                    ]
					        
					    },
					    page:{
					    	customPages : [5, 15, 20, 30, 50 ],
							perPage : 10,
							total : true,
							align : 'right'  
					    },
					    data:{
					        url:'/ngwf_he/front/sh/orderKeyInfomationAction!execute?uid=queryKeyInfomation'
					    }
					}
				list = new List(config);
				list.on('success',function(result){
                })	
		//查询
			var loadDataList=function(){
				var buildStartTime=$("input[name='buildStartTime']").val();//建单时间
				var buildEndTime=$("input[name='buildEndTime']").val();//建单时间
				var backStartTime=$("input[name='backStartTime']").val();//建单时间
				var backEndTime=$("input[name='backEndTime']").val();//建单时间
				//PROCESS_STATE
				var searchData={
						'buildStartTime':buildStartTime,
						'buildEndTime':buildEndTime,
						'backStartTime':backStartTime,
						'backEndTime':backEndTime
				};
				 
				list.search(searchData)
			}
		//重置按钮
			$('#orderRest').click(function(){
				$('#orderConterForm')[0].reset();
			});
			
		//查询按钮
			$('#orderQuery').click(function(){
				var buildStartTime=$("input[name='buildStartTime']").val();//建单时间
				var buildEndTime=$("input[name='buildEndTime']").val();//建单时间
				var backStartTime=$("input[name='backStartTime']").val();//建单时间
				var backEndTime=$("input[name='backEndTime']").val();//建单时间
				
				//PROCESS_STATE
				var searchData={
						'buildStartTime':buildStartTime,
						'buildEndTime':buildEndTime,
						'backStartTime':backStartTime,
						'backEndTime':backEndTime,
						'processState':'30010004'
				}
				if(form.form()){
            		list.search(searchData);
            	};
			});
		//验证
			 $(function(){
                 var config = {
                    el:$('#orderConterForm'),
                    dialog:true,    //是否弹出验证结果对话框
                    rules:{
                    	buildStartTime:"required|dateTime",  
                    	buildEndTime:"required|dateTime",    
                    	backStartTime:'dateTime',  
                    	backEndTime:"dateTime"        
                    },
                    messages:{
                    	buildStartTime:{ //设置name=startTime 元素的消息
                            required:"建单开始时间必填",            //用户未填写该字段时提示
                            dateTime:"建单开始时间格式不正确"    //日期格式验证失败时提示
                        },
                        buildEndTime:{ //设置name=startTime 元素的消息
                        	required:"建单结束时间必填",            //用户未填写该字段时提示
                        	dateTime:"建单结束时间格式不正确"    //日期格式验证失败时提示
                        },
                        backStartTime:{ //设置name=startTime 元素的消息
                            required:"归档开始时间必填",            //用户未填写该字段时提示
                            dateTime:"归档开始时间格式不正确"    //日期格式验证失败时提示
                        },
                        backEndTime:{ //设置name=startTime 元素的消息
                        	required:"归档结束时间必填",            //用户未填写该字段时提示
                        	dateTime:"归档结束时间格式不正确"    //日期格式验证失败时提示
                        }
                    }
                };
                form = new Validator(config);
                //添加日期时间正则
                form.addMethod('dateTime', function(str){
                	return new RegExp("^\\d{4}(\\-|\\/|\\.)\\d{1,2}\\1\\d{1,2} (([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$").test(str); 
                });
     });
			return initialize();
});