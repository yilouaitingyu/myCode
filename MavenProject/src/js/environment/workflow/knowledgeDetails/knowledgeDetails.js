define(['Util','list','detailPanel','indexLoad'],   
	function(Util,list,DetailPanel,IndexLoad){
		var list;
		var json;
		var state;
		var staffId;
		var staffName;
		var staffCityName;
		IndexLoad(function(indexModule, options) {
			state=options.state;
			var params = {
		    		"serialNo":	options.serialno
		    };
			loadJson(params);
			detailPanelinfo();
			initialize();
		});
		var initialize = function(){
			eventInit();
			dateInit();
			getCurrentUser();
		};		

		var eventInit=function(){
			 if(state!='已发布'){
				 $("#knowdetail_change,#knowdetail_stop").hide();
			 }else{
				 $("#knowdetail_change,#knowdetail_stop").show();
				 $("#knowdetail_change").on('click',knowdetailModify);
				 $("#knowdetail_stop").on('click',knowdetailStop);
			 }
		};
		var dateInit = function(){
		};
		var getCurrentUser=function(){
			Util.ajax.postJson('../../../../data/userInfo.json',{},function(result){
				 staffId=result.bean.staffId;
				 staffName=result.bean.staffName;
				 staffCityName=result.bean.deptName;
			},true);
		}
//      动态获取下拉框
		//queryStaticDatadictRest
			var loadDictionary=function(mothedName,dicName,seleId){
				var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
				var seleOptions="";
				// 
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
					$.each(result.beans,function(index,bean){
						seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
					});
					$('#'+seleId).append(seleOptions);
					console.log(seleOptions);
				},true);
			};
		 //加载Json
		 var loadJson=function(params){
			 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=examinedKnowledgeDetailed',params,function(result){
				 var detail=result.bean;
				 json = {
						 colukngid:detail.colukngid,
						 serialno:detail.serialno,
						 receivecity:detail.receivecity,
						 receivephone:detail.receivephone,
						 state:detail.state,
						 acceptstaffno:detail.acceptstaffno,
						 approver:detail.approver,
						 deleteperson:detail.deleteperson,
						 lastmodifiedperson:detail.lastmodifiedperson,
						 accepttime:detail.accepttime,
						 approvetime:detail.approvetime,
						 deletetime:detail.deletetime,
						 lastmodifiedtime:detail.lastmodifiedtime
			         };
				 $("#colukngname").val(detail.colukngname);
				 $("#colukngcategory").val(detail.colukngcategory);
				 $("#keywords").val(detail.keywords);
				 $("#complaintcontenet").val(detail.complaintcontenet);
				 $("#handledetails").val(detail.handledetails);
				 $("#colukngdesc").val(detail.colukngdesc);
			 },true);
		 };
		 //知识修改
		 var knowdetailModify=function(){
			 console.log("knowdetailModify Start......");
			 var params={
				 "staffId":staffId,
				 "staffName":staffName,
				 "staffCityName":staffCityName,
				 "serialNo":json.serialno,
				 "coluKngId":json.colukngid,
				 "coluKngName":$("#colukngname").val(),
				 "coluKngCategory":$("#colukngcategory").val(),
				 "keyWords": $("#keywords").val(),
				 "complaintContenet":$("#complaintcontenet").val(),
				 "handleDetails":$("#handledetails").val(),
				 "coluKngDesc":$("#colukngdesc").val(),
				 "receivePhone":json.receivephone,
				 "receiveCity":json.receivecity,
				 "isPost":true
			 };
			 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=updateExaminedKnowledge',params,function(result){
			 var count= result.bean.count;
			 if(count>=1){
				 loadJson({"serialNo":params.serialNo});
				 detailPanelinfo();
				 dateInit();
			 }
			 console.log("knowdetailModify End......");
			 },true);
		 }
		 //知识停用
		 var knowdetailStop=function(){
			 console.log("knowdetailStop Start......");
			 var params={
					 "coluKngId":json.colukngid,
					 "serialNo":json.serialno
				 };
			 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=examinedKnowledgeStop',params,function(result){
			 var count= result.bean.count;
			 if(count>=1){
				 loadJson({"serialNo":params.serialNo});
				 detailPanelinfo();
				 state=json.state;
				 eventInit();
				 dateInit();
			 }
			 console.log("knowdetailStop End......");
			 },true);
		 }
		 //建单人信息列表
		 var detailPanelinfo = function(){
	         var starConfig = {
	             el:$("#knowDetail_message"),
	             className:'knowledgeDetails', 
	             column:4, 
	             items:[  
	                 {
	                     label:'工单知识编号',   
	                     key:'colukngid' 
	                    },
	                 {
	                     label:'关联投诉工单',
	                     key:'serialno'
	                 },
	                 {
	                     label:'受理地市',
	                     key:'receivecity'
	                 },
	                 {
	                     label:'状态',
	                     key:'state',
	                     className:'state'
	                 },
	                 {
	                     label:'建单人',
	                     key:'acceptstaffno'
	                 },
	                 {
	                     label:'审核人',
	                     key:'approver'
	                 },
	                 {
	                     label:'停用人',
	                     key:'deleteperson'
	                 },
	                 {
	                     label:'最后更新人员',
	                     key:'lastmodifiedperson'
	                 },
	                 {
	                     label:'建单时间',
	                     key:'accepttime'
	                 },
	                 {
	                     label:'审核时间',
	                     key:'approvetime'
	                 },
	                 {
	                     label:'停用时间',
	                     key:'deletetime'
	                 },
	                 {
	                     label:'最后更新时间',
	                     key:'lastmodifiedtime'
	                 },
	             ], 
	             data:json
	         }
	         var detailPanel = new DetailPanel(starConfig);

		};
});