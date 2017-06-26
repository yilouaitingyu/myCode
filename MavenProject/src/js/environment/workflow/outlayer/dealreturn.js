define(['Util','validator','select','indexLoad',"detailPanel",
        'text!module/workflow/outlayer/dealreturn.html',
        'style!css/workflow/outlayer/dealreturn.css'],   
	function(Util,Validator,Select,IndexLoad,DetailPanel,dealreturn){
	var $el;
	var _index;
	var _options;
	var workItem;
	var handlingRole ;
	var handlingStaff;
	var processinfo ;
	var initialize = function(index, options){
			$el = $(dealreturn);
			_index = index;
			_options=options;
			processinfo=_options.processinfo;
			this.eventInit();
			this.validateForm();
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {

		//测试
		but_commit:function(){
			//校验；
			if(!_formValidator.form()){
				   return false;
			  }
			//workflow 工作流
			if(!workItem.flag){
				crossAPI.tips("工单已受理，无法追回！",3000);
				return false;
			}
				
			var taskId =workItem.workItemIstncId; //WORK_ITEM_ISTNC_ID
			var wrkfmShowSwftno =workItem.wrkfmSwftno;
			var workItemId =workItem.workItemId;
			var nodeId =workItem.nodeId;
			var nodeNm =workItem.nodeNm;  //?
			var nextNodeId =workItem.lstoneNodeId;  //?
			var nextNodeNm ="";//?
			var processDefId = processinfo.seqprcTmpltId;          //processinfo.seqprcTmpltId;
			var operateType ="0006"; //追单
			var causeType =""; //操作类型
			
			var loginStaffId =_options.loginStaffId  ;  //操作员工号码
			var loginStaffName =_options.loginStaffName;
			var handlingRole ="";
			var handlingStaff="";
			var workItemIds =workItem.workItemIds;
			var pubdynchar08=$("#pubdynchar08",$el).val();
			var groupsSuffus_array =$("#groupsSuffus",$el).val() ; //选择人员与组
			var suff_array=new Array();
			var group_array=new Array();
			var temp_array=groupsSuffus_array.split("@");
			if(temp_array[0]!=''){
				suff_array.push(groupsSuffus_array);
			}else{
				if(temp_array[1]!=''){
					group_array.push(temp_array[1]);
				}
			}
			handlingStaff =suff_array.join(',');
			handlingRole=group_array.join(',');
			
			
			
			
			var url = "/ngwf_he/front/sh/workflow!execute?uid=return002";
			var date = {
				
				'taskId' : taskId,
				'wrkfmShowSwftno' : wrkfmShowSwftno,
				'workItemId' : workItemId,
				'nodeId' : nodeId,
				'nextNodeId' : nextNodeId,
				'processDefId' : processDefId,
				'description':loginStaffName+"【"+loginStaffId+"】"+"退回工单", //表单数据
				'loginStaffId':loginStaffId,
				'loginStaffName':loginStaffName,
				'pubdynchar08':pubdynchar08,
				'handlingRole':handlingRole,
				'handlingStaff':handlingStaff,
				'workItemIds':workItemIds,
				"processType":processinfo.wrkfmTypeCd

			}
			Util.ajax.postJson(url,date,function(result) {
				
				if(result.returnCode =="0")
				{
					crossAPI.tips("追回成功。",3000);
				}else{
					crossAPI.tips("追单失败，请联系系统管理员。",3000);
				}	
				crossAPI.destroyTab('工单详情_'+processinfo.acptNum);
			});
		
	    },
		
	    dictionaryInit: function(){
	    	//获取处理过工单的工作组与人
	    	var wrkfmSwftno=_options.workItem.wrkfmSwftno;
	    	var now_workItemId =_options.workItem.workItemId;
	    	var nodeTypeCd =_options.workItem.nodeTypeCd;
	    	var wfCreate =_options.workItem.wfCreate;  //相同时间 相同节点  判断为同一个节点 的不同工作项
    		var params={wrkfmSwftno:wrkfmSwftno,now_workItemId:now_workItemId,nodeTypeCd:nodeTypeCd,wfCreate:wfCreate};
    		var seleOptions="";
			 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=return003',params,function(result){
				var wfCreate;
				var temp_date="";//判断是否为同一节点
				 $.each(result.beans,function(index,bean){
					 
					 var dspsStaffNum = bean.dspsStaffNum;
					 var dspsWorkGrpId = bean.dspsWorkGrpId;
					 var currentLinkStaff = bean.currentLinkStaff;//处理人员名册
					 var currentLinkGroup = bean.currentLinkGroup;//处理人员组
					 var select ="";
					 if(dspsWorkGrpId==null||dspsWorkGrpId=="undefind")
						 dspsWorkGrpId=""
					 if(dspsStaffNum==null||dspsStaffNum=="undefind")
						dspsStaffNum=""
					 if(now_workItemId==bean.workItemId)
						 select ="selected=selected" 
					 seleOptions+="<option  "+select+" value='"+dspsStaffNum+"@"+dspsWorkGrpId+"@"+currentLinkStaff+"@"+currentLinkGroup+"'>"+currentLinkStaff+"  ("+currentLinkGroup+")</option>"
				 });
				 $("#groupsSuffus" ,$el).append(seleOptions);	
				 //部门；byApprasDeptId
				 workItem=result.object;
				},true);	
	    			
	    },	
		eventInit:function(){
			this.dictionaryInit();
		},
		validateForm : function() {
	    	 var config = {
	    	            el: $el,
	    	            dialog:true,    //是否弹出验证结果对话框
	    	            focusNoChecked:true,
	    	            rules: {
	    	                // 主叫号码必须有,并且是手机号格式
	    	            	pubdynchar08:"required|max-300"
	    	    
	    	            }, messages:{
	    	            	pubdynchar08:{
	                            "required":"操作描述不能为空",
	                            "max":"操作描述最大长度为300"
	                        }
	                    }
		    	 };
		    _formValidator = new Validator(config);
			}
	
          
		});
	return initialize;
});
