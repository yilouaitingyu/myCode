/*nodeActionInfo :节点出入口配置 
activitygroupId : 选择的受理工作组（可多个）
activityuserId ：选择的受理人（可多个）

方法返回 json 字符串 varMap
*/
define(["jquery"],function($){
	 var vars = {
			 varsOfWorkflow : function varsOfWorkflow(nodeActionInfo,activitygroupId,activityuserId){	
					var varMap = '';
					if(nodeActionInfo.activityGroupId!=null && nodeActionInfo.activityGroupId.replace(/(^\s*)|(\s*$)/g, "")!=''){
						varMap = "{";
						var items = nodeActionInfo.activityGroupId;
						var params;
						var values = activitygroupId;
						if(items.indexOf("${")>=0 && items.indexOf("==")>=0){   //判断数据类型  ${oper=='cl'}
							params = items.substring(items.indexOf("{")+1,items.indexOf("=="));
						}else if(items.indexOf("${")>=0){                    //判断数据类型  ${oper}
							params = items.substring(items.indexOf("{")+1,items.indexOf("}"));
						}else {                                              //判断数据类型   cl
							params = items;
						}
						varMap +='"'+params+'":"'+values+'"';
						}
					if(nodeActionInfo.activityUserId!=null && nodeActionInfo.activityUserId.replace(/(^\s*)|(\s*$)/g, "")!=''){
							if(varMap=='')
							{
								varMap = "{";
							}
							else
							{
								varMap = varMap+ ",";
							}
							var items = nodeActionInfo.activityUserId;
							var params;
							var values = activityuserId;
							if(items.indexOf("${")>=0 && items.indexOf("==")>=0){
								params = items.substring(items.indexOf("{")+1,items.indexOf("=="));
							}else if(items.indexOf("${")>=0){
								params = items.substring(items.indexOf("{")+1,items.indexOf("}"));
							}else {
								params = items;
							}
							varMap +='"'+params+'":"'+values+'"';
						}
					if(nodeActionInfo.linePrerequiSite!=null && nodeActionInfo.linePrerequiSite.replace(/(^\s*)|(\s*$)/g, "")!=''){
						if(varMap=='')
						{
							varMap = "{";
						}
						else
						{
							varMap = varMap+ ",";
						}
						var items = nodeActionInfo.linePrerequiSite;
						var params;
						var values = items.substring(items.indexOf("=='")+3,
								items.indexOf("'}"));
						if(items.indexOf("${")>=0 && items.indexOf("==")>=0){
							params = items.substring(items.indexOf("{")+1,items.indexOf("=="));
						}else if(items.indexOf("${")>=0){
							params = items.substring(items.indexOf("{")+1,items.indexOf("}"));
						}else {
							params = items;
						}
						varMap +='"'+params+'":"'+values+'"';
					}
					if(nodeActionInfo.collVariable!=null && nodeActionInfo.collVariable.replace(/(^\s*)|(\s*$)/g, "")!=''){
						if(varMap=='')
						{
							varMap = "{";
						}
						else
						{
							varMap = varMap+ ",";
						}
						var items = nodeActionInfo.collVariable;
						var params;
						var values;
						if(activitygroupId!=''){
							values = '['+activitygroupId.split(",")+']';
						 }else if(activityuserId!=''){
							values = '['+activityuserId.split(",")+']';
						 }
						if(items.indexOf("${")>=0 && items.indexOf("==")>=0){
							params = items.substring(items.indexOf("{")+1,items.indexOf("=="));
						}else if(items.indexOf("${")>=0){
							params = items.substring(items.indexOf("{")+1,items.indexOf("}"));
						}else {
							params = items;
						}
						varMap +='"'+params+'":"'+values+'"';
					}
					if(varMap!="")
					{
						varMap +='}';
					}
					return varMap;
				}
	}
	return vars;
})
