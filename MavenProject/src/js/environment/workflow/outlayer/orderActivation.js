define(['Util'],  
	function(Util){
		 $('#orderActivation').on('click',function(){
			 var params={
					 "wrkfmShowSwftno":"201703302206009443069641892900"
			 };
			 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=orderActivation',params,function(result){
				 console.log("Success......");
			 },true);	 
		 });
}); 