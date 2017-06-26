require(
		[ 'date', "list", 'select','dialog','validator','jquery','Util','crossAPI','indexLoad','text!module/workflow/smstemplate/adddiv_smstemplate.html'],
		function(MyDate, List,Select,Dialog,Validator, $,Util,CrossAPI,IndexLoad,adddiv_smstemplate) {		   
			 
			var initialize = function(IndexLoad,option) {
			
			}              
		        var num = 0;
                $(function(){
                    var config = {
                        el:$('#listContainer'),
                        className:'listContainer',
                        field:{
                            boxType:'checkbox',
                            key:'id',                           
                            items:[ 
                                { text:'编号',name:'Id' },   
                                { text:'模板名称',name:'templateName' },
                                { text:'模板内容',name:'content'}                                                                
                            ]                       
                        },
                        page:{
                            customPages:[2,3,5,10,15,20,30,50],
                            perPage:10,
                            total:true,
                            align:'right',
                            button:{
                                className:'btnStyle',
                                // url:'../js/list/autoRefresh',
                                items:[
                                    {
                                        text:'新增',
                                        name:'deleter',
                                        click:function(e,item){
                                            // 打印当前按钮的文本                                        	                                      	
                                        	/*CrossAPI.createTab("添加短信配置信息", "http://localhost:8080/ngwf_he/src/module/workflow/smstemplate/smstemplate-add.html",null);*/

											// 新增
											 var config = {
				             	         	            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
				             	         	            title:'新增',    //对话框标题
				             	         	            content:adddiv_smstemplate, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
				             	         	            ok:function(){
				             	         	            	//校验；
				             	         	            	if(form1.form()){
				             					                  $('.t-popup').addClass('show').removeClass('hide'); 
				             						    		  }
				             	         	            	 else{
				             						    		  	return false;
				             						    		  	}
				             	         	            	
				             	         	            	
				             	       				        var tepName=$("#tepName").val();
				             	                     	    var templateContent=$("#templateContent").val();
				             	                     	    
				             	         	            	var params ={
				             	         	            			"templateName":tepName,
				             	         	            			"content":templateContent			             	         	            			
				             	         	            	}
				             	         	            	//新增
				             	         	            	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=saveSmsTemplate',params,function(result){
				             	         	            		if(result.bean.state=="0")
																	crossAPI.tips("新增成功！",3000);
																else
																	crossAPI.tips("新增失败，请稍后再试！",3000);
				             	         	            		list.search({});
																num=0;																
															},true);
				             	         	            }, //确定按钮的回调函数 
				             	         	            okValue: '保存',  //确定按钮的文本
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
											     
											 var config1 = {
							                          el:$('#form1'),
							                          dialog:false,    //是否弹出验证结果对话框
							                          rules:{
							                        	  tepName:"required",
							                        	  templateContent:"required" 							                        	 									
							                          }
							                          };
								            	var form1 = new Validator(config1);
											
										
                                        }
                                    }, 
                                     {
                                        text:'修改',
                                        name:'deleter',
                                        click:function(e,item){

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
				             	         	            content:adddiv_smstemplate, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
				             	         	            ok:function(){
				             	         	            	//校验；
				             	         	            	if(form1.form()){
				             					                  $('.t-popup').addClass('show').removeClass('hide'); 
				             						    		  }
				             	         	            	 else{
				             						    		  	return false;
				             						    		  	}
				             	         	            	
				             	         	            	var tepName = $("#tepName").val();
				             	                     	    var templateContent = $("#templateContent").val();
				             	                     	    var tepId = $("#tepId").val();
				             	         	            	var params ={
				             	         	            			"templateName":tepName,
				             	         	            			"content":templateContent,
				             	         	            			"Id" : tepId
				             	         	            	}
				             	         	            	
				             	         	            	//修改
				             	         	            	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=updateSmsTemplate',params,function(result){
				             	         	            		if(result.bean.state=="0")
																	crossAPI.tips("修改成功！",3000);
																else
																	crossAPI.tips("修改失败，请稍后再试！",3000);
				             	         	            		list.search({});
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
												
												$("#tepName").val(datas[0].templateName);
												$("#templateContent").val(datas[0].content);
												$("#tepId").val(datas[0].templateId);
												
												var config1 = {
								                          el:$('#form1'),
								                          dialog:false,    //是否弹出验证结果对话框
								                          rules:{
								                        	  templateName:"required",
								                        	  content:"required"
								                        	  
												
								                          }
								                          };
									            	var form1 = new Validator(config1);
											
										
                                        }
                                    },
                                    {
                                        text:'删除',
                                        name:'stopToggle',
                                        click:function(e,item){                                        	 
                                        	 confirm("确认短信模板配置吗?",function(){                                        		 
                                        		 var rows=list.getCheckedRows();                                       		 
                                        		 var ids="";
                                            	 for(var i=0;i<rows.length;i++){                                        		 
                                            		 if(i==rows.length-1){
                                            			 ids+=rows[i].templateId;
                                            		 }else{
                                            			 ids+=rows[i].templateId+","; 
                                            		 }
                                            	 }
                                            	 
                                            	 Util.ajax.getJson('/ngwf_he/front/sh/workflow!execute?uid=deleteSmsTemplate', { Ids:ids }, 
                                            			 function(result, isOk){
                                            		     if(result.bean.state=='0'){
                                            		    	 message("删除成功");
                                            		    	 list.search({});
                                            		     }else{
                                            		    	 message("删除失败");
                                            		     }
                                            	  })
                                        	 },function(){
                                        		 
                                        	 }
                                        	 )
                                        	 
                                        }
                                    }
                                ]
                            }
                        },
                        data:{
                            url:'/ngwf_he/front/sh/workflow!execute?uid=selectSmsTemplate',
                        }
                    };
                    //按上面的配置创建新的列表
                    var list = new List(config);
                    //
                    list.search({});               
                      //查询
                     $("#query").click(function(){
                	     var templateName=$("#templateName").val();
                	     var content=$("#content").val();
                	    list.search({
                	    	'templateName' : templateName,
                	    	'content' : content
                	    })
                     })
                     //重置
                      $("#reset").click(function(){
                    	$("#templateName").val('');
                 	    $("#content").val('');
                      })
                })
                           
             //确认框  
             var  confirm = function (content,sure,cancel){
                	var config = {
                            mode:'confirm',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
                            title:"消息提示",    //对话框标题
                            content:content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
                            ok: sure, //确定按钮的回调函数 
                            okValue: '确定',  //确定按钮的文本
                            cancel: cancel,  //取消按钮的回调函数
                            cancelValue: '取消',  //取消按钮的文本
                            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示                            
                            width:300,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
                            height:200, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
                            skin:'dialogSkin',  //设置对话框额外的className参数
                            fixed:false, //是否开启固定定位 默认false不开启|true开启
                            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
                            modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
                        }
                        var dialog = new Dialog(config)	
             }
             //信息框
             var message = function(content){
            	 var config = {
                         mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
                         title:"消息提示",    //对话框标题
                         content:content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）                         
                         okValue: '确定',  //确定按钮的文本                                                                      
                         width:300,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
                         height:200, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
                         skin:'dialogSkin',  //设置对话框额外的className参数
                         fixed:false, //是否开启固定定位 默认false不开启|true开启
                         quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
                         modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
                     }
                     var dialog = new Dialog(config)	
             } 
             
             
             return initialize();  
		})