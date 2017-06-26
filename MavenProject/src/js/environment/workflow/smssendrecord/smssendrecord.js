define(['Util','list','dialog','date','validator'],   
	function(Util,List,Dialog,Date,Validator ){
		var list;
		var initialize = function(){
		    	eventInit();
		    	ctiList({});
		    	};		
		
		 var eventInit=function(){			
			 $('#recordSearch').on('click',recordSearchInfo);
			 $('#recordReset').on('click',recordResetInfo);
			 $('#recordExport').on('click',recordExportInfo);			  
		 };
				
		 //导出数据按钮
	     var recordExportInfo = function(){
	    	 excelExport();
			    
	     }
	     //获取所有查询的参数
	     var wrapParams = function(){
	    	 var staffName = $("input[name='staffName']")[0].value;
			 var sdNum = $("input[name='sdNum']")[0].value;
			 var startTime = $("input[name='startTime']")[0].value;
			 var endTime = $("input[name='endTime']")[0].value;			 
			 var data = {
					"staffName":staffName,
					"sdNum": sdNum,
					"startTime": startTime,
					"endTime": endTime
			 };
			 return data;
	     }
	     
		 //重置按钮
		 var recordResetInfo = function (){		 	
			 $("input[name='staffName']")[0].value='';
			 $("input[name='sdNum']")[0].value='';
			 $("input[name='startTime']")[0].value='';
			 $("input[name='endTime']")[0].value='';
			 ctiList({});
			
		 };
		 //查询按钮事件
		 var recordSearchInfo = function (){
			 var staffName = $("input[name='staffName']")[0].value;
			 var sdNum = $("input[name='sdNum']")[0].value;
			 var startTime = $("input[name='startTime']")[0].value;
			 var endTime = $("input[name='endTime']")[0].value;			 
			 var data = {
					"staffName":staffName,
					"sdNum": sdNum,
					"startTime": startTime,
					"endTime": endTime
			 };
			 ctiList(data);
		 };
		
		 var num = 0; // 复选框选择工单条数
		 
		 var date=new Date({
				el:$('#startTime'),
	            label:'',
	            name:'startTime',    //开始日期文本框name
	            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
	            defaultValue:'',     //默认日期值
				max : '2099-06-16 23:59:55',
	            istime: true,    
	            istoday: false,
	            choose:function(){
	            }
			});
			var enddate=new Date({
				el:$('#endTime'),
	            label:'',
	            name:'endTime',    //结束日期文本框name
	            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
	            defaultValue:'',     //默认日期值
				max : '2099-06-16 23:59:55',
	            istime: true,    
	            istoday: false,
	            choose:function(){
	            }
			});
		//加载历史预警信息列表
			var ctiList = function(data){
				var config = {
						el:$('#listContainer'),
					    field:{ 
							boxType : 'checkbox',
					        key:'id',         		        	
					        items: [
					                {text: '操作人',name:'sdStaffName'},
					                {text: '发送时间',name:'sdTime'},
					                {text: '发送号码',name:'sdNum'},
					                {text: '发送内容',name:'sdCntt'}	                            
		                    ]
					        
					    },
					    page:{
					        perPage:10,    
					        align:'right' ,
					        total : true,
					        button : {
								className : 'operateButtons',
								// url:'../js/list/autoRefresh',
								items : [
										{
											text : "已选择0条工单",
											name : '',
											click : function(e) {
												
											}
										}
																			
										 ]
							}
					    },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=querySmsSenderRecord'
					    }
					}
				var list = new List(config);
				list.search(data);
				//全选 统计条数；
				$(' th input[type=checkbox]',$el).on('click',function(e){
		            var checkedAll = $(e.currentTarget).prop(':checked');
		            if(checkedAll){
		            	$(".btnCustom0").val("已选择" + list.total + "条工单");
		            	num =list.total;
		            }
		            else{
		            	$(".btnCustom0").val("已选择0条工单");
		            	num=0;
		            }
		            	
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
			}
			var excelExport=function(){
					//定义导出excel查询类型（需要修改）
					var queryType="02";
					require(['js/workflow/common/exportExcelAlert'],function(ex){
		    			excel = new ex();
		    			//定义点击确定 按钮执行的事件（应为带着arr参数以及页面参数去请求excel文件下载）
		    			excel.confirm=function(arr){
		    				var downloadUrl="/ngwf_he/front/sh/smsExport!smsExport?uid=querySmsSenderRecordAll&columns="+arr;
		    				//获取json格式的参数
		    				var pageParams=wrapParams();
		    				//将参数添加到请求地址之后
		    				for(key in pageParams){
		    					var value=pageParams[key];
		    					if(value!=null&&value!=undefined&&value.trim()!=''){
		    						downloadUrl+="&"+key+"="+value;
		    					}
		    				}
		    				//下载excel资源
		    				console.log(downloadUrl);
		    				location.href=downloadUrl;
		    			}
						excel.eventInit(queryType);
		    		  });
			}
			return initialize();
});