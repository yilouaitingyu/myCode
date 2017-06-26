define(['Util','select','indexLoad',"detailPanel","simpleTree","hdb",
        'text!module/workflow/query/reminderForOutTime.html',
        'style!css/workflow/query/reminderForOutTime.css'],   
	function(Util,Select,IndexLoad,DetailPanel,SimpleTree,Hdb,Html_outTime){
	var $el,  //本模板
	    _index, // 本页面的参数,可以和主页面进行数据交互;
	    _options;// 本页面参数,可以和主页面进行数据交互
		var initialize = function(index, options){
			$el = $(Html_outTime);
			_index = index;
			_options=options;
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype,{
        	
		});
	return initialize;
});