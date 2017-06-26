define(['Util','select','indexLoad',"detailPanel",
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/systemreturn.html',
        'style!css/workflow/outlayer/systemreturn.css'],   
	function(Util,Select,IndexLoad,DetailPanel,commonTip,Html_basicMessage){
	var $el;
	var _index;
	var _options;
	var commonTip = new commonTip();
		var initialize = function(index, options){
			$el = $(Html_basicMessage);
			_index = index;
			_options=options;
			this.dateInit();
			this.content = $el;
			this.width = 600;
			this.height = 200;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		//	      动态获取下拉框
		loadDictionary:function(mothedName,dicName,seleId){
			var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
			var seleOptions="";
			// 
			Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
				$.each(result.beans,function(index,bean){
					seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
				});
				$('#'+seleId, $el).append(seleOptions);
			},true);
		},
		dateInit : function(){
			this.loadDictionary('staticDictionary_get','HEBEI.WF.OUTSYSTEM.UNIT','outSystem_unit');//加载省份信息
		},
		but_commit:function(){
			var outSystem_unit = $("#outSystem_unit").val();//外派单位
			var assignDetail = $("#assignDetail").val();//外派说明
			Util.ajax.postJson(
			          '/ngwf_he/front/sh/workflow!execute?uid=operateData',
			           nodeData, function(json, status) {
			        console.log(json);
			        if(json.returnCode=="0"){
			        	commonTip.text({text:"操作成功！"});
			        }
			        else{
			        	commonTip.text({text:"操作失败，请联系管理员！"});
			        }	
			})
			        	
		}
		});
	return initialize;
});