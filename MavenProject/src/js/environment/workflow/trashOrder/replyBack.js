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
		var handlingRole ="";
		var handlingStaff="";
		var commonTip = new commonTip();
		var initialize = function(index, options){
			_index = index;
			_options=options;
			nodeActionInfo = options.nodeActionInfo;
			processinfo = options.processinfo;
			workItem = options.workItem;
			this.dictionaryInit();
			//this.eventInit();
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
	    	
	    	var workItem1=_options.workItem;
			var params={wrkfmShowSwftno:workItem1.wrkfmSwftno,nodeTypeCd:workItem1.nodeTypeCd};
    		var seleOptions="";
    		var temp="";
			 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=return004',params,function(result){
				 var staff_array = new Array();
			     var group_array=new Array();
			     var temp_date="";//判断是否为同一节点
				 $.each(result.beans,function(index,bean){
					 var wfCreate = bean.wfCreate;	
					 if(workItem1.lstoneWorkItemId==bean.workItemId){
						 var currentLinkStaff = bean.currentLinkStaff;//处理人员名
						 var currentLinkGroup = bean.currentLinkGroup;//处理人员组
						 if(temp_date==""||temp_date==wfCreate){
							 temp_date=wfCreate;
						 if(bean.dspsStaffNum !="" && bean.dspsStaffNum !=null){
							 staff_array.push(bean.dspsStaffNum+"@"+bean.dspsWorkGrpId+"@"+currentLinkStaff+"@"+currentLinkGroup);
						 }else if((bean.dspsStaffNum !="" || bean.dspsStaffNum !=null)&&(bean.dspsWorkGrpId !="" || bean.dspsWorkGrpId !=null)){
							 group_array.push(bean.dspsWorkGrpId+"@"+currentLinkGroup);
						 }
						 }
					 }
					
					 
				 });
				 handlingStaff =staff_array.join(",");
				 handlingRole =group_array.join(",")
	
				 //部门；byApprasDeptId
				 
				 
				},true);
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
			        "handlingRole":workItem.dspsWorkGrpId+"@复合组",
			        "dspsOpinDesc":dspsOpinDesc,
			        "handlingStaff":hildleManId,
			        "operateType":"0052",//处理工单
			        "causeType":"",
			        "description":_options.loginStaffName+"【"+_options.loginStaffId+"】对工单进行"+nodeActionInfo.lineName,
			        "processType":processinfo.wrkfmTypeCd,
			        "vars":varMap
			};
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/workflow!execute?uid=return001',
					           nodeData, function(json, status) {
					        console.log(json);
					        if(json.returnCode=="0"){
					        	commonTip.text({text:"操作成功！"});
												crossAPI.destroyTab('工单详情');
					        }else{
					        	commonTip.text({text:"操作失败，请联系管理员！"});
					        }					
 		})
		}
	});
	return initialize;
});