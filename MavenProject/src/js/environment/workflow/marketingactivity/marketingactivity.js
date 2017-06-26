define(['Util','list','dialog','date','validator','text!module/workflow/marketingactivity/adddiv_marketingactivity.html','indexLoad'],   
	function(Util,List,Dialog,Date,Validator ,div_model){
		var list;
		var initialize = function(){
		    	eventInit();
		    	ctiList({});
		    	};		
		
		 var eventInit=function(){
			
			 $('#shockOrder_Search').on('click',shockOrderInfo);
			 $('#shockOrder_Reset').on('click',resetInfo);
			  };
		
		//字典
			var loadDictionary=function(mothedName,dicName,seleId){
						var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
						var seleOptions="";
						Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
							$.each(result.beans,function(index,bean){
								//品牌工单中保存的是品牌名{
								if("subsbrand"==seleId){
									seleOptions+="<option  value='"+bean.name+"'>"+bean.name+"</option>";
								}
									else
										seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"	
							});
							$('#'+seleId).append(seleOptions);
							console.log(seleOptions);
						},true);
					};
		 
		 //重置按钮
		 var resetInfo = function (){		 	
			 $("input[name='activityname']")[0].value='';
			 $("input[name='cityname']")[0].value='';
			
		 };
		 //查询按钮事件
		 var shockOrderInfo = function (){
			 var cityname = $("input[name='cityname']")[0].value;
			 var activityname = $("input[name='activityname']")[0].value;
			
			 var data = {
					"cityname":cityname,
					"activityname": activityname
			 };
			 ctiList(data);
		 };
		
		 var num = 0; // 复选框选择工单条数
		 //弹出form
		
		//加载历史预警信息列表
			var ctiList = function(data){
				var config = {
						el:$('#historylist'),
					    field:{ 
							boxType : 'checkbox',
					        key:'id',         		        	
					        items: [{text: '地市',name:'cityname'},		                       
		                            {text: '名称', name: 'activityname'},
		                            {	text:'是否可用',
		                            	name:'state',	
		                            	render:function (item){
		                            		if(item.state=='01')
		                            			return "是";
		                            		else
		                            			return "否";
		                            	}
		                            }
		                    ]
					        
					    },
					    page:{
					        perPage:10,    
					        align:'right' ,
					        total : true,
					        button : {
								className : 'operateButtons',
								// url:'../js/list/autoRefresh',
								items : [
										{
											text : "已选择0条工单",
											name : '',
											click : function(e) {
												
											}
										},
										{
											text : '删除',
											name : '',
											click : function(e) {
												// 删除
												var datas = list.getCheckedRows();
												if (datas.length == 0) {
													crossAPI.tips("请至少选择一条信息!",3000);
													return;
												}
												var  ids = "";
												for( var i=0;i<datas.length;i++){
													if(ids=="")
														ids=datas[i].id;
													else
														ids+=","+datas[i].id
												}
												var params={
														"ids":ids
												}
												Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=marketingactivity002',params,function(result){
													if(result.bean.result=="ok")
														crossAPI.tips("删除成功！",3000)
													else
														crossAPI.tips("删除失败，请稍后再试！",3000)
												},true);	
												list.search(data);
												num=0;
												$(".btnCustom0").val("已选择" + num + "条工单")
												
											}
										},
										{
											text : '修改',
											name : '',
											click : function(e) {
												// 修改
												var datas = list.getCheckedRows();
												if (datas.length == 0) {
													crossAPI.tips("请至少选择一条信息!",3000);
													return;
												}else if (datas.length>1){
													crossAPI.tips("请选择一条数据进行修改",3000);
													return ;
												}		
													//修改
													var config = {
					             	         	            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
					             	         	            title:'修改',    //对话框标题
					             	         	            content:div_model, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
					             	         	            ok:function(){
					             	         	            //校验；
					             	         	            	if(form1.form()){
					             					                  $('.t-popup').addClass('show').removeClass('hide'); 
					             						    		  }
					             	         	            	 else{
					             						    		  	return false;
					             						    		  }
					             	         	            	var id = $("input[name='id']")[0].value;
					             	         	            	var cityid = $("select[name='acceptcity']")[0].value;
					             	         	            	var cityname = $("#acceptcity option:selected").text();
					             	         	            	var state = $("select[name='state']")[0].value;
					             	         	            	var orderid = $("input[name='orderid']")[0].value;
					             	         	            	var activityname = $("textarea[name='activityname']")[0].value;
					             	         	            	var params ={
					             	         	            			"id":id,
					             	         	            			"cityid":cityid,
					             	         	            			"cityname":cityname,
					             	         	            			"state":state,
					             	         	            			"orderid":orderid,
					             	         	            			"activityname":activityname
					             	         	            	}
					             	         	            	//修改
					             	         	            	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=marketingactivity003',params,function(result){
					             	         	            		if(result.bean.result=="ok")
																		crossAPI.tips("修改成功！",3000);
																	else
																		crossAPI.tips("修改失败，请稍后再试！",3000);
					             	         	            		list.search(data);
																	num=0;
																	$(".btnCustom0").val("已选择" + num + "条工单")
																},true);
					             	         	            }, //确定按钮的回调函数 
					             	         	            okValue: '确定',  //确定按钮的文本
					             	         	            cancel: function(){
					             	         	            },  //取消按钮的回调函数
					             	         	            cancelValue: '取消',  //取消按钮的文本
					             	         	            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
					             	         	            width:700,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
					             	         	            height:300, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
					             	         	            skin:'dialogSkin',  //设置对话框额外的className参数
					             	         	            fixed:false, //是否开启固定定位 默认false不开启|true开启
					             	         	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
					             	         	            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
					             	         	        }
					             	         	 var dialog = new Dialog(config);
													//模态框加载字典select值
													loadDictionary('staticDictionary_get','HEBEI.CUSTOM.CITY','acceptcity');//加载客户地市信息
													loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','state');//是否受理
													$("input[name='id']")[0].value=datas[0].id;
		             	         	            	$("#acceptcity option[value='"+datas[0].cityid+"']").attr("selected","selected");
		             	         	            	$("#state option[value='"+datas[0].state+"']").attr("selected","selected");
		             	         	            	$("input[name='orderid']")[0].value=datas[0].orderid;
		             	         	            	$("textarea[name='activityname']")[0].value=datas[0].activityname;
		             	         	            	 var config1 = {
									                          el:$('#form1'),
									                          dialog:false,    //是否弹出验证结果对话框
									                          rules:{
									                        	  acceptcity:"required",
									                        	  state:"required" ,
									                        	  orderid:"required",
									                        	  activityname:"required"
													
									                          }
									                          }
										            	var form1 = new Validator(config1);
												}
												
											
										},
										{
											text : '新增',
											name : '',
											click : function(e) {

												// 新增
												 var config = {
					             	         	            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
					             	         	            title:'新增',    //对话框标题
					             	         	            content:div_model, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
					             	         	            ok:function(){
					             	         	            	//校验；
					             	         	            	if(form1.form()){
					             					                  $('.t-popup').addClass('show').removeClass('hide'); 
					             						    		  }
					             	         	            	 else{
					             						    		  	return false;
					             						    		  	}
					             	         	            	
					             	         	            	var cityid = $("select[name='acceptcity']")[0].value;
					             	         	            	var cityname = $("#acceptcity option:selected").text();
					             	         	            	var state = $("select[name='state']")[0].value;
					             	         	            	var orderid = $("input[name='orderid']")[0].value;
					             	         	            	var activityname = $("textarea[name='activityname']")[0].value;
					             	         	            	var params ={
					             	         	            			"cityid":cityid,
					             	         	            			"cityname":cityname,
					             	         	            			"state":state,
					             	         	            			"orderid":orderid,
					             	         	            			"activityname":activityname
					             	         	            	}
					             	         	            	//新增
					             	         	            	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=marketingactivity003',params,function(result){
					             	         	            		if(result.bean.result=="ok")
																		crossAPI.tips("新增成功！",3000);
																	else
																		crossAPI.tips("新增失败，请稍后再试！",3000);
					             	         	            		list.search(data);
					             	         	            		list.search(data);
																	num=0;
																	$(".btnCustom0").val("已选择" + num + "条工单")
																},true);
					             	         	            }, //确定按钮的回调函数 
					             	         	            okValue: '确定',  //确定按钮的文本
					             	         	            cancel: function(){
					             	         	            },  //取消按钮的回调函数
					             	         	            cancelValue: '取消',  //取消按钮的文本
					             	         	            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
					             	         	            width:700,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
					             	         	            height:300, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
					             	         	            skin:'dialogSkin',  //设置对话框额外的className参数
					             	         	            fixed:false, //是否开启固定定位 默认false不开启|true开启
					             	         	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
					             	         	            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
					             	         	        }
					             	         	 var dialog = new Dialog(config);
												 //模态框加载字典select值
												 loadDictionary('staticDictionary_get','HEBEI.CUSTOM.CITY','acceptcity');//加载客户地市信息
												 loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','state');//是否受理	
												 var config1 = {
								                          el:$('#form1'),
								                          dialog:false,    //是否弹出验证结果对话框
								                          rules:{
								                        	  acceptcity:"required",
								                        	  state:"required" ,
								                        	  orderid:"required",
								                        	  activityname:"required"
												
								                          }
								                          }
									            	var form1 = new Validator(config1);
									            	
												
											}
										
										}
										 ]
							}
					    },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=marketingactivity001'
					    }
					}
				var list = new List(config);
				list.search(data);
				//全选 统计条数；
				$(' th input[type=checkbox]',$el).on('click',function(e){
		            var checkedAll = $(e.currentTarget).prop(':checked');
		            if(checkedAll){
		            	$(".btnCustom0").val("已选择" + list.total + "条工单");
		            	num =list.total;
		            }
		            else{
		            	$(".btnCustom0").val("已选择0条工单");
		            	num=0;
		            }
		            	
		        });
				//创建节点放在受理后面
				list.on('checkboxChange', function(e, item, checkedStatus) {// 事件处理代码
					if (checkedStatus == 1) {
						num++
						$(".btnCustom0").val("已选择" + num + "条工单")
					} else {
						num--
						$(".btnCustom0").val("已选择" + num + "条工单")
					}
				})
			}
			return initialize();
});