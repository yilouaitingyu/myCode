define(['Util','validator','select','indexLoad',"detailPanel",
        'text!module/workflow/outlayer/dealback.html','js/workflow/commonTip/commonTip'],   
	function(Util,Validator,Select,IndexLoad,DetailPanel,dealback,commonTip){
	var $el;
	var _index;
	var _options;
	var workItem ;
	var _formValidator;
	var processinfo ;
	var commonTip = new commonTip();
		var initialize = function(index, options){
			$el = $(dealback);
			_index = index;
			_options=options;
			workItem =_options.workItem;
			processinfo =_options.processinfo;
			this.eventInit();
			this.content = $el;
			this.validateForm();
		};	
		$.extend(initialize.prototype, {
			//退单
			but_commit:function(){
				//校验
				if(!_formValidator.form()){
					   return false;
				 }
				//workflow 工作流
				var taskId =workItem.workItemIstncId;
				var wrkfmShowSwftno =workItem.wrkfmSwftno;
				var workItemId =workItem.workItemId;
				var nodeId =workItem.prstNodeId;
				var nodeNm =workItem.nodeNm;  //?
				var nextNodeId =workItem.lstoneNodeId;  //?
				var nextNodeNm ="";//?
				var processDefId =processinfo.seqprcTmpltId;
				var operateType ="0005"; //退单
				var causeType =""; //操作类型
				//var description ="";
				//var processType ="";
				var loginStaffId =_options.loginStaffId ;  //操作员工号码
				var loginStaffName =_options.loginStaffName;
				var handlingRole ="";
				var handlingStaff="";
				var url = "/ngwf_he/front/sh/workflow!execute?uid=return001";
				//工单环节评价
				var pubdynchar03 =$("#pubdynchar03",$el).val();   //评价处理环节 
				var byApprasDeptId =$("#byApprasDeptId",$el).val() ; //被评价处理部门 
				var pubdynchar04 =$("#pubdynchar04",$el).val() ; //不满意原因1 
				var pubdynchar05 =$("#pubdynchar05",$el).val()  ; //不满意原因2
				//var groupsSuffus =$("#groupsSuffus").val().join(",") ; //<!-- 环节类型代码 -->
				var pubdynchar07=$("#pubdynchar07",$el).val();
				var pubdynchar08=$("#pubdynchar08",$el).val();
				var groupsSuffus_array =$("#groupsSuffus",$el).val() ; //选择人员与组
				var suff_array=new Array();
				var group_array=new Array();
				//截取选择组 选择人
				
					
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
					
				
				
				var date = {
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
							"pubdynchar08":pubdynchar08,
							'description':loginStaffName+"【"+loginStaffId+"】"+"退回工单", //表单数据
							"processType":processinfo.wrkfmTypeCd,
							'loginStaffId':loginStaffId,
							'loginStaffName':loginStaffName,
							'handlingRole':handlingRole,
							'handlingStaff':handlingStaff,
							'pubdynchar03':pubdynchar03,
							'byApprasDeptId':byApprasDeptId,
							'pubdynchar04':pubdynchar04,
							'pubdynchar05':pubdynchar05,
							'pubdynchar07':pubdynchar07,
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
					crossAPI.destroyTab('工单详情_'+processinfo.acptNum);
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
							$('#'+seleId ,$el).append(seleOptions);
							console.log(result);
						},true);
		    },
		    dictionaryInit: function(){
		    	this.loadDictionary('staticDictionary_get','HEBEI.EVALUATE.DEGREE','pubdynchar03');//复核评价满意度
				this.loadDictionary('staticDictionary_get','HEBEI.EVALUATE.REASON1','pubdynchar04');//不满意原因1
				this.loadDictionary('staticDictionary_get','HEBEI.EVALUATE.REASON2','pubdynchar05');//不满意原因2
				var workItem1=_options.workItem;
				var params={wrkfmShowSwftno:workItem1.wrkfmSwftno,nodeTypeCd:workItem1.nodeTypeCd};
	    		var seleOptions="";
	    		var byApprasDeptId="";
				 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=return004',params,function(result){
					var temp_date="";//判断是否为同一节点
					var temp="1@1";
					 $.each(result.beans,function(index,bean){
						 var dspsStaffNum = bean.dspsStaffNum;
						 var dspsWorkGrpId = bean.dspsWorkGrpId;
						 var currentLinkStaff = bean.currentLinkStaff;//处理人员名
						 var currentLinkGroup = bean.currentLinkGroup;//处理人员组
						 var wfCreate = bean.wfCreate;
						 if(dspsWorkGrpId==null||dspsWorkGrpId=="undefind")
							 dspsWorkGrpId=""
						if(dspsStaffNum==null||dspsStaffNum=="undefind")
							dspsStaffNum=""
						 var select =""//上一个节点工作组选中
						
						 if(workItem1.lstoneWorkItemId==bean.workItemId){
								 select ="selected=selected";
						 }
						 seleOptions+="<option  "+select+" value='"+dspsStaffNum+"@"+dspsWorkGrpId+"@"+currentLinkStaff+"@"+currentLinkGroup+"'>"+currentLinkStaff+"  ("+currentLinkGroup+")</option>"
						 //被评价组
						 if(dspsWorkGrpId != "" &&(temp.indexOf(dspsWorkGrpId)==-1) ){
							 temp+=dspsWorkGrpId;
							 byApprasDeptId+="<option "+select+"  value='"+dspsWorkGrpId+"'>"+currentLinkGroup+"</option>";
								
						 }
							
						 /*if(bean.nodeTypeCd=="02"){
							 byApprasDeptId+="<option selected='selected'  value='"+dspsWorkGrpId+"@"+currentLinkGroup+"'>"+currentLinkGroup+"</option>"
						 }else
							 byApprasDeptId+="<option   value='"+dspsWorkGrpId+"@"+currentLinkGroup+"'>"+currentLinkGroup+"</option>"
							*/	 
					 });
					 $("#groupsSuffus",$el).append(seleOptions);	
					 $("#byApprasDeptId",$el).append(byApprasDeptId);	
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