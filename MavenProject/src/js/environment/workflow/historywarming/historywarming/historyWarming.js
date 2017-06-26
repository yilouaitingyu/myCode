define(['Util','list','date'],   
	function(Util,list,Date){
		var list;
		var initialize = function(){
		    	eventInit();
		    	ctiList({});
		       
		};		
		
		 var eventInit=function(){
			 $('#warming_Search').on('click',searchWarmingInfo);
			 $('#warming_Reset').on('click',resetInfo);
		 };
		 
		 //重置按钮
		 var resetInfo = function (){
			 $("#warmingrange").val('');
			 $("#warmingtime").val('');
			 $("#warmingtel").val('');
			 $("#pointclass").val('');
			 $("#pointname").val('');
			 $("#watch").val('');
			 $("#watchtime").val('');
			 $("#endtime").val('');
		 };
		 
		 //查询按钮事件
		 var searchWarmingInfo = function (){
			 var warmingrange = $("#warmingrange")[0].value;
			 var warmingtime = $("#warmingtime")[0].value;
			 var warmingtel = $("#warmingtel")[0].value;
			 var pointclass = $("#pointclass")[0].value;
			 var pointname = $("#pointname")[0].value;
			 var watch = $("#watch")[0].value;
			 var watchtime = $("#watchtime")[0].value;
			 var endtime = $("#endtime")[0].value;
			 var data = {
					"warmingrange":warmingrange,
					"warmingtime": warmingtime,
					"warmingtel":warmingtel,
					"pointclass":pointclass,
					"pointname":pointname,
					"watch":watch,
					"watchtime":watchtime,
					"endtime":endtime
			 };
			 ctiList(data);
		 };
		
		 
		var date=new Date({
			el:$('#warmingtime'),
            label:'',
            name:'warmingtime',    //开始日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
		var enddate=new Date({
			el:$('#endtime'),
            label:'',
            name:'endtime',    //结束日期文本框name
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
						el:$('#historylist'),
					    field:{ 
					        key:'id',         		        	
					        items: [{text: '预警生成时间',name:'warmingtime'},		                       
		                            {text: '预警级别', name: 'warmingrange'},
		                            {text:'预警接收人手机号',name:'warmingtel'},
		                            {text:'指标类型',name:'pointclass'},
		                            {text: '指标名称', name: 'pointname'},
		                            {text:'监控维度',name:'watch'},
		                            {text:'最终执行监控维度',name:'finalwatch'},
		                            {text:'监控周期',name:'watchtime'},
		                            {text:'预警内容',name:'warmingcon'},
		                            {text: '预警状态',name:'warmingsta'},
		                            {text: '预警结束时间',name:'endtime'}
		                    ]
					        
					    },
					    page:{
					        perPage:10,    
					        align:'right'  
					    },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=warming001'
					    }
					}
				this.list = new list(config);
				this.list.search(data);
			}
			return initialize();
});