define(['Util','select','indexLoad',"detailPanel","jquery",'dialog',
        'text!module/workflow/badwordorderDetail/recoverwork.html',
        'style!css/workflow/outlayer/stageProcessing.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Dialog,Html_dealUrge){
		var $el;
		var _index;
		var _options;
		var content;
		var handlingStaff;
		var handlingRole;
		
		var initialize = function(options){
			$el = $(Html_dealUrge);			
			workItem=options;						
			this.width=550;
			this.height=130;
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		remaind_submit : function(){
			var taskId =workItem.workItemIstncId;
			var wrkfmShowSwftno =workItem.wrkfmSwftno;
			var workItemId =workItem.workItemId;
			var nodeId =workItem.prstNodeId;
			var nodeNm =workItem.nodeNm ;  //?
			var nextNodeId =workItem.nextNodeId; //?
			var nextNodeNm ="";//?
			var processDefId =workItem.seqprcTmpltId;
			var operateType ="0006"; //追单
			var causeType =""; //操作类型
			
			var loginStaffId =workItem.loginStaffId ;  //操作员工号码
			var loginStaffName =workItem.loginStaffName;			
			var url = "/ngwf_he/front/sh/workflow!execute?uid=return001";
			var pubdynchar08 =$("#pubdynchar08",$el).val() ;
			nodeData = {
					'taskId':taskId,
					'wrkfmShowSwftno' : wrkfmShowSwftno,
					'workItemId' : workItemId,
					'nodeId' : nodeId,
					'nodeNm' : nodeNm,					
					'nextNodeId' : nextNodeId,
					'nextNodeNm' : nextNodeNm,
					'processDefId' : processDefId,
					'operateType' : operateType,
					"causeType":causeType,
					'description':loginStaffName+"【"+loginStaffId+"】"+"退回工单", //表单数据
					"processType":workItem.wrkfmTypeCd, //表单数据
					'loginStaffId':loginStaffId,
					'loginStaffName':loginStaffName,
					'pubdynchar08':pubdynchar08,
					'handlingRole':handlingRole,
					'handlingStaff':handlingStaff,
					
					
					'nodeTypeCd':workItem.nodeTypeCd //修改工作项状态使用
					
	}
			Util.ajax.postJson(url,nodeData,function(result) {
				
				//获取返回值；
				if(result.returnCode =="0")
				{
					crossAPI.tips("退单成功。",3000);
				}else{
					crossAPI.tips("退单失败，请联系系统管理员。",3000);
				}	
				crossAPI.destroyTab('工单详情');
				
			});
		},
		dictionaryInit: function(){
	    	
			var params={wrkfmShowSwftno:workItem.wrkfmSwftno,nodeTypeCd:workItem.nodeTypeCd};
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
	});
	return initialize;
});