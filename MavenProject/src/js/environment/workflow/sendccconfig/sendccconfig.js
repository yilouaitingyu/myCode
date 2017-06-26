define(['Util','list','dialog','date','validator','selectTree','indexLoad' ,'text!module/workflow/sendccconfig/adddiv_sendccconfig.html'],   
	function(Util,List,Dialog,Date,Validator,SelectTree,IndexLoad,adddiv_sendccconfig){
		var list;
		var initialize = function(){
		    	eventInit();
		    	ctiList({});
		    	};		
		
		 var eventInit=function(){
			 loadDictionary('staticDictionary_get','HEBEI.sendCC','copytotype');//加载客级别信息
			    
			 $('#sendccConfig_Search').on('click',sendccListInfo);
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
		
		
		
		
		
		  
	     
			  
		
		 //查询按钮事件
		 var sendccListInfo = function (){
			 var copytotype = $("select[name='copytotype']")[0].value;
			 var data = {"copytotype":copytotype};
			 ctiList(data);
		 };
		
		 var num = 0; // 复选框选择工单条数
		 //弹出form
		 var div_model ="";
		 var group_search =function (){
				 var config = {
	       	            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
	       	            title:'选择组',    //对话框标题
	       	            content:"<div><ul class=\"selectTree\"><li id=\"treeContainer2\"></li></ul></div>", //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
	       	            ok:function(){
	       	            	
	       	            		
	       	            }, //确定按钮的回调函数 
	       	            okValue: '确定',  //确定按钮的文本
	       	            okDisplay:false,
	       	            cancel: function(){
	       	            },  //取消按钮的回调函数
	       	            cancelValue: '取消',  //取消按钮的文本
	       	            cancelDisplay:false, //是否显示取消按钮 默认true显示|false不显示
	       	            width:400,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
	       	            height:260, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
	       	            skin:'dialogSkin',  //设置对话框额外的className参数
	       	            fixed:false, //是否开启固定定位 默认false不开启|true开启
	       	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
	       	            modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
	       	        }
	       	 var dialog = new Dialog(config);
				  
				 var config2 = {
		                    el:$('#treeContainer2'),
		                    label:'多选弹出树',
		                    check:true,
		                    // async:true,         //是否启用异步树
		                   
		                    textField:'name',
		                    valueFiled:'id',
		                    expandAll:true,
		                    childNodeOnly:false,
		                    checkAllNodes:true,     //是否显示复选框“全选”
		                    url:'/ngwf_he/front/sh/workflow!execute?uid=workGroupTreeData'
		                };
				var selectTree2 = new SelectTree(config2);
				$(".ui-dialog-footer:last").html("");
				selectTree2.on('confirm',function(nodes){
					    var group_ids ="";
					    var group_names ="";
					    var json_ids =new Array();
					    var json_names=new Array();
					    for(var i=0;i<nodes.length;i++){
					    	if(nodes[i].isParent){
						        console.log("请选择一个子节点");
						    }else{
						    	group_ids +=nodes[i]["id"]+",";
						    	json_ids.push(nodes[i]["id"]);
						    	json_names.push(nodes[i]["name"]);
						    	group_names +=nodes[i]["name"]+",";
						    }
					    }
					    
					    $("#groups").val(json_names.join(','));
					    $("#groupids_hidden").val(json_ids.join(','));
					    $(".ui-dialog:last").html("");
					});
			}
		 //人员
		 var staffs_Search =function(){var config = {
    	            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
       	            title:'选择人员',    //对话框标题
       	            content:"<div><ul class=\"selectTree\"><li id=\"treeContainer3\"></li></ul></div>", //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
       	            ok:function(){
       	            	
       	            		
       	            }, //确定按钮的回调函数 
       	            okValue: '确定',  //确定按钮的文本
       	            okDisplay:false,
       	            cancel: function(){
       	            },  //取消按钮的回调函数
       	            cancelValue: '取消',  //取消按钮的文本
       	            cancelDisplay:false, //是否显示取消按钮 默认true显示|false不显示
       	            width:400,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
       	            height:260, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
       	            skin:'dialogSkin',  //设置对话框额外的className参数
       	            fixed:false, //是否开启固定定位 默认false不开启|true开启
       	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
       	            modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
       	        }
       	 var dialog = new Dialog(config);
			  
			 var config2 = {
	                    el:$('#treeContainer3'),
	                    label:'多选弹出树',
	                    check:true,
	                    // async:true,         //是否启用异步树
	                    name:'requestType',
	                    textField:'name',
	                    valueFiled:'id',
	                    expandAll:true,
	                    childNodeOnly:false,
	                    checkAllNodes:true,     //是否显示复选框“全选”
	                    url:'/ngwf_he/front/sh/workflow!execute?uid=workGroupStaffData'//workGroupStaffData
	                };
			var selectTree2 = new SelectTree(config2);
			$(".ui-dialog-footer:last").html("");
			selectTree2.on('confirm',function(nodes){
				    var staffs_ids ="";
				    var staffs_names ="";
				    var json_ids =new Array();
				    var json_names=new Array();
				    for(var i=0;i<nodes.length;i++){
				    	 if(nodes[i].isParent){
						        console.log("请选择一个子节点");
						    }else{
						    	staffs_ids +=nodes[i]["id"]+",";
						    	staffs_names +=nodes[i]["name"]+",";
						    	json_ids.push(nodes[i]["id"]);
						    	json_names.push(nodes[i]["name"]);
						    }
				    }
				    //$("#staffs").val(staffs_names);
				    $("#staffs").val(json_names);
				    $("#staffids_hidden").val(json_ids);
				    
				    $(".ui-dialog:last").html("");
				});
		}
		//匹配tree;
		 
		var matchTree=function(nodeids,url){
			var array_tem=new Array();
			var name =""
			var name_temp =new Array();
			var array_temp = nodeids.split(",");
			$.ajaxSettings.async = false; //设置同步获取
			$.getJSON (url, function (data) {
				for( var i=0;i<array_temp.length;i++){
					getArray(data["beans"],array_temp[i],array_tem);
				}
			});
			return  array_tem.join(",");
		};
		
		function getArray(data,id,array_tem)
	    {
	        for (var i in data) {
	            if (data[i].id == id) {
	                console.log(data[i]);
	                array_tem.push(data[i]["name"]);
	                break;
	            } else {
	                getArray(data[i].children, id,array_tem);
	            }
	        }
	    }
			
		//加载历史预警信息列表
			var ctiList = function(data){
				var config = {
						el:$('#historylist'),
					    field:{ 
							boxType : 'checkbox',
					        key:'id',         		        	
					        items: [
				                       
			                        { 
			                            text:'抄送类型',
			                            name:'copytotype',
		                            	render:function (item){
		                            		if(item.copytotype=='01')
		                            			return "震荡工单";
		                            		else if(item.copytotype=='02')
		                            			return "潜在升级工单";
		                            		else
		                            			return "";
		                            	}
			                        },
			                        { text:'抄送工作组',
			                          name:'groups',  
			                          render:function (item){
			                        	 return matchTree(item.groups,"/ngwf_he/front/sh/workflow!execute?uid=workGroupTreeData");
			                          }
			                         
			                        },
			                        { text:'抄送人员',name:'staffs' ,
			                        	render:function (item){
				                        	 return matchTree(item.staffs,"/ngwf_he/front/sh/workflow!execute?uid=workGroupStaffData");
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
												var  copyconfids = "";
												for( var i=0;i<datas.length;i++){
													if(copyconfids=="")
														copyconfids=datas[i].copyconfid;
													else
														copyconfids+=","+datas[i].copyconfid
												}
												var params={
														"copyconfids":copyconfids
												}
												Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=sendCCConfig002',params,function(result){
													
													if(result.returnCode =="0")
	             	         						{
	             	         							crossAPI.tips("删除成功。",3000);
	             	         						}else{
	             	         							crossAPI.tips("删除失败，请稍后再试。",3000);
	             	         						}	
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
					             	         	            content:adddiv_sendccconfig, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
					             	         	            ok:function(){
					             	         	            	//校验；
					             	         	            	if(form1.form()){
					             					                  $('.t-popup').addClass('show').removeClass('hide'); 
					             						    		  }
					             	         	            	 else{
					             						    		  	return false;
					             						    		  	}
					             	         	            	
					             	         	            	var copytotype=$("#copytotype_hidden").val();
					             	         	            	var copyconfid = $("input[name='id_hidden']")[0].value;
					             	         	            	
					             	         	            	var staffs = $("#staffs").val();
					             	       				        var staffids = $("#staffids_hidden").val();
						             	       				    var groups =$("#groups").val();
															    var groupids = $("#groupids_hidden").val();
					             	         	            	var params ={
					             	         	            			"copyconfid":copyconfid,
					             	         	            			"staffs":staffs,
					             	         	            			"staffids":staffids,
					             	         	            			"groups":groups,
					             	         	            			"groupids":groupids,
					             	         	            			"copytotype":copytotype
					             	         	            	}
					             	         	            	//修改
					             	         	            	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=sendCCConfig003',params,function(result){
					             	         	            		
					             	         	            	//获取返回值；
					             	         						if(result.returnCode =="0")
					             	         						{
					             	         							crossAPI.tips("修改成功。",3000);
					             	         						}else{
					             	         							crossAPI.tips("修改失败，请稍后再试。",3000);
					             	         						}	
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
													loadDictionary('staticDictionary_get','HEBEI.sendCC','copytotype_hidden');//加载客级别信息
													//模态框加载字典select值
													$("input[name='id_hidden']")[0].value=datas[0].copyconfid;
		             	         	            	$("#copytotype_hidden option[value='"+datas[0].copytotype+"']").attr("selected","selected");
		             	         	            	
			             	       				    $("#staffids_hidden").val(datas[0].staffs);
			             	       				    $("#groupids_hidden").val(datas[0].groups);
				             	       				$('#group_search').on('click',group_search);
													$('#staffs_Search').on('click',staffs_Search);
													$('#group_clear').on('click',group_clear);
													 $('#saffs_clear').on('click',saffs_clear);
													//id匹配树名称
													$("textarea[name='groups']")[0].value=matchTree(datas[0].groups,"/ngwf_he/front/sh/workflow!execute?uid=workGroupTreeData");
													$("textarea[name='staffs']")[0].value=matchTree(datas[0].staffs,"/ngwf_he/front/sh/workflow!execute?uid=workGroupStaffData"); 
													var config1 = {
									                          el:$('#form1'),
									                          dialog:false,    //是否弹出验证结果对话框
									                          rules:{
									                        	  staffs:"required",
									                        	  groups:"required" ,
									                        	  copytotype_hidden:"required"
													
									                          }
									                          };
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
					             	         	            content:adddiv_sendccconfig, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
					             	         	            ok:function(){
					             	         	            	//校验；
					             	         	            	if(form1.form()){
					             					                  $('.t-popup').addClass('show').removeClass('hide'); 
					             						    		  }
					             	         	            	 else{
					             						    		  	return false;
					             						    		  	}
					             	         	            	
					             	         	            	var copytotype=$("#copytotype_hidden").val();
					             	         	            	var staffs = $("#staffs").val();
					             	       				        var staffids = $("#staffids_hidden").val();
						             	       				    var groups =$("#groups").val();
															    var groupids = $("#groupids_hidden").val();
					             	         	            	var params ={
					             	         	            			"staffs":staffs,
					             	         	            			"staffids":staffids,
					             	         	            			"groups":groups,
					             	         	            			"groupids":groupids,
					             	         	            			"copytotype":copytotype
					             	         	            	}
					             	         	            	//新增
					             	         	            	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=sendCCConfig003',params,function(result){
					             	         	            		
					             	         	            		if(result.returnCode =="0")
					             	         						{
					             	         							crossAPI.tips("新增成功。",3000);
					             	         						}else{
					             	         							crossAPI.tips("新增失败，请稍后再试。",3000);
					             	         						}	
					             	         	            		list.search(data);
																	num=0;
																	$(".btnCustom0").val("已选择" + num + "条工单")
																},true);
					             	         	            }, //确定按钮的回调函数 
					             	         	            okValue: '保存',  //确定按钮的文本
					             	         	            cancel: function(){
					             	         	            },  //取消按钮的回调函数
					             	         	            cancelValue: '取消',  //取消按钮的文本
					             	         	            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
					             	         	            width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
					             	         	            height:220, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
					             	         	            skin:'dialogSkin',  //设置对话框额外的className参数
					             	         	            fixed:false, //是否开启固定定位 默认false不开启|true开启
					             	         	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
					             	         	            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
					             	         	        }
					             	         	 var dialog = new Dialog(config);
												 loadDictionary('staticDictionary_get','HEBEI.sendCC','copytotype_hidden');//加载客级别信息
												 $('#group_search').on('click',group_search);
												 $('#staffs_Search').on('click',staffs_Search);
												 $('#group_clear').on('click',group_clear);
												 $('#saffs_clear').on('click',saffs_clear);
												     
												 var config1 = {
								                          el:$('#form1'),
								                          dialog:false,    //是否弹出验证结果对话框
								                          rules:{
								                        	  staffs:"required",
								                        	  groups:"required" ,
								                        	  copytotype_hidden:"required"
												
								                          }
								                          };
									            	var form1 = new Validator(config1);
												
											}
										
										}
										 ]
							}
					    },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=sendCCConfig001'
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
			
			var add_treediv="";
			
			
			//清空；
			var group_clear=function(){
				$("textarea[name='groups']")[0].value="";
			}
			var saffs_clear =function (){
				$("textarea[name='staffs']")[0].value=""
			}
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
			return initialize();
});