define(['Util','validator','select','indexLoad',"detailPanel",'dialog',
        'text!module/workflow/outlayer/waitRemaind.html',
        'style!css/workflow/outlayer/reject.css'],   
	function(Util,Validator,Select,IndexLoad,DetailPanel,Dialog,remaind_context){
	var $el;
	var form1 ;
	var _formValidator;
	var _options ;
		var initialize = function(index, options){
			$el = $(remaind_context);
			_options=options;
			 
			this.width=600;
			this.height=250;
			this.eventInit();
			this.validateForm();
			this.content = $el;
		};	
		$.extend(initialize.prototype, {
			//测试
			 but_commit:function(){
			  //校验
			   			  			  
			  var opCntt = $("#opCntt",$el).val();
			  if(!_formValidator.form()){
				   return false;
			  }
			  
			  var data ={
					  'wrkfmShowSwftno' : _options.serialno,
						'workItemId' :"",
						'seqprcTmpltId' :"",  //流程模板id
						'nodeId' : "",
						'opCntt' :opCntt,
						'wrkfmId':"",
						'opStaffNum':_options.loginStaffId,
						'opStaffName':_options.loginStaffName,
						'opRsnTypeCd':"",
						'wrkfmTypeCd':"",
						'opTypeCd':"0016"  
			  }
			  var url = "/ngwf_he/front/sh/workflow!execute?uid=waitReminder";
				
			  Util.ajax.postJson(url,data,function(result,isOk) {
					if (result.returnCode=='0') {
						crossAPI.tips('催单成功!',3000)
						
					} else {
						crossAPI.tips("添加催单事由失败",3000);
					}

				});
				
			
		    },
			//下拉框加载数据字典方法
		    loadDictionary:function(mothedName,dicName,seleId){},
		    dictionaryInit: function(){},	
			eventInit:function(){
				
			
			},
			validateForm : function() {
				 
		    	
		    	 var config = {
		    	            el: $el,
		    	            dialog:true,    //是否弹出验证结果对话框
		    	            rules: {
		    	                // 主叫号码必须有,并且是手机号格式
		    	            	remaind:"required|length-300"
		    	            }, messages:{
		    	            	remaind:{
		                            "required":"催单描述不能为空",
		                            "length":"催单描述最大长度为300"
		                        }
		                    }
			    	 };
			    _formValidator = new Validator(config);
				}
		});
		
	return initialize;
});