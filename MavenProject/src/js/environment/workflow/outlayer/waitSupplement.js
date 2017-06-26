define(['Util','validator','select','indexLoad',"detailPanel",
        'text!module/workflow/outlayer/waitSupplement.html'],   
	function(Util,Validator,Select,IndexLoad,DetailPanel,reject){
	var $el;
	var _index;
	var _options;
	var handlingRole ="";
	var handlingStaff="";
	
	
	var initialize = function(index, options){
			$el = $(reject);
			_index = index;
			_options=options;
			workItem =_options.workItem;
			processinfo =_options.processinfo;
			this.eventInit();
			this.validateForm();
			this.content = $el;
		};	
		$.extend(initialize.prototype, {
			//测试
			but_commit:function(){
			
				var opCntt = $("#supplementComplant",$el).val(); // 操作内容
				if(!_formValidator.form()){
					   return false;
				 }
	            var params ={
	            			"supplementComplant":opCntt,
	            			"wrkfmId":"",
	            			"srvReqstId":"",
	            			"extdId":"",
	            			"opTypeCd":"0017",//操作类型
	            			"workItemId":"",
	            			"opStaffNum":_options.loginStaffId, //
	            			"opStaffName":_options.loginStaffName,
	            			"wrkfmShowSwftno":_options.serialno,
	            			"wrkfmTypeCd":"",//工单类型代码 
	            			"seqprcTmpltId":"",
	            			"nodeId":"",
	            			"opRsnTypeCd":"补充投诉内容",
	            			"cont":"",
	            			"opCntt":_options.loginStaffName+"【"+_options.loginStaffId+"】"+"补充投诉内容"
	            	}
	            	var cont_t=""
	            	//补充投诉内容
	            	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=waitSupplement',params,function(result){
	            		
	            		if(result.returnCode =="0")
  						{
  							crossAPI.tips("投诉内容补充成功。",3000);
  						}else{
  							crossAPI.tips("投诉内容补充失败，请稍后再试。",3000);
  						}
	            		cont_t= result.object;
	            	},true);
	            	
	            	return cont_t;
			},
			
		    
			eventInit:function(){
				
				var workItem1=_options.workItem;
				var params={"wrkfmShowSwftno":workItem1.wrkfmSwftno};
	    	
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=supplementComplant002',params,function(result){
					extdId=	result.beans[0].extdId;
					
					},true);
			},
			validateForm : function() {
		    	 var config = {
		    	            el: $el,
		    	            dialog:true,    //是否弹出验证结果对话框
		    	            rules: {
		    	                // 主叫号码必须有,并且是手机号格式
		    	            	supplementComplant:"required|length-30"
		    	            },
		    	            messages:{
		    	            	supplementComplant:{
		                            "required":"投诉内容不能为空",
		                            "length":"投诉内容长度最大为30"
		                        }
		                    }
		    	 
			    	 };
		    	 
			    _formValidator = new Validator(config);
				}
		});
		
	return initialize;
});