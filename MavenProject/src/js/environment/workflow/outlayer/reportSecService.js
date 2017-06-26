define(['Util','select','indexLoad',"detailPanel",
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/reportSecService.html',
        'style!css/workflow/outlayer/reportSecService.css'],   
	function(Util,Select,IndexLoad,DetailPanel,commonTip,Html_dealUrge){
	var $el;
	var _index;
	var _options;
	var commonTip = new commonTip();
	var initialize = function(index, options){
		$el = $(Html_dealUrge);
		_index = index;
		_options=options;
		this.width=600;
		this.height=120;
		this.dictionaryInit();
		this.content = $el;
	};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		//下拉框加载数据字典方法
	    loadDictionary:function(mothedName,dicName,seleId){
					var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
					var seleOptions="";
					Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
						$.each(result.beans,function(index,bean){
							seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
						});
						$('#'+seleId,$el).append(seleOptions);
						console.log(result);
					},true);
	    },
	    dictionaryInit: function(){
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.FLOWPATH_TYPE', 'flowType'); //流程类别
//	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.TARGET_PROVINCE', 'targetTwo'); //目标二线
	    },
		but_commit : function(){
			var nodeData = {
					"outDispatchType":"2",
					"csvcSeqprcTypeCd":$("#flowType",$el).val(),
					"targetTwo":$("#targetTwo",$el).val()
					//调用接口需要的参数
			}	
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/workflow!execute?uid=outDispatch01',
					           nodeData, function(json, status) {
					       console.log(json);
					       if(json.returnCode=="0"){
					    	   commonTip.text({text:"操作成功！"});
												crossAPI.destroyTab('工单详情');
					        }else{
					        	commonTip.text({text:"操作失败，请联系管理员！"});
					        }				
			},true)
		}
	});
	return initialize;
});