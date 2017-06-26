define(['Util', 'select', 'indexLoad', "detailPanel", "jquery", 'dialog', 'js/workflow/processinfoDetail/varsOfWorkflow', 'text!module/workflow/outlayer/directReply.html', 'style!css/workflow/outlayer/directReply.css'],
function(Util, Select, IndexLoad, DetailPanel, $, Dialog, vars, Html_basicMessage) {
    var $el;
    var _index;
    var _options;
    var content;
    var nodeActionInfo;
    var processinfo;
    var workItem;
    var initialize = function(index, options) {
        $el = $(Html_basicMessage);
        _index = index;
        _options = options;
        nodeActionInfo = options.nodeActionInfo;
        processinfo = options.processinfo;
        workItem = options.workItem;
        this.dictionaryInit();
        this.content = $el;

    };
    $.extend(initialize.prototype, {
        //动态获取下拉框
        loadDictionary: function(mothedName, dicName, seleId) {
            var params = {
                method: mothedName,
                paramDatas: '{typeId:"' + dicName + '"}'
            };
            var seleOptions = "<option value=''>请选择</option>";
            Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF', params, function(result) {
                $.each(result.beans, function(index, bean) {
                    seleOptions += "<option value='" + bean.value + "'>" + bean.name + "</option>"
                });
                $('#' + seleId, $el).append(seleOptions);
            },
            true);
        },
        dictionaryInit: function() {
        	this.loadDictionary('staticDictionary_get', 'HEBEI.COMPLAINT.CAUSE', 'dr_complainReason'); //导致客户投诉原因
        }
    });

    return initialize;
});