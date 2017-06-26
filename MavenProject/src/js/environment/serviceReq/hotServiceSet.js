define( [ 'Util','validator','dialog', 'indexLoad','ajax'],
		function(Util,Validator,Dialog,IndexLoad,ajax) {
			var _index;
			var list;
			var ctiData;
			
			
			var eventInit = function() {
				$('#editBtn').on('click', editBtn);//编辑事件
			};
			//添加表单验证
			var validator = new Validator({
		    	 el: $("#hotServiceForm"),
		         dialog:false, 
		         rules:{
		        	 intervalg:"required|num1",
		        	 topn:"required|num1"
		         },
		         messages:{
		           intervalg:{ 
		        	   num1:"统计时间间隔必须为正整数的数字"
	        	   },
	        	   topn:{ 
	        		   num1:"显示前N个必须为正整数"
	        	   }
		         }
			});
			//添加验证正整数
			validator.addMethod("num1", function(str) { 
				return new RegExp("^[1-9]\\d*$").test(str.replace(/(^\s*)|(\s*$)/g,"")); 
			});
			//编辑
			var editBtn = function(){						
				$('#editBtn').addClass('editorCancle').prop("disabled",false);
				$('#hottype').attr("disabled",false);//下拉框可选
				if($('#hottype').val()!='0'){
					$('.radio').attr("disabled",false); //radio按钮 可选
					$('#intervalg').attr("disabled",false);//统计时间间隔(小时) 文本框可编辑
					$('#topn').attr("disabled",false);//显示前N个 文本框可编辑
				}
				$('#hottype').change(selectHottype);
				$('#addHotBtn').removeClass('editorCancle').addClass('btn-blue');
				$('#addHotBtn').on('click', addHotBtn);//保存事件
				$('#hotClearBtn').removeClass('editorCancle');
				$('#hotClearBtn').on('click', hotClearBtn);//重置事件
			}
			//重置
			var hotClearBtn = function(){
//				$('#hotServiceForm input').val("");
//				$("input[type='radio']").prop("checked",false);
//				$('select').find('option:first').prop("selected",true);
//				$('input').prop("disabled",false);
				queryHotinfor('0');
			}
			//选择热点类型时
			var selectHottype= function(){
				var hottype=$('#hottype').val();
				if(hottype=="0"){
					$('.radio').prop("checked",false).attr("disabled",true); //radio按钮不可选
					$('#intervalg').val("").attr("disabled",true);//统计时间间隔(小时) 清空文本框且文本框不可编辑
					$('#topn').val("").attr("disabled",true);//显示前N个 清空文本框且文本框不可编辑
				}else{
					$('.radio').attr("disabled",false); //radio按钮可选
					$('#intervalg').attr("disabled",false);//统计时间间隔(小时) 文本框可编辑
					$('#topn').attr("disabled",false);//显示前N个 文本框可编辑
					//queryHotinfor('1');
				}
				
			}
			//选中非手动型时处理
			var selectNotManual= function(){
				$('.radio').attr("disabled",false); //radio按钮可选
				$('#intervalg').attr("disabled",false);//统计时间间隔(小时) 文本框可编辑
				$('#topn').attr("disabled",false);//显示前N个 文本框可编辑
				queryHotinfor('1');
			}
			var addHotBtn = function(e) {
				var hottype=$('#hottype').val();
				if(!validator.form() && hottype!='0'){
					crossAPI.tips('表单验证失败:统计时间间隔必须为正整数的数字且显示前N个必须为正整数,请检查!',1500);
					return;
				}		
				var $form = $('#hotServiceForm');
				var addData = Util.form.serialize($("form"));
				console.log(addData);
				$('#editBtn').removeClass('editorCancle').removeProp('readonly','readonly')
				$('#addHotBtn').removeClass('btn-blue').addClass('editorCancle')
				$('#addHotBtn').off('click');//移除保存绑定事件
				$('#hotClearBtn').addClass('editorCancle');
				$('#hotClearBtn').off('click');//移除重置绑定事件
				$('#hottype').attr("disabled",true);//下拉框可选
				$('.radio').attr("disabled",true); //radio按钮 可选
				$('#intervalg').attr("disabled",true);//统计时间间隔(小时) 文本框可编辑
				$('#topn').attr("disabled",true);//显示前N个 文本框可编辑
				Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=queryHotSrTypeCfg001',function(data){
					var jsonBeans = eval(data.beans);
					if(jsonBeans.length > 0){
						//开始修改
						addData.id = ''+jsonBeans[0].id+'';//添加参数     id
						Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=updateHotSrTypeCfg001',addData,function(data){
							var rm = data.returnMessage;
							if(rm =="updateSuccess"){
								crossAPI.tips('修改成功',1500);
							}else{
								crossAPI.tips('修改失败',1500);
							}
						});
					}else{
						//开始新增
						Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=insertHotSrTypeCfg001',addData,function(data){
							var rm = data.returnMessage;
							if(rm =="addSuccess"){
								crossAPI.tips('添加成功',1500);
								_index.destroy('新增热点服务配置');
								
							}else{
								crossAPI.tips('添加失败',1500);
							}
						});
					}
				});
	
				
			}
			
			
			//type=='0'表示为刚加载页面时的初始化，type!='0'表示选择热点服务类型时的初始化
			var queryHotinfor = function(type) {
				Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=queryHotSrTypeCfg001',function(data){
					var jsonBeans = eval(data.beans);
					if(jsonBeans.length > 0){
						if(jsonBeans[0].hottype != '' && jsonBeans[0].hottype != 'null' && type=='0'){
							$("#hottype").val(jsonBeans[0].hottype);//设置value=test的项目为当前选中项
						}
						if(jsonBeans[0].hottype != '0'){
							if(jsonBeans[0].citydifference == 'Y'){
								$("input[type=radio][name='citydifference'][value='Y']").prop("checked",true);
							}else if(jsonBeans[0].citydifference == 'N'){
								$("input[type=radio][name='citydifference'][value='N']").prop("checked",true);
							}
				
							if(jsonBeans[0].isclassified == 'Y'){
								$("input[type=radio][name='isclassified'][value='Y']").prop("checked",true);
							}else if(jsonBeans[0].isclassified == 'N'){
								$("input[type=radio][name='isclassified'][value='N']").prop("checked",true);
							}
							
							if(jsonBeans[0].intervalg != '' && jsonBeans[0].intervalg != '0'){
								$("#intervalg").val(jsonBeans[0].intervalg);
							}
							if(jsonBeans[0].topn != '' && jsonBeans[0].topn != '0'){
								$("#topn").val(jsonBeans[0].topn);
							}
						}else{
							$('.radio').prop("checked",false).attr("disabled",true); //radio按钮不可选
							$('#intervalg').val("").attr("disabled",true);//统计时间间隔(小时) 清空文本框且文本框不可编辑
							$('#topn').val("").attr("disabled",true);//显示前N个 清空文本框且文本框不可编辑
						}
						
		
					}
				});
				
			};
			//实现统计时间间隔(小时)intervalg中获取动态剩余字数的实现
			//实现 显示前N个topn中获取动态剩余字数的实现
			 $(function(){
				   $('#intervalg').on('keyup',function(){
				      var intervalg = $('#intervalg').val();
				      if(intervalg > 24 ){
				    	  $('#intervalg').val("24");
				    	  crossAPI.tips('统计时间间隔需小于24,请检查!',1500);
				    	   
				      }
				    });
				   $('#topn').on('keyup',function(){
				      var topn = $('#topn').val();
				      if(topn > 20 ){
				    	  $('#topn').val("20");
				    	  crossAPI.tips('显示前N个需小于20,请检查!',1500);
				      }
				   });
			});
			IndexLoad(function(IndexModule, options){
				_index = IndexModule;
				//事件初始化
				eventInit();
				queryHotinfor('0'); //查询
			 });
		});