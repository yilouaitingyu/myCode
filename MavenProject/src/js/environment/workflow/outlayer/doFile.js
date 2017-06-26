define(['Util','select','indexLoad',"detailPanel","jquery",'validator','dialog',
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/doFile.html',
        'style!css/workflow/outlayer/doFile.css'],   
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
			this.height=250;
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
	        },
			eventInit:function(){
				$("#rpc_Combuildgrade",$el).change(function () {
					if($("#rpc_Combuildgrade",$el).val()=='7' || $("#rpc_Combuildgrade",$el).val()=='8'){
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
//			            	appraise:"required",
//			            	handleMan: "required",
			            	handingComment:"required"
			            }
				 };
				 _formValidator = new Validator(config);
			},
		    //提交复核处理
			but_commit:function(){
				var custRevstFLag = $("#rpc_Visitdgrade",$el).val(); //是否回访
				var revstSatisDgrId = $("#rpc_Combuildgrade",$el).val(); //回访满意度
				var nSatisRsnDesc = $("#rec_satisreason",$el).val(); //不满意原因
				var ifNew = $("#rpc_importhing",$el).val(); //是否生成新的工单
				var dspsOpinDesc = $("#handingComment",$el).val();  //归档说明
				if(_formValidator.form()){
						var varMap = vars.varsOfWorkflow(nodeActionInfo,"","");
						var fileData = {
								        //回访情况以及归档说明
								        "custRevstFLag":custRevstFLag,//是否已回访
								        "revstSatisDgrId":revstSatisDgrId,//回访满意度
								        "nSatisRsnDesc":nSatisRsnDesc,//不满意原因
								        "ifNew":ifNew,//是否生成新的工单
								        //工单流转所需参数
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
								        "handlingRole":"",
								        "dspsOpinDesc":dspsOpinDesc,//归档说明
								        "handlingStaff":"",
								        "operateType":"0052",//处理工单
								        "causeType":"",
								        "description":_options.loginStaffName+"【"+_options.loginStaffId+"】对工单进行"+nodeActionInfo.lineName,
								        "processType":processinfo.wrkfmTypeCd,
								        "vars":varMap
								        }
						Util.ajax.postJson(
								          '/ngwf_he/front/sh/workflow!execute?uid=doFileData',
								          fileData, function(json, status) {
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
			},
		});
		 
	return initialize;
});