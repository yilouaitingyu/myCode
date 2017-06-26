define(['Util','select','indexLoad',"detailPanel","jquery",'dialog',
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/replyBadsorder.html',
        'style!css/workflow/outlayer/replyEnd.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Dialog,vars,commonTip,Html_dealUrge){
		var $el;
		var _index;
		var _options;
		var content;
		var nodeActionInfo;
		var processinfo;
		var workItem;
		var commonTip = new commonTip();
		var initialize = function(index, options){
			$el = $(Html_dealUrge);
			_index = index;
			_options=options;
			nodeActionInfo = options.nodeActionInfo;
			processinfo = options.processinfo;
			workItem = options.workItem;
			this.dictionaryInit();
			this.height=30;
			this.width=350;
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
					},true);
	    },
	    dictionaryInit: function(){
	    	this.loadDictionary('staticDictionary_get','WFHEBEI.BADORDER.UNSATISFY','fst_n_satis_rsn_desc'); //评价满意度
	    },
	    
		but_commit : function(){
			hildleManId = "";
            hildleGroupId = "";
            dspsOpinDesc = "";
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
			        "dspsOpinDesc":dspsOpinDesc,
			        "handlingStaff":hildleManId,
			        "operateType":"0052",//处理工单
			        "causeType":"",
			        "description":_options.loginStaffName+"【"+_options.loginStaffId+"】对工单进行"+nodeActionInfo.lineName,
			        "processType":processinfo.wrkfmTypeCd,
			        "vars":varMap,
					"content":$('#content',$el).val()//操作描述
			}
			console.log(nodeData);
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/workflow!execute?uid=replyBadsorder',
					           nodeData, function(json, status) {
					        if(json.returnCode=="0"){
					        	commonTip.text({text:"操作成功！"},function(){
					        		crossAPI.destroyTab('工单详情');
					        	});
					        }else{
					        	commonTip.text({text:"操作失败，请联系管理员！"});
					        }					
 		})
		}
	});
	return initialize;
});