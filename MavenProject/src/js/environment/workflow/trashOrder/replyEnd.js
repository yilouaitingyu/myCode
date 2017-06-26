define(['Util','select','indexLoad',"detailPanel","jquery",'dialog',
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/replyEnd.html',
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
			_index = index;
			_options=options;
			nodeActionInfo = options.nodeActionInfo;
			processinfo = options.processinfo;
			workItem = options.workItem;
			this.height=30;
			this.width=350;
			this.content = '<h1 align="center" style="font-weight:bold;font-size:20px;">是否驳回？</h1>';
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
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.EVALUATE.DEGREE', 'appras_type_cd'); //评价满意度
	    	this.loadDictionary('staticDictionary_get', 'WFHEBEI.PROCESSHANDLE.UNSATISFYREASON', 'fst_n_satis_rsn_desc'); //不满意原因
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.SUFFER.EVALUATE.BRANCH', 'by_appras_dept_id'); //被评价部门
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.COMPLAINT.CAUSE', 'cmplnts_rsn_type_cd');//导致客户投诉原因
	    },	
		eventInit:function(){
	    	//默认评价满意度为满意
			var select=$('#appras_type_cd',$el).get(0);
	    	for(var i=0; i<select.options.length; i++){  
	    	    if(select.options[i].value == '02'){  
	    	        select.options[i].selected = true;  
	    	        break;  
	    	    }  
	    	};
			$('#appras_type_cd',$el).click(function(){
	    		var $single = $("#appras_type_cd",$el).val()
	    		if($single==01){
	    			$("#Dissatisfieds",$el).removeClass("hide")
	    		}else{
	    			$("#Dissatisfieds",$el).addClass("hide")
	    		}
	    	})
		},
		but_commit : function(){
			hildleManId = "";
            hildleGroupId = "";
            dspsOpinDesc = $("#handingComment",$el).val();
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
			        "vars":varMap
					        };
			console.log(nodeData);
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/workflow!execute?uid=trashReplyEnd',
					           nodeData, function(json, status) {
					        console.log(json);
					        if(json.returnCode=="0"){
					        	commonTip.text({text:"操作成功！"});
					        }else{
					        	commonTip.text({text:"操作失败，请联系管理员！"});
					        }					
 		})
		}
	});
	return initialize;
});