define(['Util','select','indexLoad',"detailPanel","jquery",'dialog',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/stageProcessing.html',
        'style!css/workflow/outlayer/stageProcessing.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Dialog,commonTip,Html_dealUrge){
		var $el;
		var _index;
		var _options;
		var content;
		var processinfo;
		var workItem;
		var commonTip =new commonTip();
		var initialize = function(index, options){
			$el = $(Html_dealUrge);
			_index = index;
			_options=options;
			processinfo = options.processinfo;
			workItem = options.workItem;
			this.width=550;
			this.height=130;
			this.dictionaryInit();
			this.eventInit();
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
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
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMPLAIN', 'succConcCustFlag'); //是否联系上客户
	    },	
	    eventInit: function(){
	    	var select=$('#succConcCustFlag',$el).get(0);
	    	for(var i=0; i<select.options.length; i++){  
	    	    if(select.options[i].value == '02'){  
	    	        select.options[i].selected = true;  
	    	        break;  
	    	    }  
	    	}
	    },
		but_commit : function(){
			var nodeData = {
							"succConcCustFlag":$('#succConcCustFlag',$el).val()=='01'?0:1,//未联系上客户
							"processInstId":processinfo.wrkfmShowSwftno,//流程实例Id
							"description":_options.loginStaffName+"【"+_options.loginStaffId+"】对工单进行阶段处理",//描述
							"rplCntt":$('#content',$el).val(),//内容
							"workItemId":workItem.workItemId,
					        "wrkfmShowSwftno":processinfo.wrkfmShowSwftno,
					        "processDefId":processinfo.seqprcTmpltId,
					        "nodeId":workItem.prstNodeId, //或者是 activityParentId
					        "loginStaffId":_options.loginStaffId,
					        "loginStaffName":_options.loginStaffName,
					        "operateType":"0010",
					        "causeType":"",
					        "processType":processinfo.wrkfmTypeCd
					        }
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/workflow!execute?uid=stageDispose',
					          nodeData, function(json, status) {
					        console.log(json);
					        if(json.returnCode=="0"){
					        	 commonTip.text({text:"操作成功！"},function(){
						        		crossAPI.destroyTab('工单详情');
						        	});
					        }else{
					        	 commonTip.text({text:"操作失败,请联系管理员！"});
					        }					
			})
		}
	});
	return initialize;
});