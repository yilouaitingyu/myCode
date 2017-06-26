define([ 'Util',
		'text!html/serviceReq/workview/querySheetMessage.html'], function(Util,
		html_essInformation) {
	var _index;
	var _option;
	var $el;
	var initialize = function(index, options) {
		$el = $(html_essInformation);
		_index = index;
		_option = options;
		var data={};
		var acceptstaffno;
    	crossAPI.getIndexInfo(function(info){
			acceptstaffno=info.userInfo.staffId;
			//获取受理号码
			var subsnumber;
			crossAPI.getContact('getClientBusiInfo',function(businInfo){
				if(businInfo!=undefined && businInfo!="" && businInfo.bean!=undefined){
					subsnumber = businInfo.bean.msisdn;//受理号码
				}
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getPropertiesIP',
						data,function(result,isOK){
						if(isOK){
							//src='http://133.96.80.106:9000/arsys/queryManager/sheetmessage/querySheetMessage.jsp?LOGINNAME="+acceptstaffno+"&telnum="+subsnumber+"&flag=0"
							var src=result.bean.oldWorkSheetIpPort+"/arsys/queryManager/sheetmessage/querySheetMessage.jsp?LOGINNAME="+acceptstaffno+"&telnum="+subsnumber+"&flag=0";
							//$("#sheetMessage").attr("src","https://www.baidu.com");
							$("#sheetMessage").attr("src",src);
						}
				});
			});
		});
		this.content = $el;
	};
	return initialize;
});