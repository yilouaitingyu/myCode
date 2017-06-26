define(function(require){
	require(['Util', 'list' ,'ajax','form','dialog','validator','zTree','tab','indexLoad','date','simpleTree',
				'selectTree'],
				function(Util, List ,Ajax, Form, Dialog,Validator,zTree,Tab,IndexLoad,MyDate,SimpleTree,
						SelectTree){
					var _index;
					var list;
					var _ids="";
					var _number=0;
					var ztree;
					var ctiData;
					var _srtypeId;
					var _operationStatus;
					var _subsBrand;
					var _subsCity;
					var _subslevel;
				var eventInit = function() {
					$('#chaxun').on('click', search);//查询
					$('#chongzhi').on('click', clear);//重置
					$("#biaodan").on("click",".remark",contactMain);
					$("#biaodan").on("click",".serveicId",selectadd);
					$("#biaodan").on("click",".handlingstaffno",staffno);
					//$('#daochu').on('click', showDialog);
					$("#srtypeIdIcon").on("click",selectedTree);
					$('#reproducing').on('click', reproducing);
					$('#srtypeId').on('mouseover',function(){
						var titles = $(this).val()
						$(this).attr('title',titles)
					})
					
					/**请求类树触发事件*/
				crossAPI.on("servicechose",function(param){
					$("#srtypeId").val(param[0]);
					$("#srtypeId").attr("name",param[1]);
				})
					
				};
				
				/**表单验证*/
				var validator = new Validator({
			    	 el: $("#froms"),
			         dialog:true, 
			         rules:{
			        	 subsnumber:"number2"
			         },
			         messages:{
				         subsnumber:{
				        	 number2:"只能输入数字，长度20位以内"
				         }
			         }
				})
				validator.addMethod("number2", function(str) { return new RegExp("^[0-9]{0,20}$").test(str); });
				
				var reproducing=function(){
					crossAPI.tips("功能不做",1500);
				}
				//服务请求详情
				var selectadd=function(){
					var numberId =$(this).attr("name");
					//crossAPI.tips(numberId,3000);
					Util.ajax.postJson('/ngwf_he/front/sh/serviceReqDetail!execute?uid=selectNumber',{"numberId":numberId},function(data){
						if(data.beans.length>0){
							_index.destroyTab('服务请求详情');
							_index.createTab({
								title:'服务请求详情',
								url:''+getBaseUrl() + '/ngwf_he/src/html/serviceReq/serviceDetail.html', 
								closeable:true, //选项卡是否可以关闭，支持true|fal或者1|0  addNumber
								width:90,//选项卡宽度，单位px
								option:{
									"custBean":data.beans
								}
							});
						}else{
							crossAPI.tips("抱歉,该服务请求已经不存在！",1500);
						}
					});
				}
				//服务请求
				var selectedTree = function(e) {
					$("#srtypeId").val("");
					$("#srtypeId").attr("name","");
					
					window.blur();
						_index.showDialog({
							id:"servicechose",        //弹框唯一键值
							title:'服务类别',   //弹出窗标题
							url:'html/serviceReq/selectServiceReqType.html',  //要加载的iframe 地址
							param:{tabName:"查询"},    //要传递的参数，可以是json对象
							modal:false,
							width: 800,
							height: 520,
						});
						window.focus();
					
					
					
					
					
					
					/*
					var dialog = new Dialog(
							$.extend(dialogConfig_two,{
										mode : 'normal',
										id : 'normal',
										quickClose : false,
						        		modal : true,
										content : require("text!module/serviceReq/AcceptanceRequest.html"),
									}));
					Tree();
					$('.showContent').on('click','input[type="checkbox"]',add);
					$('#clearBtn').on('click',clearBtn);
					$('#searchType').on('propertychange input',onpropertychange);
					$('#searchOK').on('click',searchOK);
					$('#searchClear').on('click',searchClear);
					$('.t-tabs-items li').on('click',tabsActive);
					$(".ui-dialog-autofocus").on('click',ensure);
					$(".ui-dialog-button").find('button').eq(1).on('click',cancel);
					
					$('#treeDemo').on('click','.ztree li span.switch',treeDemoColor);
					$('#treeDemo').on('click','.ztree ul li.level1 ',treeDemoLiColor);
					
					$('#searchType').bind('keypress',function(){//enter键
		        		if(event.keyCode == 13){ 
							searchOK();
						} 
	        	    })
				*/};
	           /* var treeDemoColor = function(){
					   $(this).parent().parent('.ztree').toggleClass("ztreetColor");
					   $("#treeDemo .ztree ul li.level1").removeClass('activeColor');
				 }
				 var treeDemoLiColor = function(){
					 $("#treeDemo .ztree ul li.level1").removeClass('activeColor');
					 $("#ztree_One_1_ul li").removeClass('activeColor'); 
					 $(this).addClass("activeColor").siblings().removeClass('activeColor');
				 }
				var cancel = function(){
					_ids="";
					_number=0;
				}
				var searchClear = function(){
					$("#searchType").val("");
				}
				//确定服务类型
				var ensure=function(){
					
					var str=""
					$('#selectContents').find('li').each(function(){
						str+=","+$(this).text();
						})
						var name="";
						$('#selectContents').find('input').each(function(){
							name+=","+$(this).prop("name");
						})
						name=name.substring(1,name.length);
						str=str.substring(1,str.length);
						$("#srtypeId").val(str);
					$("#srtypeId").attr("name",name);
						_ids="";
					_number=0;
				}
				
				//清空搜索框
				var serchClear = function(){
					$('#searchInput').val('')
				}
				//删除选择路径
				 var clearBtn = function(){	
					 if($('#selectContents').find('input[type="checkbox"]').is(":checked")){
								 $($('#selectContents').find('input[type="checkbox"]:checked').each(function(){ 
									 $('#selectContents').find('input[type="checkbox"]:checked').parent('li').remove();
									var ids=$(this).attr("name");
									_ids= _ids.replace(ids,'');
									 _number=_number-1;
									 if(ztree!=null && ztree!=""){
										 var allNodes=ztree.getNodes();
				    				       
				    				        var nodes = ztree.transformToArray(allNodes);
				    				        if(nodes.length>0){
				    				            for(var i=0;i<nodes.length;i++){
				    				                if(nodes[i].id==$(this).attr("name")){
				    				                	nodes[i].checked=false;
				    				                }
				    				            }
				    				        }
				    				        ztree.refresh(); 
									 }
										 $('.showContent').find('input[name^='+ids+']').prop('checked',false); 
									 
									 
									 
								 })
					 )
					 $("#GS").html(_number);
					 }else{
						 crossAPI.tips("请选择删除的服务类别",3000);
					 }
		            }
				
				//去除重复
					var add=function(){
						var ids=$(this).attr("name");
						console.log($(this).parent('li'));
						 if($('.showContent').find('input[name^='+ids+']').is(":checked")){	
							 if(_ids.indexOf(ids) >= 0){
									crossAPI.tips("类别已选过，请勿重复选取",3000);
									$(this).checked=false;
								}else{
									var content=$("#selectContents").html();
									content+="<li><input type='checkbox' name='"+ids+"'/><label>"+$(this).parent('li')[0].innerText+"</label></li>";
									$("#selectContents").html(content);
									_number+=1;
									_ids+=","+ids;
									 $("#GS").html(_number);
								}
						 }else{
							 $("#selectContents").find("input[name^="+ids+"]").parent('li').remove();
				     			
				     			
				     			_number=_number-1;
				     			_ids=_ids.replace(ids,'');
				     			 $("#GS").html(_number);
						 }
						
						
					}
					//点击确定搜索
					var searchOK=function(){
						var name=$('#searchType').val();
						if(name==null || name==""){
							crossAPI.tips("请输入服务类型",3000);
							return;
						}
						name=encodeURI(name);
						var optionDic = "";
		            	Ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByNamereqType',{name:name},function(result){
		            		$.each(result.beans,function(index,bean){
		            			optionDic+="<ul><li><input type='checkbox' name="+bean.id+"><label>"+bean.fullName+"</label></li></ul>"
		            		})
		            		$("#txtIds").html(optionDic);
		            	});
					}
					var onpropertychange=function(e){
						var searchKey=$(e.currentTarget).context.value;
						
						var optionDic = "";
		            	Ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByZMreqType&searchKey='+searchKey+'',function(result){
		            		$.each(result.beans,function(index,bean){
		            			optionDic+="<ul><li><input type='checkbox' name="+bean.id+"><label>"+bean.fullName+"</label></li></ul>"
		            		})
		            		$("#txtIds").html(optionDic);
		            	});
					}
					 var tabsActive = function(){
						 var $t = $(this).index();
						 $(this).addClass('active').siblings().removeClass('active');
						 $('.t-tabs-wrap li').eq($t).addClass('selected').siblings().removeClass('selected');
					 }
			
						var Tree = function(){
			        		var setting = {  
			    					view: {  
			    						selectedMulti: false,//禁止多点选中  
			    						showIcon: false//是否显示节点图标,默认值为true	
			    					},
			    					check: {  
			    						enable: false//是否启用复选框
			    					},  
			    					data: {  
			    						simpleData: {  
			    							enable: true ,
			    							idKey: "id",  
			    							pIdKey: "pId",  
			    							rootPId: "" 
			    						}  
			    					},
			    					callback: {  
			    						onClick: function nodeClick(treeId, treeNode) { 
			    							var treeObj = $.fn.zTree.getZTreeObj(treeNode); 
			    							var selectedNode = treeObj.getSelectedNodes()[0];
			    							if(selectedNode.level==0){
			    								Ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&srtypeId='+selectedNode.id+'',function(result){
			    									var setting1 = {  
			    											view: {  
			    												selectedMulti: false,//禁止多点选中  
			    												showIcon: true//是否显示节点图标,默认值为true	     			     				
			    											},	
			    											check: {  
			    												enable: true//是否启用复选框  
			    											},  
			    											data: {  
			    												simpleData: {  
			    													enable: true 
			    												} 
			    											},
			    											callback: {  
			    												onCheck: zTreeOnCheck  
			    											} 
			    									}
			    									*//**树节点二次选中回调函数*//*
			    						            function zTreeOnCheck(event, treeId, treeNode) { 
			    										var content=$("#selectContents").html();
			    										if(treeNode.checked == true){
			    											if(content=="" || content==null){
			    												content="<li><input type='checkbox' name='"+treeNode.id+"'/><label>"+treeNode.fullName+"</label></li>";
			    												_ids+=treeNode.id+",";
			    												_number++;
			    											}else{
			    												content+="<li><input type='checkbox' name='"+treeNode.id+"'/><label>"+treeNode.fullName+"</label></li>";
			    												_ids+=treeNode.id+",";
			    												_number++;
			    											}
			    											$("#selectContents").html(content);
			    										}else{
			    											$("input[name^="+treeNode.id+"]").parent('li').remove();
			    											_number--;
			    											_ids=_ids.replace(treeNode.id,'');
			    										}
			    										$("#GS").html(_number);
			    									}
			    									//服务类别小类树
			    									ztree=$.fn.zTree.init($("#txtIds"), setting1, result.beans);
			    									var nodes = ztree.transformToArray(ztree.getNodes());
			    									if(nodes.length>0){
			    										for(var i=0;i<nodes.length;i++){
			    											if(nodes[i].isParent){
			    												nodes[i].nocheck=true;
			    											}else{
			    												nodes[i].nocheck=false;
			    											}
			    										}
			    									}
			    									ztree.refresh();
			    									var arr=_ids.split(",");
			    									for(var a=0;a<arr.length;a++){
			    										if(arr[a]!=null && arr[a]!=""){
			    											var note = ztree.getNodeByParam("id", arr[a], null);
			    											note.checked=true;
			    										}
			    									}
			    									ztree.refresh();
			    								});
			    							}// end if
			    						}// end callback
			    					}  
			        			}
			                	Ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypess',function(result){
		    						var zNode =result.bean.resultParent;
		            			    //服务类别大类树
		                		    var treeDemo=$.fn.zTree.init($("#treeDemo"), setting, zNode);
			            		});
			                }*/
			
				var creartSelect = function(typeId, label, elID) {
					var params = {
						method : 'staticDictionary_get',
						paramDatas : '{typeId:"' + typeId + '"}'
					};
					Util.ajax.postJson(
							'/ngwf_he/front/sh/common!execute?uid=getDic01',
							params, function(result) {
								if(label=="用户品牌"){
									_subsBrand=result.beans;
								}else if(label=="操作状态"){
									_operationStatus=result.beans;
								}else if(label=="用户级别"){
									_subslevel=result.beans;
								}else if(label=="用户地市"){
									_subsCity=result.beans;
								}
							}, true);
				}
				var search = function(e) {
					if(!validator.form()){
						return;
					}
					//var data = Util.form.serialize($("#froms"));
					var startTime = $("input[name='startTime']").val();//开始时间
					var endTime = $("input[name='endTime']").val();//结束时间
					var srtypeId=$("input[id='srtypeId']").prop("name");//服务类型
					var Id=$.trim($("input[name='serviceId']").val());//编号
					var subsnumber=$.trim($('#subsnumber').val());//受理号码
					var handLingstaffno=$.trim($('#handLingstaffno').val());//受理工号
					var data = {
							"startTime" : startTime,
							"endTime" : endTime,
							"srtypeId" : srtypeId,
							"Id": Id,
							"subsnumber": subsnumber,
							"handLingstaffno": handLingstaffno
					}
					if(startTime==null || startTime=="" || endTime==null || endTime==""){
						crossAPI.tips("时间不能为空",1500);
						return;
					}
					if(new Date(startTime.replace(/\-/g, "\/")) > new Date(endTime.replace(/\-/g, "\/"))){
						 crossAPI.tips("开始日期不能大于结束日期！",1500); 
						    return;
					}
					
						listSearch(data);
					
					
				}
				var clear = function(e) {
					$('form').find('input[name!="startTime"][name!="endTime"]').val('');
					$("input[id=srtypeId]").removeAttr("name");
					$("#subsnumber").val("");
					$("input").val("");
					var date = new Date();
					date.setHours(0, 0, 0, 0);
					$('input[name=startTime]').val(date.format("yyyy-MM-dd hh:mm:ss"));
					date.setHours(23, 59, 59, 0);
					$('input[name=endTime]').val(date.format("yyyy-MM-dd hh:mm:ss"));
				}
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
				//详情
				var contactMain = function(e,items){
						var	service=$(this).attr("name");
						var	dealstaff=$($($(e.currentTarget).parent().parent().get(0)).context.innerHTML)[4].innerText;
							var url =getBaseUrl();
							Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=transactionDetails&Id='+service+'',{},function(data){
								_index.destroyTab('异动详情');
								_index.createTab({
									 title:'异动详情',
									 url:''+url+'/ngwf_he/src/html/serviceReq/Detailed.html', 
									 closeable:true, //选项卡是否可以关闭，支持true|fal或者1|0  
									 width:90,//选项卡宽度，单位px
									 option:{
										 "custBean":data.beans,
										 "dealstaff":dealstaff
									 }
								 });
							})
				}
				
				$(document).click(function(){
					$('.content').hide();
				})
				
				//员工详情
				var staffno = function(e) {
					e.stopPropagation()
					var evt =e|| event;
			    	var bbb =$(this).parent('td').offset().left-185;
	       			var ccc = $(this).parent('td').offset().top-230;
	       			$('.content').css({'left':bbb,'top':ccc}).toggle();
					//_index.destroyDialog();
					//var deptName;
					var mobilePhone = "";
					//var emailAddress;
					var staffName = "";
					var orgaName = "";
					/*var orgaCode;
					var roleName;*/
					var staffId = $(e.currentTarget).text();
					var params = {
						method : 'functionAuthOrStaffInfo_get',
						paramDatas : '{staffId :"'+staffId+'"}'  
					}
					Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params, function(result){
						//console.log(result);
						if(result.bean.orgaName && result.bean.mobilePhone && result.bean.staffName){
							orgaName = result.bean.orgaName;
							mobilePhone = result.bean.mobilePhone;
							staffName = result.bean.staffName;
						}
						/*mobilePhone = result.bean.mobilePhone;
						//emailAddress = result.bean.emailAddress;
						staffName = result.bean.staffName;
						orgaName = result.bean.orgaName;
						orgaCode = result.bean.orgaCode;
						deptName = result.bean.deptName;
						roleName = result.bean.roleName;*/
						
					},true);
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
					            +'<li><span class="listLeft">工号:</span><span>'+ staffId +'</span></li>'    
					            +'<li><span class="listLeft">姓名:</span><span>'+ staffName +'</span></li>'  
					            +'<li><span class="listLeft">部门:</span><span>'+ orgaName +'</span></li>'  
					            +'<li><span class="listLeft">手机:</span><span>'+ mobilePhone +'</span></li>'
					           //+'<li><span class="listLeft">Email</span><span>'+ emailAddress +'</span></li>'
					            +'<li><span class="listLeft">集团短号</span><span></span></li>'
					            +'<li><span class="listLeft">处理人专业线</span><span></span></li>'
					            +'<li><span class="listLeft">处理人级别</span><span></span></li>'
					            +'<p>督导信息</p>'
					            +'<li><span class="listLeft">工号</span><span>'+ orgaCode +'</span></li>'
					            +'<li><span class="listLeft">姓名</span><span>'+ roleName +'</span></li>'
					            +'<li><span class="listLeft">部门</span><span>'+ orgaName +'</span></li>'
					            +'<li><span class="listLeft">手机</span><span>'+ mobilePhone +'</span></li>'
					            +'</ul>'
							    +'</div>',
							width : 170,
							height : 130,
							skin : 'dialogSkin',
							fixed : true,
							quickClose : true,
							cancelDisplay:false,
							okDisplay:false,
							modal : false
						}
						var dialog =new Dialog(dialogConfig);
						$('.ui-dialog-footer').addClass('hide');
						$('.content li span:odd').on('mouseover',function(){
							var titles = $(this).text()
							$(this).attr('title',titles)
						})*/
					};
				//加载数据字典(无默认值)
				var dictionaryNoDefault =  function(mythod,typeId,selId){
					var params = {method:mythod,paramDatas:'{typeId:"'+typeId+'"}'};
					var optionDic = "<option value=''>请选择</option>";
					Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
						$.each(result.beans,function(index,bean){
							optionDic += "<option value='"+bean.value+"'>"+bean.name+"</option>";
						});
						$("#"+selId).append(optionDic);
						
					},true);
				};
				var date = function(){
					//开始日期组件
					var config = new MyDate({
				        el:$('#startTime'),
				        label:'开始日期',
				        name:'startTime',    //开始日期文本框name
				        format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
				        defaultValue:laydate.now()+' 00:00:00', //默认日期值
				        //min: laydate.now(0),      //最小日期限制
				        istime: true,
				        istoday: true,
				        choose:function(){} //用户选中日期时执行的回调函数
				    });
					var date1 = new MyDate( {
				        el:$('#endTime'),
				        label:'结束日期',
				        name:'endTime',    //开始日期文本框name
				        format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
				        defaultValue:laydate.now()+' 23:59:59', //默认日期值
				        //min: laydate.now(0),         //最小日期限制
				        istime: true,
				        istoday: true,
				        choose:function(){} //用户选中日期时执行的回调函数
				    });
					$('.timegroup label').addClass('necessary');
					//$('.timegroup input').attr('readonly','readonly');
				}
				var listSearch = function(data) {
					var config = { 
							el:$('#biaodan'),
							highlight: false,
					        field:{
					            boxType:'',
					            key:'',
					            popupLayer:
					            {
					                width:800,
					                height:250
					            },
					            items:[
					                { text:'请求编号',name:'Id',render:function(item,val){
					                	
					                		val = '<a id="serveicId"  class="serveicId" name='+item.Id+' style="color: blue;">'+val+'</a>';
					                	return val;
					                	}
					                },
					                { text:'受理号码',name:'subsNumber' },
					                { text:'受理时间',name:'acceptTime' },
					                { text:'请求类别',name:'Name' },
					                { text:'受理工号',name:'acceptStaffno',render:function(item,val){
					                	if(typeof(val) != "undefined"){
					                		val = '<a id="staffno" class="handlingstaffno"  style="color: blue;">'+val+'</a>';
					                	}else{
					                		val="";
					                	}
					                	return val;
					        		  }},
					                { text:'操作状态',name:'operationStatus',render:function(item,val){
					                	var val = '';
				    					$.each(_operationStatus,function(index,bean){
				    						if(item.operationStatus==bean.value){
				    							val=bean.name;
				    						}
				    					});
				    					return val;
				    				
				        		  }},
					                { text:'用户级别',name:'subsLevel',render:function(item,val){
					                	var val = '';
				    					$.each(_subslevel,function(index,bean){
				    						if(item.subsLevel==bean.value){
				    							val=bean.name;
				    						}
				    					});
				    					
				    					return val;
				    				
				        		  }},
					                { text:'用户品牌',name:'subsBrand',render:function(item,val){
					                	var val = '';
				    					$.each(_subsBrand,function(index,bean){
				    						if(item.subsBrand==bean.value){
				    							val=bean.name;
				    						}
				    					});
				    					
				    					return val;
				    				
				        		  }},
					                { text:'用户地市',name:'subsCity',render:function(item,val){
					                	var val = '';
				    					$.each(_subsCity,function(index,bean){
				    						if(item.subsCity==bean.value){
				    							val=bean.name;
				    						}
				    					});
				    					return val;
				    				
				        		  }},
					                { text:'详情',name:'serviceContent',render:function(item,val){
					                	if(typeof(val) != "undefined"){
					                		val = '<a id="remark"  class="remark" name='+item.Id+'  style="color: blue;">'+"详情"+'</a>';
					                	}else{
					                		val = '';
					                	}
					                	return val;
					        		  } }
					            ]
					        },
					        page:{
					            perPage:10,
					            total:true,
					            align:'right'
					        },
					        data:{
					            url:'/ngwf_he/front/sh/serviceReq!execute?uid=selectTransactionDetails'
					        }}
					list = new List(config);
					list.search(data);
					
					var total;
					list.on("success",function(result){
						total=list.total;
						if(total == 0){
							var content='共'+total+'个查询结果';
							$('#total').html(content);
							return;
						}
						if(null != total && "" != total)
						{
							var content='共'+total+'个查询结果';
							$('#total').html(content);
						}
					})
				};
				
				IndexLoad(function(IndexModule, options){
					_index = IndexModule;
					eventInit();
					date();
					setTimeout(function(){
						search();
					},10);
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
					creartSelect("HEBEI.DIC.OPSTATUS", "操作状态","operationStatus");
					creartSelect("NGCS.HEYTCK.GRADE", "用户级别","subsLevel");
					creartSelect("HEBEI.DIC.SUBSBRAND", "用户品牌", "subsBrand");
					creartSelect("NGCS.HEYTCK.CITYCODE", "用户地市","subsCity");
					//dictionaryNoDefault('staticDictionary_get','HEBEI.DIC.SERVICEREQTYPE','srtypeId');
					});
				
				
				
				});
	// 服务类型对话框
	var dialogConfig_two = {
		mode : 'mormal', // 对话框模式，默认normal标准|tips浮动层|confirm确认对话框
		// delayRmove:3, //延迟删除秒数设定 默认3秒
		title : '服务类别', // 对话框标题
		content : '服务类别', // 对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）

		width : 800, // 对话框宽度
		height : 450, // 对话框高度
		skin : 'dialogSkin', // 设置对话框额外的className参数
		fixed : false, // 是否开启固定定位 默认false不开启|true开启
		quickClose : true, // 点击空白处快速关闭 默认false不关闭|true关闭
		modal : true
	// 是否开启模态框状态
	// 默认false不开启|true开启,confirm默认状态为true
	}
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
});
