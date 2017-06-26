define(['Util','select','indexLoad',"detailPanel","jquery",'dialog',
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/responsedeal.html',
        'style!css/workflow/outlayer/responsedeal.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Dialog,vars,commonTip,Html_basicMessage){
	var $el;
	var _index;
	var _options;
	var content;
	var nodeActionInfo;
	var processinfo;
	var workItem;
	var commonTip = new commonTip();
		var initialize = function(index, options){
			$el = $(Html_basicMessage);
			_index = index;
			_options=options;
			nodeActionInfo = options.nodeActionInfo;
			processinfo = options.processinfo;
			workItem = options.workItem;
			this.height=200;
			this.width=600;
			this.dictionaryInit();
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
	    dictionaryInit: function(){ 
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.EVALUATE.DEGREE', 'res_checksatisfy'); //评价满意度
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.DISCONTENT.TYPE', 'res_checksatisreason'); //不满意原因
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.COUNTY.COMPANY', 'res_dealcompany'); //处理县公司
	    },
	    eventInit:function(){
			$("#res_checksatisfy",$el).change(function () {
				if($("#res_checksatisfy",$el).val()=='01'){
					$("#dissatisfied",$el).addClass('show').removeClass('hide')
				}else{
					$("#dissatisfied",$el).addClass('hide').removeClass('show')
				}
			});
		},
	    but_commit : function(){
			hildleManId = "";
            hildleGroupId = "";
            dspsOpinDesc = $("#res_dealmoredetails",$el).val();
			var varMap = vars.varsOfWorkflow(nodeActionInfo,hildleGroupId,hildleManId);
			var nodeData = {
							"needRevstFlag":$("#res_isgoback",$el).val(),//回访标志
							"endType":"0",//答复
							"apprasTypeCd":$('#res_checksatisfy',$el).val(),//评价类型代码(非空)
							"fstNSatisRsnDesc":$('#res_checksatisreason',$el).val(),//不满意原因
							"rmk":$('#res_checkreasondetail',$el).val(),//不满意原因备注
							"content":$('#res_dealmoredetails',$el).val(),//处理说明
					        //流转反馈
							"wrkfmId":workItem.wrkfmId,
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
					        "operateType":"0061", //工单回复  答复工单
					        "causeType":"",
					        "description":_options.loginStaffName+"【"+_options.loginStaffId+"】对工单进行答复",
					        "processType":processinfo.wrkfmTypeCd,
					        "vars":varMap
					        //环节评价
					        }
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/workflow!execute?uid=responseOrDeal',
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
		}
		});
	return initialize;
});