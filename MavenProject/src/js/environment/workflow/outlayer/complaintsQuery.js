define(['Util','select','indexLoad','detailPanel',
        'text!module/workflow/outlayer/complaintsQuery.html',
        'style!css/workflow/outlayer/complaintsQuery.css'],   
	function(Util,Select,IndexLoad,DetailPanel,Html_dealUrge){
	var $el;
	var _index;
	var _options;
		var initialize = function(index, options){
			$el = $(Html_dealUrge);
			_index = index;
			_options=options;			
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		
	});
		
	return initialize;

});