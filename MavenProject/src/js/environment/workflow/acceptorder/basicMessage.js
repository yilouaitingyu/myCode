define(['Util','list','timer','select','selectTree','date','indexLoad',
        'text!module/workflow/acceptorder/basicMessage.html'],   
	function(Util,list,Timer,Select,SelectTree,Date,IndexLoad,Html_basicMessage){
	var $el;
	var _index;
	var _options;
		var initialize = function(index, options){
			$el = $(Html_basicMessage);
			_index = index;
			_options=options;
			
			this.eventInit(this);
			this.dateInit(this);
			this.content = $el;
		};	
		$.extend(initialize.prototype, Util.eventTarget.prototype, {
			eventInit:function(){
		    		var dateagain=new Date({
		    		el:$('#aor_Basbacktime', $el),
		    		label:'',
	            	name:'datetime',    //开始日期文本框name
	            	format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
	            	defaultValue:'',     //默认日期值
					max : '2099-06-16 23:59:55',
					istime: true,    
	            	istoday: false,
	            	choose:function(){
	            	}
		    	});
			},
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
				this.loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','aor_Bassosrange');//加载紧急程度信息
				this.loadDictionary('staticDictionary_get','HEBEI.FOLLOW.HANDLE','aor_Basfollow');//加载跟进处理信息
				this.loadDictionary('staticDictionary_get','HEBEI.COMPLAIN.METHOD','aor_Basaskway');//加载投诉途径信息
				this.loadDictionary('staticDictionary_get','HEBEI.NET.TYPE','aor_Basnetclass');//加载投诉途径信息
				this.loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','aor_Basacccity');//加载投诉途径信息
				this.loadDictionary('staticDictionary_get','HEBEI.QUESTION.TYPE','aor_Basallques');//加载集中问题分类信息
				this.loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Basdif');
				this.loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Basemotion');
				this.loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Bashidename');
				this.loadDictionary('staticDictionary_get','HEBEI.ORDER.MODEL','aor_Basmodule');
		  }
		});
		


	return initialize;
	
});