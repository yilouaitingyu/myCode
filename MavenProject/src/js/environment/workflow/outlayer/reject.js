define(['Util','validator','select','indexLoad',"detailPanel",'dialog',
        'text!module/workflow/outlayer/reject.html','js/workflow/commonTip/commonTip',
        'style!css/workflow/outlayer/reject.css'],   
	function(Util,Validator,Select,IndexLoad,DetailPanel,Dialog,reject,commonTip){
	var $el;
	var _index;
	var _options;
	var handlingRole ="";
	var handlingStaff="";
	var form1 ;
	var _formValidator;
	var workItem ;
	var processinfo ;
	var commonTip = new commonTip();
		var initialize = function(index, options){
			$el = $(reject);
			_index = index;
			_options=options;
			workItem =_options.workItem;
			processinfo =_options.processinfo;
			this.width=600;
			this.height=250;
			this.eventInit();
			this.validateForm();
			this.content = $el;
		};	
		$.extend(initialize.prototype, {
			//测试
			but_commit:function(){
			  if(!_formValidator.form()){
				   return false;
			  }
				//workflow 工作流 workItemIstncId
				var taskId =workItem.workItemIstncId;
				var wrkfmShowSwftno =workItem.wrkfmSwftno;
				var workItemId =workItem.workItemId;
				var nodeId =workItem.prstNodeId;
				var nodeNm =workItem.nodeNm ;  //?
				var nextNodeId =workItem.lstoneNodeId; //?
				var nextNodeNm ="";//?
				var processDefId =processinfo.seqprcTmpltId;
				var operateType ="0005"; //退单
				var causeType =""; //操作类型
				//不支持连续退单
				if(Number(nodeId.replace("usertask",""))<Number(nextNodeId.replace("usertask",""))){
					commonTip.text({text:"上级已经退单，不支持连续退单"});
					return false;
				}
				var loginStaffId =_options.loginStaffId ;  //操作员工号码
				var loginStaffName =_options.loginStaffName;
				var url = "/ngwf_he/front/sh/workflow!execute?uid=return001";
				var date = {};
				
				//驳回
				var pubdynchar03 = $("#pubdynchar03",$el).val(); // 
				var pubdynchar04 =$("#pubdynchar04",$el).val() ;   // 
				var pubdynchar07  =$("#pubdynchar07",$el).val();  //
				var pubdynchar08 =$("#pubdynchar08",$el).val() ;  //
				date = {
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
							"processType":processinfo.wrkfmTypeCd, //表单数据
							'loginStaffId':loginStaffId,
							'loginStaffName':loginStaffName,
							'handlingRole':handlingRole,
							'handlingStaff':handlingStaff,
							'pubdynchar03':pubdynchar03,
							'pubdynchar04':pubdynchar04,
							'pubdynchar07':pubdynchar07,
							'pubdynchar08':pubdynchar08,
							'nodeTypeCd':workItem.nodeTypeCd //修改工作项状态使用
							
			}
				
			Util.ajax.postJson(url,date,function(result) {
					
					//获取返回值；
					if(result.returnCode =="0")
					{
						commonTip.text({text:"退单成功"});
					}else{
						commonTip.text({text:"退单失败，请联系系统管理员"});
					}	
					crossAPI.destroyTab('工单详情');
					
				});
				
			
		    },
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
		    	 
		    	
		    	this.loadDictionary('staticDictionary_get','HEBEI.EVALUATE.DEGREE','pubdynchar03');//复核评价满意度
	    		this.loadDictionary('staticDictionary_get','HEBEI.EVALUATE.REASON','pubdynchar04');
	    		
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
				this.dictionaryInit();
			},
			validateForm : function() {
				 
		    	 var config = {
		    	            el: $el,
		    	            dialog:true,    //是否弹出验证结果对话框
		    	            focusNoChecked:true,
		    	            rules: {
		    	                // 主叫号码必须有,并且是手机号格式
		    	            	pubdynchar08:"required|length-300",
		    	            	pubdynchar07:"length-300"
		    	            }, messages:{
		    	            	pubdynchar08:{
		                            "required":"操作描述不能为空",
		                            "length":"操作描述最大长度为300"
		                        },pubdynchar07:{
		                            "length":"备注内容长度最大为300"
		                        }
		                    }
			    	 };
			    _formValidator = new Validator(config);
				}
		});
		
	return initialize;
});