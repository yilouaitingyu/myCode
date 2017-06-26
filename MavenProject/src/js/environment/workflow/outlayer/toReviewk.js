define(['Util','select','indexLoad',"detailPanel","jquery",'dialog',
        'js/workflow/commonTip/commonTip',
        'js/workflow/processinfoDetail/varsOfWorkflow'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Dialog,commonTip,vars){
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
			this.content ='<h1 align="center" style="font-weight:bold;font-size:20px;">是否已查询重复工单？</h1>';
		};	
		$.extend(initialize.prototype, {
			createValidator :function(){
				return true;	
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
	             console.log(formJson);
	             Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=acceptOrder001', formJson, function(result) {
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
		// 序列化 输入框的值;
	    $.fn.serializeObject = function() {
	        var json = {};
	        var arrObj = this.serializeArray();
	        $.each(arrObj, function() {
	            if (json[this.name]) {
	                if (!json[this.name].push) {
	                    json[this.name] = [json[this.name]];
	                }
	                json[this.name].push(this.value || '');
	            } else {
	                json[this.name] = this.value || '';
	            }
	        });
	        return json;
	    }; // 序列化 输入框的值; 
	return initialize;
});