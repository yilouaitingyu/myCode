define(['Util','validator','select','indexLoad',"detailPanel",
        'text!module/workflow/outlayer/supplementComplant.html','js/workflow/commonTip/commonTip'],   
	function(Util,Validator,Select,IndexLoad,DetailPanel,reject,commonTip){
	var $el;
	var _index;
	var _options;
	var handlingRole ="";
	var handlingStaff="";
	var _formValidator;
	var extdId ;
	var workItem ;
	var processinfo ;
	var commonTip = new commonTip();
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
			supplementComplant:function(){
				 
				//校验
				if(!_formValidator.form()){
					   return false;
				 }
				var workItem1=_options.workItem;
				var params1={"wrkfmShowSwftno":workItem1.wrkfmSwftno};
				//原来的投诉内容
				var cont="";
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=supplementComplant002',params1,function(result){
					 
					cont=result.beans[0].supplementComplant ;
					extdId=	result.beans[0].extdId;
					
					},true);
	        	 
				var supplementComplant = $("#supplementComplant",$el).val(); // 操作内容
	            var params ={
	            			"supplementComplant":supplementComplant,
	            			"wrkfmId":processinfo.wrkfmId,
	            			"srvReqstId":processinfo.srvReqstId,
	            			"extdId":processinfo.wrkfmId,
	            			"opTypeCd":"0017",//操作类型
	            			"workItemId":workItem.workItemId,
	            			"opStaffNum":_options.loginStaffId, //
	            			"opStaffName":_options.loginStaffName,
	            			"wrkfmShowSwftno":workItem.wrkfmSwftno,
	            			"wrkfmTypeCd":processinfo.wrkfmTypeCd,//工单类型代码 
	            			"seqprcTmpltId":processinfo.seqprcTmpltId,
	            			"nodeId":workItem.prstNodeId,
	            			"opRsnTypeCd":"补充投诉内容",
	            			"cont":cont,
	            			"opCntt":_options.loginStaffName+"【"+_options.loginStaffId+"】"+"补充投诉内容"
	            	}
	            	var cont_t=""
	            	//补充投诉内容
	            	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=supplementComplant001',params,function(result){
	            		
	            		if(result.returnCode =="0")
  						{
  							commonTip.text({text:"投诉内容补充成功"});
  						}else{
  							commonTip.text({text:"投诉内容补充失败，请稍后再试"});
  						}
	            		cont_t= result.object;
	            	},true);
	            	
	            	return cont_t;
			},
			
		    
			eventInit:function(){
				
				var workItem1=_options.workItem;
				var params={"wrkfmShowSwftno":workItem1.wrkfmSwftno};
	    	
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=supplementComplant002',params,function(result){
					 
					//$("#supplementComplant",$el).val(result.beans[0].supplementComplant) ;
					extdId=	result.beans[0].extdId;
					
					},true);
			},
			validateForm : function() {
		    	 var config = {
		    	            el: $el,
		    	            dialog:true,    //是否弹出验证结果对话框
		    	            focusNoChecked:true,
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