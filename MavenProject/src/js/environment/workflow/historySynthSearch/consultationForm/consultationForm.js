define(['Util','timer','validator','select','selectTree','date','indexLoad',"detailPanel",
        'text!module/workflow/consultationForm/consultationForm.html',
        'style!css/workflow/consultationForm/consultationForm.css'],   
	function(Util,Timer,Validator,Select,SelectTree,Date,IndexLoad,DetailPanel,Html_basicMessage){
	var $el;
	var _index;
	var _options;
	var  jintuiliangnan;
		var initialize = function(index, options){
			$el = $(Html_basicMessage);
			_index = index;
			_options=options;
			this.eventInit(this);
			this.dateInit();
			this.content = $el;
			this.regular();
			this.getValue();
			this.content = $el;
		};	
		$.extend(initialize.prototype, Util.eventTarget.prototype, {
			eventInit:function(){
	    		var dateagain=new Date({
	    		el:$('#faf_Basbacktime', $el),
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
			//添加正则验证的函数

			 regular: function(){
			 	 var config = {
                            el:$('#forms',$el),
                            submitBtn: $("#aor_Send"),    //触发验证的按钮，可不配置
                            dialog:true,    //是否弹出验证结果对话框
                            rules:{
                                callerno:"required|mobile",  //主叫号码必须有,并且是手机号格式
				                acceptstaffno:"required",           //受理工号.必须有
				                subslevel:"required",       //客户级别必须有;
				                acceptmode:"required",      //受理方式
				                subsname:"required",        //客户名字
				                contactphone1:'required|mobile', //联系电话1,必须有并且是手机号
				                subsprovince:"required",      //客户省份
				                subscity:"required",          //客户地市
				                furtherhandle:"required",     // 跟进处理
				                complainway:"required",       // 投诉途径
				                nettype:"required",           //网络类别
				                acceptcity:"required",        //受理地市
				                subordinatecounties:"required",  //下级县区输入框验证
				                potentialupgradeflag:"required",  //是否潜在升级
				                focusproblemtype :"required",     //集中问题分类
				                businesshallrelate:"required",   //营业厅相关
				                subsnumbersite:"required",       //受理号码归属地
				                complaincontent:"required|min-10", // 投诉内容
				                content:"required|min-10"           //设置name=content 的元素为必填项，并且字数不能小于10
                            },
                            messages:{
                                time:{ //设置name=startTime 元素的消息
                                    required:"",            //用户未填写该字段时提示
                                    date:"开始日期格式不正确"    //日期格式验证失败时提示
                                },
                                content:{
                                    min:"内容输入字数不能少于10"
                                }
                            }
                       };
                        var form = new Validator(config);
                        $("#aor_Send").click(function(){
                        if(form.form()){
				                  $('.t-popup').addClass('show').removeClass('hide'); 
					    		  }else{
					    		  	return;}
                        });
			 },
			//信息列表
			
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
		    getValue:function(){
		    	var  data={serviceid:"123",uploadstaff:"456"};
		    	$(".requestForm").data("mydata",data);
		    	console.log($(".requestForm").data("mydata"));
		    },
			dateInit : function(){
				this.loadDictionary('staticDictionary_get','CSP.PUB.PROVINCE','aor_Basserpri');//加载省份信息
	    	    this.loadDictionary('staticDictionary_get','HEBEI.CUSTOM.CITY','aor_Bassercity');//加载客户地市信息
	    	    this.loadDictionary('staticDictionary_get','CSP.PUB.ACCEPTMODE','aor_Basaccway');//加载受理方式信息
	    	    this.loadDictionary('staticDictionary_get','ECP.PUB.USERBRAND','aor_Basbrand');//加载客户品牌信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','aor_Basrange');//加载客级别信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.SEND.TYPE','aor_Seccommit');//加载提交方式信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.TEL.TYPE','aor_Secconcattel');//加载联系方式信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','aor_Bassosrange');//加载紧急程度信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.FOLLOW.HANDLE','aor_Basfollow');//加载跟进处理信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.COMPLAIN.METHOD','aor_Basaskway');//加载投诉途径信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.NET.TYPE','aor_Basnetclass');//加载投诉途径信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','aor_Basacccity');//加载投诉途径信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.QUESTION.TYPE','aor_Basallques');//加载集中问题分类信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Basdif');
		    	this.loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Secisrep');
		    	this.loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Basemotion');
		    	this.loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Bashidename');
		    	this.loadDictionary('staticDictionary_get','HEBEI.ORDER.MODEL','aor_Basmodule');
		  }
		});
	return initialize;
});