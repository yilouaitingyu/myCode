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
			 var params = {
						method : 'staticDictionary_get',
						paramDatas : '{typeId:"HEBEI.DIC.PROCESSTYPE"}'
					};
					var seleOptions = "";
					Util.ajax.postJson('/ngwf/front/sh/common!execute?uid=callCSF',
							params, function(result) {
							console.log(result)
							 processState=result.beans;
							 console.log(processState)
							}, true);
				
			 
			 
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
		            defaultValue:time1,     //默认日期值
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
		            defaultValue:time2,     //默认日期值
					max : '2099/06/16 23:59:59',
		            istime: true,    
		            istoday: true,
		            choose:function(){
		            }
				});
			});	
		
		//加载历史预警信息列表
				var num=0;
				var config = {
						el:$('#harryOrderList'),
					    field:{ 
					        key:'id',         		        	
					        items: [{text: '序号',name:'',
					        		render:function(){
					        			return num+=1;
                            		}},
					                {text: '工单流水号',name:'wrkfmShowSwftno'},		                       
		                            {text: '业务类型', name: 'wrkfmTypeCd'},
		                            {text: '投诉类型', name: 'srvReqstTypeId'},
		                            {text: '催办人',name:'staffName'},
		                            {text: '催办人所在组',name:'reminderGroupName'},
		                            {text: '催办人所在部门',name:'reminderDeptName'},
		                            {text: '催办人所在单位',name:'reminderOrgaName'},
		                            {text: '被催办人',name:'toReminderName'},
		                            {text: '被催办人所在组',name:'toReminderGroupName'},
		                            {text: '被催办人所在部门',name:'toReminderDeptName'},
		                            {text: '被催办人所在单位',name:'toReminderOrgaName'}
		                    ]
					        
					    },
					    page:{
					    	customPages : [5, 15, 20, 30, 50 ],
							perPage : 10,
							total : true,
							align : 'right'  
					    },
					    data:{
					        url:'/ngwf_he/front/sh/orderReminderAction!execute?uid=queryReminderOrder'
					    }
					}
				list = new List(config);
				list.on('success',function(result){
					num=0
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
						'backEndTime':backEndTime,
						'processState':'30010004'
				}
				num=0;
				list.search(searchData)
			}
		//重置按钮
			$('#orderRest').click(function(){
				$("input[name='buildStartTime']").val(" ");
				$("input[name='buildEndTime']").val(" ");
				$("input[name='backStartTime']").val(" ");
				$("input[name='backEndTime']").val(" ");
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
                    	buildStartTime:"dateTime",  
                    	buildEndTime:"dateTime",    
                    	backStartTime:'dateTime',  
                    	backEndTime:"dateTime"        
                    },
                    messages:{
                    	buildStartTime:{ //设置name=startTime 元素的消息
                            dateTime:"建单开始时间格式不正确"    //日期格式验证失败时提示
                        },
                        buildEndTime:{ //设置name=startTime 元素的消息
                        	dateTime:"建单结束时间格式不正确"    //日期格式验证失败时提示
                        },
                        backStartTime:{ //设置name=startTime 元素的消息
                            dateTime:"归档开始时间格式不正确"    //日期格式验证失败时提示
                        },
                        backEndTime:{ //设置name=startTime 元素的消息
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