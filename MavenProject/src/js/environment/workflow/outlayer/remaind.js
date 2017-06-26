define(['Util','validator','select','indexLoad',"detailPanel",'dialog',
        'text!module/workflow/outlayer/remaind.html','js/workflow/commonTip/commonTip',
        'style!css/workflow/outlayer/reject.css'],   
	function(Util,Validator,Select,IndexLoad,DetailPanel,Dialog,remaind_context,commonTip){
	var $el;
	var form1 ;
	var _formValidator;
	var _options ;
	var pop = new commonTip();
		var initialize = function(data){
			$el = $(remaind_context);
			_options=data;
			this.width=600;
			this.height=250;
			this.validateForm();
			this.content = $el;
			
		};	
		$.extend(initialize.prototype, {
			
			//测试
			remaind_submit:function(){
			  //校验
			   
			  _formValidator;
			  var remaind= $("#remaind",$el).val(); 
			  if(!_formValidator.form()){
				   return false;
			  }
			  var data ={
					  'wrkfmShowSwftno' : _options.wrkfmShowSwftno,
						'workItemId' : _options.workItemId,
						'seqprcTmpltId' : _options.seqprcTmpltId,  //流程模板id
						'nodeId' : _options.nodeId,
						'opCntt' :_options.opCntt+remaind,
						'wrkfmId':_options.wrkfmId,
						'opStaffNum':_options.opStaffNum,
						'opStaffName':_options.opStaffName,
						'opRsnTypeCd':_options.opRsnTypeCd,
						'wrkfmTypeCd':_options.wrkfmTypeCd,
						'opTypeCd':_options.opTypeCd  
			  }
			  var url = "/ngwf_he/front/sh/workflow!execute?uid=reminder";
				
			  Util.ajax.postJson(url,data,function(result,isOk) {
					if (result.returnCode=='0') {
						pop.text({text:"催单成功"});
					} else {
						pop.text({text:"催单失败，请联系管理员"});
					}

				});
				
			
		    },
			//下拉框加载数据字典方法
		    loadDictionary:function(mothedName,dicName,seleId){},
		    dictionaryInit: function(){},	
			eventInit:function(){},
			
			validateForm : function() {
		    	 var config = {
		    	            el: $el,
		    	            submitBtn: $(".btnSearch", $el),
		    	            dialog:true,    //是否弹出验证结果对话框
		    	            focusNoChecked:true,
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