define(['Util','select','indexLoad',"detailPanel","jquery",'dialog',
        'text!module/workflow/badwordorderDetail/closeSupplement.html',
        'style!css/workflow/outlayer/stageProcessing.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Dialog,Html_dealUrge){
		var $el;
		var _index;
		var _options;
		var content;
		
		
		var initialize = function(options){
			$el = $(Html_dealUrge);			
			_options=options;						
			this.width=550;
			this.height=130;
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		remaind_submit : function(){
			var nodeData = {
							
							"wrkfmId":_options.wrkfmId,//流程实例Id							
							"closeSupplement":$('#content',$el).val()//内容
							
					        }
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/workflow!execute?uid=addCloseSupplement',
					          nodeData, function(json, status) {
					        
					        if(json.returnCode=="0"){
					        	 crossAPI.tips("操作成功！",3000);
					        }else{
					        	 crossAPI.tips("操作失败,请联系管理员",3000);
					        }					
			})
		}
	});
	return initialize;
});