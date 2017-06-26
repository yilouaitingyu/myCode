define(['Util','select','indexLoad',"detailPanel","jquery",'dialog',
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/badsorder.html',
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
			this.eventInit();
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
			        "vars":varMap,
			        //环节评价
			        "apprasTypeCd":$('#appras_type_cd',$el).val(),//评价满意度
					"fstNSatisRsnDesc":$('#fst_n_satis_rsn_desc',$el).val(),//不满意原因
					"rmk":$('#rmk',$el).val(),//不满意原因备注
					"content":$('#content',$el).val()//处理说明
					        };
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/workflow!execute?uid=finishOrder',
					           nodeData, function(json, status) {
					        console.log(json);
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