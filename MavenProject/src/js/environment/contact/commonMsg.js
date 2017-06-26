define( [ 'Util', 'indexLoad','selectTree','simpleTree'],
		function(Util,IndexLoad,SelectTree,SimpleTree) {
			var _index;
			var zTree_msg;
			var flag = true;
			
			/**初始化事件*/
			var eventInit = function() {
				$(document).on('keypress',EnterPress);
				//加载数据字典
				dictionaryHasDefault('cityid');//用户地市
				$('#confirmBtn').on('click', confirm);
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
				$('#dirAndMediaUl').on('click','ul li',choiceMediaName);
				$('#dirAndMediaUl').on('mouseover','li',function(){
					var titles = $(this).text();
					$(this).attr('title',titles);
				});
				$("#dirAndMediaUl").scroll(function() {
					flag = false;
					$('#searchContent').focus();
				});
			};
			
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
		            return ;
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
					$('#msgContent').val($(this).attr("content"));
				}
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
			
			/**确定*/
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
				},true);
				_index.destroyDialog();
			}
			
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

			/**初始化加载*/
			IndexLoad(function(IndexModule, options){
				_index = IndexModule;
				eventInit();
				initTree();
			});
			
});