define(['crossAPI','Util', 'timer', 'validator', 'select', 'selectTree', 'date', 'indexLoad', "detailPanel", "hdb", 'text!module/workflow/uniqueFactor/businessHandle.html', 'style!css/workflow/uniqueFactor/businessHandle.css'],
function(CrossAPI,Util, Timer, Validator, Select, SelectTree, Mydate, IndexLoad, DetailPanel, Hdb, Html_basicMessage) {
    var $el;
    var _index;
    var _options;
    var _result;
    var _orderInfo;
    var initialize = function(index, options) {
        $el = $(Html_basicMessage);
        _index = index;
        _options = options;
        this.pageInit();
        this.content =$el;
    };
    $.extend(initialize.prototype, {
    	pageInit: function() {
        }
    });
    return initialize;
});