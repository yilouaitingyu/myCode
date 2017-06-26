/*
arrayIndexOf : 选择的受理工作组（可多个）
activityuserId ：选择的受理人（可多个）

方法返回 json 字符串 varMap
*/
define(['Util',"jquery"],function(Until,$){
	var commonCopact = {
			arrayIndexOf:function(){
				if (!Array.prototype.indexOf)
				{
				  Array.prototype.indexOf = function(elt /*, from*/)
				  {
				    var len = this.length >>> 0;
				    var from = Number(arguments[1]) || 0;
				    from = (from < 0)
				         ? Math.ceil(from)
				         : Math.floor(from);
				    if (from < 0)
				      from += len;
				    for (; from < len; from++)
				    {
				      if (from in this &&
				          this[from] === elt)
				        return from;
				    }
				    return -1;
				  };
				}
			},
	};
	return vars;
})
