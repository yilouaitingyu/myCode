define(['Util','select','indexLoad',"detailPanel","jquery",'validator','dialog',
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/badfile.html',
        'style!css/workflow/outlayer/repeatcheck.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Validator,Dialog,vars,commonTip,Html_basicMessage){
	var $el;
	var _index;
	var _options;
	var content;
	var nodeActionInfo;
	var processinfo;
	var workItem;
	var _formValidator;
	var commonTip = new commonTip();
		var initialize = function(index, options){
			$el = $(Html_basicMessage);
			_index = index;
			_options=options;
			nodeActionInfo = options.nodeActionInfo;
			processinfo = options.processinfo;
			workItem = options.workItem;
			this.dateInit();
			this.validateForm();
			this.eventInit();
			this.height=230;
			this.width=600;
			this.content = $el;
			
		};	
		$.extend(initialize.prototype, {
            //动态获取下拉框
	        loadDictionary: function(mothedName, dicName, seleId) {
	            var params = {
	                method: mothedName,
	                paramDatas: '{typeId:"' + dicName + '"}'
	            };
	            
	            var par = { "workItemId":workItem.workItemId};
	            
	            var seleOptions = "<option value=''>请选择</option>";
	           
	          //添加上一部门
	            Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=addPreviousSector', par, function(results) {
	                $.each(results.beans, function(index, bean) {
	                    seleOptions += "<option value='" + index + "'>" + bean.CURRENT_LINK_GROUP + "</option>"
	                });
	                $('#res_checksatisreason', $el).append(seleOptions);
	            },
	            true);
	            Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF', params, function(result) {
	                $.each(result.beans, function(index, bean) {
	                    seleOptions += "<option value='" + bean.value + "'>" + bean.name + "</option>"
	                });
	                $('#' + seleId, $el).append(seleOptions);
	            },
	            true);
	        },
	        dateInit: function() {
	            this.loadDictionary('staticDictionary_get', 'WFHEBEI.BADORDER.UNSATISFY', 'rec_satisreason'); //不满意原因
	        },
			eventInit:function(){
				$("#rpc_Combuildgrade",$el).change(function () {
					if($("#rpc_Combuildgrade",$el).val()=='0'){
						$("#dissatisfied",$el).addClass('show').removeClass('hide')
					}else{
						$("#dissatisfied",$el).addClass('hide').removeClass('show')
					}
				});
		},
		// 校验form表单数据有效性
		validateForm : function() {
			 var config = {
		            el: $el,
		            rules: {
		            	appraise:"required",
		            	handleMan: "required",
		            	handingComment:"required"
		            }
			 };
			 _formValidator = new Validator(config);
		},
	    //提交复核处理
		but_commit:function(){
			if(_formValidator.form()){
				 hildleManId = $("#hildleManId",$el).val();
		            hildleGroupId = $("#hildleGroupId",$el).val();
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
							        "srvReqstTypeId":processinfo.srvReqstTypeId,//服务请求类型ID
							        "description":_options.loginStaffName+"【"+_options.loginStaffId+"】对工单进行"+nodeActionInfo.lineName,
							        "processType":processinfo.wrkfmTypeCd,
							        "vars":varMap,
							        //环节评价
							        "apprasTypeCd":$('#res_checksatisfy',$el).val(),//评价满意度
									"fstNSatisRsnDesc":$('#rpc_Combuildgrade',$el).val(),//不满意原因
									"rmk":$('#rec_satisreasondetail',$el).val(),//不满意原因备注
									"content":$('#rpc_checkintroduce',$el).val()//处理说明
							        }
					Util.ajax.postJson(
							          '/ngwf_he/front/sh/workflow!execute?uid=complete',
							           nodeData, function(json, status) {
							        console.log(json);
							        if(json.returnCode=="0"){
							        	commonTip.text({text:"操作成功！"},function(){
							        		crossAPI.destroyTab('工单详情');
							        	})
							        }else{
							        	commonTip.text({text:"操作失败，请联系管理员！"});
							        }					
		 		})
			}else{
				return false;
			}
           
		},
		});
		 
	return initialize;
});