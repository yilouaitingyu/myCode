define(['Util','list'],   
	function(Util,List){
		var list;
		var initialize = function(){
		    	eventInit();
		    	};		
		
		 var eventInit=function(){
			
			 $('#knowledge_Search').on('click',knowledgeInfo);
			 $('#knowledge_Reset').on('click',resetInfo);
			  };
		
		//字典
			var loadDictionary=function(mothedName,dicName,seleId){
						var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
						var seleOptions="";
						Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
							$.each(result.beans,function(index,bean){
								//品牌工单中保存的是品牌名{
								if("subsbrand"==seleId){
									seleOptions+="<option  value='"+bean.name+"'>"+bean.name+"</option>";
								}
									else
										seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"	
							});
							$('#'+seleId).append(seleOptions);
							console.log(seleOptions);
						},true);
					};
		 
		 //重置按钮
		 var resetInfo = function (){		 	
			 $("input[name='colukngname']")[0].value='';
			 $("select[name='colukngcategory']")[0].value='';
			 $("input[name='keywords']")[0].value='';
			 $("input[name='complaintcontenet']")[0].value='';
			 $("input[name='city']")[0].value='';
			 $("input[name='operatingunit']")[0].value='';
				
		 };
		 //查询按钮事件
		 var knowledgeInfo = function (){
			 var colukngname = $("input[name='colukngname']")[0].value;
			 var colukngcategory = $("select[name='colukngcategory']")[0].value;
			 var keywords = $("input[name='keywords']")[0].value;
			 var complaintcontenet = $("input[name='complaintcontenet']")[0].value;
			 var city = $("input[name='city']")[0].value;
			 var operatingunit = $("input[name='operatingunit']")[0].value;
			 var data = {
					"colukngname":colukngname,
					"colukngcategory": colukngcategory,
					"keywords": keywords,
					"complaintcontenet": complaintcontenet,
					"city":city,
					"operatingunit":operatingunit
			 };
			 //ctiList(data);
		 };
		
		return initialize();
});