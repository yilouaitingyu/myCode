define(['Util','list','date'],   
	function(Util,list,Date){
		var list;
		var initialize = function(){
		    	eventInit();
		    	messageList({});
		       
		};		
		
		 var eventInit=function(){
		 };
		var date=new Date({
			el:$('#message_starttime'),
            label:'开始时间',
            name:'starttime',    //开始日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
		var enddate=new Date({
			el:$('#message_endtime'),
            label:'结束时间',
            name:'endtime',    //结束日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
		//加载短信信息列表
			var messageList = function(data){
				var config = {
						el:$('#messageList'),
					    field:{ 
					        key:'id',         		        	
					        items: [{text: '操作人',name:'warmingtime'},		                       
		                            {text: '发送时间', name: 'warmingrange'},
		                            {text:'发送号码',name:'warmingtel'},
		                            {text:'发送号码',name:'pointclass'}
		                    ]
					        
					    },
					    page:{
					        perPage:10,    
					        align:'right'  
					    },
					    data:{
					        url:''
					    }
					}
				this.list = new list(config);
				this.list.search(data);
			}
			return initialize();
});