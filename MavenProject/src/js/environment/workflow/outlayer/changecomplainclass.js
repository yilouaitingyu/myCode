define(['Util','select','indexLoad',"detailPanel",
        'text!module/workflow/outlayer/changecomplainclass.html',
        'style!css/workflow/outlayer/changecomplainclass.css'],   
	function(Util,Select,IndexLoad,DetailPanel,Html_basicMessage){
	var $el;
	var _index;
	var _options;
	var nodeActionInfo;
	var processinfo;
	var workItem;
		var initialize = function(index, options){
			$el = $(Html_basicMessage);
			_index = index;
			_options=options;
			nodeActionInfo = options.nodeActionInfo;
			processinfo = options.processinfo;
			workItem = options.workItem;
			this.dateInit();
			this.eventInit();
			this.content = $el;
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
				this.loadDictionary('staticDictionary_get','HEBEI.COMPLAIN.TYPE','change_complaint');//投诉类型
				this.loadDictionary('staticDictionary_get','HEBEI.DISCONTENT.TYPE','rec_satisreason');//不满意原因
		  },
		  eventInit:function(){
				$("#res_checksatisfy",$el).change(function () {
					if($("#res_checksatisfy",$el).val()=='0'){
						$("#dissatisfied",$el).addClass('show').removeClass('hide')
					}else{
						$("#dissatisfied",$el).addClass('hide').removeClass('show')
					}
				});
				
		  },
		  but_commit:function(){
			  var changeData = {
					  'srvReqstId':processinfo.srvReqstId,
			          'wrkfmShowSwftno':processinfo.wrkfmShowSwftno,
			          'workItemId':workItem.workItemId,
			          'srvReqstTypeId':processinfo.srvReqstTypeId,
			          'satisfaction':$("#res_checksatisfy").val(),
			          'dissatisfiedReason':$("#rec_satisreason").val(),
			          'remarks':$("#change_satisreasondetail").val(),
			          'content':$("#change_changedetail").val()
			  };
			  Util.ajax.postJson(
			          '/ngwf_he/front/sh/workflow!execute?uid=changComplaintType',
			          changeData, function(json, status) {
			        
			  })
		  }
		});
	return initialize;
});