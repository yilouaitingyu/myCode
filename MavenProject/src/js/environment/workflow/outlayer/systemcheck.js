define(['Util','select','indexLoad',"detailPanel",
        'text!module/workflow/outlayer/systemcheck.html',
        'style!css/workflow/outlayer/systemcheck.css'],   
	function(Util,Select,IndexLoad,DetailPanel,Html_basicMessage){
	var $el;
	var _index;
	var _options;
		var initialize = function(index, options){
			$el = $(Html_basicMessage);
			_index = index;
			_options=options;
			this.content = $el;
		};	
	return initialize;
});