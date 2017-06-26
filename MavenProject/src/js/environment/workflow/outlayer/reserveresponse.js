define(['Util','select','date','indexLoad',"detailPanel",
        'text!module/workflow/outlayer/reserveresponse.html',
        'style!css/workflow/outlayer/reserveresponse.css'],   
	function(Util,Select,Date,IndexLoad,DetailPanel,Html_basicMessage){
	var $el;
	var _index;
	var _options;
		var initialize = function(index, options){
			$el = $(Html_basicMessage);
			_index = index;
			_options=options;
//			this.dateInit();
//			this.regular();
			this.eventInit(this);
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		eventInit:function(){
    		var dateagain=new Date({
    		el:$('#res_calltime', $el),
    		label:'预约回复提醒:',
        	name:'datetime',    //开始日期文本框name
        	format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
        	defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
			istime: true,    
        	istoday: false,
        	choose:function(){
        		
        	}
    	});
	  }
		});
	return initialize;
});