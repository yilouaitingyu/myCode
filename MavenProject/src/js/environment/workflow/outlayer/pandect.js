define(['Util','select','indexLoad','detailPanel','validator',
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/pandect.html',
        'style!css/workflow/outlayer/pandect.css'],   
	function(Util,Select,IndexLoad,DetailPanel,Validator,vars,commonTip,Html_dealUrge){
	var $el;
	var _index;
	var _options;
	var nodeActionInfo;
	var commonTip = new commonTip();
	var initialize = function(index, options){
		$el = $(Html_dealUrge);
		_index = index;
		_options=options;
		nodeActionInfo = options.nodeActionInfo;
		this.width=600;
		this.height=200;
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
						console.log(result);
					},true);
	    },
	    dictionaryInit: function(){
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.FLOW_PATH_TYPE', 'csvcSeqprcTypeCd'); //流程类别
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.TARGET_PROVINCE', 'csvcDspsCoNm'); //目标省
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.COMMON_ISORNO', 'unifyOperate'); //>统一运营
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.COMMON_NEED', 'csvcPtcptFlag'); //需要总部干预
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.COMMON_ISORNO', 'unknownDeductions'); //是否不明扣费
	    },
	    eventInit:function(){
	    	var select;
	    	//默认目标省为集团
	    	select=$('#csvcDspsCoNm',$el).get(0);
	    	for(var i=0; i<select.options.length; i++){
	    	    if(select.options[i].value == '32'){  
	    	        select.options[i].selected = true;  
	    	        break;  
	    	    }  
	    	};
	    },
		but_commit : function(){
			var nodeData = {
							"outDispatchType":"1",
							"srvReqstId":"",
							"csvcSeqprcTypeCd":$("#csvcSeqprcTypeCd",$el).val(),
							"csvcDspsCoNm":$("#csvcDspsCoNm",$el).val(),
							"unifyOperate":$("#unifyOperate",$el).val(),
							"unknownDeductions":$("#unknownDeductions",$el).val(),
							"spPort":$("#spPort",$el).val(),
							"csvcPtcptFlag ":$("#csvcPtcptFlag",$el).val()
							//调用接口需要的参数
							
							
					        }
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/outSystemAction!execute?uid=outDispatch01',
					           nodeData, function(json, status) {
					       console.log(json);
					       if(json.returnCode=="0"){
					    	  commonTip.text({text:"操作成功！"},function(){
					        		crossAPI.destroyTab('工单详情');
					        	});
					        }else{
					        	commonTip.text({text:"操作失败，请联系管理员！"});
					        }				
			},true)
		},
		form_commit : function(){
			$('#bizTypeId').val(_options.srTypeId);
            $('#reqstUrlAddr').val(_options.pageUrl);
            $('#processId').val('');
            $('#processDefId').val(_options.templateId);
            var hildleManId = $("#hildleManId",$el).val();
            var hildleGroupId = $("#hildleGroupId",$el).val();
            var dspsOpinDesc = $("#handingComment",$el).val();
            var autoRecheck = "";
            var sendccstaffdatas = '[' + $("#toCopyStaffStr",$el).val() + ']'; // 被抄送组
            var sendccgroupdatas = '[' + $("#toCopyGroupStr",$el).val() + ']'; // 被抄送人员
            var varMap = vars.varsOfWorkflow(nodeActionInfo, hildleGroupId, hildleManId);
            // $("#vars").val(varMap);
            var formJson = $("#aor_form").serializeObject();
            //服务请求id
            formJson.srvReqstId = _options.serviceId;
            //投诉类型
            formJson.bizTypeId = $('#bizTypeId').val();
            // 请求后台员工信息.按权限加载按钮
            formJson.loginStaffId = _options.userInfo.staffId;
            formJson.loginStaffName = _options.userInfo.staffName;
            formJson.vars = varMap;
            formJson.nodeId = nodeActionInfo.nodeId; // 或者是
            // activityParentId
            formJson.nodeType = nodeActionInfo.nodeType;
            formJson.nextNodeId = nodeActionInfo.activityId;
            formJson.handlingRole = hildleGroupId;
            formJson.handlingStaff = hildleManId;
            formJson.dspsOpinDesc = dspsOpinDesc;
            formJson.nodeNm = nodeActionInfo.nodeName;
            formJson.nextNodeNm = nodeActionInfo.activityName;
            formJson.autoRecheck = autoRecheck;
            formJson.nextHandlingStaff = hildleManId;
            formJson.nextHandlingRole = hildleGroupId;
            formJson.operateType = "0045";
            formJson.causeType = "";
            formJson.description = _options.userInfo.staffName+"【"+_options.userInfo.staffId+"】创建并启动工单";
            if($("#wrkfmTypeCd").val()=="" || $("#wrkfmTypeCd").val()==null){
            	formJson.processType = $("#wrkfmTypeCd").val();
            }else{
            	formJson.processType = _srTypeId.substring(0,3);
            }
            
            // 抄送
            formJson.sendccstaffdatas = sendccstaffdatas;
            formJson.sendccgroupdatas = sendccgroupdatas;
            console.log(formJson);
            Util.ajax.postJson('/ngwf_he/front/sh/outSystemAction!execute?uid=outDispatch01', formJson, function(result) {
                if (result.returnCode == "0") {
               	 commonTip.text({text:"操作成功！"},function(){
			        		crossAPI.destroyTab('建单');
			        	});
                } else {
                    commonTip.text({text:"添加工单失败，请联系系统管理员。"});
                }
            },
            true);
		},
	});
	return initialize;
});