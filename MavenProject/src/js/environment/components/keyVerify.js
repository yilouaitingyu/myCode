define(['Util'],
		function(Util){
	
	//var ritCheck= function (authIdInput){
	var ritCheck= function (authIdInput,staffId){
	//	var staffId="";
		var flag ="0";
	//	crossAPI.getIndexInfo(function(info){
		//	debugger;
		//	console.log("1");
		//	console.log(info.userInfo);
		//	debugger;
		//	console.log("2");
		//	staffId=info.userInfo.staffId;
		//	console.log(staffId);
			var queryIntfs = Util.ajax.postJson(
					'/ngwf_he/front/sh/sendMSG!execute?uid=getAuthId',
					{"staffId":staffId},function(json,status){
						var verResult="";
						console.log("3");
						console.log(json);
						if(json!=null&&json!=undefined&&json!=""){
							
							for(var i=0;i<json.beans.length;i++){
								var authIdValue = json.beans[i].authId;
								if(authIdValue == authIdInput) //权限地判断
								{
									flag="1";
									break;
								}else
								{
									flag="0";
								}
							}
						
						}
					
					},true);
			return flag;
//		});
		
	}
	return ritCheck;
});