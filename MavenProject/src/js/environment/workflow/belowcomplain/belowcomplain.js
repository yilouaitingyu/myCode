define(['jquery'],   
	function($){
		var list;
		var initialize = function(){
		    	eventInit();
		};		
		
		 var eventInit=function(){
			 $('#message_addfind').on('click',messageaddFind);//弹出新增修改页面
		 };
//		弹出新增修改页面
		 var messageaddFind = function(){
			 $('#below_addchange').addClass('show').removeClass('hide');
		 };
		 
		 
			return initialize();
});