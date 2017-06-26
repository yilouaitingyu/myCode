define([ 'Util',
		'text!html/serviceReq/workview/queryEvaResult.html'], function(Util,
		html_essInformation) {
	var _index;
	var _option;
	var $el;
	var acceptstaffno="acceptstaffno";

	var initialize = function(index, options) {
		$el = $(html_essInformation);
		_index = index;
		_option = options;
		var data={}
		Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getPropertiesIP',
				data,function(result,isOK){
			    console.log(result);
				if(isOK){
					crossAPI.getContact('getClientBusiInfo',function(businInfo){//获取当前通话的客户资料;（若当前无通话，则获取当前受理号码的资料）
						var telNum ="" ;//受理号码 
						if(businInfo!=undefined && businInfo.bean!=undefined && businInfo.bean.msisdn!=undefined && businInfo.bean.msisdn!=null){
							telNum=businInfo.bean.msisdn;
							$("#telNum").val(telNum);
						}
						//src='http://133.96.81.28:80/ngmttsso/hebeicrm.action?thirdSys=http://133.96.81.28:8080/csp/wh/queryEvaResult.action' ></iframe>
						var src=result.bean.ssoIpPort+"/ngmttsso/hebeicrm.action?thirdSys="
						+result.bean.oldCspIpPort+"/csp/wh/queryEvaResult.action";
						//$("#evaResult").attr("action","https://www.baidu.com");
						$("#evaResult").attr("action",src); 
						$("#evaResult").attr("target","evaResultIframe"); 
						$("#evaResult").submit();
						//$("#evaResult").attr("src",src);
					});
					
				}
		});
		this.content = $el;
	};
	return initialize;
});