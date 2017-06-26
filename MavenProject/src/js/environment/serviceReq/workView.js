define(function(require){
	require(['Util', 'indexLoad', 'selectTree', 'simpleTree', 'ajax', 'tab', 'list' ,'form','dialog','validator','date'],
			function(Util, IndexLoad, SelectTree, simpleTree, ajax, Tab, List ,Form, Dialog,Validator,MyDate){
				var ztree;
				var prefixBiz = 'dayContact';
				var resultBean;//用户地市字典
				var resultBean1;//操作状态
				var resultBean2;//接触渠道
				var resultBean3;//媒体类型
				var resultBean4;//接触方式
				var untreatedcontactlists;//未处理接触列表
				var _index;
				var _options;
				var date = new Date();
			    var seperator1 = "-";
			    var seperator2 = ":";
			    var month = date.getMonth() + 1;
			    var strDate = date.getDate();
			    var acceptstaffno="";//员工编号
			    var telNum;//受理号码
			    //获取服务请求内容
				var servicecontent="";
				//获取流水号
				var serialNo="";
				//获取员工基本资料
				var acceptstaffno="";//员工编号
				var staffName="";//员工姓名
				var acceptcity="";//受理员工所属城市编码
				var acceptstaffdept="";//受理部门ID
				var userName = ""; //客户姓名
			    var telNumStarCode = ""; //号码星级
			    var customerAssignment = ""; //用户归属地
			    var callType="";//受理方式
			    var userSatisfy="";//满意度
			    var custBrandId="";//用户品牌
				//获取受理号码
				var subsnumber="";
				var callerNo ="";//主叫号码
				var dialog1;
				var ngcctIpPort;
				var oldWorkSheetIpPort;
				var parentArray=['010@'];//父级节点请求id;
				var nameArray=["%%%"];
				/**加载数据字典**/
				var creartSelect = function(typeId) {
					var resultData;
					var params = {
						method : 'staticDictionary_get',
						paramDatas : '{typeId:"' + typeId + '"}'
					}
					Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getDic01',
							params, function(result) {
								resultData=result.beans
							}, true);
					return resultData;
				}
				resultBean=creartSelect("NGCS.HEYTCK.CITYCODE");//用户地市
            	resultBean1=creartSelect("HEBEI.DIC.OPSTATUS");//操作状态
				resultBean2=creartSelect("HEBEI.DIC.CONTACTCHANNELID");//接触渠道
            	resultBean3=creartSelect("CSP.PUB.MEDIATYPE");//媒体类型
            	resultBean4=creartSelect("CSP.PUB.CONTACTMODE");//接触方式
			
			    crossAPI.getIndexInfo(function(data){
					//员工编号
		            if (data.userInfo.staffId != null && data.userInfo.staffId!=undefined && data.userInfo.staffId != "") {
		            	acceptstaffno = data.userInfo.staffId;
		            }
		            //员工姓名
		            if (data.userInfo.staffName != null && data.userInfo.staffName!=undefined && data.userInfo.staffName != "") {
		            	staffName = data.userInfo.staffName;
		            }
		            //员工部门
		            if (data.userInfo.deptId != null && data.userInfo.deptId!=undefined && data.userInfo.deptId != "") {
		            	acceptstaffdept = data.userInfo.deptId;
		            }
					
				});
				crossAPI.getContact('getClientBusiInfo',function(businInfo){
					if(businInfo!=undefined && businInfo!="" && businInfo.bean!=undefined){
						telNum = businInfo.bean.msisdn;//受理号码
					}
				});
				
			    if (month >= 1 && month <= 9) {
			        month = "0" + month;
			    }
			    if (strDate >= 0 && strDate <= 9) {
			        strDate = "0" + strDate;
			    }
			    var startTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
			            + " 00:00:00";
			    var endTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
		        + " 23:59:59";
			    
			    
			    /**获取请求头*/
				var getBaseUrl = function () {
					var ishttps = 'https:' == document.location.protocol ? true: false;
					var url = window.location.host;
					if(ishttps){
						url = 'https://' + url;
					}else{
						url = 'http://' + url;
					}
					return url;
				}			
					
				/**================================当天接触=================================*/
				var dayContactList = function (listContainer,List){
					var config = {
							el:$('#' + listContainer),
			                className:'dayContactList',
			                field:{
			                	boxType:'',
			                	key:'',
			                	items:[
										{ text:'流水号',name:'serialNo',
											  render:function(item,val){//serialNo
							                	val = '<a  class="serialnoId" >'+val+'</a>';
							                	return val;
							        		  },
							        		  click:function(e,val,item){
							        			  crossAPI.createTab(
							        					  item.data.serialNo,
							        					  ngcctIpPort+"/ngcct/src/module/contact/contactDetail.html",
							        				      {serialNo:item.data.serialNo}
							        			  ); 
							        		  }},
										{ text:'开始时间',name:'contactStartTime'},//contactStartTimecontactstarttime
										{ text:'受理号码',name:'subsNumber'},
										{ text:'主叫号码',name:'callerNo'},
										{ text:'员工账号',name:'staffId',
											render : function(item, val) {
												val = '<a ref="#" class="staffDetail" >'+val+'</a>';
												return val;
											}},
										{ text:'被叫号码',name:'calledNo'},
										{ text:'接触渠道',name:'channelName'},
										{ text:'媒体类型',name:'mediaTypeName'}/*,
										{ text:'接触方式',name:'surveyTypeId',//contactmodeid
						        			  render:function(item,val){
								                	var val =item.surveyTypeId;
							    					$.each(resultBean4,function(index,bean){
							    						if(item.surveyTypeId==bean.value){
							    							val=bean.name;
							    						}
							    					});
							    				
							                	return "";
							        		  }
						        		  }*/
			                	]
			                },
			                page:{
			                	perPage:10,
			                    customPages:[5,10,15,20,30,50],
			                    total:true,
			                    align:'right'
			                },
			                data:{
			                    url:"/ngwf_he/front/sh/serviceReq!execute?uid=callCSFQueryContactRecord&beginTime="+startTime+"&endTime="+endTime+"&staffId="+_index.getUserInfo().staffId
			                    
			                }
					}
					var daycontactlist = new List(config);
					var acceptStaffno=_index.getUserInfo().staffId;
					daycontactlist.search({});//method:"NGCCT_QUERYSTAFFCONTACT_GET",paramDatas:'{staffId:"HA10001",beginTime:"'+startTime+'",serialNo:"",callerNo:"",endTime:"'+endTime+'"}'
					return daycontactlist;
				}
				
				/****未处理接触****/
				var untreatedContactList = function (listContainer,List){
					var config = {
							el:$('#' + listContainer),
			                className:'untreatedContactList',
			                field:{
			                	boxType:'checkbox',
			                	key:'id',
			                	items:[
										{ text:'流水号',name:'serialNo',render:function(item,val){
							                	val = '<a  class="serialnoId" >'+val+'</a>';
							                	return val;
							        		  },
							        		  click:function(e,val,item){
							        			  crossAPI.createTab(
							        					  item.data.serialNo,
							        					  ngcctIpPort+"/ngcct/src/module/contact/contactDetail.html",
							        				      {serialNo:item.data.serialNo}
							        			  ); 
							        		  }},
										{ text:'开始时间',name:'contactStartTime'},
										{ text:'受理号码',name:'subsNumber'},
										{ text:'主叫号码',name:'callerNo'},
										{ text:'员工账号',name:'staffId',
											render : function(item, val) {
												val = '<a ref="#" class="staffDetail" >'+val+'</a>';
												return val;
											}},
										{ text:'被叫号码',name:'calledNo'},
										{ text:'接触渠道',name:'channelName'},
										{ text:'媒体类型',name:'mediaTypeName'}/*,
										{ text:'接触方式',name:'surveyTypeId',
											render:function(item,val){
							                	var val =item.surveyTypeId;
						    					$.each(resultBean4,function(index,bean){
						    						if(item.surveyTypeId==bean.value){
						    							val=bean.name;
						    						}
						    					});
						                	return "";
						        		  }
										}*/
			                	]
			                },
			                page:{
			                	perPage:10,
			                    customPages:[5,10,15,20,30,50],
			                    total:true,
			                    align:'right'
			                },
			                data:{//beginTime='+startTime+"&endTime="+endTime+'&staffId='+_index.getUserInfo().staffId+'&srFlag=0
			                	//beginTime=2017-05-01 00:00:00&endTime=2017-05-17 23:59:59
			                	url:'/ngwf_he/front/sh/serviceReq!execute?uid=callCSFQueryContactRecord&beginTime='+startTime+"&endTime="+endTime+'&staffId='+_index.getUserInfo().staffId+'&srFlag=0'
			                }
					}
					untreatedcontactlists = new List(config);
					untreatedcontactlists.search({});
					return untreatedcontactlists;
				}
		

				/*****当天请求（请求查询）***/
				var dayRequestList = function (listContainer,List){
					var config = {
							el:$('#' + listContainer),
			                className:'dayRequestList',
			                field:{
			                	boxType:'',
			                	key:'id',
			                	items:[
										{
											text : '请求编号',
											name : 'id',
											render : function(item, val) {
												val = '<a  class="reqDetail">' + val+ '</a>';
												return val;
											}
										},
										{
											text : '受理号码',
											name : 'subsNumber',
										},
										{
											text : '受理时间',
											name : 'acceptTime'
										},
										{
											text : '服务请求类别',
											name : 'fullname'
										},
										{
											text : '操作状态',
											name : 'operationStatus',
											render:function(item,val){
							                	var val =item.operationStatus;
						    					$.each(resultBean1,function(index,bean){
						    						if(item.operationStatus==bean.value){
						    							val=bean.name;
						    						}
						    					});
						                	return val;
						        		  }
										}, {
											text : '用户地市',
											name : 'subsCity',
											render:function(item,val){
							                	var val = item.subsCity;
						    					$.each(resultBean,function(index,bean){
						    						if(item.subsCity==bean.value){
						    							val=bean.name;
						    						}
						    					});
						                	return val;
						        		  }
										}, 
										{ text:'用户姓名',name:'subsname'},
										{ text:'业务内容',
										  name:'servicecontent',
										  render:function(item,val){
											   var servicecontent = item.servicecontent;
												 if(servicecontent){
												  if(servicecontent.length > 18) {
													  val = servicecontent.substring(0,17);
													  val = '<span title='+servicecontent+' style="cursor: pointer"> '+val+'...'+'</span>';
												  }else {
													  val = servicecontent;
												  }
												  return val;
											  }else{
												  val = '';
												  return val;
											  }
											}
										}
							        ]
			                },
			                page:{
			                    perPage:10,
			                    customPages:[5,10,15,20,30,50],
			                    total:true,
			                    align:'right'
			                },
			                data:{
			                	url:'/ngwf_he/front/sh/serviceReq!execute?uid=requestQuery001&startTime='+startTime+'&endTime='+endTime+'&acceptStaffNo='+_index.getUserInfo().staffId
			                   
			                }
					}
					var dayrequestlist = new List(config);
					dayrequestlist.search({});
					return dayrequestlist;
					
				}
				
				/**新增服务请求弹框*/
				var dialogConfig1 = {
			            id:'comfirm',
			            mode:'normal', 
			            title:'标题',
			            content:'这里是对话框的内容',
			            ok:function(){},
			            cancel: function(){}, 
			            cancelDisplay:true,
			            width:600,
			            height:360,
			            skin:'dialogSkin',  //设置对话框额外的className参数
			            fixed:false, 
			            quickClose:false ,
			            modal:false
		        }
				var relevanceBiz = function(Util,Dialog,List,ajax,prefix,routeContent,relevanceContent){
				      var page;
					if(prefix=='dayContact'){//当天接触
						page = dayContactList('dayContactListDiv',List);//'listContainer'
						
					}else if(prefix=='untreatedContact'){//未处理接触
						page = untreatedContactList('untreatedContactListDiv',List);
						
					}else if(prefix=='personalEvaluation'){//个人考评
						//page = personalEvaluationList('personalEvaluationListDiv',List);
						
					}else if(prefix=='dayRequest'){//当天请求
						page = dayRequestList('dayRequestListDiv',List);
						
					}else if(prefix=='workOrderInquiry'){//工单查询
						//page = workOrderInquiryList('workOrderInquiryListDiv',List);
					}
				}
				 
				$(document).click(function(){
					$('.content').hide();
				})
				
				
				/**员工个人信息展示 start*/ 
				var staffnoDetail = function(e) {
					e.stopPropagation()
					var evt =e|| event;
			    	var bbb =$(this).parent('td').offset().left-201;
	       			var ccc = $(this).parent('td').offset().top-114;
	       			$('.content').css({'left':bbb,'top':ccc}).toggle();
					var staffId = $(e.currentTarget).text();
					var orgaName = "";
					var mobilePhone = "";
					var staffName = "";
					Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getStaffInfo01',{"staffId":staffId}, function(result){
						if(result.bean.orgaName && result.bean.mobilePhone && result.bean.staffName){
							orgaName = result.bean.orgaName;
							mobilePhone = result.bean.mobilePhone;
							staffName = result.bean.staffName;
						}
					}, true);
					
					$("#staffId").text(staffId);
					
					if(staffName != "" && staffName.length > 11) {
						var name = staffName.substring(0,11);
						name += "...";
						$("#staffName").text(name);
						$("#staffName").attr("title",staffName);
					}else{
						$("#staffName").text(staffName);
					}
					
					if(orgaName != "" && orgaName.length > 11) {
						var orga = orgaName.substring(0,11);
						orga += "...";
						$("#orgaName").text(orga);
						$("#orgaName").attr("title",orgaName);
					}else{
						$("#orgaName").text(orgaName);
					}
					
					if(mobilePhone != "" && mobilePhone.length > 11) {
						var phone = mobilePhone.substring(0,11);
						phone += "...";
						$("#mobilePhone").text(phone);
						$("#mobilePhone").attr("title",mobilePhone);
					}else{
						$("#mobilePhone").text(mobilePhone);
					}
					
					/*var dialogConfig = {
						mode:'normal',
						delayRmove:2000, 
						content :
							'<div class="content">'		   
				            +'<p>员工信息</p>'
				            +'<ul class="contentList">'
				            +'<li><span class="listLeft">工号</span><span>'+ staffId +'</span></li>'    
				            +'<li><span class="listLeft">姓名</span><span>'+ staffName +'</span></li>'  
				            +'<li><span class="listLeft">部门</span><span>'+ orgaName +'</span></li>'  
				            +'<li><span class="listLeft">手机</span><span>'+ mobilePhone +'</span></li>'
						    +'</div>',
						width : 220,
						height : 195,
						skin : 'dialogSkin',
						fixed : true,
						quickClose : true,
						cancelDisplay:false,
						okDisplay:false,
						modal : false,
						
					}
					var dialog =new Dialog(dialogConfig);
					
					$('.ui-dialog-footer').addClass('hide');
                    $('.ui-dialog-content').css('overflow','hidden');
                    $('.content li span:odd').on('mouseover',function(){
						var titles = $(this).text()
						$(this).attr('title',titles)
					})*/
				}
				/**员工个人信息展示 end*/
					
				/**员工个人信息展示 start*/ 
				var staffnoDetail1 = function(e) {
					e.stopPropagation()
					var evt =e|| event;
					var bbb =$(this).parent('td').offset().left-201;
					var ccc = $(this).parent('td').offset().top-154;
					$('.content').css({'left':bbb,'top':ccc}).toggle();
					var staffId = $(e.currentTarget).text();
					var orgaName = "";
					var mobilePhone = "";
					var staffName = "";
					Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getStaffInfo01',{"staffId":staffId}, function(result){
						if(result.bean.orgaName && result.bean.mobilePhone && result.bean.staffName){
							orgaName = result.bean.orgaName;
							mobilePhone = result.bean.mobilePhone;
							staffName = result.bean.staffName;
						}
					}, true);
					$("#staffId1").text(staffId);
					
					if(staffName != "" && staffName.length > 11) {
						var name = staffName.substring(0,11);
						name += "...";
						$("#staffName1").text(name);
						$("#staffName1").attr("title",staffName);
					}else{
						$("#staffName1").text(staffName);
					}
					
					if(orgaName != "" && orgaName.length > 11) {
						var orga = orgaName.substring(0,11);
						orga += "...";
						$("#orgaName1").text(orga);
						$("#orgaName1").attr("title",orgaName);
					}else{
						$("#orgaName1").text(orgaName);
					}
					
					if(mobilePhone != "" && mobilePhone.length > 11) {
						var phone = mobilePhone.substring(0,11);
						phone += "...";
						$("#mobilePhone1").text(phone);
						$("#mobilePhone1").attr("title",mobilePhone);
					}else{
						$("#mobilePhone1").text(mobilePhone);
					}
					
					/*var dialogConfig = {
						mode:'normal',
						delayRmove:2000, 
						content :
							'<div class="content">'		   
				            +'<p>员工信息</p>'
				            +'<ul class="contentList">'
				            +'<li><span class="listLeft">工号</span><span>'+ staffId +'</span></li>'    
				            +'<li><span class="listLeft">姓名</span><span>'+ staffName +'</span></li>'  
				            +'<li><span class="listLeft">部门</span><span>'+ orgaName +'</span></li>'  
				            +'<li><span class="listLeft">手机</span><span>'+ mobilePhone +'</span></li>'
						    +'</div>',
						width : 220,
						height : 195,
						skin : 'dialogSkin',
						fixed : true,
						quickClose : true,
						cancelDisplay:false,
						okDisplay:false,
						modal : false,
						
					}
					var dialog =new Dialog(dialogConfig);
					
					$('.ui-dialog-footer').addClass('hide');
                    $('.ui-dialog-content').css('overflow','hidden');
                    $('.content li span:odd').on('mouseover',function(){
						var titles = $(this).text()
						$(this).attr('title',titles)
					})*/
				}
				/**员工个人信息展示 end*/
				
					
					/**=========================服务类别树===========================*/
					var _ids="";
					var _number=0;
					var ztree;
					var Tree = function() {
				        ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypess', function(result) {
			                var zNode = result.bean.resultParent;
			                var setting = {
			                    view: {
			                        selectedMulti: false,
			                        //禁止多点选中  
			                        showIcon: false,
			                        //是否显示节点图标，默认值为true	
			                        dblClickExpand: false
			                    },
			                    check: {
			                        enable: false //是否启用 复选框
			                    },
			                    data: {
			                        simpleData: {
			                            enable: true,
			                            idKey: "id",
			                            pIdKey: "pId",
			                            rootPId: ""
			                        }
			                    },
			                    callback: {
			                        onClick: function(treeId, treeNode) {
			                        	parentArray=['010@'];//父级节点请求id;
			                        	nameArray=["%%%"];
			                            var treeObj = $.fn.zTree.getZTreeObj(treeNode);
			                            var selectedNode = treeObj.getSelectedNodes()[0];
			                            //var selectedNode = treeObj.getSelectedNodes()[0];
			                            if (selectedNode.level == 1) {
			                            	$(".showContent").unbind();
			                            	$('#deleted').hide();
			                                ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&srtypeId=' + selectedNode.id + '', function(result) {
			                                    var Node = result.beans;
			                                    var setting1 = {
			                                        view: {
			                                        	 selectedMulti: false,
			                                             //禁止多点选中  
			                                             showIcon: true,
			                                             //是否显示节点图标，默认值为true	    			     				
			                                        },
			                                        check: {
			                                            enable: true //是否启用 复选框  
			                                        },
			                                        data: {
			                                            simpleData: {
			                                                enable: true
			                                            }
			                                        },
			                                        callback: {
			                                        	onClick: zTreeOnClick,
			                                            onCheck: zTreeOnCheck
			                                        },
			                                    }
			                                    function zTreeOnCheck(event, treeId, treeNode) {
			                                        var content = $("#selectContents").html();

			                                        if (treeNode.checked == true) {
			                                            if (content == "" || content == null) {
			                                                content = "<li><input type='checkbox' name='" + treeNode.id + "'/><label>" + treeNode.fullName + "</label></li>";
			                                                _ids += treeNode.id + ",";
			                                                _number += 1;

			                                                if ($("#hiddenSelectContents").val() == "") $("#hiddenSelectContents").val(treeNode.id);
			                                                else $("#hiddenSelectContents").val($("#hiddenSelectContents").val() + "," + treeNode.id);
			                                            } else {
			                                                content += "<li><input type='checkbox' name='" + treeNode.id + "'/><label>" + treeNode.fullName + "</label></li>";
			                                                _ids += treeNode.id + ",";
			                                                _number += 1;

			                                                if ($("#hiddenSelectContents").val() == "") $("#hiddenSelectContents").val(treeNode.id);
			                                                else $("#hiddenSelectContents").val($("#hiddenSelectContents").val() + "," + treeNode.id);
			                                            }
			                                            $("#selectContents").html(content);
			                                            correlationSMS();
			                                            correlationKno();
			                                        } else {
			                                            $("input[name^=" + treeNode.id + "]").parent('li').remove();
			                                            _number = _number - 1;
			                                            _ids = _ids.replace(treeNode.id+",", '');
			                                            correlationSMS();
			                                            correlationKno();
			                                            var array = $("#hiddenSelectContents").val().split(",");
			                                            for (var i = 0; i < array.length; i++) {
			                                                if (array[i] == treeNode.id) {
			                                                    array.splice(i, 1);
			                                                    break;
			                                                }
			                                            }
			                                            $("#hiddenSelectContents").val(array.join(","));
			                                        }

			                                        $("#GS").html(_number);
			                                    };
			                                    
			                                    //节点单击事件
			                        			function zTreeOnClick(event, treeId, treeNode) {
			                        				if(nameArray.join("-").indexOf(treeNode.name)==(-1))
				                        				nameArray.push(treeNode.name);
			                        				if(treeNode.isLoad=="N"){
			                        					return ;
			                        				}
			                        				if(treeNode.isLoad==""||treeNode.isLoad==null||treeNode.isLoad == undefined){
			                        					if(treeNode.isLeaf=="0"){//父节点继续查
			                        							if(parentArray.join("-").indexOf(treeNode.id)!=(-1)){
			                            							treeNode.isParent =true;
			                        								treeNode.nocheck = true;
			                        								if(treeNode.open)
			                        									ztree.expandNode(treeNode, false, false, true);
			                        								else
			                        									ztree.expandNode(treeNode, true, false, true);
			                           							    ztree.refresh();
			                        								return ;
			                        							}
			                        						else{
			                        							treeNode.isParent =true;
			                        							parentArray.push(treeNode.id);
				                        						ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&id='+treeNode.id, function(result) {
				                     							   //treeNode.nocheck = false;
				                     							   ztree.addNodes(treeNode,result.beans,true);
				                     							   //获取当前子节点，循环 去除checkbox
				                     							  var allNodes = ztree.getNodes();
				                                                  var nodes = ztree.transformToArray(allNodes);
				                                                  if (nodes.length > 0) {
				                                                      for (var i = 0; i < nodes.length; i++) {
				                                                          if (nodes[i].isLeaf=="0") { //找到父节点
				                                                              nodes[i].nocheck = true; //nocheck为true表示没有选择框
				                                                              nodes[i].isParent =true;
				                                  							//展开此节点
				                                  							ztree.expandNode(nodes, true, false, true);
				                                                          } else {
				                                                              nodes[i].nocheck = false;
				                                                              //var hidden = $("#hiddenSelectContents").val();
				                                                              var hidden =_ids;
				                                                              if (hidden.indexOf(nodes[i].id) != -1) {
				                                                                  nodes[i].checked = true;
				                                                              }
				                                                          }
				                                                      }
				                                                  }
				                     							   ztree.expandNode(treeNode, true, false, true); //展开此节点
				                     							   treeNode.nocheck = true;
				                     							   ztree.refresh();
				                        						});
			                        						}
			                        				
			                        					}else{
			                        						
			                        						 treeNode.nocheck = false;
			                        						 ztree.refresh();
			                        					}
			                        				}
			                        				
			                        				
			                        			}
			                                    
			                                    ztree = $.fn.zTree.init($("#txtIds"), setting1, Node);
			                                    var allNodes = ztree.getNodes();
			                                    var nodes = ztree.transformToArray(allNodes);
			                                    if (nodes.length > 0) {
			                                        for (var i = 0; i < nodes.length; i++) {
			                                            if (nodes[i].isLeaf=="0") { //找到父节点
			                                                nodes[i].nocheck = true; //nocheck为true表示没有选择框
			                                                nodes[i].isParent =true;
			                                            } else {
			                                                nodes[i].nocheck = false;
			                                                var hidden = $("#selectContents").val();
			                                                if (hidden.indexOf(nodes[i].id) != -1) {
			                                                    nodes[i].checked = true;
			                                                }
			                                            }
			                                        }
			                                    }
			                                    ztree.refresh();
			                                    $('#txtIds').on("click",".switch",function(event){
				                            		if(nameArray.join("-").indexOf($(event.target).siblings('a').attr('title'))==(-1))
				                            			$(event.target).siblings('a').trigger('click');
				                            		if(nameArray.join("-").indexOf($(event.target).siblings('a').attr('title'))==(-1))
				                        				nameArray.push($(event.target).siblings('a').attr('title'));
				                                });
			                                   /* var arr = _ids.split(",");
			                                    for (var a = 0; a < arr.length; a++) {
			                                        if (arr[a] != null && arr[a] != "") {
			                                            var note = ztree.getNodeByParam("id", arr[a], null);
			                                            if (!note && note != null) {
			                                                note.checked = true;
			                                            }
			                                        }
			                                    }
			                                    ztree.refresh();*/
			                                });
			                            }
			                        },
			                    }
			                };
			                var treeDemo = $.fn.zTree.init($("#treeDemo"), setting, zNode);
			            

				        });

				    }
					
					 /**enter键事件*/
				    var EnterPress = function EnterPress() {
				        if (event.keyCode == 13) {
				            searchOK();
				        }
				    }
					
					//点击确定搜索
					var searchOK=function(){
						var name=$('#searchType').val();
						if(name==null || name==""){
							crossAPI.popAlert("请输入服务类型","提示",function(){});
							return;
						}
						name=encodeURI(name);
						var optionDic = "";
		            	ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByNamereqType',{name:name},function(result){
		            		$.each(result.beans,function(index,bean){
		               		    //判断是否选中
		            			var arrayIds=_ids.split(",")
		                   		var checkTree=""
		                        for(var i=0;i<arrayIds.length;i++){
		                     	   if(arrayIds[i]==bean.id){
		                     		  checkTree= checked;
		                     		   break;
		                     	   }
		                        }
		                   		optionDic += "<ul><li><input type='checkbox' "+checkTree+"  name=" + bean.id + "><label>" + bean.fullName + "</label></li></ul>"
		                       /* if (_ids.indexOf(bean.id) >= 0) {
		                       	 optionDic += "<ul><li><input type='checkbox'  checked name=" + bean.id + "><label>" + bean.fullName + "</label></li></ul>"
		                        } else {
		                       	 optionDic += "<ul><li><input type='checkbox'  name=" + bean.id + "><label>" + bean.fullName + "</label></li></ul>"
		                               }*/
		                    })
		            		$("#txtIds").html(optionDic);
		            	});
		            	
		            	addSelNode();
					}
					 
					/***
				     * 搜索、enter往下面追加
				     */
				    var addSelNode =function(){
				    	 //去除事件
				        $(".showContent").unbind();
				        $('#txtIds').off('change'); 
				        //添加checked事件
				        $('#txtIds').on('change','input[type="checkbox"]',function(){
				            var content = $("#selectContents").html();
				            var id =$(this)[0].name;
				    		var fullName=$(this).next("label").text();
				            if ($(this).is(":checked")) {
				                if (content == "" || content == null) {
				                    content = "<li><input type='checkbox' checkFlag='check' name='" +id + "'/><label>" + fullName + "</label></li>";
				                    _ids += id + ",";
				                    _number += 1;

				                    if ($("#hiddenSelectContents").val() == "") $("#hiddenSelectContents").val(id);
				                    else $("#hiddenSelectContents").val($("#hiddenSelectContents").val() + "," + id);
				                } else {
				                    content += "<li><input type='checkbox' checkFlag='check' name='" + id + "'/><label>" + fullName + "</label></li>";
				                    _ids += id + ",";
				                    _number += 1;

				                    if ($("#hiddenSelectContents").val() == "") $("#hiddenSelectContents").val(id);
				                    else $("#hiddenSelectContents").val($("#hiddenSelectContents").val() + "," + id);
				                }
				                $("#selectContents").html(content);
				                correlationSMS();
				                correlationKno();
				            } else {
				            	if($("input[name^=" + id + "][checkFlag='check']").parent('li').length>0){
				            		$("input[name^=" + id + "][checkFlag='check']").parent('li').remove();
				            		_number = _number - 1;
				            		_ids = _ids.replace(id, '');
				            		correlationSMS();
				            		correlationKno();
				            		var array = $("#hiddenSelectContents").val().split(",");
				            		for (var i = 0; i < array.length; i++) {
				            			if (array[i] == id) {
				            				array.splice(i, 1);
				            				break;
				            			}
				            		}
				            		$("#hiddenSelectContents").val(array.join(","));
				            	}
				            }
				            $("#GS").html(_number);
				        
				    	}); 
				    }
					
					//默认搜索
					var searchClear=function(){
					    $('#searchType').val("");  
						
					}
					
					/***监听字母搜索*/
					var onpropertychange=function(e){
				        var searchKey = $(e.currentTarget).context.value;
				        if (searchKey == null || searchKey == "") {
				            $("#txtIds").html("");
				            return;
				        }
				        var optionDic = "";
				        ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByZMreqType&searchKey=' + searchKey + '', function(result) {
				        	$.each(result.beans, function(index, bean) {
				        		//判断是否选中
				           		var arrayIds=_ids.split(",")
				           		var checkTree=""
				                for(var i=0;i<arrayIds.length;i++){
				             	   if(arrayIds[i]==bean.id){
				             		  checkTree= checked;
				             		   break;
				             	   }
				                }
				           		optionDic += "<ul><li><input type='checkbox' "+checkTree+"  name=" + bean.id + "><label>" + bean.fullName + "</label></li></ul>"
				        	});  
				            $("#txtIds").html(optionDic);
				            addSelNode();
				        })
				    }
					
					/**去除重复*/
					var add = function(){
						var ids=$(this).attr("name");
						 if($('.showContent').find('input[name^='+ids+']').is(":checked")){	
							 if(_ids.indexOf(ids) >= 0){
									crossAPI.popAlert("类别已选过，请勿重复选取","提示",function(){});
									$(this).checked=false;
								}else{
									var content=$("#selectContents").html();
									content+="<li><input type='checkbox' name='"+ids+"'/><label>"+$(this).parent('li')[0].innerText+"</label></li>";
									$("#selectContents").html(content);
									_number+=1;
									_ids+=ids+",";
									 $("#GS").html(_number);
									 correlationSMS();
									 correlationKno();
								}
						 }else{
							 $("#selectContents").find("input[name^="+ids+"]").parent('li').remove();
				     			_number=_number-1;
				     			_ids=_ids.replace(ids+",",'');
				     			 $("#GS").html(_number);
				     			correlationSMS();
				     			correlationKno();
						 }
					}
					
					
					/*****===========填单================*/
					var tianDan=function(options){
						 //获取受理号码
				        subsnumber = $('#searchNumber').val();
				        if (subsnumber == '') {
				            crossAPI.tips('受理号码不可为空！', 1500);
				            return;
				        }
				        var regx =/^[0-9]+$/;
				        if(!regx.test(subsnumber)){
				        	crossAPI.tips('受理号码格式不正确！', 1500);
				        	return;
				        }
				        if (_number == 0) {
				            crossAPI.popAlert("填单_请选取服务请求内容", "提示", function() {});
				            return;
				        } else if (_number != 1) {
				            crossAPI.popAlert("填单时只能选择一个服务请求", "提示", function() {});
				            return;
				        }
				       
				        //获取服务请求内容
				        servicecontent = $.trim($("#noMustInput").val());//encodeURI($("#noMustInput").val());
				        var length = $("#noMustInput").val().length;
				        if (length > 100) {
				            crossAPI.tips('服务请求内容不能超过100字', 1500);
				            return;
				        }
						//流水号
						serialNo=$('#serialNo').val();
						//获取选取的服务类型id
						var str = "";
						var arr=_ids.split(",");
						 for(var i = 0;i < arr.length; i++) {
							 if(arr[i]!=null && arr[i]!=""){
								 str+=arr[i]+","; 
							 }
							
						 }
						 str=str.substring(0,str.length-1);
						var params={method:'NGCCT_QUERYCONTACTINFO_GET',paramDatas:'{serialNo:"'+serialNo+'"}'};
						Util.ajax.postJson("/ngwf_he/front/sh/common!execute?uid=callCSF",params,function(result){
							if(result.beans.length>0){
								if(result.beans[0].custName!=undefined){
									userName=result.beans[0].custName;//客户姓名
								}
                                if(result.beans[0].custStarId!=undefined){
                                	telNumStarCode=result.beans[0].custStarId;//用户星级
								}
                                if(result.beans[0].custCityId2!=undefined){
                                	customerAssignment=result.beans[0].custCityId2; //用户归属地
								}
                                if(result.beans[0].custBrandId!=undefined){
                                	custBrandId=result.beans[0].custBrandId;//用户品牌
								}
                                if(result.beans[0].userSatisfy!=undefined){
                                	userSatisfy=result.beans[0].userSatisfy;//用户满意度
								}
                                if(result.beans[0].callType!=undefined){
                                	callType=result.beans[0].callType;//呼叫方式
								}
                                if(result.beans[0].staffCityId!=undefined){
                                	acceptcity=result.beans[0].staffCityId;//员工地市
                				}
                                if(result.beans[0].callerNo!=undefined){
                                	callerNo=result.beans[0].callerNo;//主叫号码
                				}
							}
							var data ={
			                		"subsNumber":subsnumber,
			                		"subsName":userName,
			                		"subsLevel":telNumStarCode,
			                		"subsCity":customerAssignment,
			                		"acceptStaffNo":acceptstaffno,
			                		"acceptCity":acceptcity,
			                		"acceptStaffDept":acceptstaffdept,
			                		"serviceContent":servicecontent,
			                		"serialNo":serialNo,
			                		"operationStatus":1,
			                		"serviceId":str,
			                		"custBrand":custBrandId,
			                		"userSatisfy":userSatisfy,
			                		//"custBrand":"1",//用户品牌
			                		//"userSatisfy":"0",//满意度(未评价)
			                		//"mobileType":"0",//手机型号
			                		//"contactMode":"1",//联系方式(人工)
			                		"urgentId":"00006003",//紧急度(一般)
			                		"impactId":"00007003",//重要程度(中)
			                		"priorityId":"00008003",//优先级(中)
			                		"languageId":"1",//语种(普通话)
			                		"acceptMode":"1",//受理方式(人工)
			                		"contactChannel":"1",//受理渠道(人工受理)
			                		"faultLocation":acceptcity,//业务地市(省中心)
			                		"callerNo":callerNo  //主叫号码
			                }
			                //保存数据库
			                Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=acceptanceReques004',data, function(result) {
								if(result.bean.start==null){
									crossAPI.popAlert("填单失败","提示",function(){});
								}else{
									crossAPI.popAlert(result.bean.start,"提示",function(){});
									dialog1.remove();
									dialog1.close();
									untreatedcontactlists.search({});//刷新未处理接触
								}
								
							})
						})
						//跳转老客服填单页面
						 Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getPropertiesIP',
				                        {},function(result,isOK){
				                        	Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=favoritMSG004',{"staffId":acceptstaffno,"provinceId":"00030004","systermNo":"CSP"},function(result){
				                        		if(result ==null||result ==undefined ||result =="undefined"){
				                        			origStaffId=""; 
				                        		}
				                        		else
				                        		{
				                        			if(result.beans ==null||result.beans ==undefined ||result.beans =="undefined")
				                        			{
				                        				origStaffId="";
				                        			}
				                        			else
				                        			{ 
				                        				if(result.beans[0] ==null||result.beans[0] ==undefined ||result.beans[0] =="undefined"){
				                        					origStaffId="";
				                        				}else{
				                        					if(result.beans[0].origStaffId ==null||result.beans[0].origStaffId ==undefined ||result.beans[0].origStaffId =="undefined")
				                        					{
				                        						origStaffId="";
				                        					}
				                        					else
				                        					{
				                        						origStaffId = result.beans[0].origStaffId;
				                        					}									
				                        				}
				                        			}
				                        			
				                        		} 
				                        	},true);
				                        	if(origStaffId==""){
				                        		crossAPI.popAlert("获取老工号失败,不能跳转到填单页面!", "提示", function() {});
				                        	}else{
				                        		crossAPI.createTab.apply(crossAPI, ['填单详情', result.bean.oldWorkSheetIpPort+'/arsys/queryManager/sheetmessage/UsdInCrmPage.jsp?LOGINNAME=' + origStaffId + '&telnum=' + subsnumber + '&sourceid=&flag=1&srtypeid=' + str + '&ApplyMaster='+staffName, {}]);
				                        		/*for (var i = 0; i < arr.length; i++) {
				        				            if (arr[i] != null && arr[i] != "") {
				        				            }
				        				        }*/
				                        	}
				         });
					
					}
					/**直接答复*/
					var directResponse=function(){
						 //获取受理号码
				        subsnumber = $('#searchNumber').val();
				        if (subsnumber == '') {
				            crossAPI.tips('受理号码不可为空！', 1500);
				            return;
				        }
				        var regx =/^[0-9]+$/;
				        if(!regx.test(subsnumber)){
				        	crossAPI.tips('受理号码格式不正确！', 1500);
				        	return;
				        }
				        if (_number == 0) {
				            crossAPI.popAlert("直接答复_请选取服务请求内容", "提示", function() {});
				            return;
				        } /*else if (_number != 1) {
				            crossAPI.popAlert("只能选取一条服务请求，请删除多余选项", "提示", function() {});
				            return;
				        }*/
				       
				        //获取服务请求内容
				        servicecontent = $.trim($("#noMustInput").val());//encodeURI($("#noMustInput").val());
				        var length = $("#noMustInput").val().length;
				        if (length > 100) {
				            crossAPI.tips('服务请求内容不能超过100字', 1500);
				            return;
				        }
						//流水号
						serialNo=$('#serialNo').val();
						//获取选取的服务类型id
						var arr=_ids.split(",");
						var str = "";
						 for(var i = 0;i < arr.length; i++) {
							 if(arr[i]!=null && arr[i]!=""){
								 str+=arr[i]+","; 
							 }
							
						 }
						 str=str.substring(0,str.length-1);
						var params={method:'NGCCT_QUERYCONTACTINFO_GET',paramDatas:'{serialNo:"'+serialNo+'"}'};
						Util.ajax.postJson("/ngwf_he/front/sh/common!execute?uid=callCSF",params,function(result){
							if(result.beans.length>0){
								if(result.beans[0].custName!=undefined){
									userName=result.beans[0].custName;//客户姓名
								}
                                if(result.beans[0].custStarId!=undefined){
                                	telNumStarCode=result.beans[0].custStarId;//用户星级
								}
                                if(result.beans[0].custCityId2!=undefined){
                                	customerAssignment=result.beans[0].custCityId2; //用户归属地
								}
                                if(result.beans[0].custBrandId!=undefined){
                                	custBrandId=result.beans[0].custBrandId;//用户品牌
								}
                                if(result.beans[0].userSatisfy!=undefined){
                                	userSatisfy=result.beans[0].userSatisfy;//用户满意度
								}
                                if(result.beans[0].callType!=undefined){
                                	callType=result.beans[0].callType;//呼叫方式
								}
                                if(result.beans[0].staffCityId!=undefined){
                                	acceptcity=result.beans[0].staffCityId;//员工地市
                				}
                                if(result.beans[0].callerNo!=undefined){
                                	callerNo=result.beans[0].callerNo;//主叫号码
                				}
							}
							var data ={
			                		"subsNumber":subsnumber,
			                		"subsName":userName,
			                		"subsLevel":telNumStarCode,
			                		"subsCity":customerAssignment,
			                		"acceptStaffNo":acceptstaffno,
			                		"acceptCity":acceptcity,
			                		"acceptStaffDept":acceptstaffdept,
			                		"serviceContent":servicecontent,
			                		"serialNo":serialNo,
			                		"operationStatus":4,
			                		"serviceId":str,
			                		"custBrand":custBrandId,
			                		"userSatisfy":userSatisfy,
			                		//"custBrand":"1",//用户品牌
			                		//"userSatisfy":"0",//满意度(未评价)
			                		"mobileType":"0",//手机型号
			                		"contactMode":"1",//联系方式(人工)
			                		"urgentId":"00006003",//紧急度(一般)
			                		"impactId":"00007003",//重要程度(中)
			                		"priorityId":"00008003",//优先级(中)
			                		"languageId":"1",//语种(普通话)
			                		"acceptMode":"1",//受理方式(人工)
			                		"contactChannel":"1",//受理渠道(人工受理)
			                		"faultLocation":acceptcity,//业务地市(省中心)
			                		"callerNo":callerNo  //主叫号码
			                }
			                //保存数据库
			                Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=acceptanceReques004',data, function(result) {
								if(result.bean.start==null){
									crossAPI.popAlert("直接答复失败","提示",function(){});
								}else{
									crossAPI.popAlert(result.bean.start,"提示",function(){});
									dialog1.remove();
									dialog1.close();
									untreatedcontactlists.search({});//刷新未处理接触
								}
								
							})
						})
					}
					
					/**判断请求头*/
					var getBaseUrl = function () {
						var ishttps = 'https:' == document.location.protocol ? true: false;
						var url = window.location.host;
						if(ishttps){
							url = 'https://' + url;
						}else{
							url = 'http://' + url;
						}
						return url;
					}
					
					/**我的收藏*/
					var myCollection = function(e){
				        $("#treeDemo .ztree ul li.level1").removeClass('activeColor');
				        $("#ztreeT ul li").removeClass('activeColor');
				        $("#ztree_One_1_ul li").removeClass('activeColor');
				        $("#treeDemo_1_ul li").removeClass('activeColor');
				        var staffId = _index.getUserInfo().staffId;
				        var optionDic = "";
				        Util.ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectCollection',{"creator":staffId}, function(result) {
				            $.each(result.beans, function(index, bean) {
				                if (_ids.indexOf(bean.id) >= 0) {
				                    optionDic += "<ul class='i-ul-collect'><li><input type='checkbox' val='scflag' checked name=" + bean.srtypeid + "><label>" + bean.fullname + "</label></li></ul>";
				                } else {
				                    optionDic += "<ul class='i-ul-collect'><li><input type='checkbox' val='scflag' name=" + bean.srtypeid + "><label>" + bean.fullname + "</label></li></ul>";
				                }
				            })
				        },true)
				        $("#txtIds").html(optionDic);
				        $('#txtIds').off('change'); 
				        $(".showContent").unbind();
				        $('.showContent').on('click', 'input[type="checkbox"]', add); 
				        //添加底色
				        var kkk = $("#txtIds").find('label');
				        if($("#txtIds").find('input[type="checkbox"]').is(':checked')){
				        	$("#txtIds").find('input[type="checkbox"]:checked').siblings("label").css('background','#ccc');
				        }
				        $('.showContent').bind("contextmenu", function(){
						    return false;
				    	});
				    	$(".showContent").on('mousedown','ul.i-ul-collect li',mouseRight);//鼠标右键事件
				    }
					//固定类别查询
					var selectAdd = function(e){
						//$(".showContent").unbind();
				    	$('#deleted').hide();
						var name=$(e.currentTarget).context.id;
						var srtypeid="";
						if(name=="ywzx"){
							srtypeid="002114002";
						}else if(name=="ywcx"){
							srtypeid="002114003";
						}else if(name=="khts"){
							
							srtypeid="002114001";
						}else if(name=="yxl"){
							srtypeid="002115";
						}else if(name=="ywqx"){
							srtypeid="002114004";
						}
						ajax.getJson('/ngwf_he/front/sh/hotServiceType!execute?uid=queryServiceTypeById&srtypeid='+srtypeid+'',function(result){
		            			var optionDic="";
		            			for(var i=0;i<result.beans.length;i++){
		            				var fullname=result.beans[i].fullname.split("->");
		            				var srtypeId=result.beans[i].id;
		            				var string="";
		            				for(var a=3;a<fullname.length;a++){
		            					if(a==fullname.length-1){
		            						string+=fullname[a];
		            					}else{
		            						string+=fullname[a]+"->";
		            					}
		            					
		            				}
			    				        if(_ids.indexOf(srtypeId) >= 0){
			    				        	optionDic+="<ul><li><input type='checkbox' checked name="+srtypeId+"><label>"+string+"</label></li></ul>"
			    				        }else{
			    				        	optionDic+="<ul><li><input type='checkbox' name="+srtypeId+"><label>"+string+"</label></li></ul>"	
			    				        }
		            			}
		            		$("#txtIds").html(optionDic);
		            		$(".showContent").unbind();
		        	        $('.showContent').on('click', 'input[type="checkbox"]', add);
		            	});
					}
					
					/**清空搜索框*/
					var serchClear = function(){
						$('#searchInput').val('')
					}
					
					/**收藏*/
					var shoucang = function(){
				        if (_ids == null || _ids == "") {
				            crossAPI.popAlert("请选择服务类别", "提示",
				            function() {});
				            return;
				        }
				        var staffId = _index.getUserInfo().staffId;
				        ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=insertCollection&srtypeid=' + _ids + '&creator=' + staffId + '', function(result) {
				            $("#ztreeT ul li").removeClass('activeColor');
				            $("#treeDemo_1_ul li").removeClass('activeColor');
				            crossAPI.popAlert(result.bean.start, "提示", function() {});
				        });
					}
					//点击显示路径
					var element = function(){ 
						//点击input选框选择此条时，显示在页面上
						if($(this).find('input').is(":checked")){

						}
					}
					//删除选择路径
					 var clearBtn = function(){	
						 if($('#selectContents').find('input[type="checkbox"]').is(":checked")){
									 $($('#selectContents').find('input[type="checkbox"]:checked').each(function(){ 
										 $('#selectContents').find('input[type="checkbox"]:checked').parent('li').remove();
										var ids=$(this).attr("name");
										_ids= _ids.replace(ids+",",'');
										 _number=_number-1;
										 var treeDel= false;
										 if(ztree!=null && ztree!=""){
											 var allNodes=ztree.getNodes();
					    				       
					    				        var nodes = ztree.transformToArray(allNodes);
					    				        if(nodes.length>0){
					    				            for(var i=0;i<nodes.length;i++){
					    				                if(nodes[i].id==$(this).attr("name")){
					    				                	nodes[i].checked=false;
					    				                	if(!treeDel)//判断是否删除树节点
					    	                                	treeDel=true;
					    				                }
					    				            }
					    				        }
					    				        //如果删除树节点，树刷新
					    			            if(treeDel)
					    				          ztree.refresh(); 
										 }
											 $('.showContent').find('input[name^='+ids+']').prop('checked',false); 
											 $('.showContent').find('input[name^=' + ids + ']').siblings('label').css('background','none');
								           
										 
										 
									 })
						 )
						 $("#GS").html(_number);
						 }else{
							 crossAPI.popAlert("请选择删除的服务类别","提示",function(){});
						 }
			            }
					 var Hot = function(){
						     $('#ztreeT .rightTri').toggleClass("lowerTri");
						     $("#ztreeT").toggleClass("ztreetColor");
						     $("#ztreeT ul li").toggleClass("ztreetFont");
						     $("#ztreeT ul li").removeClass('activeColor');
							 $("#ztreeT ul").finish().toggle(100);
						}
					 var treeDemoColor = function(){
						   $('#treeDemo').toggleClass("ztreetColor");
						   $("#treeDemo_1_ul li").removeClass('activeColor');
					 }
					 var activeColor = function(){
						 $("#treeDemo_1_ul li").removeClass('activeColor');
						 $(this).addClass("activeColor").siblings().removeClass('activeColor');
					 }
					 var treeDemoLiColor = function(){
						 $("#ztreeT ul li").removeClass('activeColor');
						 $(this).parent('li').addClass("activeColor").siblings().removeClass('activeColor');
					 }
					 //关联事件
					 var tabsActive = function(){
						 var $t = $(this).index();
						 $(this).addClass('active').siblings().removeClass('active');
						 $('.t-tabs-wrap li').eq($t).addClass('selected').siblings().removeClass('selected');
						 
						var str=$(this)[0].innerText;
						 if(str.indexOf("短信")>-1){
							 correlationSMS();
						 }
						 if(str.indexOf("知识")>-1){
							 correlationKno();
						 }
						
					 }
					 
					 /**查询关联短信*/
					 var correlationSMS = function(){
						 var arr=_ids.split(",");
						 var str="";
						 for(var i = 0;i < arr.length; i++) {
							 if(arr[i]!=null && arr[i]!=""){
								 str+=arr[i]+","; 
							 }
							
						 }
						 str=str.substring(0,str.length-1);
						 ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=correlationSMS&routekey='+str,function(result){
		             		var optionDic="<br/>";
							 $.each(result.beans,function(index,bean){
								 optionDic+="<a href='javascript:void(0)' id='correlationSMS' name='"+bean.demensionid+"'>"+bean.targetdesc+"</a><br>";
		             		})
		             		$("#correlationSMS").html(optionDic);
		             		})
					 }
					 
					 /**查询关联知识*/
					    var correlationKno = function() {
					        var html = "";
					        var str = "";
					        var acceptstaffno = ""; //工号
					        var arr = _ids.split(",");//获取选取的服务类型id
					        crossAPI.getIndexInfo(function(info) {
					        	acceptstaffno = info.userInfo.staffId;
					        	for (var i = 0; i < arr.length; i++) {
					                if (arr[i] != null && arr[i] != "") {
					                	var params = {
					                            method: 'qryKbsBySrTypeId_post',
					                            paramDatas: '{requestId:"' + arr[i] + '"}'
					                        }
					                	 Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=qryKbsBySrTypeId', params, function(result) {
					                         $.each(result.beans, function(index, bean) {
					                             html += "<a target='_blank' href='http://133.96.81.28:80/ngmttsso/hebeicrm.action?thirdSys=http://133.96.81.28:8080/icsp/kbs/showKng.action?kngShowType=pre%26searchRank=%26openType=1%26coluKngType=4%26kngTblFlag=0%26kngId=" + bean.knowledgeId + "%26dispId=%26buttonFlag=true%26articleFlag=true%26relativeKngFlag=true%26showType=1%26staffId=" + acceptstaffno + "%26channelId=0%26kngPointId=%26moduleId=' id=" + bean.knowledgeId + "'>" + bean.knowledgeName + "</a><br/>";
					                         });
					                     },true);
					                }
					            }
					        	$('#correlationZS').html(html);
					    	})
					    }
					//跳转关联短信
					 var correlation=function(){
						 var msgId = $(this).attr("name");
					    	var messageDetail="";
					        var data={
									 ids:msgId
							} 
							Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG003',data,function(result){
								if(result.beans[0]!=undefined && result.beans[0]!=null){
									messageDetail = result.beans[0].content;
								}	
							},true);
					        if(messageDetail===undefined || messageDetail=='undefined'){
					        	crossAPI.tips('服务器繁忙', 3000);
					        	messageDetail="";
					        }
					        if(messageDetail ==''){
					        	crossAPI.tips('根据短信Id未查询到对应短信内容!', 3000);
					        	messageDetail="";
					        	return;
					        }
						 _index.showDialog({
							    id: "ngwfheSendMsg",
								title : "短信发送" ,
								modal:false,
								url : 'html/serviceReq/sendShortMsg.html',    
								param:{data:messageDetail},
								width : 850,  
								height : 600,
							});
					 }
					 
					/*****初始化事件*****/
					var eventInit = function(options) {		
						Tree();
						_ids='';
						_number=0;
						var beans = untreatedcontactlists.getCheckedRows();
						if(beans.length>0){
							$('#searchNumber').val(beans[0].subsNumber);
							$('#serialNo').val(beans[0].serialNo);
						}
						crossAPI.getIndexInfo(function(data) {
							//员工编号
				            if (data.userInfo.staffId != null && data.userInfo.staffId!=undefined && data.userInfo.staffId != "") {
				            	acceptstaffno = data.userInfo.staffId;
				            }
				            //员工姓名
				            if (data.userInfo.staffName != null && data.userInfo.staffName!=undefined && data.userInfo.staffName != "") {
				            	staffName = data.userInfo.staffName;
				            }
				            //员工地市
				            if (data.userInfo.CTIType != null && data.userInfo.CTIType!=undefined && data.userInfo.CTIType != "") {
				            	acceptcity = data.userInfo.CTIType;
				            }
				            //员工部门
				            if (data.userInfo.deptId != null && data.userInfo.deptId!=undefined && data.userInfo.deptId != "") {
				            	acceptstaffdept = data.userInfo.deptId;
				            }
				        });
						$('.element li').on('click',element);	
						$('#serchClear').on('click',serchClear);
						$('#clearBtn').on('click',clearBtn);
						$('#shoucang').on('click',shoucang);
						$('#ywcx').on('click',selectAdd);//业务查询
						$('#ywzx').on('click',selectAdd);
						$('#ywqx').on('click',selectAdd);
						$('#yxl').on('click',selectAdd);
						$('#khts').on('click',selectAdd);
						
						//$('.showContent').on('click','input[type="checkbox"]',add);
						$('#Hot').on('click', Hot);
						$("#ztreeT ul li").on('click',activeColor);
						$('#treeDemo').on('click','#treeDemo_1_switch',treeDemoColor);
						$('#treeDemo').on('click','#treeDemo_1_ul li',treeDemoLiColor)
						$('.t-tabs-items li').on('click',tabsActive);//关联事件
						$('#tianDan').on('click',tianDan);//填单
						$('#myCollection').on('click',myCollection);
						$('#searchType').on('propertychange input',onpropertychange);//监听字母搜索
						$('#searchOK').on('click',searchOK);//搜索
						$('#searchClear').on('click',searchClear);//清空搜索框
						$('#directResponse').on('click',directResponse);//直接答复
						$('#correlationSMS').on('click','a',correlation);//关联短信
						//输入框回车事件
						$('#searchType').bind('keypress', EnterPress);
						 /**屏蔽鼠标右键*/
				        $('.showContent').bind("contextmenu", function(){
				            return false;
				        })
				        $(".showContent").on('mousedown','ul.i-ul-collect li',mouseRight);//鼠标右键事件
				        $('#deleted').on('click',deleted);//删除
				        $('#txtIds').on('click','ul.i-ul-collect li',changeColor);
					}
					
					/**我的收藏选中底色*/
				    var changeColor = function(){
				    	var kkk = $(this).find('label');
				    	if($(this).find('input[type="checkbox"]').is(':checked')){
				    		kkk.css('background','#ccc');
				    	}else{
				    		kkk.css('background','none');
				    	}
				    }
					/**鼠标右击事件删除收藏   start*/
				    var mouseRight = function(e){
				    	var evt =e|| event;
				    	if($(this).find('input[type="checkbox"]').is(':checked')){
				    		var bbb =evt.clientX - $(this).offset().left;
				      		 if (3 == evt.which) {
				           			 var ccc = $(this).offset().top - 20;
				           			 var eee = $('.showContent').scrollTop(); 
				           			$('#deleted').css({'left':bbb,'top':ccc + eee + 'px'}).show();
				      		 } else{
				    	    	    $('#deleted').hide();
				    	         }
				  	       }else{
				  	    	   $('#deleted').hide();
				  	       }
				    } 
				    
				    var deleted = function(){
				    	if(window.confirm("确定删除吗？")){
				    		var staffId = _index.getUserInfo().staffId;
				    		var array = _ids.split(",");
				    		var sc_id="";
				    		$('input[type="checkbox"][val="scflag"]:checked').each(function(){
				    			sc_id+=$(this).attr('name')+",";
				    		});
				    		sc_id = sc_id.substring(0,sc_id.length-1);
				    		var arr = sc_id.split(",");
				    		_number = _number - arr.length;
				        	var data={
				        			"creator":staffId,
				        			"ids":sc_id
				        	}
				            Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=delCollection01',data,function(status){
				            	 crossAPI.tips(status.returnMessage,1500);
				            },true)
				        	for(var i=0;i<arr.length;i++){
				        		_ids = _ids.replace(arr[i]+",", '');
				        		$('#selectContents li').find('input[name="'+arr[i]+'"]').parent('li').remove();
				        	}
				        	myCollection();
				        	$("#GS").html(_number);
				        	correlationSMS();
				        	correlationKno();
						}
				    	$('#deleted').hide();
				    }
				    /**鼠标右击事件删除收藏   end*/
					
					/**单击请求编号跳转服务请求详情*/
					var  reqDetail =function (e){
						var serviceId = $(e.currentTarget).text();
						var url=getBaseUrl();
						Util.ajax.postJson('/ngwf_he/front/sh/serviceReqDetail!execute?uid=selectNumber',{"numberId":serviceId},function(data){
							if(data.beans.length>0){
								_index.destroyTab('服务请求详情');
								_index.createTab({
									title:'服务请求详情',
									url:url+ '/ngwf_he/src/html/serviceReq/serviceDetail.html', 
									closeable:true, 
									width:90,
									option:{
										"custBean":data.beans
									}
								})
							}else{
								crossAPI.tips("抱歉,该服务请求已经不存在！",1500);
							}
						})
					}
					
					var openAddServiceReqDialog = function(){//到选择服务类别
						var beans = untreatedcontactlists.getCheckedRows();
						if(beans.length!=1){
							crossAPI.tips("必须选择且只能选择一条数据",1500);
							return;
						}
						var treeNodeId;
						var treeNodeFullName;
						 dialog1 =  new Dialog($.extend(dialogConfig1,{
				            mode:'normal',
				            id:'selectServiceDialog',
				            title:'创建服务请求',
				            cancelDisplay:true, 
				            width:1000,
				            height:600, 
				            modal:true,
				            content:require("text!html/serviceReq/workview/workViewCreateServiceReq.html")
				        }));
						$('.ui-dialog-autofocus').hide();
						eventInit(_options);
						dialog1.on('confirm',function(){
							_ids='';
							_number=0;
					    })
						
						//实现textarea中获取动态剩余字数的实现
				        $('#noMustInput').on('keyup', function() {
				            var txtval = $('#noMustInput').val().length;
				            var str = parseInt(100 - txtval);
				            if (str > 0) {
				                $('#num_txt').html('剩余可输入' + str + '字');
				                $("#num_txt").css("color", "black");
				            } else {
				                $('#num_txt').html('已经达到限定字数！');
				                $("#num_txt").css("color", "red");
				                $('#noMustInput').val($('#noMustInput').val().substring(0, 100)); //这里意思是当里面的文字小于等于0的时候，那么字数不能再增加，只能是100个字
				            }
				        })
					}
					
					/**初始化选项卡*/
					var eventTabsInit = function(){
						$(function(){
							$('#tabContainer').empty().unbind();//清除调用两次后的div中显示两个的问题
							var config = {
									el:$('#tabContainer'),
									highlight: false,
					                direction:'horizontal',//布局方向 horizontal默认横向|vertical纵向 
					                tabs:[
					                    {
					                        title:'当天接触',
					                        closeable:0,
					                        click:function(e, tabData){
					                        	prefixBiz = "dayContact";
					                        	var html = require("text!html/serviceReq/workview/dayContact.html")
					                            tab.content(html);
					                        	relevanceBiz(Util, Dialog, List,ajax,prefixBiz,'当天接触');
					                        	//$("#dayContactListDiv").on("click",".serialnoId",contactMain);
					                        	$('#dayContactListDiv').on("click", '.staffDetail', staffnoDetail);//工号详情
					                        }
					                    },
					                     {
					                        title:'未处理接触',
					                        closeable:0,
					                        click:function(e, tabData){
					                        	prefixBiz = "untreatedContact";
					                        	var html = require("text!html/serviceReq/workview/untreatedContact.html")
					                            tab.content(html);
					                            relevanceBiz(Util, Dialog, List,ajax,prefixBiz,'未处理接触');
					                        	$('#untreatedContactListDiv').on("click", '.staffDetail', staffnoDetail1);//工号详情
					                        	
					                        	$('#addServiceReq').on("click", openAddServiceReqDialog);//新增请求
					                        }
					                    },
					                     {
					                        title:'个人考评',
					                        closeable:0,
					                        click:function(e, tabData){
					                        	require(['js/serviceReq/queryEvaResult'], function(QueryEvaResultSub) {	
							                        var queryEvaResultSub = new QueryEvaResultSub(_index, _options);
							                        tab.content(queryEvaResultSub.content);	
							                    });
					                        }
					                    },
					                     {
					                        title:'当天请求',
					                        closeable:0,
					                        click:function(e,tabData){
					                        	prefixBiz = "dayRequest";
					                        	tab.content(require("text!html/serviceReq/workview/dayRequest.html"));
					                        	relevanceBiz(Util, Dialog, List, ajax,prefixBiz,'当天请求');
					                        	$('#dayRequestListDiv').on("click", '.reqDetail', reqDetail);//服务请求详情
					                        }
					                    },
					                    
					                    {
					                        title:'工单查询',
					                        closeable:0,
					                        click:function(e,tabData){
					                        	require(['js/serviceReq/querySheetMessage'], function(QuerySheetMessage) {	
							                        var querySheetMessage = new QuerySheetMessage(_index, _options);
							                        tab.content(querySheetMessage.content);	
							                    });  
					                        }
					                    }
					                ]	
							};
							var tab = new Tab(config);
						})
					}
					
					/**个人考评*/
				    function personalEvaluationList(param1,param2){
				    	
				    }
				    
				    /**工单查询*/
				    function workOrderInquiryList(param1,param2){
				    	
			        }
				    
					/***初始化加载**/
				 	IndexLoad(function(IndexModule, options){
						_index = IndexModule;
						_options=options;
						eventTabsInit();
						var typeId;
						creartSelect(typeId);
						var data1={};
						Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getPropertiesIP',
								data1,function(result,isOK){
								if(isOK){
									ngcctIpPort=result.bean.ngcctIpPort;
									oldWorkSheetIpPort=result.bean.oldWorkSheetIpPort;
								}
						});
					})
			}
	)
	
})

