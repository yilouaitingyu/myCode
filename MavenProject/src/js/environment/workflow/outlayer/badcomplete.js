define(['Util','select','indexLoad',"detailPanel","jquery",'dialog',
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/badcomplete.html',
        'style!css/workflow/outlayer/stageProcessing.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Dialog,vars,commonTip,Html_dealUrge){
		var $el;
		var _index;
		var _options;
		var content;
		var processinfo;
		var workItem;
		var commonTip = new commonTip();
		var initialize = function(index, options){
			$el = $(Html_dealUrge);
			_index = index;
			_options=options;
			processinfo = options.processinfo;
			workItem = options.workItem;
			nodeActionInfo = options.nodeActionInfo;
			this.width=550;
			this.height=130;
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		but_commit : function(){
			hildleManId = "";
            hildleGroupId = "";
			var varMap = vars.varsOfWorkflow(nodeActionInfo,hildleGroupId,hildleManId);
			var nodeData = {
							"wrkfmId":processinfo.wrkfmId,
							"workItemId":workItem.workItemId,
							"wrkfmShowSwftno":processinfo.wrkfmShowSwftno,
			        		"processDefId":processinfo.seqprcTmpltId,
			        		"nodeId":nodeActionInfo.nodeId, //或者是 activityParentId
			        		"nodeType":nodeActionInfo.nodeType,
			        		"nextNodeId":nodeActionInfo.activityId, 
			        		"nodeNm":nodeActionInfo.nodeName,
			        		"nextNodeNm":nodeActionInfo.activityName,
			        		"taskId":workItem.workItemIstncId,
			        		"loginStaffId":_options.loginStaffId,
			        		"loginStaffName":_options.loginStaffName,
			        		"handlingRole":hildleGroupId,
			        		"handlingStaff":hildleManId,
			        		"operateType":"0010",
			        		"content":$('#content',$el).val(),//内容
					        "causeType":"",
					        "processType":processinfo.wrkfmTypeCd,
					        "vars":varMap
					        }
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/workflow!execute?uid=complete',
					          nodeData, function(json, status) {
					        console.log(json);
					        if(json.returnCode=="0"){
					        	commonTip.text({text:"操作成功！"},function(){
					        		crossAPI.destroyTab('工单详情');
					        	})

					        }else{
					        	commonTip.text({text:"操作失败，请联系管理员！"});
//					        	 
					        }					
			})
		}
	});
	return initialize;
});