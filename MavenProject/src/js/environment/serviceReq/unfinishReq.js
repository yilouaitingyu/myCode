define(function(require){
require(['Util', 'list', 'indexLoad', 'date', 'dialog', 'simpleTree','selectTree', 'ajax','validator'],
		function(Util, List, IndexLoad, MyDate, Dialog, SimpleTree,SelectTree, ajax,Validator){
			var _index;
			var list;
			var ztree;//服务请求类别树
			var zTree_depart;//受理部门树
			var _number=0;//树组件选中节点
			var _ids='';//子节点选中的id字符串
			var depart_Menu;
			var staffId;
			
			/**数据字典翻译*/
			var _subsCity;//用户地市
			var _acceptMode;//受理方式
			var _subslevel;//用户级别
			var _subsBrand;//用户品牌
			var _operationStatus;//操作状态
			var _feedbackSatisfied;//满意度
			
			var eventInit = function() {
				/**初始化数据字典块*/
				creartSelect("NGCS.HEYTCK.CITYCODE", "用户地市", "subsCity");
				creartSelect("HEBEI.DIC.ACCEPTMODE", "受理方式", "acceptMode");
				creartSelect("NGCS.HEYTCK.GRADE",'用户级别','subslevel');
				creartSelect("HEBEI.DIC.SUBSBRAND", "用户品牌", "subsBrand");
				creartSelect("HEBEI.EDUCATION.TYPE", "紧急度", "urgentId");
				creartSelect("CSP.PUB.IMPACT", "影响度", "impactId");
				creartSelect("HEBEI.DIC.OPSTATUS", "操作状态","operationStatus");
				creartSelect("HEBEI.DIC.FEEDBACKSATISFIED", "满意度","feedbackSatisfied");
				/**事件部分*/
				$('#btnSearch').on('click', searchForm);//查询
				$('#btnClear').on('click', resetForm);//重置
				$('#exporReqBtn').on("click", exporReqDetaril);//导出
				$('#delServiceReq').on('click', deleteSerReq);//删除
				$('#listContainer').on("click", '.staffDetail', staffnoDetail);//工号详情
				$('#listContainer').on("click", '.reqDetail', reqDetail);//服务请求详情
				$('#chooseDepart').on('click',selectDeptTree);//受理部门
				$('#srtypeId-icon').on('click',selectTreeBox);//服务请求类别
				$('#playaudio').on('click',playaudio);//放音
				$('#moreClick').click(function(){//点击更多查询条件
					$('#moreDiv').fadeToggle('2000').finish();
				});
				$('.btnMore').on('click', btnMore);
				$('#srtypeId').on('mouseover',function(){
					var titles = $(this).val()
					$(this).attr('title',titles)
				})
				crossAPI.on("refreshDepart",function(param){
					$('#acceptStaffdept').val(param.nodename);
					$("#acceptStaffdept").attr('val',param.id);
				})
				/**未完请求类别树*/
				crossAPI.on("unfinished",function(param){
					$('#srtypeId').val(param[0]);
					$("#srtypeId").attr('val',param[1]);
				})
			}
			/**放音*/
			var playaudio=function(){
				var beans=list.getCheckedRows();
				if(beans.length <=0 || beans.length >1){
					_index.tips("请选中一条服务请求！",1500);
					
				}else{
					var contactSerialno = beans[0].contactSerialno;
					if(contactSerialno == null || contactSerialno == "" || contactSerialno =="undefined") {
						_index.tips("没有对应的接触流水号",1500);
						return false;
					}else{
					/*crossAPI.getContact(CallAffixInfos.getAudioRecords,function(data){
						console.log(data);
					})*/
					crossAPI.getContact("recordPlay", {'serialNo':contactSerialno}, function(){})
					}
				}
			}
			/**更多查询条件*/
			var btnMore = function(){
				$('.btnMore').toggleClass('btnMoreTop');		
				$(".jf-form-item .changeShowHide").stop().toggle();
	        }	

			/**加载数据字典*/
			var creartSelect = function(typeId, label, selId) {
				var option = "<option value=''>--请选择--</option>";
				var params = {
					method : 'staticDictionary_get',
					paramDatas : '{typeId:"' + typeId + '"}'
				}
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getDic01',params, function(result){
					$.each(result.beans, function(index, bean) {
						option += "<option value='" + bean.value+ "'>" + bean.name + "</option>";
					});
					$("#" + selId).append(option);
					if(label=="用户地市"){
						_subsCity=result.beans;
					}else if(label=="受理方式"){
						_acceptMode=result.beans;
					}else if(label=="用户级别"){
						_subslevel=result.beans;
					}else if(label=="用户品牌"){
						_subsBrand=result.beans;
					}else if(label=="操作状态"){
						_operationStatus=result.beans;
					}else if(label=="满意度"){
						_feedbackSatisfied=result.beans;
					}
				}, true)
			}
			
			/**导出按钮*/
			var exporReqDetaril=function(){
				var long1 = new Date().getTime();
				var data = Util.form.serialize($("form"));
				var beans = list.getCheckedRows().length==0 ? '':list.getCheckedRows();
				var dialogConfig = {
	        		mode : 'normal', 
	        		delayRmove:300, 
	        		title : '导出列', 
	        		content :require("text!html/serviceReq/serviceReqCols.html"),
	        		width : 600,
	        		height :240,
	        		skin : 'dialogSkin',
	        		fixed : false,
	        		quickClose : false,
	        		modal : true,
	                cancelDisplay:false,
	                button:[
							{
							    value: '确定', 
							    callback: function () {
							    	var ids='';//选中的条数(请求编号)
				    				if(beans!='' || beans!=null){
				    					for(var i=0;i<beans.length;i++){
				    						ids=ids+beans[i].id+","
				    					}
				    					ids=ids.substring(0,ids.length-1);
				    				}
				    				var str='';//查询的条件参数
				    				for(var key in data){//将查询参数拼成字符串
				    					if(data[key] !=''){
				    						str = str+"&"+key+"="+data[key];
				    					}
				    				}
				    				var cols='';//选中的列
				    				$('#exp-div ul').find('input[name="cloum"]:checked').each(function(){
				    					cols+=$(this).val()+',';
				    				})
				    				cols=cols.substring(0,cols.length-1);
				    				if(cols==''){
				    					crossAPI.tips("请至少选择一列！",1500);
				    					return false;
				    				}else{
				    					window.location.href=encodeURI('/ngwf_he/front/sh/exportServiceReq!exportDatas?uid=exportServiceReq001&ids='+ids+'&cols='+cols+str);
				    				}
				    				var long2 = new Date().getTime();
				    				/**导出后往日志表插入导出记录*/
				    				var recordtime=getNowFormatDate();
				    				//var staffId=_index.getUserInfo().staffId;
				    				var staffName=_index.getUserInfo().staffName;
				    				var state="成功";
				    				var param={
				    	 					"recordTime":recordtime,
				    	 					"logType":'2',
				    	 					"staffId":staffId,
				    	 					"staffName":staffName,
				    	 					"outputType":'9',
				    	 					"outputName":"服务请求查询",
				    	 					"outputContent":"导出"+data.startTime+"至"+data.endTime+"的数据",
				    	 					"duration":long2-long1,
				    	 					"state":state
				    		 		}
				    			    Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=dialogRecord002',param);
							    }
							    
							},
	                        {
	                          value: '重置',  //自定义按钮文本
	                          callback: function () {
	                        	  $("input[name='cloum']").prop("checked", true);
	                              return false; //阻止对话框关闭
	                          }
	                          
	                        }
                          ]
    	        }
	        	var dialog = new Dialog(dialogConfig);
			 	/**默认全选*/
				$("input[name='cloum']").each(function(){ 
					$(this).attr("checked", true); 
				});
				$('.ui-dialog-autofocus').hide();
				$('button[i-id="确定"]').css({"color":"#fff","backgroundColor":"#0085d0"});
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
			
			/**时间组件*/
			var dateInit = new MyDate({
				el:$('#dateInit'),
				label:'开始时间',
		        double:{
	                start:{
	                    name:'startTime',
	                    format: 'YYYY-MM-DD hh:mm:ss',
	                    defaultValue:laydate.now(0)+' 00:00:00', 
	                    min: '1949-06-16 00:00:00',
	                    max: '2099-06-16 23:59:59',
	                    istime: true,       
	                    istoday: false,
	                    choose: function(datas){
	                        this.end.min = datas;
	                        this.end.start = datas;
	                    }
	                },
	                end:{
	                    name:'endTime',
	                    format: 'YYYY-MM-DD hh:mm:ss',
	                    defaultValue:laydate.now(0)+' 23:59:59', 
	                    min: $('.createTime').val(),
	                    max: '2099-06-16 23:59:59',
	                    istime: true,
	                    istoday: false,
	                    choose: function(datas){
	                        this.start.max = datas;
	                    }
	                }
	            }
		    })
			$('#dateInit label').addClass('necessary')
			
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
	        
	        /**服务请求类别树 start*/
			var selectTreeBox = function(){
				$('#srtypeId').val('');
            	$('#srtypeId').attr('val','');
            	_index.showDialog({
					  id:"serviceCategory",        //弹框唯一键值
					  title:'服务类别',   //弹出窗标题
					  url:'html/serviceReq/selectServiceReqType.html',  //要加载的iframe 地址
					  param:{tabName:""},    //要传递的参数，可以是json对象
					  modal:false,
					  width: 800,
			          height: 520,
					});
            }
//            var selectTreeBox=function(){
//    	        var dialogConfig = {
//	        		mode : 'normal', 
//	        		delayRmove:300, 
//	        		title : '服务类别', 
//	        		content :require("text!html/serviceReq/selectServiceReqType.html"),
//	        		width : 800,
//	        		height :450,
//	        		skin : 'dialogSkin',
//	        		fixed : false,
//	        		quickClose : false,
//	        		modal : true,
//	        		ok:function(){
//	        			var str="";//给父页面<input>srtypeId赋值
//	    				var val="";//自定义属性,给父页面srtypeId
//	    				$('#selectContents').find('li').each(function(){
//	    					str+=$(this).text()+",";
//	    				})
//	    				str=str.substring(0,str.length-1);
//	    				$('#selectContents').find('input').each(function(){
//	    					val+=$(this).prop("name")+",";//该内容为ztree子节点选中后追加元素的name
//	    				})
//	    				val=val.substring(0,val.length-1);
//	    			    $("#srtypeId").val(str);
//	    				$("#srtypeId").attr("val",val);
//	    				_ids="";
//	    				_number=0;
//	        		},
//	                okValue: '确定',
//	                cancel: function(){
//	                	_ids='';
//						_number=0;
//	                },
//	                cancelValue: '取消'
//    	        }
//	        	var dialog = new Dialog(dialogConfig);
//    	        if( dialog.origin().open){
//    	        	$('#searchType').focus();
//    	        }
//	        	tree();
//	        	$('.showContent').on('click','input[type="checkbox"]',countCheckbox);//统计选中节点
//	        	$('#clearBtn').on('click',delNode);//删除选择路径
//	        	$('#treeDemo').on('click','.ztree li span.switch',treeDemoColor);
//				$('#treeDemo').on('click','.ztree ul li.level1 ',treeDemoLiColor);
//	        	$('#searchType').on('propertychange input',onpropertychange);//输入光标变化事件
//	        	$('#searchType').on('keypress',function(){//enter键
//	        		if(event.keyCode == 13){ 
//						searchOK();
//					} 
//	        	})
//	        }
//            var treeDemoColor = function(){
//				   $(this).parent().parent('.ztree').toggleClass("ztreetColor");
//				   $("#treeDemo .ztree ul li.level1").removeClass('activeColor');
//			 }
//			 var treeDemoLiColor = function(){
//				 $("#treeDemo .ztree ul li.level1").removeClass('activeColor');
//				 $("#ztree_One_1_ul li").removeClass('activeColor'); 
//				 $(this).addClass("activeColor").siblings().removeClass('activeColor');
//			 }
//	        /**输入光标变化事件*/
//	        var onpropertychange=function(e){
//	        	if($('#searchType').val()=='') return;
//	        	$('#txtIds').html('');
//				var searchKey=$(e.currentTarget).context.value;
//				var optionDic = "";
//				ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByZMreqType&searchKey='+searchKey+'',function(result){
//            		$.each(result.beans,function(index,bean){
//            			optionDic+="<ul><li><input type='checkbox' name="+bean.id+"><label>"+bean.fullname+"</label></li></ul>"
//            		})
//            		$("#txtIds").html(optionDic);
//            	})
//			}
//	        
//	        /**点击搜索*/
//			var searchOK=function(){
//				var name=$('#searchType').val();
//				if(name==null || name==""){
//					crossAPI.tips("请输入服务类型",3000);
//					return;
//				}
//				var optionDic = "";
//				Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByNamereqType',{name:name},function(result){
//            		$.each(result.beans,function(index,bean){
//            			optionDic+="<ul><li><input type='checkbox' name="+bean.id+"><label>"+bean.fullName+"</label></li></ul>"
//            		})
//            		$("#txtIds").html(optionDic);
//            	})
//			}
//	        /**删除选择路径*/
//			var delNode = function(){	
//				var selChecked=$('#selectContents').find('input[type="checkbox"]:checked');
//				if(selChecked.length==0){
//					crossAPI.tips("请选择要删除的服务请求类别",3000);
//				}
//				selChecked.each(function(){ 
//					selChecked.parent('li').remove();
//					var ids=$(this).attr("name");
//					_ids= _ids.replace(ids,'');
//					_number=_number-1;
//					if(ztree!=null && ztree!=""){
//						var allNodes=ztree.getNodes();
//				        var nodes = ztree.transformToArray(allNodes);
//				        if(nodes.length>0){
//				            for(var i=0;i<nodes.length;i++){
//				               if(nodes[i].id==$(this).attr("name")){
//				            	   nodes[i].checked=false;
//				               }
//				            }
//				         }
//    				     ztree.refresh(); 
//					 }
//				    $('.showContent').find('input[name^='+ids+']').prop('checked',false); 
//				})
//			    $("#GS").html(_number);
//		    }
//			
//	        /**统计选中节点*/
//			var countCheckbox=function(){
//				 var ids=$(this).attr("name");
//				 var sel=$('.showContent').find('input[name^='+ids+']');
//				 var html=$("#selectContents").html();;
//				 if(sel.is(":checked")==true){	
//			 	     html+="<li><input type='checkbox' name='"+ids+"'/><label>"+$(this).parent('li')[0].innerText+"</label></li>";
//					 $("#selectContents").html(html);
//					 _number++;
//					 _ids+=","+ids;
//				     $("#GS").html(_number);
//				 }else{
//					 $("#selectContents").find("input[name^="+ids+"]").parent('li').html('');
//	     			 _number--;
//	     			_ids=_ids.replace(ids,'');
//	     			 $("#GS").html(_number);
//				 }
//			}
//			
//	        /**服务请求类别树 start*/
//            var tree=function(){
//        		var setting = {  
//					view: {  
//						selectedMulti: false,//禁止多点选中  
//						showIcon: false//是否显示节点图标,默认值为true	
//					},
//					check: {  
//						enable: false//是否启用复选框
//					},  
//					data: {  
//						simpleData: {  
//							enable: true ,
//							idKey: "id",  
//							pIdKey: "pId",  
//							rootPId: "" 
//						}  
//					},
//					callback: {  
//						onClick: function nodeClick(treeId, treeNode) { 
//							var treeObj = $.fn.zTree.getZTreeObj(treeNode); 
//							var selectedNode = treeObj.getSelectedNodes()[0];
//							if(selectedNode.level==1){
//								ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&srtypeid='+selectedNode.id+'',function(result){
//									var setting1 = {  
//											view: {  
//												selectedMulti: false,//禁止多点选中  
//												showIcon: true//是否显示节点图标,默认值为true	     			     				
//											},	
//											check: {  
//												enable: true//是否启用复选框  
//											},  
//											data: {  
//												simpleData: {  
//													enable: true 
//												} 
//											},
//											callback: {  
//												onCheck: zTreeOnCheck  
//											} 
//									}
//									/**树节点二次选中回调函数*/
//						            function zTreeOnCheck(event, treeId, treeNode) { 
//										var content=$("#selectContents").html();
//										if(treeNode.checked == true){
//											if(content=="" || content==null){
//												content="<li><input type='checkbox' name='"+treeNode.id+"'/><label>"+treeNode.fullname+"</label></li>";
//												_ids+=treeNode.id+",";
//												_number++;
//											}else{
//												content+="<li><input type='checkbox' name='"+treeNode.id+"'/><label>"+treeNode.fullname+"</label></li>";
//												_ids+=treeNode.id+",";
//												_number++;
//											}
//											$("#selectContents").html(content);
//										}else{
//											$("input[name^="+treeNode.id+"]").parent('li').remove();
//											_number--;
//											_ids=_ids.replace(treeNode.id,'');
//										}
//										$("#GS").html(_number);
//									}
//									//服务类别小类树
//									ztree=$.fn.zTree.init($("#txtIds"), setting1, result.beans);
//									var nodes = ztree.transformToArray(ztree.getNodes());
//									if(nodes.length>0){
//										for(var i=0;i<nodes.length;i++){
//											if(nodes[i].isParent){
//												nodes[i].nocheck=true;
//											}else{
//												nodes[i].nocheck=false;
//											}
//										}
//									}
//									ztree.refresh();
//									var arr=_ids.split(",");
//									for(var a=0;a<arr.length;a++){
//										if(arr[a]!=null && arr[a]!=""){
//											var note = ztree.getNodeByParam("id", arr[a], null);
//											note.checked=true;
//										}
//									}
//									ztree.refresh();
//								});
//							}// end if
//						}// end callback
//					}  
//    			}
//            	ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypess',function(result){
//            		
//            		var obj=result.object;
//					for(var i=0;i<result.object.length;i++){
//						$("#treeDemo").append("<div class='ztree' id='treeDemo"+i+"'></div>");
//						//$("#father").prepend("<div>脚本之家欢迎您</div>");
//						var zNode =result.object[i];
//            		//console.log(result);
//        			//服务类别大类树
//            		var treeDemo=$.fn.zTree.init($("#treeDemo"+i), setting, zNode);
//					}
//        		});
//            }
            /**服务请求类别树 end*/
            
			/**受理部门树 start*/
            var selectDeptTree = function(){
            	$('#acceptStaffdept').val('');
            	$('#acceptStaffdept').attr('val','');
            	_index.showDialog({
					  id:"acceptingDepartment",        //弹框唯一键值
					  title:'选择受理部门',   //弹出窗标题
					  url:'html/serviceReq/selectWorkGroup.html',  //要加载的iframe 地址
					  param:{tabName:""},    //要传递的参数，可以是json对象
					  modal:false,
					  left:200,
					  width: 520,
			          height: 350,
					});
            }
//            var selectDeptTree = function(){
//            	 var config = {
//		            mode:'normal', 
//			        delayRmove:300, 
//		            title:'选择受理部门',
//		            content:require("text!html/serviceReq/selectWorkGroup.html"),
//		            ok:function(){
//		            	nodename = '';
//			    		id = '';
//		            }, 
//		            okValue: '确定选择', 
//		            cancel: function(){}, 
//		            cancelValue: '取消',
//		            cancelDisplay:true,
//		            width:520, 
//		            height:350,
//		            skin:'dialogSkin',
//		            fixed:true, 
//		            modal:true 
//		        }
//		        var deptTreeDialog = new Dialog(config);
//            	if( deptTreeDialog.origin().open){
//            		 departTree();
//     	        	$('#workGroupName').focus();
//     	        }
//            	deptTreeDialog.on('confirm',function(){
//		    		$("#acceptStaffdept").val(nodename);
//		    		$("#acceptStaffdept").attr('val',id);
//		        });
//            	//var arr=[];
//            	$('#workGroupName').bind('keypress',function(){//enter键
//            		if(event.keyCode == 13){ 
//            		depart_Menu = $.fn.zTree.getZTreeObj("treeContainer");
//            		depart_Menu.expandAll(false);
//            		depart_Menu.refresh();//之前选中状态去掉
//            		var workGroupName=$.trim($('#workGroupName').val());
//            		if(workGroupName==''){
//            			crossAPI.tips('请输入你要查找的内容！',3000);
//            			return;
//            		}
//            		var params = {
//      					method : 'workGroupById_get',
//      					paramDatas : '{groupName:"'+workGroupName+'"}'
//              		}
//                    Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(data){
//	            	    if(data.bean=='' || data.beans==''){
//	            	    	crossAPI.tips("对不起没有该部门！",3000);
//	            	    }
//	            	    $.each(data.beans,function(i,bean){
//	            		    var node = depart_Menu.getNodeByParam("id",bean.groupId);
//	            		    depart_Menu.selectNode(node,true);//指定选中ID的节点  
//	            		    depart_Menu.expandNode(node, true, true, false);//指定选中ID节点展开 
//	            	    })
//                    })
//            	}
//	        	})
//            	$('#searchDepart').on('click',function(){
//            		depart_Menu = $.fn.zTree.getZTreeObj("treeContainer");
//            		depart_Menu.expandAll(false);
//            		depart_Menu.refresh();//之前选中状态去掉
//            		var workGroupName=$.trim($('#workGroupName').val());
//            		if(workGroupName==''){
//            			crossAPI.tips('请输入你要查找的内容！',3000);
//            			return;
//            		}
//            		var params = {
//      					method : 'workGroupById_get',
//      					paramDatas : '{groupName:"'+workGroupName+'"}'
//              		}
//                    Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(data){
//	            	    if(data.bean=='' || data.beans==''){
//	            	    	crossAPI.tips("对不起没有该部门！",3000);
//	            	    }
//	            	    $.each(data.beans,function(i,bean){
//	            		    //superGroupCode,groupCode,groupId,groupTypeId
//	            		    var node = depart_Menu.getNodeByParam("id",bean.groupId);
//	            		    //arr=bean.groupId;
//	            		    depart_Menu.selectNode(node,true);//指定选中ID的节点  
//	            		    depart_Menu.expandNode(node, true, true, false);//指定选中ID节点展开 
//	            	    })
//                    })
//            	})
//            }
            
            /**选中节点*/
            var nodename;//选中节点的名字
            var id;//id
	        function nodeClick(event, treeId, treeNode) {
				if(treeNode != null){
					nodename = treeNode.name;
					id =  treeNode.id;
				}
		    }
	        /**生成树*/
//            var departTree=function(){
//            	 var settingDepartTree = {  
//     		            check: {  
//     		                enable: false 
//     		            },  
//     		            callback:{
//     		            	onClick:nodeClick
//     		            },
//     		            data: {  
//     		                simpleData: {  
//     		                    enable: true  
//     		                }  
//     		            }  
//     		      }; 
//            	  var params = {
//     					method : 'departGrops_get',
//     					paramDatas : '{staffId:101,authType:118002}'
//         		  };
//                  Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(data){
//                	  var jsons= (new Function('return( ' + data.object + ' );'))();//把后台过来的数据直接转换为对象.
//				        zTree_depart=$.fn.zTree.init($("#treeContainer"),settingDepartTree , jsons[0]);
//                  },true)
//            }
            /**受理部门树 end*/
           
            /**删除服务请求<必须是自己受理的>*/  
			var deleteSerReq = function() {
				var beans = list.getCheckedRows();
				if(beans.length==0){
					crossAPI.tips("至少选择一条数据",1500);
					return;
				}
				var ids = "";
				/*
				var a= 0;
				for (var i = 0; i < beans.length; i++) {
					if(beans[i].acceptStaffno != staffId){
				    	//$("input[value="+beans[i].id+"]").prop('checked',false);
				    	a++;
				    }
					if (beans[i].id!='') {
						ids += beans[i].id + "@";
					}
				}
				if(a>0) {
					_index.tips("您只能删除自己创建的服务请求");
					return;
				}*/
				for (var i = 0; i < beans.length; i++) {
					if (beans[i].id!='') {
						ids += beans[i].id + "@";
					}
				}
				ids = ids.substring(0,ids.length-1);
				var params = {
					ids : ids,
					acceptstaffno : staffId
				}
				if(window.confirm("确定删除吗？")){
					ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=delRequest001',params, function(result) {
						crossAPI.tips(result.returnMessage,1500);
						searchForm();
						$('#choosedNum').text('');
					});
				}
			}
			
			/**重置按钮*/
			var resetForm = function(){
				$('form').find('input[name!="startTime"][name!="endTime"][id!="acceptStaffno"]').val('');
				$('#acceptStaffno').val(staffId);
				$('#srtypeId').removeAttr('val');
				$("#acceptStaffdept").removeAttr('val');
				var date=new Date();
				date.setHours(0, 0, 0, 0);
				$('input[name="startTime"]').val(date.format("yyyy-MM-dd hh:mm:ss"));
				date.setHours(23, 59, 59, 0);
				$('input[name="endTime"]').val(date.format("yyyy-MM-dd hh:mm:ss"));
				$('#subsCity option:first').prop('selected', 'selected');
				$('#acceptMode option:first').prop('selected', 'selected');
				$('#subslevel option:first').prop('selected', 'selected');
				$('#subsBrand option:first').prop('selected', 'selected');
				$('#urgentId option:first').prop('selected', 'selected');
				$('#impactId option:first').prop('selected', 'selected');
				$('#operationStatus option:first').prop('selected', 'selected');
				$('#feedbackSatisfied option:first').prop('selected', 'selected');
			}
			/**重置后格式化日期*/
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
			
			/**表单验证*/
			var validator = new Validator({
		    	 el: $("form"),
		         dialog:true, 
		         rules:{
		        	 startTime:"required",
		        	 endtime:"required",
		        	 subsNumber:"number2",
		        	 idNumber:"number1",
		        	 callerNo:"number2",//主叫号码
		        	 contactPhone1:"number2",//联系电话1
		        	 contactPhone2:"number2",//联系电话2
		        	 contactSerialno:"number"
		         },
		         messages:{
			         idNumber:{
			        	 number1:"此项必须是大于0的数字"
			         },
			         callerNo:{
			        	 number2:"只能输入数字，长度20位以内"
			         },
			         subsNumber:{
			        	 number2:"只能输入数字，长度20位以内"
			         },
			         contactPhone1:{
			        	 number2:"只能输入数字，长度20位以内"
			         },
			         contactPhone2:{
			        	 number2:"只能输入数字，长度20位以内"
			         }
		         }
			})
			validator.addMethod("number1", function(str) { return new RegExp("^[0-9]*[1-9][0-9]*$").test(str); });
			validator.addMethod("number2", function(str) { return new RegExp("^[0-9]{0,20}$").test(str); });
			
			/**查询按钮*/
			var searchForm = function() {
				$('#choosedNum').text('');//点查询已选中记录归零
				var startTime = $("input[name='startTime']").val();//开始时间
				var endTime = $("input[name='endTime']").val();//结束时间
				if(startTime==''){
					crossAPI.tips("开始时间不可为空！",1500);
					return;
				}
				if(endTime==''){
					crossAPI.tips("结束时间不可为空！",1500);
					return;
				}
				if(!validator.form()){
					return;
				}
				var srtypeId=$.trim($('#srtypeId').attr('val'));/**服务类别<树>*/
				if(srtypeId==undefined){
					srtypeId='';
				}
				var id=$.trim($('#id').val());//请求编号
				var subsNumber=$.trim($('#subsNumber').val());//受理号码
				var acceptStaffno=$.trim($('#acceptStaffno').val());//受理工号
				var subsCity=$('#subsCity').val();//用户地市
				var callerNo=$.trim($('#callerNo').val());//主叫号码
				var acceptStaffdept=$.trim($('#acceptStaffdept').attr('val'));/**受理部门<树>*/
				var feedbackSatisfied=$.trim($('#feedbackSatisfied').val());//满意度
				var idNumber=$.trim($('#idNumber').val());//相同服务请求点选次数(大于等于)
				var acceptMode=$('#acceptMode').val();//受理方式
				var subslevel=$('#subslevel').val();//用户级别 
				var subsBrand=$('#subsBrand').val();//用户品牌
				var urgentId=$('#urgentId').val();//紧急度
				var impactId=$('#impactId').val();//影响度
				var subsName=$.trim($('#subsName').val());//用户姓名
				var contactPhone1=$.trim($('#contactPhone1').val());//联系电话1
				var contactPhone2=$.trim($('#contactPhone2').val());//联系电话2
				var operationStatus=$('#operationStatus').val();//操作状态
				var contactSerialno=$.trim($('#contactSerialno').val());//接触流水号
				var data = {
					"startTime" : startTime,
					"endTime" : endTime,
					"srtypeId" : srtypeId,
					"id": id,
					"subsNumber": subsNumber,
					"acceptStaffNo": acceptStaffno,
					"subsCity": subsCity,
					"callerNo": callerNo,
					"acceptStaffDept":acceptStaffdept,
					"feedbackSatisfied":feedbackSatisfied,
					"idNumber":idNumber,
					"acceptMode": acceptMode,
					"subsLevel": subslevel,
					"subsBrand": subsBrand,
					"urgentId": urgentId,
					"impactId": impactId,
					"subsName": subsName,
					"contactPhone1": contactPhone1,
					"contactPhone2": contactPhone2,
					"operationStatus": operationStatus,
					"contactSerialNo": contactSerialno,
					"operationStatus":'1'
				}
				var start=new Date(startTime.replace("-", "/").replace("-", "/"));
				var end=new Date(endTime.replace("-", "/").replace("-", "/"));
				if((dayInterval(end)-dayInterval(start))>10){
					crossAPI.tips("时间间隔不能超过10天!",1500);
					return;
				}
				if(end<start){ 
				    crossAPI.tips("开始日期不能大于结束日期！",1500); 
				    return;
				}
				if(srtypeId=='' && id=='' && subsNumber=='' && acceptStaffno=='' && subsCity=='' && callerNo=='' &&  acceptStaffdept==''){
					crossAPI.tips("带*的条件必须任选一个!",1500);
					return;
				}
				listSearch(data);
			}
			
			/**时间间隔天数*/
			var dayInterval = function(date){ 
			    return date.getTime()/(24 * 60 * 60 * 1000); 
			}
			
			/**员工个人信息展示 start*/ 
			var staffnoDetail = function(e) {
				var dialogConfig = {
					mode:'normal',
					delayRmove:8, 
					content :
						'<div class="content">'		   
			            +'<p>员工信息</p>'
			            +'<ul class="contentList">'
			            +'<li><span class="listLeft">工号</span><span id="acceptstaffnoCope"></span></li>'    
			            +'<li><span class="listLeft">姓名</span><span id="nameCope"></span></li>'  
			            +'<li><span class="listLeft">部门</span><span id="departCope"></span></li>'  
			            +'<li><span class="listLeft">手机</span><span id="phoneCope"></span></li>'
			            +'<li><span class="listLeft">Email</span><span id="emailCope"></span></li>'
			            +'<li><span class="listLeft">集团短号</span><span id="groupNo"></span></li>'
			            +'<li><span class="listLeft">处理人专业线</span><span id="dealMan"></span></li>'
			            +'<li><span class="listLeft">处理人级别</span><span id="dealManLev"></span></li>'
			            +'<p>督导信息</p>'
			            +'<li><span class="listLeft">工号</span><span id="dustuffno"></span></li>'
			            +'<li><span class="listLeft">姓名</span><span id="duname"></span></li>'
			            +'<li><span class="listLeft">部门</span><span id="dudepart"></span></li>'
			            +'<li><span class="listLeft">手机</span><span id="duphone"></span></li>'
			            +'</ul>'
					    +'</div>',
					width : 220,
					height : 375,
					skin : 'dialogSkin',
					fixed : true,
					quickClose : true,
					cancelDisplay:false,
					okDisplay:false,
					modal : false
				}
				var dialog =new Dialog(dialogConfig);
				var staffId = $(e.currentTarget).text();
				var params = {
					method : 'functionAuthOrStaffInfo_get',
					paramDatas : '{staffId :"'+staffId+'"}'  
				}
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params, function(result){
					$("#acceptstaffnoCope").text(result.bean.staffId);
					$('#departCope').text(result.bean.deptName);
					$('#phoneCope').text(result.bean.mobilePhone);
					$('#emailCope').text(result.bean.emailAddress);
					$('#nameCope').text(result.bean.staffName);
					$('#groupNo').text('');
					$('#dealMan').text('');
					$('#dealManLev').text('');
					
					$('#dustuffno').text(result.bean.staffId);
					$('#duname').text(result.bean.staffName);
					$('#dudepart').text(result.bean.deptName);
					$('#duphone').text(result.bean.mobilePhone);
				}, true);
				
				$('.ui-dialog-footer').addClass('hide');
				$('.content li span:odd').on('mouseover',function(){
					var titles = $(this).text()
					$(this).attr('title',titles)
				})
			}
			/**员工个人信息展示 end*/
			
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
						});
					}else{
						crossAPI.tips("抱歉,该服务请求已经不存在！",1500);
					}
				})
			}
			
			/**查询结果集容器*/
			var listSearch = function(data) {
				var config = {
					el : $('#listContainer'),
					highlight: false,
					field : {
						boxType : 'checkbox',
						key : 'id',
						popupLayer : {
							width : 800,
							height : 250
						},
						items : [
								{
									text : '请求编号',
									name : 'id',
									render : function(item, val) {
										val = '<a class="reqDetail">' + val+ '</a>';
										return val;
									}
								},
								{
									text : '接触流水号',
									name : 'contactSerialno',
									render : function(item, val) {
										var val= item.contactSerialno;
										if(val == 'undefined'){
											val = '';
										}
										if(val == '"null"'){
											val = '';
										}
										return val;
									}

								},
								{
									text : '受理号码',
									name : 'subsNumber',
									render : function(item, val) {
										var val= item.subsNumber;
										if(val == 'undefined'){
											val = '';
										}
										return val;
									}
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
									text : '受理工号',
									name : 'acceptStaffno',
									render : function(item, val) {
										val = '<a class="staffDetail">'+val+'</a>';
										return val;
									}
								},

								{
									text : '操作状态',
									name : 'operationStatus',
									render : function(item, val) {
										var val=item.operationStatus;
					                	$.each(_operationStatus,function(index,bean){
					                		if(val == 'undefined'){
												val = '';
											}
					                		if(bean.value==val){
					                			val=bean.name;
					                		}
					                	});
					                	return val;
									}
								}, {
									text : '用户级别',
									name : 'subslevel',
									render : function(item, val) {
										var val=item.subslevel;
										$.each(_subslevel,function(index,bean){
											if(val == 'undefined'){
												val = '';
											}
					                		if(bean.value==val){
					                			val=bean.name;
					                		}
					                	});
					                	return val;
									}
								}, {
									text : '用户品牌',
									name : 'subsBrand',
									render : function(item, val) {
										var val=item.subsBrand;
										$.each(_subsBrand,function(index,bean){
											if(val == 'undefined'){
												val = '';
											}
					                		if(bean.value==val){
					                			val=bean.name;
					                		}
					                	});
					                	return val;
									}
								}, {
									text : '用户地市',
									name : 'subsCity',
									render : function(item, val) {
										var val=item.subsCity;
					                	$.each(_subsCity,function(index,bean){
					                		if(val == 'undefined'){
												val = '';
											}
					                		if(bean.value==val){
					                			val=bean.name;
					                		}
					                	});
					                	return val;
									}
								}, {
									text : '受理方式',
									name : 'acceptMode',
									render : function(item, val) {
										var val=item.acceptMode;
					                	$.each(_acceptMode,function(index,bean){
					                		if(val == 'undefined'){
												val = '';
											}
					                		if(bean.value==val){
					                			val=bean.name;
					                		}
					                	});
					                	return val;
									}
								}, {
									text : '满意度',
									name : 'feedbackSatisfied',
									render : function(item, val) {
										var val=item.feedbackSatisfied;
					                	$.each(_feedbackSatisfied,function(index,bean){
					                		if(val == 'undefined'){
												val = '';
											}
					                		if(bean.value==val){
					                			val=bean.name;
					                		}
					                	});
					                	return val;
									}
								}
								]
					},
					page : {
						perPage : 10,
						align : 'right',
						total:true
					},
					data : {
						url : '/ngwf_he/front/sh/serviceReq!execute?uid=requestQuery001'
					}
				}
				list = new List(config);
				list.search(data);
				
				/**选中几条记录*/
				list.on('checkboxChange',function(e, item, checkedStatus){
				    $('#choosedNum').text(list.getCheckedRows().length);
				    // $(".checkAllWraper > input").attr('checked',false);
				})
		        list.on('success',function(result){
		        	$('#choosedNum').html(0);
		        	//$(".checkAllWraper > input").prop('checked',false);
		    	    $(".checkAllWraper > input").click(function(){
		    	    	var lengths = $(".sn-list-table > tbody input[type='checkbox']").length
						if(this.checked==true){
							$('#choosedNum').html(lengths);
						}else{
							$('#choosedNum').html(0);
						}
					})
		        })
			}
			
			/**初始化加载*/
			IndexLoad(function(IndexModule, options) {
				_index = IndexModule;
				staffId =_index.getUserInfo().staffId;
				var startTime = $("input[name='startTime']").val();
				var endTime = $("input[name='endTime']").val(); 
				//crossAPI.getIndexInfo(function(info){})
				//staffId = info.userInfo.staffId;
				$('#acceptStaffno').val(staffId);
				listSearch({startTime:startTime,endTime:endTime,acceptStaffNo:staffId,operationStatus:'1'});
				eventInit();
			})
	})
})