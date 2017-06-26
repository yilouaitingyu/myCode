define(['Util','select','indexLoad',"detailPanel","jquery",'validator','dialog',
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/waitchecklayer.html',
        'style!css/workflow/outlayer/waitchecklayer.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Validator,Dialog,vars,commonTip,Html_waitchecklayer){
	var $el;
	var _index;
	var _options;
	var nodeActionInfo;
	var processinfo;
	var workItem;
	var _formValidator;
	var commonTip = new commonTip();
		var initialize = function(index, options){
			$el = $(Html_waitchecklayer);
			_index = index;
			_options=options;
			nodeActionInfo = options.nodeActionInfo;
			processinfo = options.processinfo;
			workItem = options.workItem;
			this.height = 260;
			this.width = 600;
			this.dateInit();
			this.validateForm();
			this.eventInit();
			this.content = $el;
			
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		//动态获取下拉框
        loadDictionary: function(mothedName, dicName, seleId) {
            var params = {
                method: mothedName,
                paramDatas: '{typeId:"' + dicName + '"}'
            };
            var seleOptions = "<option value=''>请选择</option>";
            // 
            Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF', params, function(result) {
                $.each(result.beans, function(index, bean) {
                    seleOptions += "<option value='" + bean.value + "'>" + bean.name + "</option>"
                });
                $('#' + seleId, $el).append(seleOptions);
            },
            true);
        },
        dateInit: function() {
            this.loadDictionary('staticDictionary_get', 'WFHEBEI.PROCESSHANDLE.UNSATISFYREASON', 'rec_satisreason'); //不满意原因
            this.loadDictionary('staticDictionary_get', 'HEBEI.COMPLAINT.CAUSE', 'kls_complainReason'); //导致客户不满意原因
        },
		eventInit:function(){
			$("#res_checksatisfy",$el).change(function () {
				if($("#res_checksatisfy",$el).val()=='0'){
					$("#dissatisfied",$el).addClass('show').removeClass('hide')
				}else{
					$("#dissatisfied",$el).addClass('hide').removeClass('show')
				}
			});
			$("#kls_commitcheck",$el).on('click',function(){
				console.log("close");
			});
		},
		// 校验form表单数据有效性
	    validateForm : function() {
	    	 var config = {
    	            el: $el,
    	            rules: {
    	            	kls_complainReason: "required",
    	            }
	    	 };
	    	 _formValidator = new Validator(config);
		},
		but_commit : function(){
			if(_formValidator.form()){
				hildleManId = "";
	            hildleGroupId = "";
	            dspsOpinDesc = $("#handingComment",$el).val();
				var varMap = vars.varsOfWorkflow(nodeActionInfo,hildleGroupId,hildleManId);
				var nodeData = {
								"needRevstFlag":$("input[name='need_revst_flag']:checked",$el).val(),//回访标志
								"apprasTypeCd":$('#res_checksatisfy',$el).val(),//评价满意度
								//"byApprasDeptId":"",//被评价部门
								"fstNSatisRsnDesc":$('#rec_satisreason',$el).val(),//不满意原因
								"rmk":$('#res_checkreasondetail',$el).val(),//不满意原因备注
								"faultDspsFinishFlag":$('#faultDspsFinishFlag',$el).val(),//解决情况
								"content":$('#content',$el).val(),//直接答复内容
								"cmplntsRsnTypeCd":$('#cmplnts_rsn_type_cd',$el).val(),//导致客户投诉说明
						        //流转回访
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
						        "operateType":"0061", //工单回复  直接答复 
						        "causeType":"",
						        "description":_options.loginStaffName+"【"+_options.loginStaffId+"】对工单进行直接答复",
						        "processType":processinfo.wrkfmTypeCd,
						        "vars":varMap
						        //环节评价
						        }
				Util.ajax.postJson(
						          '/ngwf_he/front/sh/workflow!execute?uid=directReply',
						           nodeData, function(json, status) {
						        console.log(json);
						        if(json.returnCode=="0"){
						        	commonTip.text({text:"操作成功！"},function(){
						        		crossAPI.destroyTab('工单详情_'+processinfo.acptNum);
						        	});
						        }else{
						        	commonTip.text({text:"操作失败，请联系管理员！"});
						        }					
	 		    })
			}else{
				return false;
			}
		}
		});
	return initialize;
});