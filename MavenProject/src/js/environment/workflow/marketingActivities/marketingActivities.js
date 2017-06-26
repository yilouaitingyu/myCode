define(['Util','list','dialog','date','validator','selectTree' ,'text!module/workflow/marketingActivities/marketingActivities.html',     
        'text!module/workflow/marketingActivities/activityConfig.html','indexLoad'],   
	function(Util,List,Dialog,Date,Validator,SelectTree,reject,activityConfig){
		var list;
		var initialize = function(){
		    	eventInit();
		    	ctiList({});
		    	};		
		
		 var eventInit=function(){
			 $('#new_return_back').on('click',new_return_back);
		};
		
		//营销活动新增
		var new_return_back =function (){
			var config = {
		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
		            delayRmove:"",   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
		            title:'营销活动配置',    //对话框标题
		            content:activityConfig, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
		            ok:function(){console.log('点击了确定按钮')}, //确定按钮的回调函数 
		            okValue: '保存配置',  //确定按钮的文本
		            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
		            cancelValue: '取消',  //取消按钮的文本
		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
		            width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
		            height:150, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
		            skin:'dialogSkin',  //设置对话框额外的className参数
		            fixed:false, //是否开启固定定位 默认false不开启|true开启
		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
		            modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
		        }
		        var dialog = new Dialog(config)
		}
		 var num = 0; // 复选框选择工单条数	
		//加载历史预警信息列表
			var ctiList = function(data){
				var config = {
						el:$('#historylist'),
					    field:{ 
							boxType : 'checkbox',
					        key:'id',         		        	
					        items: [
				                       
			                        { 
			                            text:'操作',
			                            name:'',
		                            	render:function (item){
		                            		
		                            	}
			                        },
			                        { text:'地市',
			                          name:'',  
			                          render:function (item){
			                        	 
			                          }
			                         
			                        },
			                        { text:'名称',
			                          name:'' 
			                        	
			                        },
			                        { text:'是否可用（0：启用 1：停用）',
				                          name:'' 
				                        	
				                        }
		                    ]
					        
					    },
					    page:{
					        perPage:10,    
					        align:'right' ,
					        total : true,
					        button : {
								className : 'operateButtons',
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
												Util.ajax.postJson('',params,function(result){
													if(result.bean.result=="ok")
														crossAPI.tips("删除成功！",3000);
													else
														crossAPI.tips("删除失败，请稍后再试！",3000);
												},true);	
												list.search(data);
												num=0;
												$(".btnCustom0").val("已选择" + num + "条工单")
												
											}
										}
										 ]
							}
					    },
					    data:{
					        url:''
					    }
					}
				var list = new List(config);
				list.search(data);
		
			}
			
			return initialize();
});