define([ 'Util', 'list', 'validator', 'indexLoad','date'], 
		function(Util, List,Validator, IndexLoad,MyDate) {
		var logininformation;
		var list;
		var val = '';
		var date_select;
		
		
		
		var eventInit = function() {
			/**数据字典块*/
			// 用户级别
			dictionaryNoDefault('staticDictionary_get', 'NGCS.HEYTCK.GRADE','subslevel');
			// 用户品牌
			dictionaryNoDefault('staticDictionary_get', 'HEBEI.DIC.SUBSBRAND','subsbrand');
			// 手机型号
			dictionaryNoDefault('staticDictionary_get', 'HEBEI.DIC.MOBILETYPE','mobiletype');
			// 联系方式
			dictionaryNoDefault('staticDictionary_get', 'HEBEI.TEL.TYPE','contactmode');
			// 服务等级
			dictionaryNoDefault('staticDictionary_get', 'HEBEI.DIC.SERVICELEVEL','servicelevel');
			/*// 用户归属局
			dictionaryNoDefault('staticDictionary_get', 'CSP.CI.CUSTCITYCODE','acceptcity');*/
			// 受理方式
			dictionaryNoDefault('staticDictionary_get', 'HEBEI.DIC.ACCEPTMODE','acceptmode');
			// 受理渠道
			dictionaryNoDefault('staticDictionary_get', 'HEBEI.DIC.CONTACTCHANNEL','contactchannel');
			// 业务地市
			dictionaryNoDefault('staticDictionary_get', 'NGCS.HEYTCK.CITYCODE','faultlocation');
			/*// 语种
			dictionaryNoDefault('staticDictionary_get', 'CSP.PUB.LANGUAGE','languageid');*/
			// 紧急程度
			dictionaryNoDefault('staticDictionary_get', 'HEBEI.EDUCATION.TYPE','urgentid');
			// 重要程度
			dictionaryNoDefault('staticDictionary_get', 'CSP.PUB.IMPACT','impactid');
			// 优先级
			dictionaryNoDefault('staticDictionary_get', 'HEBEI.DIC.PRIORITYID','priorityid');
			// 用户归属地
			dictionaryNoDefault('staticDictionary_get', 'NGCS.HEYTCK.CITYCODE','subscity');
			/**初始化from表单*/
			dataAll(shujidate);
			/**文本框设为只读*/
			$("input").prop("disabled",true);// 设置为只读
			$("textarea").prop("disabled",true);//业务内容只读
			$("select").prop("disabled", true);//下拉选失效
			$("#repeatflag1").prop("disabled", true);//复选失效
			
			$("#saveid").prop("disabled",true);
			$("#cleardate").prop("disabled",true);
			$('#cancle').prop("disabled",true);
			
			$("#guaqi").on("click", editbtn);//编辑
			$('#cancle').on('click',qixiaobnt);//取消
			$("#cleardate").on("click", resetForm);//重置
			$("#repeatflag1").on("click", fuxuan);
			$("#urgentid").on("change",urgent);//紧急度
			$("#impactid").on("change",impact);//影响
		}
		
		/**使Enter键失效的方法*/
		var loseEnter = function() {
			  if(event.keyCode==13)
		           return false;
			}
		
		/**表单验证*/
		var validator = new Validator({
	    	 el: $("form"),
	         dialog:false, 
	         rules:{
	        	 callerno:"number2",
	        	 contactphone1:"number2",
	        	 contactphone2:"number2",
	        	 subsnumber:"number2",
	        	 email:"email",
	        	 subslevel:"required",
	        	 priorityid:"required",
	        	 accepttime:"required"
	         },
			messages:{
				contactphone1:{ 
					//dianhua:"联系电话必须为固话或手机号"
					number2:"只能输入数字，长度20位以内"
	     	    },
	     	    contactphone2:{ 
	     	    	 number2:"只能输入数字，长度20位以内"
	     	    },
	     	    callerno:{
	     	    	number2:"只能输入数字，长度20位以内"
	     	    },
	     	    subsnumber:{
	     		  number2:"只能输入数字，长度20位以内"
	     	    }
		   }
		})
		//添加验证正固话或手机号
		/*validator.addMethod("dianhua", function(str) { 
			return new RegExp("^0?(13|15|17|18|14)[0-9]{9}|\d{3}-\d{8}|\d{4}-\d{7}$").test(str.replace(/(^\s*)|(\s*$)/g,"")); 
		});*/
		validator.addMethod("number2", function(str) { return new RegExp("^[0-9]{0,20}$").test(str); });
		
		var urgent = function(){
			if($(this).val()=="00006001"){
				$("#priorityid").val("00008001");
				$("#impactid").val("00007001");
			}
			if($(this).val()=="00006002"){
				$("#priorityid").val("00008002");
				$("#impactid").val("00007002");
			}
			if($(this).val()=="00006003"){
				$("#priorityid").val("00008003");
				$("#impactid").val("00007003");
			}
			if($(this).val()=="00006004"){
				$("#priorityid").val("00008004");
				$("#impactid").val("00007004");
			}
		}
		var impact = function(){
			if($(this).val()=="00007001"){
				$("#priorityid").val("00008001");
				$("#urgentid").val("00006001");
			}
			if($(this).val()=="00007002"){
				$("#priorityid").val("00008002");
				$("#urgentid").val("00006002");
			}
			if($(this).val()=="00007003"){
				$("#priorityid").val("00008003");
				$("#urgentid").val("00006003");
			}
			if($(this).val()=="00007004"){
				$("#priorityid").val("00008004");
				$("#urgentid").val("00006004");
			}
		}
			
		/**递归判断*/
		var retu = function(data){
			$.each(data,function(i,bean){
				if(bean.children){
					retu(bean.children);
				}else {
	     		    if(shujidate.custBean[0].acceptstaffdept == bean.id) {
	     		    	val = bean.name;
	     		    	return false;
    		    	}
				}
				if(''!= val) {
					return false;
				}
		 	})
		}
		
		/**工作部门*/
		var dept = function(deptId){
			var params = {
				 deptId:deptId
	  		}
			Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getOrgaInfoAccordOrgaId01',params,function(data){
				if(data.bean.deptName!=null && data.bean.deptName!=undefined && data.bean.deptName!=""){
					val= data.bean.deptName;
				}else{
					val= "";
				}
			},true)
			return val;
		}
		
		/**表单赋值*/
		var dataAll = function(options) {
			val = dept(options.custBean[0].acceptstaffdept);
			if(options.custBean.length>0){
			// 用户姓名
			if(options.custBean[0].subsname==undefined){
				$('#subsname').val('');
			}else{
				$('#subsname').val(options.custBean[0].subsname);
			}
			// 受理号码
			$('#subsnumber').val(options.custBean[0].subsnumber);
			// 主叫号码
			$('#callerno').val(options.custBean[0].callerno);
			// 联系电话1
			$('#contactphone1').val(options.custBean[0].contactphone1);
			// 联系人
			$('#contactperson').val(options.custBean[0].contactperson);
			// 用户级别
			if(options.custBean[0].subslevel=='undefined'){
				$('#subslevel').val('');
			}else{
				$('#subslevel').val(options.custBean[0].subslevel);
			}
			// 用户品牌
			if(options.custBean[0].subsbrand=='undefined'){
				$('#subsbrand').val('');
			}else{
				$('#subsbrand').val(options.custBean[0].subsbrand);
			}
			// 联系电话2
			$('#contactphone2').val(options.custBean[0].contactphone2);
			// 手机型号
			$('#mobiletype').val(options.custBean[0].mobiletype);
			$('#mobiletype').attr('val',options.custBean[0].mobiletype);
			// 联系方式
			$('#contactmode').val(options.custBean[0].contactmode);
			$('#contactmode').attr('val',options.custBean[0].contactmode);
			// 服务等级
			$('#servicelevel').val(options.custBean[0].servicelevel);
			// 用户归属地
			if(options.custBean[0].subscity=='undefined'){
				$('#subscity').val('');
			}else{
				$('#subscity').val(options.custBean[0].subscity);
				$('#subscity').attr("val",options.custBean[0].subscity);
			}
			// 用户归属局
			if(options.custBean[0].acceptcity=='undefined'){
				$('#acceptcity').val('');
			}else{
				$('#acceptcity').val(options.custBean[0].acceptcity);
			}
			// 电子邮件
			$('#email').val(options.custBean[0].email);
			// 联系地址
			$('#address').val(options.custBean[0].address);
			// 服务标题
			$('#servicetitle').val(options.custBean[0].servicetitle);
			// 请求编码
			$('#id').val(options.custBean[0].id);
			$('#serviceid').attr("value",options.custBean[0].serviceid);
			$("#serviceid").prop("readonly", "readonly");
			// 受理工号
			$('#acceptstaffno').val(options.custBean[0].acceptstaffno);
			// 受理部门
			$('#acceptstaffdept').val(val);
			// 受理时间
			$("input[name='accepttime']").val(options.custBean[0].accepttime);
			// 受理方式
			$('#acceptmode').val(options.custBean[0].acceptmode);
			// 受理渠道
			$('#contactchannel').val(options.custBean[0].contactchannel);
			// 业务地市
			$('#faultlocation').val(options.custBean[0].faultlocation);
			// 语种
			$('#languageid').val(options.custBean[0].languageid);
			// 紧急程度
			$('#urgentid').val(options.custBean[0].urgentid);
			$('#urgentid').attr('val',options.custBean[0].urgentid);
			// 重要程度 impactid
			$('#impactid').val(options.custBean[0].impactid);
			// 优先级
			$('#priorityid').val(options.custBean[0].priorityid);
			//反馈时间设置
			if($("input[name='factfeedbacktime']").val()==""){
				if(options.custBean[0].factfeedbacktime!=undefined){
					$("input[name='factfeedbacktime']").val(options.custBean[0].factfeedbacktime);
				}else{
					var bTime=shujidate.custBean[0].accepttime;
					var timePar = bTime.split(' ');
			        var timeDate = timePar[0].split('-');
			        bTime = timeDate[1]+'/'+timeDate[2]+'/'+timeDate[0];
			        var date2 = new Date(bTime);
			        var timeHour = timePar[1].split(':');
			        date2.setHours(timeHour[0], timeHour[1],timeHour[2]);
					date2.setDate(date2.getDate()+2);
					$("input[name='factfeedbacktime']").val(date2.format("yyyy-MM-dd hh:mm:ss"));
				}
			}
			$("#factfeedbacktime").val($("input[name='factfeedbacktime']").val());
			// 重复标记
			if(options.custBean[0].repeatflag){
				if (options.custBean[0].repeatflag != null) {
					if (options.custBean[0].repeatflag.indexOf("N")>-1) {
						$("#repeatflag1").prop("checked", false);
						$('#repeatflag').val(options.custBean[0].repeatflag);
					} else {
						$("#repeatflag1").prop("checked", true);
						$('#repeatflag').val(options.custBean[0].repeatflag);
					}
				}
			}else{
				$("#repeatflag1").prop("checked", false);
			}
			$('#commonlanguage').val(options.custBean[0].commonlanguage);
			$('#specialrequirements').val(options.custBean[0].specialrequirements);
			// 业务内容
			$('#servicecontent').val(options.custBean[0].servicecontent);
			// 特殊要求 和常用语待定 serviceinfochar004
			//$('#serviceinfochar004').val(options.custBean[0].serviceinfochar004);
			$('#serviceinfochar003').val(options.custBean[0].serviceinfochar003);
			}
			else{
				crossAPI.tips("未查询到数据",1500);
			}
		}
		
		/**格式化日期*/
		Date.prototype.format = function(format){ 
			var o = { 
					"M+" : this.getMonth()+1,
					"d+" : this.getDate(),
					"h+" : this.getHours(), 
					"m+" : this.getMinutes(),
					"s+" : this.getSeconds(),
					"q+" : Math.floor((this.getMonth()+3)/3),
					"S" : this.getMilliseconds() 
			} 
	
			if(/(y+)/.test(format)) { 
				format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
			} 
	
			for(var k in o) { 
				if(new RegExp("("+ k +")").test(format)) { 
					format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
				} 
			} 
			return format; 
		}
		
		/*var insterlog = function() {
			var paramsdata = Util.form.serialize($("#reqeryForm"));
			//paramsdata.logininformation=logininformation;
			Util.ajax.postJson('/ngwf_he/front/sh/serviceReqDetail!execute?uid=insertNumber',paramsdata, function(data) {
				if (data.returnMessage == "true") {
					// crossAPI.tips('更新成功1',1000);
				} else {
					// crossAPI.tips('更新失败1',1000);
				}
			})
		}*/
		
		/**更新数据*/
		var upnumber = function() {
			var paramsdata = Util.form.serialize($("#reqeryForm"));
			paramsdata.acceptstaffdept = shujidate.custBean[0].acceptstaffdept;
			paramsdata.factfeedbacktime=$("input[name='factfeedbacktime']").val();
			if((!paramsdata.subscity || paramsdata.subscity == "") && $("#subscity").val() != "请选择"){
				paramsdata.subscity = $("#subscity").attr('val');
			}
			if((!paramsdata.urgentid || paramsdata.urgentid == "") && $("#urgentid").val() != "请选择"){
				paramsdata.urgentid = $("#urgentid").attr('val');
			}
			if((!paramsdata.contactmode || paramsdata.contactmode == "") && $("#contactmode").val() != "请选择"){
				paramsdata.contactmode = $("#contactmode").attr('val');
			}
			if((!paramsdata.mobiletype || paramsdata.mobiletype == "") && $("#mobiletype").val() != "请选择"){
				paramsdata.mobiletype = $("#mobiletype").attr('val');
			}
			
			debugger;
			var xuanzf=$("#subslevel option:selected").text();
			if(xuanzf==""){
				crossAPI.tips("请选择用户级别",1500);
				return;
			}
			if(!validator.form()){
				crossAPI.tips('请完善信息',1500);
				return;
			}
			var start=new Date(getNowFormatDate().replace("-", "/").replace("-", "/"));
			var end="";
			var bak_time = $("input[name='factfeedbacktime']").val();
			if(bak_time!=""){
				 end = new Date(($("input[name='factfeedbacktime']").val()).replace("-", "/").replace("-", "/"));
				 if(end<start){
					crossAPI.tips('反馈时间不能小于当前时间', 1500);
					return;
				}
			}else{
				/*var time =new Date(shujidate.custBean[0].accepttime);
				time.setDate(time.getDate()+2);
				paramsdata.factfeedbacktime = getNowFormatDate2(time);*/
				paramsdata.factfeedbacktime = date_select ;
			}
			
			/**保存修改日志*/
			Util.ajax.postJson('/ngwf_he/front/sh/serviceReqDetail!execute?uid=updateNumber',paramsdata, function(data) {
				if (data.returnMessage == "true") {
					shujidate.custBean[0]= paramsdata;
					dataAll(shujidate);
					crossAPI.tips('保存成功', 1500);
				} else {
					crossAPI.tips('服务器繁忙', 1500);
				}
			},true)
			$("#saveid").off('click');
			$('.jf-form-item li div input').css('border','none')
			$('.jf-form-item li div select ').css('border','none')
			$('.jf-form-item li div textarea').css('border','none')
			$("#saveid").removeClass('blueBtn').prop("disabled",true);
			$("#cleardate").addClass('guaqiDiv').removeClass('btn-Export').prop("disabled",true);
			$('#cancle').addClass('guaqiDiv').removeClass('btn-Export').prop("disabled",true);
			$('#guaqi').removeClass('guaqiDiv').prop("disabled",false);
			$("textarea").prop("disabled",true);
			$("input").prop("disabled",true);// 设置为只读
			$("select").prop("disabled", true);
			$("#repeatflag1").prop("disabled", true);
			$("input[name='factfeedbacktime']").attr("disabled",true);
			$("input[name='accepttime']").attr("disabled",true);
			$('#reqeryForm .mask').show();
			$('.jf-form-item li label').css('color','#bfbfbf');
			$('.wordNum').hide();
		}
		/**编辑功能*/
		 function  editbtn() {	
			 if(shujidate.custBean[0].acceptstaffno==logininformation.staffId){
			$('.jf-form-item li div input').css('border','1px solid #cfd6d9');
			$('.jf-form-item li div select ').css('border','1px solid #cfd6d9');
			$('.jf-form-item li div textarea').css('border','1px solid #cfd6d9');
			$("#saveid").addClass('blueBtn').prop('disabled',false);
			$("#cleardate").addClass('btn-Export').removeClass('guaqiDiv').prop('disabled',false);
			$('#cancle').addClass('btn-Export').removeClass('guaqiDiv').prop('disabled',false);
			$('#guaqi').addClass('guaqiDiv').prop("disabled",true);
			$("select").prop("disabled", false);
			$("input").removeAttr("disabled");
			$("#serviceid").prop("readonly", "readonly");//请求编号不可编辑
			$("#acceptstaffdept").prop("readonly", "readonly");//受理部门不可手动编辑
			$("#acceptstaffno").prop("readonly", "readonly");//受理工号不可编辑
			
			
			$("textarea").removeAttr("disabled");
			$("#repeatflag1").prop("disabled", false);
			$("#saveid").on("click", upnumber);//保存修改
			$('#reqeryForm .mask').hide();
			$('.wordNum').show();
			$('#wordNum').text(100 -$('#servicecontent').val().length);
			
			/**格式化日期*/
			Date.prototype.format = function(format){ 
				var o = { 
						"M+" : this.getMonth()+1, //month 
						"d+" : this.getDate(), //day 
						"h+" : this.getHours(), //hour 
						"m+" : this.getMinutes(), //minute 
						"s+" : this.getSeconds(), //second 
						"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
						"S" : this.getMilliseconds() //millisecond 
				} 

				if(/(y+)/.test(format)) { 
					format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
				} 

				for(var k in o) { 
					if(new RegExp("("+ k +")").test(format)) { 
						format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
					} 
				} 
				return format; 
			}
			
			/**判断反馈时间*/
			if(shujidate.custBean[0].factfeedbacktime !=undefined){
				var bTime=shujidate.custBean[0].factfeedbacktime;
				var timePar = bTime.split(' ');
		        var timeDate = timePar[0].split('-');
		        bTime = timeDate[1]+'/'+timeDate[2]+'/'+timeDate[0];
		        var date2 = new Date(bTime);
			    var timeHour = timePar[1].split(':');
			    date2.setHours(timeHour[0], timeHour[1],timeHour[2]);
			}
			else{
				var bTime=shujidate.custBean[0].accepttime;
				var timePar = bTime.split(' ');
		        var timeDate = timePar[0].split('-');
		        bTime = timeDate[1]+'/'+timeDate[2]+'/'+timeDate[0];
		        var date2 = new Date(bTime);
			    var timeHour = timePar[1].split(':');
			    date2.setHours(timeHour[0], timeHour[1],timeHour[2]);
				date2.setDate(date2.getDate()+2);
		       
			}
		    date_select =date2.format("yyyy-MM-dd hh:mm:ss");
			var datechusi1 = new MyDate({
				el:$('#factfeedbacktime1'),
				label:'反馈时间',
		        name:'factfeedbacktime', 
		        format: 'YYYY-MM-DD hh:mm:ss', 
		        defaultValue:date_select,
		        istime: true,
		        istoday: true,
		        choose:function(){
		        	//$("input[name='factfeedbacktime']").val(date_select);	
		        } //用户选中日期时执行的回调函数
		        
		    });
			$('.bg-date').css('border','1px solid #cfd6d9');
			$("#handlingstaffno").val(logininformation.staffId);
			$("#handlingstaffname").val(logininformation.staffName);
		 }else{
			 crossAPI.tips("只能编辑当前处理号对应详情",1500);
		 }
			 $('.jf-form-item li label').css('color','#222')
		}
		
		/**获取当前时间*/
		var getNowFormatDate=function() {
		    var date = new Date();
		    date.setDate(date.getDate());
		    var seperator1 = "-";
		    var seperator2 = ":";
		    var month = (date.getMonth() + 1) <=9 ? '0' +(date.getMonth() + 1) : (date.getMonth() + 1);
		    var strDate = date.getDate() <=9 ? '0'+date.getDate() : date.getDate();
		    var hours = date.getHours() <=9 ? '0'+date.getHours() : date.getHours();
		    var minutes = date.getMinutes() <=9 ? '0'+date.getMinutes() : date.getMinutes();
		    var seconds = date.getSeconds() <=9 ? '0'+date.getSeconds() : date.getSeconds();
		    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		            + " " + hours + seperator2 + minutes + seperator2 + seconds;
		    return currentdate;
		}
		/**获取当前时间2*/
		var getNowFormatDate2 = function(date) {
		    var seperator1 = "-";
		    var seperator2 = ":";
		    var month = (date.getMonth() + 1) <=9 ? '0' +(date.getMonth() + 1) : (date.getMonth() + 1);
		    var strDate = date.getDate() <=9 ? '0'+date.getDate() : date.getDate();
		    var hours = date.getHours() <=9 ? '0'+date.getHours() : date.getHours();
		    var minutes = date.getMinutes() <=9 ? '0'+date.getMinutes() : date.getMinutes();
		    var seconds = date.getSeconds() <=9 ? '0'+date.getSeconds() : date.getSeconds();
		    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		            + " " + hours + seperator2 + minutes + seperator2 + seconds;
		    return currentdate;
		}
		
		/**复选框事件*/ 
		var fuxuan = function() {
			if ($('#repeatflag1').is(':checked')) {
				$('#repeatflag').val("Y");
			} else {
				$('#repeatflag').val("N");
			}
		}
		
		/**取消按钮*/
		var qixiaobnt=function(){
			dataAll(shujidate);
		    $('.jf-form-item li div input').css('border','none');
			$('.jf-form-item li div select ').css('border','none');
			$('.jf-form-item li div textarea').css('border','none');
			$("#saveid").removeClass('blueBtn').prop("disabled",true);
			$("#cleardate").addClass('guaqiDiv').removeClass('btn-Export').prop("disabled",true);
			$('#cancle').addClass('guaqiDiv').removeClass('btn-Export').prop("disabled",true);
			$('#guaqi').removeClass('guaqiDiv').prop("disabled",false);
			$("textarea").prop("disabled",true);
			$("input").prop("disabled",true);// 设置为只读
			$("select").prop("disabled", true);
			//复选失效
			$("#repeatflag1").prop("disabled", true);
			$("input[name='factfeedbacktime']").attr("disabled",true);
			$("input[name='accepttime']").attr("disabled",true);
			$('#reqeryForm .mask').show()
			$('.jf-form-item li label').css('color','#bfbfbf');
			$('.wordNum').hide();
			
			$("#saveid").unbind();
		}
		
		/**重置功能*/
		var resetForm = function() {
			dataAll(shujidate);
			//$("input[name='factfeedbacktime']").val(date2.format("yyyy-MM-dd hh:mm:ss"));
		}
		
		/**加载数据字典(无默认值)*/ 
		var dictionaryNoDefault = function(mythod, typeId, selId) {
			var params = {
				method : mythod,
				paramDatas : '{typeId:"' + typeId + '"}'
			}
			var optionDic = "<option value=''>请选择</option>";
			Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getDic01',params, function(result) {
				$.each(result.beans, function(index, bean) {
					optionDic += "<option value='" + bean.value + "'>"
							+ bean.name + "</option>";
				})
				$("#" + selId).append(optionDic);
			}, true)
		}
		
		/**统计字数 start*/
		var countWords=function(){
			var $len = $.trim($('#servicecontent').val()).length;
			var numbers = 100 - $len;
			if(numbers >= 0){
				$('#wordNum').text(numbers);			
			}else{
				var str = $('#servicecontent').val()
				$('#servicecontent').val(str.substring(0,100));
			}
		}
		
	    $('#servicecontent').on('focus',function(){
	    	clearInterval(timer);
	        var timer = setInterval(countWords,20);
	    })
		/**统计字数 end*/
	    
		IndexLoad(function(IndexModule, options) {
			//去除页面backSpace键回退时间
			document.onkeydown =function (e) {  
                var code,type;     
                if (!e){ var e = window.event;}     
                if (e.keyCode){ code = e.keyCode;}  
                else if (e.which){ code = e.which;}  
                type = event.srcElement.type;  
                if ((code == 8)  
                  && ((type != "text" && type != "textarea"   
                  &&type != "password") ||  event.srcElement.readOnly == true)) {  
                      event.keyCode = 0;  
                      event.returnValue = false;  
                }  
                return true;  
            }  
		    logininformation=IndexModule.getUserInfo();
		    loseEnter();
			shujidate = options;
			eventInit();

		})
})