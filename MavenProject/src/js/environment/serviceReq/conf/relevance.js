define([ 'Util', 'list', 'ajax', 'form', 'dialog', 'validator','selectTree', 'simpleTree',
		'tab', 'indexLoad' ],
		function(Util, List, ajax, Form, Dialog, Validator,SelectTree, SimpleTree, Tab,
				IndexLoad) {
			var _index;
			var prefixBiz = 'sms';
			var reqtree;//类别树
			var nodes;//类别树所有节点
		    //var nameArray=["%%%"];//避免重复发请求


			var eventInit = function() {
				/**从常用短信传过来的短信内容*/
				crossAPI.on("commonMsg", function(param) {
					var ids = "";
					var names = "";
					if(param != undefined && param != null && param.length > 0){
						$.each(param,function(index, bean){
							ids += bean.id + ",";
							names += bean.name + ",";
						});
						ids = ids.substring(0, ids.length-1);
						names = names.substring(0,names.length-1);
					}
					//var arr = param.split('&');
					$('#smsReqrelevanceId').val(ids);
					$('#smsRelevancetitle').val(names);
				});
			};

			var eventTreeInit = function() {
				$(function() {
					var setting = {
						async: {
							enable: true,
							url: "/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd",
							autoParam: ["id=id"],
							type:"get",//可拼接参数post无法拼接
							dataType:"json",
							dataFilter:function(treeId, parentNode, responseDta){//转化数据
								for(var x in responseDta.beans){
									if(responseDta.beans[x].isLeaf == "0" ){
										responseDta.beans[x].isParent = true;
									}
								}
								return responseDta.beans;
							}
						},
	
						check : {
							enable : false//是否启用 复选框  
						},
						callback : {
							onClick : nodeClick,
						},
						data : {
							simpleData : {
								enable : true
							}
						}
					};
					Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypes',{}, function(result) {
						reqtree = $.fn.zTree.init($("#reqtree"), setting, result.beans);
					},true);
					nodes = reqtree.transformToArray(reqtree.getNodes());
					if (nodes.length > 0) {
                          for (var i = 0; i < nodes.length; i++) {
                              if (nodes[i].isleaf=="0") { //找到父节点
                                  nodes[i].nocheck = true; //nocheck为true表示没有选择框
                                  nodes[i].isParent =true;//让树样式为文件夹
                                  reqtree.expandNode(nodes, true, false, true);
                              } else {
                                  nodes[i].nocheck = false;
                              }
                          }
                     }
					 reqtree.refresh();
					/* $('#reqtree').on("click",".switch",function(event){
						 if(nameArray.join("-").indexOf($(event.target).siblings('a').attr('title'))==(-1)){
							 $(event.target).siblings('a').trigger('click');
						 }
						if(nameArray.join("-").indexOf($(event.target).siblings('a').attr('title'))==(-1))
							 nameArray.push($(event.target).siblings('a').attr('title'));
					 });*/
				});
			};

			/**节点选中事件*/
			function nodeClick(event, treeId, treeNode) {
				reqtree.expandNode(treeNode, null, false, false,false);
				if(treeNode.isParent) {
					$("#tabContainer input").val('');
					return;
				}
				/*if(nameArray.join("-").indexOf(treeNode.name)==(-1)){
					nameArray.push(treeNode.name);
					if(treeNode.isParent==true) {
						$("#tabContainer input").val('');
						Util.ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd',{id:treeNode.id}, function(result) {
						   reqtree.addNodes(treeNode,result.beans,true);
						   var nodes = reqtree.transformToArray(reqtree.getNodes());//获取当前子节点
						   if (nodes.length > 0) {//循环 去除checkbox
							   for (var i = 0; i < nodes.length; i++) {
								   if (nodes[i].isLeaf=="0") { //找到父节点
									   nodes[i].isParent =true;
									   nodes[i].nocheck = false; 
								   } else {
									   nodes[i].nocheck = false;
								   }
							   }
						   }
						   reqtree.refresh();
						   reqtree.expandNode(treeNode, true, true, false);
						  
						},true);
					}
				}else{
					if(treeNode.open){
						reqtree.expandNode(treeNode, false, true, false);
					}else{
						reqtree.expandNode(treeNode, true, true, false);
					}
				   // reqtree.expandNode(treeNode, true, false, true);
				    //treeNode.nocheck = true;
				    reqtree.refresh();
				    }*/
				    if (treeNode != null) {
				    	$("#" + prefixBiz + "ReqTypeName").val(treeNode.name);
				    	$("#" + prefixBiz + "SrTypeId").val(treeNode.id);
				    	$("#" + prefixBiz + "RouteCode").val(treeNode.id);
				    	//有待优化和保存里面的类别判断合并一处
				    	if (prefixBiz == 'sms') {
				    		$("#" + prefixBiz + "RouteTarget").val("短信关联");
				    	}
				    	$("#smsReqrelevanceId").val("");//关联短信ID
				    	$("#smsRelevancetitle").val("");//关联短信名称
				    	var params = {
				    			smsSrTypeId : treeNode.id
				    	};
				    	
				    	Util.ajax.postJson(
				    			'/ngwf_he/front/sh/serviceReq!execute?uid=queryServiceRqType001',
				    			params,
				    			function(data) {
				    				var jsonBeans = eval(data.beans);
				    				if (jsonBeans.length > 0) {
				    					if (jsonBeans[0].target != ''
				    						&& jsonBeans[0].target != 'null') {
				    						$("#smsReqrelevanceId").val(
				    								jsonBeans[0].smsReqrelevanceId);//关联短信ID
				    					}
				    					if (jsonBeans[0].targetdesc != ''
				    						&& jsonBeans[0].targetdesc != 'null') {
				    						$("#smsRelevancetitle")
				    						.val(
				    								jsonBeans[0].smsRelevancetitle);//关联短信名称
				    					}
				    				}
				    			},true);
				    }
				    return;
			}

			// 短信模板标题弹窗
			var favoriteMSG = function() {
				_index.showDialog({
		        	id:"ngwfheSendMsg",
		            title: "常用短信",
		            modal: false,
		            url: 'html/serviceReq/commonMsg.html',
		            param: {
		                flag:"relevance"
		            },
		            width: 820,
		            height: 550,
		        });
				/*   var returnResult =window.showModalDialog("../../serviceReq/conf/smsModule.html","短信模板","dialogWidth:900px;resizable=no;status=no;dialogHeight:800px;dialogLeft:400px;dialogTop:150px;center:yes;help:yes;resizable");
			       var messageID="";
			       var messageTitle="";
			       if(returnResult){
			    	   for(var i=0;i<returnResult.length;i++){
			    		   if(i==0){
			    			   messageID = returnResult[i].messageID;
			    			   messageTitle=returnResult[i].messageTitle; 
			    		   }else{
			    			   messageID = messageID+","+returnResult[i].messageID;
			    			   messageTitle=messageTitle+","+returnResult[i].messageTitle;  
			    		   }
			    	   }
						$("#smsReqrelevanceId").val(messageID);//关联短信ID
						$("#smsRelevancetitle").val(messageTitle);//关联短信名称 
			       }*/
			}
			
			var smsAllClear = function() {
				$("input").val("");
			}

			var smsqk = function() {
				$("#smsRelevancetitle").val("");
				$("#smsReqrelevanceId").val("");
			}

			var smsSave = function(e) {

				var $form = $('#hotServiceForm');
				var addData = Util.form.serialize($("form"));
				if (addData.smsReqTypeName == '' || addData.smsReqTypeName == 'null') {
					crossAPI.tips("请选择服务请求类别!",1500);
					return;
				}
				/*if (addData.smsRelevancetitle == ''
						|| addData.smsRelevancetitle == 'null') {
					crossAPI.tips("请选择短信模板!",3000);
					return;
				}else*/ if(addData.smsRelevancetitle.length>150){
					crossAPI.tips("短信模板标题最大长度为150个字符!",1500);
					return;
				}
				console.log(addData);

				Util.ajax
						.postJson(
								'/ngwf_he/front/sh/serviceReq!execute?uid=queryServiceRqType001',
								addData,
								function(data) {
									var jsonBeans = eval(data.beans);
									if (jsonBeans.length > 0) {
										//开始修改
										addData.id = '' + jsonBeans[0].id + '';
										Util.ajax.postJson(
														'/ngwf_he/front/sh/serviceReq!execute?uid=updateServiceRqType001',
														addData,
														function(data) {
															var rm = data.returnMessage;
															if (rm == "updateSuccess") {
																crossAPI.tips(
																		'修改成功',
																		1500);
															} else {
																crossAPI.tips(
																		'修改失败',
																		1500);
															}
														});
									} else {
										//开始新增
										Util.ajax.postJson(
														'/ngwf_he/front/sh/serviceReq!execute?uid=insertServiceRqType001',
														addData,
														function(data) {
															var rm = data.returnMessage;
															if (rm == "addSuccess") {
																crossAPI.tips(
																		'添加成功',
																		1500);
																//_index.destroy('热点类别关联保存成功');
															} else {
																crossAPI.tips(
																				'热点类别关联保存失败',
																				1500);
															}
														});
									}
								});

			}
			var contentStr = "<div id='listContainer'></div>";
			var eventTabsInit = function() {
				$(function() {
					var config = {
						el : $('#tabContainer'),
						direction : 'horizontal',//布局方向 horizontal默认横向|vertical纵向 
						tabs : [ {
							title : '关联短信',
							click : function(e, tabData) {
								prefixBiz = "sms";

								$.get("sms.html", function(data) {
									 
									var html = data;
									tab.content(html);
									$('#smsAllClear').on('click', smsAllClear);//重置
									$('#smsSelect').on('click', favoriteMSG);//选择
									$('#smsqk').on('click', smsqk);//清空
									$('#smsSave').on('click', smsSave);//保存事件
									$('#smsRelevancetitle').on('mouseover',function(){
										var titles = $(this).val();
										$(this).attr('title',titles);
									})
								});

								relevanceBiz(Util, Dialog, List, ajax,
										prefixBiz, contentStr, '关联短信');
							}
						} ]
					};
					var tab = new Tab(config);
				})
				
			};
			var validator = new Validator({

			});

			var dialogConfig = {
				id : 'comfirm',
				mode : 'mormal', //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
				// delayRmove:3, //延迟删除秒数设定 默认3秒
				title : '标题', //对话框标题
				content : '这里是对话框的内容', //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）

				ok : function() {
				}, //确定按钮的回调函数 
				okValue : '确定', //确定按钮的文本
				cancel : function() {
					console.log('点击了取消按钮')
				}, //取消按钮的回调函数
				cancelValue : '取消', //取消按钮的文本
				cancelDisplay : true, //是否显示取消按钮 默认true显示|false不显示
				width : 600, //对话框宽度
				height : 400, //对话框高度
				skin : 'dialogSkin', //设置对话框额外的className参数
				fixed : false, //是否开启固定定位 默认false不开启|true开启
				quickClose : false, //点击空白处快速关闭 默认false不关闭|true关闭
				modal : false
			//是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
			}
			/**
			 * 关联短信模块业务处理
			 */
			var relevanceBiz = function(Util, Dialog, List, ajax, prefix,
					routeContent, relevanceContent) {
				var routeItemSelect = null;
				$('#' + prefix + 'RouteClear').on('click', function() {
					$("#" + prefix + "RouteTarget").val("");

				});

				$('#' + prefix + 'Select').on('click', function() {

					if (prefix == 'page' || prefix == 'problem') {
						var dialog = new Dialog($.extend(dialogConfig, {
							mode : 'normal',
							id : 'normal',
							content : '<div id="listContainer"><div/>'
						}));
						var page;
						if (prefix == 'page') {
							page = pageList('listContainer', List);
							dialog.on('confirm', function() {
								if (page.getCheckedRows().length > 1) {
									crossAPI.tips("只能选择一条记录",1500);
									return;
								}
								var row = page.getCheckedRows()[0];
								$("#pageRouteTarget").val(row.pageurl);
								$("#pageRouteName").val(row.pagename);
								$("#pageSrTypeId").val("SRPage");
							});
						} else if (prefix == 'problem') {
							page = problemList('listContainer', List);
							dialog.on('confirm', function() {
								if (page.getCheckedRows().length > 1) {
									crossAPI.tips("只能选择一条记录",1500);
									return;
								}
								var row = page.getCheckedRows()[0];
								$("#problemRouteTarget").val(row.templateId);
								$("#problemRouteName").val(row.templateName);
								$("#problemSrTypeId").val("PBHFlow");
							});
						}

					} else {
						var dialog = new Dialog($.extend(dialogConfig, {
							mode : 'normal',
							id : 'normal',
							content : relevanceContent
						}));

						dialog.on('confirm', function() {
							$("#" + prefix + "Relevancetitle").val("默认短信标题");
							$("#" + prefix + "ReqrelevanceId").val("默认短信id");
							$("#" + prefix + "RelvanceType").val("0");
						});
					}
				});
				$('#' + prefix + 'Clear').on('click', function() {
					$("#" + prefix + "Relevancetitle").val("");
					$("#" + prefix + "ReqrelevanceId").val("");
					$("#" + prefix + "RelvanceType").val("");

				});

				$('#' + prefix + 'AllClear').on('click', function() {
					$("#" + prefix + "Form")[0].reset();
				});

				$('#' + prefix + 'Save')
						.click(
								function() {
									var $form = $('#' + prefix + 'Form');
									var result = Util.form.serialize($form);
									var RouteCode = $(
											'#' + prefix + 'RouteCode').val();
									if (!RouteCode) {
										crossAPI.tips("路由编码不能为空",1500);
										return;
									}
									ajax.postJson(
											'/ngwf_he/front/sh/serviceReq!execute?uid='
													+ prefix + 'Relevance',
											result, function(res) {
												if (res.returnCode == 1) {
													crossAPI.tips('操作成功!!!',1500);
												} else {
													crossAPI.tips('操作失败，请联系管理员!!!',1500);
												}

											});
								})
			}

			/**

			 * 路由目标弹出框列表构建
			 */
			var routeList = function(listContainer, List) {
				var num = 0;
				//list列表配置信息
				var config = {
					el : $('#' + listContainer),
					className : 'listContainer',
					field : {
						boxType : 'radio',
						key : 'id',
						items : [
						{
							text : '路由编码',
							name : 'routeKey'
						}, {
							text : '路由目标',
							name : 'target'
						} ]

					},
					page : {
						customPages : [ 5, 10, 15, 20, 30, 50 ],
						perPage : 1,
						total : true,
						align : 'right'
					},
					data : {
						url : '/ngwf_he/front/sh/serviceReq!execute?uid=routerTargets'
					}
				}
				var list = new List(config);
				list.search({});
				return list;
			}
			/**
			 * 弹出所有页面信息
			 */
			var pageList = function(listContainer, List) {
				var num = 0;
				//list列表配置信息
				var config = {
					el : $('#' + listContainer),
					className : 'listContainer',
					field : {
						boxType : 'checkbox',
						key : 'id',
						items : [

						{
							text : '页面代码',
							name : 'pagecode'
						}, {
							text : '页面名称',
							name : 'pagename'
						}, {
							text : '页面类别',
							name : 'category'
						}, {
							text : '页面URL',
							name : 'pageurl'
						}, {
							text : '状态',
							name : 'status'
						}

						]

					},
					page : {
						customPages : [ 5, 10, 15, 20, 30, 50 ],
						perPage : 10,
						total : true,
						align : 'right'
					},
					data : {
						url : '/ngwf_he/front/sh/serviceReq!execute?uid=selectPageInfoAll'
					}
				}
				var list = new List(config);
				list.search({});
				return list;
			}
			/**
			 * 弹出所有流程信息
			 */
			var problemList = function(listContainer, List) {
				var num = 0;
				//list列表配置信息
				var config = {
					el : $('#' + listContainer),
					className : 'listContainer',
					field : {
						boxType : 'checkbox',
						key : 'id',
						items : [

						{
							text : '流程编号',
							name : 'templateId'
						}, {
							text : '流程版本',
							name : 'templateVersion'
						}, {
							text : '流程名称',
							name : 'templateName'
						}, {
							text : '流程状态',
							name : 'state'
						}, {
							text : '工单类别',
							name : 'processType'
						} ]

					},
					page : {
						customPages : [ 5, 10, 15, 20, 30, 50 ],
						perPage : 10,
						total : true,
						align : 'right'
					},
					data : {
						url : '/ngwf_he/front/sh/serviceReq!execute?uid=selectProblemAll'
					}
				}
				var list = new List(config);
				list.search({});
				return list;

			}

			IndexLoad(function(IndexModule, options) {
				_index = IndexModule;
				//事件初始化
				eventInit();
				eventTabsInit();
				eventTreeInit();
			});
		});
