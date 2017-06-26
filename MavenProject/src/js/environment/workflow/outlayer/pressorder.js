define(['Util','select','indexLoad',"detailPanel",
        'text!module/workflow/outlayer/pressorder.html',
        'style!css/workflow/outlayer/pressorder.css'],   
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