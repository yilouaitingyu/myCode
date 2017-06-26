define(['require','Util'],function(require,Util){
	// 添加时间对象原形.设置时间格式;
	Date.prototype.Format = function(fmt) { // author: meizz
		var o = {
			"M+" : this.getMonth() + 1, // 月份
			"d+" : this.getDate(), // 日
			"h+" : this.getHours(), // 小时
			"m+" : this.getMinutes(), // 分
			"s+" : this.getSeconds(), // 秒
			"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
			"S" : this.getMilliseconds() // 毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
					.substr(4 - RegExp.$1.length));
		for ( var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1,
						(RegExp.$1.length == 1) ? (o[k])
								: (("00" + o[k])
										.substr(("" + o[k]).length)));
		return fmt;
	}
	
})
gotoPage=function(){
	var data="";
	$(".t-tabs-items > li").click(function(){
		data=$(this).children("a").attr("data");
		crossAPI.destroyTab('工单管理');
		if(data=="waitHandlePool"){
			crossAPI.createTab('工单管理', getBaseUrl()+'/ngwf_he/src/module/workflow/query/waitHandlePool.html');
		}
		if(data=="waitHandle"){
			crossAPI.createTab('工单管理', getBaseUrl()+'/ngwf_he/src/module/workflow/query/waitHandle.html');
		}
		if(data=="orderInfoQuery"){
			crossAPI.createTab('工单管理', getBaseUrl()+'/ngwf_he/src/module/workflow/query/orderInfoQuery.html');
		}
		if(data=="groupReport"){
			crossAPI.createTab('工单管理', getBaseUrl()+'/ngwf_he/src/module/workflow/query/groupReport.html');
		}
	});
}

var getBaseUrl = function () {
	var ishttps = 'https:' == document.location.protocol ? true: false;
	var url = window.location.host;
	if(ishttps){
		url = 'https://' + url;
	}else{
		url = 'http://' + url;
	}
	return url;
}


//组装数据字典对象
var wrapDictionray=function(dicName){
	var params = {
			method : "staticDictionary_get",
			paramDatas : '{typeId:"' + dicName + '"}'
		};
	var obj={};
	$.ajax({
		url:"/ngwf_he/front/sh/common!execute?uid=callCSF",
		dataType:"json",
		data:params,
		async:false,
		success:function(result){
			$.each(result.beans, function(index, bean) {
				obj[bean.value]=bean.name;
			});
		}
	});
	return obj;
}
var getUserInfo=function(){
	var currentUser={};
	return currentUser;
}

