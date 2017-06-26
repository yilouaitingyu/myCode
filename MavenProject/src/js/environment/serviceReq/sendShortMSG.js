define(function(require){
require( [ 'Util', 'indexLoad','dialog','date','selectTree','simpleTree','js/components/keyVerify','js/components/ajaxfileupload'],
		function(Util,IndexLoad,Dialog,MyDate,SelectTree,SimpleTree,KeyVerify) {
			var _index;
			var msgMultResultDetailMap = new Array();
			var origStaffId;//老工号
			var staffId;
			var scrollFlag = true;
			
			/**初始化事件*/
			var eventInit = function() {
				//$('#acceptMan').on('keypress',EnterPress); 
				staffId = _index.getUserInfo().staffId;
				//获取受理号码
				crossAPI.getContact('getClientBusiInfo',function(businInfo){
					if(businInfo!=undefined && businInfo!="" && businInfo.bean!=undefined){
						$('#acceptMan').val( businInfo.bean.msisdn);
					}
				})
				/*//受理号变更事件
				crossAPI.on('acceptNumberChange',function(data){
					$('#acceptMan').val(data);
				})
				*/
				crossAPI.getContact('getCheckedPhoneNum',function(businInfo){
					$('#acceptMan').val(businInfo);
				});
				$('#impoortPersons').on('click', impoortPersons);//导入联系人
				//$('#timingSend').on('click', sendTiming);//定时发送
				//$('#instantSend').on('click', instantSend);//立即发送
				$('#sendBtn').on('click', sendMSG);//发送
				$('#commonUseMSG').on('click', commonUseMSG);//常用短信
				$('#favorite').on('click',favoriteMSG);//收藏夹
				authRight();//判断是否有权限
				/**从导入联系人页面传过来的解析结果*/
				crossAPI.on("refreshSend",function(param){
					//$('#acceptMan option:first').prop("selected","selected").text(param.bean);
					$('#acceptMan').val(param.bean);
				})
				
			}
			//发送短信权限判断
			var authRight=function (){
				var authId="000220008";
				var verResult=KeyVerify(authId,staffId);
				if(verResult == "0"){
					$("#shortMsgContent").attr("contenteditable",false).css('background','#f9f9f9');
				}
			}
			
			/**统计字符数 start*/
			var countWords=function(){
				var $len = $.trim($('#shortMsgContent').text()).length;
				$('#charNum').text($len);
			}
			
            $('#shortMsgContent').on('focus',function(){
            	clearInterval(timer);
                var timer = setInterval(countWords,20);
            })
            /**统计字符数 end*/
            
			/**短信收藏夹*/
			var favoriteMSG=function(){
            	//var returnResult =window.showModalDialog("http://133.96.81.28:80/ngmttsso/hebeicrm.action?thirdSys=http://133.96.81.28:8080/csp/mmb/openCommUseFavoriteSendPage.action?mediaType=01&moduleId=1058&businessType=001","短信模板","dialogWidth:800px;resizable=no;status=no;dialogHeight:600px;dialogLeft:400px;dialogTop:150px;center:yes;help:yes;resizable");
				//'http://133.96.81.28:80/ngmttsso/hebeicrm.action?thirdSys=http://133.96.81.28:8080/csp/mmb/openCommUseFavoriteSendPage.action?mediaType=01&moduleId=1058&businessType=001' ,
            	/**初始化转换新老工号*/
				//crossAPI.getIndexInfo(function(info){//crossAPI.getIndexInfo(function(info){info.userInfo.staffId;})})
				Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=favoritMSG004',{"staffId":staffId,"provinceId":"00030004","systermNo":"CSP"},function(result){
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
					_index.showDialog({
						title : "短信收藏夹" ,
						modal:false,
						url :'html/serviceReq/favorite.html',    
						param:{staffId:origStaffId},
						width : 800,  
						height : 550
					})
				});
			}
            
			/**常用短信*/
			var commonUseMSG=function(){
				/*_index.showDialog({
					title : "常用短信" ,
					modal:false,
					url :'html/serviceReq/commonMsg.html',    
					param:{staffId:origStaffId},
					width : 800,  
					height : 550
				})*/
				var dialogConfig = {
		        		mode : 'normal', 
		        		delayRmove:300, 
		        		title : '常用短信', 
		        		content :require("text!html/serviceReq/commonMsg2.html"),
		        		width : 800,
		        		height :430,
		        		skin : 'dialogSkin',
		        		fixed : true,
		        		quickClose : false,
		        		modal : false,
		                cancelDisplay:false,
		                ok: function() { 
		                	var ids = "";
		    				$.each($("#msgName")[0].children,function(index, bean){
		    					if(bean.id != undefined && bean.id != ""){
		    						ids += bean.id + ",";
		    					}
		    				});
		    				ids = ids.substring(0,ids.length-1);
		    				//查询短信内容拼接短信
		    				var data = {
		    						cityId: $('#cityid').val(),
		    						ids: ids
		    				};
		    				Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG003', data, function(data){
		    					 console.log(data);
		    					 msgMultResultDetailMap=data.beans;
		    					 if(msgMultResultDetailMap.length>0){
		    							var html='';
		    							var n=0;
		    							for(var i=0;i<msgMultResultDetailMap.length; i++){
		    								n++;
		    								if($('input[type="checkbox"]').is(':checked') == true){
		    									html += "===============第"+n+"条=============== "+"<br>"+msgMultResultDetailMap[i].content+"<br>";
		    								}else{
		    									html += msgMultResultDetailMap[i].content+"<br>";
		    								}
		    							}
		    							console.log(msgMultResultDetailMap);
		    							$('#shortMsgContent').html(html);
		    						} 
		    						var html=$('#shortMsgContent').html();
		    						$('#shortMsgContent').html(html+"<br>");
		    				},true);
		                }
	    	        }
		        	var dialog = new Dialog(dialogConfig);
				dictionaryHasDefault('cityid');//用户地市
				$('#searchContent').on('keypress',EnterPress);
				$('#msgTitle').on('keypress',EnterPress);
				/*$('#confirmBtn').on('click', confirm);*/
				$('#moveUp').on('click', moveUp);
				$('#moveDown').on('click', moveDown);
				$('#delRow').on('click', delRow);
				$('#clearAll').on('click', clearAll);
				//$('#favorit').on('click', favorit);//收藏
				$('#searchBegin').on('click',searchBegin);
				$('#cityid').on('change',changeCity);//地市改变
				$('#treeDemo input[type="checkbox"]').on('click',checkNode);//节点选中事件
				$('#msgName').on('click','li',nodeContent);//选中后内容
				$('#searchContent').on("propertychange input",nameChange);//内容变化
				$('#searchContent').on("focus",contentFocus);
				$('#searchContent').on("blur",contentBlur);
				$('.commonMessageRight').on('click','ul li',choiceMediaName);
				$('#dirAndMediaUl').on('mouseover','li',function(){
					var titles = $(this).text()
					$(this).attr('title',titles)
				});
				$("#dirAndMediaUl").scroll(function() {
					flag = false;
					$('#searchContent').focus();
				});
				initTree();
				$('#searchContent').focus();
				   /*var returnResult =window.showModalDialog("../../html/contact/smsModule.html","短信模板","dialogWidth:900px;resizable=no;status=no;dialogHeight:800px;dialogLeft:400px;dialogTop:150px;center:yes;help:yes;resizable");
			       var selectedId="";//短信id  messageID
			       var selectedName="";//短信名称  messageTitle
			       var messageDetail="";//短信内容  messageDetail
			       var html=$('#shortMsgContent').html();//关联短信的短信内容;
			       if(returnResult){
			    	   msgMultResultDetailMap = new Array();
			    	   html="";
			    	   var n=0;
			    	   for(var i=0;i<returnResult.length;i++){
			    		   if(i==0){
			    			   selectedId = returnResult[i].messageID;
			        		   selectedName=returnResult[i].messageTitle; 
			        		   messageDetail=returnResult[i].messageDetail; 
			    		   }else{
			        		   selectedId = selectedId+","+returnResult[i].messageID;
			        		   selectedName=selectedName+","+returnResult[i].messageTitle;
			        		   messageDetail=messageDetail+","+returnResult[i].messageDetail;
			    		   }
			    		   msgMultResultDetailMap.push(returnResult[i]);
			    		   if($('input[type="checkbox"]').is(':checked')==true){
			    			    n++;
								html += "===============第"+n+"条=============== "+"<br>"+returnResult[i].messageDetail+"<br>";
			    		   }else
			    		   {
			    			   html += returnResult[i].messageDetail+"<br>";
			    		   }
			    	   }
			       }else{
			    	   html=$('#shortMsgContent').html();
			       }  
			       $('#shortMsgContent').html(html);*/    
			}
			/**  常用短信js引入 start */
			/**加载数据字典*/
			var dictionaryHasDefault =  function(selId){
				//var params = {method:mythod,paramDatas:'{typeId:"'+typeId+'"}'};
				var optionDic="<option selected='selected' value='HB.KF.01'>省中心(HB.KF.01)</option>" +
				"<option value='HB.KF.09'>衡水公司(HB.KF.09)</option>" +
				"<option value='HB.KF.02'>石家庄公司(HB.KF.02)</option>" +
				"<option value='HB.KF.14'>南区客服中心(HB.KF.14)</option>" +
				"<option value='HB.KF.04'>张家口公司(HB.KF.04)</option>" +
				"<option value='HB.KF.13'>北区客服中心(HB.KF.13)</option>" +
				"<option value='HB.KF.03'>保定公司(HB.KF.03)</option>" +
				"<option value='HB.KF.12'>秦皇岛公司(HB.KF.12)</option>" +
				"<option value='HB.KF.06'>唐山公司(HB.KF.06)</option>" +
				"<option value='HB.KF.05'>承德公司(HB.KF.05)</option>" + 
				"<option value='HB.KF.08'>沧州公司(HB.KF.08)</option>" + 
				"<option value='HB.KF.07'>廊坊公司(HB.KF.07)</option>" + 
				"<option value='HB.KF.10'>邢台公司(HB.KF.10)</option>" + 
				"<option value='HB.KF.11'>邯郸公司(HB.KF.11)</option>";
				$('#'+selId).append(optionDic);
			}
			/**enter键事件*/
		    var EnterPress = function EnterPress() {
		        if (event.keyCode == 13) {
		            return false;
		        }
		    }
			/**节点选中后根据短信名称查询常用短信内容*/
			var nodeContent=function(){
				$(this).addClass('selectedli').siblings().removeClass('selectedli');
				var msgTitle= $(this).text();
				//$('#msgTitle').val(msgTitle);
				var data={
						cityId: $('#cityid').val(),
						ids: $(this)[0].id
				};
				Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG003',data,function(result){
					$('#msgTitle').val(result.beans[0].name);
					$('#msgContent').val(result.beans[0].content);
				},true);
			}
			
			/**改变地市查询常用短信*/
			var changeCity=function(){
				initTree();
			}
			/**点击查询出来的名称*/ 
			var choiceMediaName = function(){
				console.log($(this));
				var val = $(this).attr("msgId");
				var name = $(this).text();
				var newName;
				if(val != undefined && val != "" &&
						name != undefined && name != ""){
					newName = name.split("->");
					var len = newName.length;
					var a = $("#msgName").find('#' + val);
					$('#msgName li').removeClass('selectedli');
					if(a.html() == undefined){
						$('#msgName').append('<li  class="selectedli" id='+val+'>'+newName[len-1]+'</li>');
					} else {
						a.addClass('selectedli');
					}
					$('#msgTitle').val(newName[len-1]);
					//var content = $(this).attr("content");
					$('#msgContent').val($(this).attr("content"));
				}
				//$("#dirAndMediaUl").find("li").remove();
				$("#dirAndMediaUl").hide();
			}
			/**聚焦*/
			var contentFocus = function(){
				if($("#searchContent").val() != ""){
					$("#dirAndMediaUl").show();
				}
			}
			
			var contentBlur = function(){
				setTimeout(function(){
					if(flag){
						$("#dirAndMediaUl").hide();
					}
					
				}, 500);
				flag = true;
			}
			/**搜索框name变化触发*/
			var nameChange = function(){
				$('#dirAndMediaUl').show()
				var searchContent=$.trim($('#searchContent').val());
				if(searchContent != ""){
					var param = {
							cityId: $('#cityid').val(),
							name: searchContent
					};
					Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG005',param,function(data){
						$("#dirAndMediaUl").find("li").remove();
						$.each(data.beans,function(index, node){
							$("#dirAndMediaUl").append("<li msgId="+node.id+" content="+ node.content +">"+ node.name +"</li>");
						});
					},true);
				} else {
					$("#dirAndMediaUl").find("li").remove();
					$("#dirAndMediaUl").hide();
				}
			}
			
			
			/**模糊查询短信标题*/
			var searchBegin=function(){
				var searchContent=$.trim($('#searchContent').val());
				if(searchContent != ""){
					var param = {
							cityId: $('#cityid').val(),
							name: searchContent
					};
					Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG004',param,function(data){
						$("#dirAndMediaUl").find("li").remove();
						$.each(data.beans,function(index, node){
							$("#dirAndMediaUl").append("<li value="+node.id+">"+ node.name +"</li>");
						});
					});
				} else{
					$("#dirAndMediaUl").find("li").remove();
					$("#dirAndMediaUl").hide();
				}
				$('#searchContent').focus();
			}
			
			/**上移*/
			var moveUp=function(){
				var index = $('#msgName').find('.selectedli');
				if(index.index() != 0){
					index.prev().before(index);
				}else{
					crossAPI.tips("该条记录已移动到最上方",1500); 
				}
			}
			
			/**下移*/
			var moveDown=function(){
				var index = $('#msgName').find('.selectedli');
				var length = $('#msgName').find('li').length;
				if(index.index() != length-1){
					index.next().after(index);
				}else{
					crossAPI.tips("该条记录已移动到最下方",1500);
				}
			}
			
			/**删除*/
			var delRow=function(){
				var index = $('#msgName').find('.selectedli');
				if(zTree_msg.getNodeByParam("id", index[0].id, null) != undefined){
					zTree_msg.getNodeByParam("id", index[0].id, null).checked = false;
					var parentNode = zTree_msg.getNodeByParam("id", index[0].id, null).getParentNode();
					while(parentNode != undefined){
						parentNode.checked = false;
						parentNode = parentNode.getParentNode();
					}
				}
				$('#msgName').find('.selectedli').remove();
				$('#msgTitle').val('');
				$('#msgContent').val('');
				zTree_msg.refresh();
			}
			
			/**清空*/
			var clearAll=function(){
				$('#msgName').html('');
				$('#msgTitle').val('');
				$('#msgContent').val('');
				$.each(zTree_msg.getCheckedNodes(true),function(index, node){
					node.checked = false;
				});
				zTree_msg.refresh();
			}
			
			/**收藏*/
			var favorit=function(){
				var msgName=$.trim($('#msgName').find('.selectedli').text());
				var callcontent=$.trim($('#msgContent').val());
				var staffId=_index.getUserInfo().staffId;//员工工号
				var data={
						method:"",
						params:'{msgName:"'+msgName+'",callcontent:"'+callcontent+'",staffId:"'+staffId+'"}'
				}
				Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=favoritMSG001',data,function(data){
					crossAPI.popAlert(data.bean.favoritStatus,"收藏短信",function(){});
				},true);
			}
			
			/**确定*//*
			var confirm=function(){
				//查出所有选中的短信的id
				var ids = "";
				$.each($("#msgName")[0].children,function(index, bean){
					if(bean.id != undefined && bean.id != ""){
						ids += bean.id + ",";
					}
				});
				ids = ids.substring(0,ids.length-1);
				//查询短信内容拼接短信
				var data = {
						cityId: $('#cityid').val(),
						ids: ids
				};
				Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG003', data, function(data){
					crossAPI.trigger(['服务请求类别关联'],'commonMsg',data.beans);
					 Util.eventTarget.trigger("open",data.beans);
				},true);
				_index.destroyDialog();
			}*/
			
			/**常用短信树结构，调用接口老系统URL*/
			var initTree = function(){
				 var setting = {
		            check: {
		            	enable: true,
		            	//chkStyle : "checkbox", 
		            	chkboxType : { "Y": "s", "N": "ps"}
		            },
		            async:{
		            	enable : true,
		            	dataType:"json",
		            	url : '/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG001',
		            	autoParam : ["id"],
		            	otherParam :{"cityId": function(){return $('#cityid').val();}},
		            	dataFilter:function(treeId, parentNode, responseDta){//转化数据
							return responseDta.beans;
						}
		            },
		            callback:{
		            	onClick : leafCheck,
		            	onCheck : nodeCheck
		            	//onAsyncSuccess: loadSuccess
		            },
		            data: {  
		                simpleData: {  
		                	enable: true ,
							idKey: "id",
							pIdKey: "pId"
		                }  
		            },
		            view: {
		            	dblClickExpand: false
		            }
				}
				 var param = {
						 method:"",
						 cityId:function(){return $('#cityid').val();},
						 id:"00000000000000000001"
				 };
				 Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG001',param,function(data){
					 zTree_msg = $.fn.zTree.init($("#treeDemo"),setting , data.beans);
				},true);
				 
			}
			
			var loadSuccess = function(event, treeId, treeNode){
				if(treeNode.isParent && treeNode.checked){
					zTree_msg.expandNode(treeNode, true, false, true);
					$.each(treeNode.children, function(i,childNode){
						childNode.checked = true;
						checkNode(childNode, true);
					});
				}
				zTree_msg.refresh();
			}
			
			/**叶子节点单击事件*/
			var leafCheck = function(event, treeId, treeNode){
				if(!treeNode.isParent){
					if(treeNode.checked){
						treeNode.checked = false;
						checkNode(treeNode,false);
					}else{
						treeNode.checked = true;
						checkNode(treeNode,true);
					}
				}else{
					if(treeNode.zAsync){
						zTree_msg.expandNode(treeNode, treeNode.open?false:true, false, true);
					}else{
						treeNode = syncLoadNode(treeNode);
					}
				}
				zTree_msg.refresh();
			}
			
			/**同步加载树节点*/
			var syncLoadNode = function(treeNode){
				var param = {
						"id": treeNode.id,
						"cityId": $('#cityid').val()	
				};
				Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG001', param, function(data){
					//var nodes = zTree_msg.addNodes(treeNode, 0, data.beans);
					treeNode.children= data.beans;
					treeNode.zAsync = true;
					treeNode.open = true;
				},true);
			}
			
			/**点击节点复选框节点事件*/
			var checkNode=function(treeNode, oper){
				//treeNode.checked = oper;
				if(oper){
					//选中节点查找
					var a = $("#msgName").find('#' + treeNode.id);
					$('#msgName li').removeClass('selectedli');
					//未找到新增
					if(a.html() == undefined && !treeNode.isParent){
						$('#msgName').append('<li class="selectedli" id='+treeNode.id+'>'+treeNode.name+'</li>');
					}else{//找到的话
						a.addClass('selectedli');
					}
					$('#msgTitle').val(treeNode.name);
					$('#msgContent').val(treeNode.content);
				}else{
					var node = $('#msgName').find('#'+ treeNode.id);
					if(node.hasClass('selectedli')){
						$('#msgTitle').val('');
						$('#msgContent').val('');
					}
					node.remove();
				}
			};
			/**点击节点复选框时触发该事件 */
			var nodeCheck = function(event, treeId, treeNode){
				if(treeNode.checked){
					nodeChildOper(treeNode, true);
				} else {
					nodeChildOper(treeNode, false);
					var parentNode = treeNode.getParentNode();
					while(parentNode != undefined && parentNode != null && parentNode != ""){
						parentNode.checked = false;
						parentNode = parentNode.getParentNode();
					}
				}
				zTree_msg.refresh();
			}
			/**树节点的子节点级联操作
			 * 当点击父节点时要异步加载所有子节点
			 * */
			/*var nodeChildOper = function(treeNode, oper){
				if(treeNode.isParent && treeNode.children != undefined){
					$.each(treeNode.children, function(i,childNode){
						if(childNode.isParent && !childNode.zAsync){
							var data = {
									"id": childNode.id,
									"cityId": $('#cityid').val()	
							};
							Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG001', data, function(data){
								zTree_msg.addNodes(childNode, data.beans)
							},true);
							childNode.zAsync = true;
							//zTree_msg.refresh();
						}
						nodeChildOper(childNode, oper);
					});
				}
				if(oper && !treeNode.open){
					zTree_msg.expandNode(treeNode, oper, false, true);
					zTree_msg.refresh();
				}
				treeNode.checked = oper;
				checkNode(treeNode, oper);
			}*/
			var nodeChildOper = function(treeNode, oper){
				//不是父类节点
				if(!treeNode.isParent){
					checkNode(treeNode, oper);
					return false;
				}
				//如果是父节点且是勾选事件遍历子节点
				if(treeNode.isParent){
					//一、重新加载一下该节点然后递归该节点所有子节点
					/*if(!treeNode.zAsync && oper){
						zTree_msg.reAsyncChildNodes(treeNode, "refresh");
					}*/
					//二、根据根节点和cityId重新查一遍生成新节点
					if(!treeNode.zAsync && oper){
						syncLoadNode(treeNode);
						/*var param = {
								"id": treeNode.id,
								"cityId": $('#cityid').val()	
						};
						Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG001', param, function(data){
							//zTree_msg.expandNode(treeNode, true, false, true);
							var nodes = zTree_msg.addNodes(treeNode, 0, data.beans);
							treeNode.children= data.beans;
							treeNode.zAsync = true;
							treeNode.isAjaxing = true;
							treeNode.open = true;
						},true);*/
					}
					if(treeNode.children != undefined){
						$.each(treeNode.children, function(i,childNode){
							if(oper){
								childNode.checked = true;
							}
							nodeChildOper(childNode, oper);
						});
					}
				}
				return true;
			}
			/**  常用短信js引入 end */
			/**逐条发送事件*/
			$('input[type="checkbox"]').on('change',function(){
				  if(msgMultResultDetailMap.length>0){
					  var html='';
					  var n=0;    
					  for(var i=0;i<msgMultResultDetailMap.length; i++){
							if($(this).is(':checked')==true){
								n++;
								html += "===============第"+n+"条=============== "+"<br>"+msgMultResultDetailMap[i].content+"<br>";
							}else{
								html += msgMultResultDetailMap[i].content+"<br>";
							} 
						} 
					  $('#shortMsgContent').html(html);
				  } 
			})
			
			/**手机号验证*/
			var checkTelephone = function(num){
				if("," == num){
					return false;
				}
	            for(i=0;i< num.length;i++) {
	                if((num.charAt(i) >='0' &&(num.charAt(i) <='9')) || (num.charAt(i) == ',') )
	                {
	                    continue;
	                }
	                else
	                {
	                    return false;
	                }
	            }
            	return true;
            }
			
			/**发送短信*/
			var sendMSG = function(){
				var sender=$.trim($('#callerno option:selected').text());//发送者
				var receiver=$.trim($('#acceptMan').val());//接收者
				var sendtime = getNowFormatDate();//发送时间
				var sendStatus;//发送结果
				var sendMessageTip="";//发送失败提示语
				var sendFailRecord="";//发送失败条数记录
				var sendFlag=true;//发送成功标识
				var arr2=[];//接收者数组
				var data={};//发送参数
				if(receiver==''){
					crossAPI.tips("接收人不可为空！",1500);
					return;
				}
				var flag = checkTelephone(receiver);
				if(flag==false){
					crossAPI.tips("号码格式不正确！",1500);
					return;
				}
				//var submittime="";//立即发送
				//var receiveNumber=receiver;
				/*if($('input[type="radio"]:checked').val()=='0'){
					sendtime=getNowFormatDate();
				}else{
					sendtime = $('input[name="sendTime"]').val();
					if(sendtime < getNowFormatDate()){
						alert("定时发送不能小于当前时间！");
						return;
					}
				}*/
				var callcontent = $.trim($('#shortMsgContent').text());//发送内容
				if(callcontent==''){
					crossAPI.tips("发送内容不可为空！",1500);
					return;
				} 
				if($('input[type="checkbox"]').is(':checked')==true 
						&& msgMultResultDetailMap != null && msgMultResultDetailMap.length > 0){//逐条发送
					for(var j=0;j<msgMultResultDetailMap.length;j++){
						data={
								"sender": sender,
								"sendTemplateId": msgMultResultDetailMap[j].id,
								"sendDetail": msgMultResultDetailMap[j].content,
								"beans":receiver
						}
						/**调发送接口*/
						Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=sendShortMsg001',data,function(status){
							sendStatus = status.returnCode;
							sendMessageTip = status.returnMessage;
						},true)
						
						/***-----------------添加接触记录---------------*****/
						if(sendStatus=='0'){
							arr2 = receiver.split(",");
							for(var i in arr2){
								var data22={
										"channelId":"01",//接触渠道编号固定值
										"channelName":"人工",
										"mediaTypeId":"02",//02短信
										"mediaTypeName":"短信",
										"callType":"1",//0呼入1 呼出
										"callerNo":sender,
										"calledNo":arr2[i],
										"subsNumber":arr2[i],
										"staffId":staffId,
										"contactStartTime":sendtime,//接触开始时间
										"contactEndTime":sendtime,//接触结束时间
										"playRecordFlag":"0",//放音标识
										"surveyTypeId":"02",//满意度调查类型 02代表未调查
										"userSatisfy":"0",//未评价
										"hasRecordFile":"0",//是否有录音文件
										"msgType":"001",//文本
										"content":msgMultResultDetailMap[j].content,//消息内容
										"duration":"0",
										"srFlag":"0",//是否创建服务请求
										"serviceTypeId":"heytck",
										"originalCreateTime":sendtime
										/*"subject":"",//主题
										"provinceId":"",
										"ctiId":"",
										"ccid":"",
										"vdnId":"",
										"callId":"",
										"callIdTime":"",//呼叫进入时间
										"callIdDsn":"",//呼叫进入的任务号
										"callIdHandle":"",//呼叫进入一个任务的次数
										"callIdServer":"",//唯一标识一个服务器的标识
										"callSkillId":"",//呼叫技能编号
										"orgCallerNo":"",//原始主叫
										"orgCalledNo":"",//原始被叫
										"remark":"",
										"contactEndTime":"",//接触结束时间
										"qcFlag":"0",//质检标识
										"qcStaffId":"",//质检代表帐号
										"staffHangup":"",//挂机方
										"userSatisfy2":"",//二次满意度结果
										"userSatisfy3":"",//互联网二次满意度调查结果
										"custId":"",//客户id
										"custName":"",//客户姓名
										"custLevelId":"",
										"custLevelName":"",
										"custBrandId":"",
										"custBrandName":"",
										"custCityId":"",
										"custCityName":"",
										"custCityId2":"",
										"custCityName2":"",
										"firstResponseTime":"",//第一次响应时间
										"staffCityId":"HB.KF.14",
										"contactDuration":"0",
										"haveServiceFlag":"0",//是否创建服务请求
										"interceptFlag":"0",//拦截标识
										"listenFlag":"0",//监听标识
										"innerHelpFlag":"0",//内部求助标识
										"mainContactFlag":"1",//如果当前有通话或者接触信息，那么固定为0，如果没有，填1
										"expFlag":"0",//转经验集标识
										"isProcessed":"1",//是否已处理
										"dyfield19":"0",//入质检池标识
										"holdDuration":"0"//保持时长  */
								}
								Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=afterSendMSG001',data22,function(data){
									/*if(data.returnCode=='0'){
										crossAPI.popAlert("添加接触记录成功！","【提示】",function(){});
									}else{
										crossAPI.popAlert("添加接触记录失败！","【提示】",function(){});
									}*/
								},true)
							}
						}else{
							sendFlag=false;
							sendFailRecord+=j+1+",";
					    }
					}//end for循环
					if(sendFlag==true){
						crossAPI.popAlert("发送成功！","【短信发送结果】",function(){});
					}else{
						sendFailRecord=sendFailRecord.substring(0,sendFailRecord.length-1);
						crossAPI.popAlert("第"+sendFailRecord+"条发送失败！请联系管理员！","【短信发送结果】",function(){});
					}
					//发送完清空，避免叠加重复发送
					msgMultResultDetailMap = new Array();
					
				}else{ //如果不是逐条
					data={
						"sender": sender,
					    "sendTemplateId": "9999999999",
					    "sendDetail": callcontent,
						"beans":receiver
					}
					/**调发送接口*/
					Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=sendShortMsg001',data,function(status){
						sendStatus = status.returnCode;
						sendMessageTip = status.returnMessage;
					},true)
					
					/***-----------------添加接触记录---------------*****/
					if(sendStatus=='0'){//发送短信成功
						crossAPI.popAlert("发送成功！","【短信发送结果】",function(){});
						arr2 = receiver.split(",");
						for(var i in arr2){
							var data22={
									"channelId":"01",//接触渠道编号固定值
									"channelName":"人工",
									"mediaTypeId":"02",//02短信
									"mediaTypeName":"短信",
									"callType":"1",//0呼入1 呼出
									"callerNo":sender,
									"calledNo":arr2[i],
									"subsNumber":arr2[i],
									"staffId":staffId,
									"contactStartTime":sendtime,//接触开始时间
									"contactEndTime":sendtime,//接触结束时间
									"playRecordFlag":"0",//放音标识
									"surveyTypeId":"02",//满意度调查类型 0代表未调查
									"userSatisfy":"0",//未评价
									"hasRecordFile":"0",//是否有录音文件
									"msgType":"001",//文本
									"content":callcontent,//消息内容
									"duration":"0",
									"srFlag":"0",//是否创建服务请求
									"serviceTypeId":"heytck",
									"originalCreateTime":sendtime
							}
							Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=afterSendMSG001',data22,function(data){
								/*if(data.returnCode=='0'){
									crossAPI.popAlert("添加接触记录成功！","【提示】",function(){});
								}else{
									crossAPI.popAlert("添加接触记录失败！","【提示】",function(){});
								}*/
							},true)
						}
					}else{
						crossAPI.popAlert("发送失败！请联系管理员！失败原因："+sendMessageTip,"【短信发送结果】",function(){});
				    }
				}//end 发送状态
				_index.destroyDialog('ngwfheSendMsg');
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
			
			/*var date = new MyDate({
				el:$('#chooseTime'),
				label:'发送时间',
				name:'sendTime',    
				format: 'YYYY-MM-DD hh:mm:ss',  
				defaultValue:getNowFormatDate(),//laydate.now(0)+' 00:00:00', 
				min: laydate.now(0),     
				istime: true,
				istoday: true,
				choose:function(){}
			});*/
		
			/*var instantSend=function(){
				$('#chooseTime').hide();
			}*/
			
			/*var sendTiming=function(){
				$('#chooseTime').show();
				$('input[name="sendTime"]').val(getNowFormatDate());
			}*/
			
			/**导入联系人*/
			var impoortPersons=function(){

				var config = {
			            mode:'normal', 
			            delayRmove:300, 
			            title:'导入联系人',
			            content:
			            	'<div id="excel">'+
						    '<label>选择待读取的excel文件</label>'+
							'<input type="file" id="chooseExcel" name="chooseExcel">'+
						    '</div>'+
						    '<div class="excelA" id="excelA">'+
							'<ul>'+
							'<li>'+
							'<label>从第几行第几列读取Excel信息，默认为第一行第一列(最好是矩阵、整齐数据)</label>'+
							'</li>'+
							'<li>'+
							'<div>'+
							'<input type="text" value="1" id="rows" name="rows">行'+
							'<input type="text" value="1" id="cols" name="cols">列'+
							'</div>'+
							'</li>'+
							'</ul>'+
						    '</div>',
			            ok:function(){
							var file=$('input[type="file"]').val();
							var rows=$.trim($('#rows').val());
							var cols=$.trim($('#cols').val());
							if(file){
								$.ajaxFileUpload
					            ({
				                    url: '/ngwf_he/front/sh/sendMSG!importPhones?uid=importPhones001&rows='+rows+'&cols='+cols,
				                    secureuri: false, 
				                    fileElementId: "chooseExcel",
				                    dataType: 'JSON', 
				                    success: function (data)
				                    {
				                    	var phones =JSON.parse(data);
				                    	var dataBean={
				                    			"bean":phones.bean.phones
				                    	}
				                    	crossAPI.popAlert("解析成功！","导入结果",function(){});
				                    	$('#acceptMan').val(phones.bean.phones)
				                    },
				                    error: function (data)
				                    {
				                    	alert("导入失败！");
				                    	dialog.remove();
				                    }
					            });
							}else{
								alert("请选择文件！");
							}
			            	
			            },
			            okValue: '确定', 
			            cancel: function(){
			            	dialog.remove();
			            },
			            cancelValue: '取消', 
			            cancelDisplay:true, 
			            width:600,
			            height:280,
			            skin:'dialogSkin',
			            fixed:false,
			            quickClose:false ,
			            modal:false 
			        }
				var dialog=new Dialog(config);
			}
			
			/**初始化加载*/
			IndexLoad(function(IndexModule, options){
				_index = IndexModule;
				$('#shortMsgContent').text(options.data);
				eventInit();
			});
})
})