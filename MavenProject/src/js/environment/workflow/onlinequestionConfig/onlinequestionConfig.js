
define(['jquery'],   
	function($){
		var list;
		var initialize = function(){
		    	eventInit();
		    	onlineList({});
		       
		};		
		
		 var eventInit=function(){
			 $('#onlineaddpop').on('click',onlineaddpop);//点击出现弹框
		 };
		//点击出现弹框
		 var onlineaddpop = function(){
			 $('.t-popup').addClass('show').removeClass('hide');
		 };
		//加载在线问题配置信息列表
			var onlineList = function(data){
				var config = {
						el:$('#onlineList'),
					    field:{ 
					    	boxType:'checkbox',
					        key:'id',         		        	
					        items: [{text: '操作',name:''},		                       
		                            {text: '字段点选列表', name: ''},
		                            {text:'短信出发时限(小时)',name:''},
		                            {text:'用户回复时限(小时)',name:''},
		                            {text: '短信内容', name: ''}
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