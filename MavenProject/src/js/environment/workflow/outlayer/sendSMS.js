define(['Util','select','indexLoad',"detailPanel",
        'text!module/workflow/outlayer/sendSMS.html',
        'style!css/workflow/outlayer/sendSMS.css'],   
	function(Util,Select,IndexLoad,DetailPanel,Html_dealUrge){
	var $el;
	var _index;
	var _options;
		var initialize = function(index, options){
			$el = $(Html_dealUrge);
			_index = index;
			_options=options;
			this.content = $el;
			this.eventInit(this);
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		eventInit:function(){
    		var dateagain=new Date({
    		el:$('#starttime', $el),
    		label:'',
        	name:'datetime',    //开始日期文本框name
        	format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
        	defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
			istime: true,    
        	istoday: false,
        	choose:function(){
        		 this.end.min = datas;     //设置结束日期的最小限制
                 this.end.start = datas;     //设置结束日期的开始值
        	}
    	});
	  }
	});
		
	return initialize;

});