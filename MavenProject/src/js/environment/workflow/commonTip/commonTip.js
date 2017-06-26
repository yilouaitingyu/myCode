define(['Util','select','indexLoad',"detailPanel",
        'text!module/workflow/commonTip/commonTip.html',
        'style!css/workflow/commonTip/commonTip.css'],   
	function(Util,Select,IndexLoad,DetailPanel,Html_dealUrge){
	var $el,
	   _data;
		var initialize = function(){
		 $el = $(Html_dealUrge);
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
          text:function(data,callback){
        	  //设置body  relative
        	  $("body").css("position","relative");
        	  if(data.text){
        		  $("#commonContent p",$el).html(data.text) 
        	  }
        	 $("body").append($el);
        	  //获取中间层宽度设置wrap的宽度
             
        	 var contentWidth = $("#commonContent").width();
        	 var wrapHeight = $("#commonWrap").height();
        	 $("#commonWrap").css({
        		 "width":contentWidth+"px",
        		 "margin-left":-(contentWidth/2)+"px",
        		 "margin-top":-(wrapHeight/2)+"px",
        		 "visibility":"visible",
        	 });
        	 $("#hideAlert",$el).on("click",function(){
        		 if(callback){
        			 (callback)()
        		 }
	    		 $el.remove();
	    		 
	    	 });
	    
          },
      //点击确定的时候删除刚才添加的弹框
	
	    	
		});
	return initialize;
});