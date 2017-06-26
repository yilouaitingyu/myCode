define(['Util','select','indexLoad',"detailPanel",
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/eomcbuild.html',
        'style!css/workflow/outlayer/eomcbuild.css'],   
	function(Util,Select,IndexLoad,DetailPanel,vars,commonTip,Html_basicMessage){
	var $el;
	var _index;
	var _options;
	var workItem;
	var nodeActionInfo;
	var commonTip = new commonTip();
	var initialize = function(index, options){
		$el = $(Html_basicMessage);
		_index = index;
		_options=options;
		workItem = options.workItem;
		nodeActionInfo = options.nodeActionInfo;
		this.width=600;
		this.height=100;
		this.content = $el;
	};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		but_commit : function(){
			var nodeData = {
					"outDispatchType":"EOMS",
					"opDescribe":$("#opDescribe",$el).val()
					//调用接口需要的参数
			}
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/outSystemAction!execute?uid=outDispatch01',
					           nodeData, function(json, status) {
					       console.log(json);
					       if(json.returnCode=="0"){
					    	   commonTip.text({text:"操作成功！"});
												crossAPI.destroyTab('工单详情');
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
            var hildleManId = "";
            var hildleGroupId = "";
            var dspsOpinDesc = "";
            var autoRecheck = "";
            var sendccstaffdatas = ""; // 被抄送组
            var sendccgroupdatas = ""; // 被抄送人员
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
            	formJson.processType = _options.srTypeId.substring(0,3);
            }
            
            // 抄送
            formJson.sendccstaffdatas = sendccstaffdatas;
            formJson.sendccgroupdatas = sendccgroupdatas;
            //外派EOMS 参数添加
            formJson.outDispatchType = "EOMS";
            formJson.opDescribe = $("#opDescribe",$el).val();
            
            console.log(formJson);
            Util.ajax.postJson('/ngwf_he/front/sh/outSystemAction!execute?uid=outDispatch01', formJson, function(result) {
                if (result.returnCode == "0") {
               	  commonTip.text({text:"外派EOMS成功！"},function(){
			        		crossAPI.destroyTab('建单');
			        	});
                } else {
                    commonTip.text({text:"外派EOMS失败，请联系系统管理员。"});
                }
            },
            true);
		}
	});
	return initialize;
});