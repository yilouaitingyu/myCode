define(['Util','select','indexLoad',"detailPanel","jquery",'dialog',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/toVoid.html',
        'style!css/workflow/outlayer/toVoid.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Dialog,commonTip,Html_dealUrge){
		var $el;
		var _index;
		var _options;
		var content;
		var processinfo;
		var workItem;
		var commonTip = new commonTip();
		var initialize = function(index, options){
			$el = $(Html_dealUrge);
			_index = index;
			_options=options;
			processinfo = options.processinfo;
			workItem = options.workItem;
			this.width=600;
			this.height=220;
			this.dictionaryInit();
			this.eventInit();
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype,{
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
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.EVALUATE.DEGREE', 'evaluateStatisfac'); //评价满意度
	    	this.loadDictionary('staticDictionary_get', 'WFHEBEI.PROCESSCREATE.UNSATISFYREASON', 'comments'); //建单不满意原因  
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMPLAIN', 'isFoundOrder'); //是否创建新工单
	    },	
	    eventInit:function(){
	    	var select;
	    	//默认评价满意度为满意
	    	select=$('#evaluateStatisfac',$el).get(0);
	    	for(var i=0; i<select.options.length; i++){  
	    	    if(select.options[i].value == '02'){  
	    	        select.options[i].selected = true;  
	    	        break;  
	    	    }  
	    	};
	    	//默认选中不创建新工单
	    	select=$('#isFoundOrder',$el).get(0);
	    	for(var i=0; i<select.options.length; i++){  
	    	    if(select.options[i].value == '02'){  
	    	        select.options[i].selected = true;  
	    	        break;  
	    	    }  
	    	};
	    	//建单人工号
	    	$('#acceptStaffno',$el).val(_options.processinfo.acptStaffNum);
	    	//评价环节不满意显示隐藏div
	    	$('#evaluateStatisfac',$el).click(function(){
	    		var $single = $("#evaluateStatisfac",$el).val()
	    		if($single==1){
	    			$("#Dissatisfieds",$el).removeClass("hide")
	    		}else{
	    			$("#Dissatisfieds",$el).addClass("hide")
	    		}
	    	});
	    },
		but_commit : function(){
			var nodeData = {
							"evaluateStatisfac":$('#evaluateStatisfac',$el).val(),//评价满意度
							"discontent1":$('#comments',$el).val(),//不满意原因
							"discontentRemark":$('#commentsRemark',$el).val(),//建单人不满意原因备注
							"isFoundOrder":$('#isFoundOrder',$el).val(),//是否创建新工单
							"opDescribe":$('#handlingComment',$el).val(),//作废说明
							"processInstId":processinfo.wrkfmShowSwftno,//流程实例Id
							"description":_options.loginStaffName+"【"+_options.loginStaffId+"】对工单进行作废",//描述
							"workItemId":workItem.workItemId,
					        "wrkfmShowSwftno":processinfo.wrkfmShowSwftno,
					        "processDefId":processinfo.seqprcTmpltId,
					        "nodeId":workItem.prstNodeId, //或者是 activityParentId
					        "nodeTypeCd":workItem.nodeTypeCd, //节点类型代码
					        "loginStaffId":_options.loginStaffId,
					        "loginStaffName":_options.loginStaffName,
					        "operateType":"0002",
					        "causeType":"",
					        "processType":processinfo.wrkfmTypeCd
					        }
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/workflow!execute?uid=orderCancel',
					           nodeData, function(json, status) {
					       console.log(json);
					       if(json.returnCode=="0"){
					    	   commonTip.text({text:"操作成功！"},function(){
					    		   crossAPI.destroyTab('工单详情_'+processinfo.acptNum);
					        	});
					        }else{
					        	commonTip.text({text:"操作失败，请联系管理员！"});
					        }				
			},true)
		}
	    
	})		
	return initialize;
})