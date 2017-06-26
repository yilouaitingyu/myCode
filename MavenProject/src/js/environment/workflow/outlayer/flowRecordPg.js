define(['Util',
        'text!module/workflow/outlayer/flowRecordPg.html',
        'style!css/workflow/outlayer/flowRecordPg.css'],   
	function(Util,Html_flowRecordPg){
	var $el;
	var _index;
	var _options;
		var initialize = function(index, options){
			$el = $(Html_flowRecordPg);
			_index = index;
			_options=options;
			this.content=$el;
		};	
	$.extend(initialize.prototype, {
          
		});

	return initialize;
});