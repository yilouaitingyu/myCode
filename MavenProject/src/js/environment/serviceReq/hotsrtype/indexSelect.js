
define(function(require){
	require(['Util', 'list' ,'ajax','form','dialog','validator','zTree','tab','indexLoad',
	         'selectTree','simpleTree',
				'style!assets/lib/zTree_v3/css/zTreeStyle/zTreeStyle.css',
				'style!assets/css/styles/style.css'
				],
			function(Util, List ,ajax, Form, Dialog,Validator,zTree,Tab,IndexLoad){
				var _index;
				var _ids="";
				var ztree;
				var _number=0;
				var treeNodeOption="";
				
				var eventInit = function(){
					$('#selectServiceDialog').on('click',selectServiceDialog);//点击打开选择服务类别界面
					
				};
				
				var selectServiceDialog=function(){//到选择服务类别
					var treeNodeId;
					var treeNodeFullName;
					$("#srtype").empty();
					var dialog1 =  new Dialog($.extend(dialogConfig1,{
		                mode:'normal',
		                id:'selectServiceDialog',
		                title:'选择服务类别',
		                ok:function(){}, //确定按钮的回调函数 
		                okValue: '确定',  //确定按钮的文本
		                cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
		                cancelValue: '取消',  //取消按钮的文本
		                cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
		                width:920,  //对话框宽度
		                height:400, //对话框高度
		                modal:true,
		                content:require("text!module/serviceReq/hotsrtype/selectServiceReqType.html")
		            }));
					//
					Tree();
					$('.element li').on('click',element);	
					$('.serchClear').on('click',serchClear);
					$('#clearBtn').on('click',clearBtn);
					$('#shoucang').on('click',shoucang);
					$('#ywcx').on('click',selectAdd);
					$('#ywzx').on('click',selectAdd);
					$('#ywqx').on('click',selectAdd);
					$('#yxl').on('click',selectAdd);
					$('#khts').on('click',selectAdd);
					
					$('.showContent').on('click','input[type="checkbox"]',add);
					$('#Hot').on('click',Hot);
					$('#tianDan').on('click',tianDan);
					$('#myCollection').on('click',myCollection);
					$('#searchType').on('propertychange input',onpropertychange);
					$('#searchOK').on('click',searchOK);
					$('#searchClear').on('click',searchClear);
					dialog1.on('confirm',function(){
						$("#srtype").empty();
					    $("#srtype").append(treeNodeOption);
						$("#srtype option:first").prop("selected", 'selected');
						treeNodeOption="";
						_number=0;
					});
				}
				//服务类别树
				var Tree = function(){
    				ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypess',function(result){
    			     	var zNode =result.beans;
    			     	
    			     	var setting = {  
    			     			 view: {  
    			     				 selectedMulti: false,     //禁止多点选中  
    			     				 showIcon:false
    			     			 },
    					        check: {  
    					            enable: false//是否启用 复选框
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
    				                onClick: function(treeId, treeNode) { 
    				                    var treeObj = $.fn.zTree.getZTreeObj(treeNode); 
    				                    var selectedNode = treeObj.getSelectedNodes()[0];
    				                    if(selectedNode.id.length==7){
    				                    	ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&srtypeId='+selectedNode.id+'',function(result){
    					    			     	var Node =result.beans;
    					    			     	var setting1 = {  
    					   					        check: {  
    					   					            enable: true  //是否启用 复选框  
    					   					        },  
    					   					        data: {  
    					   					            simpleData: {  
    					   					                enable: true 
    					   					            } 
    					   					        },
    					   					     callback: {  
    					   				            onCheck: zTreeOnCheck  
    					   				        },  
    					    			     	}
    					    			     	function zTreeOnCheck(event, treeId, treeNode) { 
    					    			     		var content=$("#selectContents").html();
    					    			     		
    					    			     		if(treeNode.checked == true){
    					    			     			if(content=="" || content==null){
        					    			     			content="<li><input type='checkbox' name='"+treeNode.id+"'/><label>"+treeNode.fullName+"</label></li>";
        					    			     			_ids+=treeNode.id+",";
        					    			     			_number+=1;
        					    			     			treeNodeOption = "<option value='"+treeNode.id+"'>"+treeNode.fullName+"</option>";
        					    			     		}else{
        					    			     			content+="<li><input type='checkbox' name='"+treeNode.id+"'/><label>"+treeNode.fullName+"</label></li>";
        					    			     			_ids+=treeNode.id+",";
        					    			     			_number+=1;
        					    			     			treeNodeOption += "<option value='"+treeNode.id+"'>"+treeNode.fullName+"</option>";
        					    			     		}
    					    			     			$("#selectContents").html(content);
    					    			     		}else{
    					    			     			$("input[name^="+treeNode.id+"]").parent('li').html('');
    					    			     			_number=_number-1;
    					    			     			_ids=_ids.replace(treeNode.id,'');
    					    			     		}
    					    			     		
    					    			     		
    					    			     		
    					    			     		$("#GS").html(_number);
    					    				        };
    					    				        ztree=$.fn.zTree.init($("#txtIds"), setting1, Node);
    					    				        var allNodes=ztree.getNodes();
    					    				        var nodes = ztree.transformToArray(allNodes);
    					    				        if(nodes.length>0){
    					    				            for(var i=0;i<nodes.length;i++){
    					    				                if(nodes[i].isParent){//找到父节点
    					    				                	nodes[i].nocheck=true;//nocheck为true表示没有选择框
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
    				                    }
    				                   
    				                },
    				                
    				            }  
    					    };
    			     	  
    			     	 var treeDemo=$.fn.zTree.init($("#treeDemo"), setting, zNode);
    			     });
    			}
			//	
				var searchOK=function(){
					var name=$('#searchType').val();
					if(name==null || name==""){
						crossAPI.tips("请输入服务类型",1500);
						return;
					}
					name=encodeURI(name);
					var optionDic = "";
	            	ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByNamereqType',{name:name},function(result){
	            		$.each(result.beans,function(index,bean){
	            			optionDic+="<ul><li><input type='checkbox' name="+bean.id+"><label>"+bean.fullName+"</label></li></ul>"
	            		})
	            		$("#txtIds").html(optionDic);
	            	});
				}
				var searchClear=function(){
				    $('#searchType').val("");  
					
				}
				var onpropertychange=function(e){
					var searchKey=$(e.currentTarget).context.value;
					
					var optionDic = "";
	            	ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByZMreqType&searchKey='+searchKey+'',function(result){
	            		$.each(result.beans,function(index,bean){
	            			optionDic+="<ul><li><input type='checkbox' name="+bean.id+"><label>"+bean.fullname+"</label></li></ul>"
	            		})
	            		$("#txtIds").html(optionDic);
	            	});
				}
				var add=function(){
					var ids=$(this).attr("name");
					console.log($(this).parent('li'));
					 if($('.showContent').find('input[name^='+ids+']').is(":checked")){	
						 if(_ids.indexOf(ids) >= 0){
								crossAPI.tips("类别已选过，请勿重复选取",1500);
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
						 $("#selectContents").find("input[name^="+ids+"]").parent('li').html('');
			     			
			     			
			     			_number=_number-1;
			     			_ids=_ids.replace(ids,'');
			     			 $("#GS").html(_number);
					 }
					
					
				}
				var tianDan=function(){
					//获取流水号
					//crossAPI.getContact(getSerialNo,callback);
					//获取受理号码
					//根据流水号获取接触信息
					var date='';	//crossAPI.getContact(getClientBusiInfo,callback);
					//保存数据库
					ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=acceptanceReques004&serviceid='+_ids+'&date='+date+'',function(result){
						
					})
					//更改未处理字段
				}
				var myCollection = function(e){
	                	var staffId=123;//_index.getUserInfo().staffId;
	                	var optionDic = "";
	                	ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectCollection&staffId='+staffId+'',function(result){
	                		$.each(result.beans,function(index,bean){
	                			if(_ids.indexOf(bean.id) >= 0){
	                				optionDic+="<ul><li><input type='checkbox' checked name="+bean.id+"><label>"+bean.fullname+"</label></li></ul>"
	                			}else{
	                				optionDic+="<ul><li><input type='checkbox' name="+bean.id+"><label>"+bean.fullname+"</label></li></ul>"	
	                			}
	                			
	                		})
	                		$("#txtIds").html(optionDic);
	                	});
				}
				//固定类别查询
				var selectAdd = function(e){
					var name=$(e.currentTarget).context.id;
					var srtypeid="";
					if(name=="ywzx"){
						srtypeid="2114002";
					}else if(name=="ywcx"){
						srtypeid="2114003";
					}else if(name=="khts"){
						srtypeid="2114001";
					}else if(name=="yxl"){
						//srtypeid="2114004";
						crossAPI.tips("没有数据",1500);
						return;
					}else if(name=="ywqx"){
						srtypeid="2114004";
					}
					ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByreqType&srtypeId='+srtypeid+'',function(result){
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
	            	});
				}
				//清空搜索框
				var serchClear = function(){
					$('#searchInput').val('')
				}
				
				//收藏
				var shoucang = function(){
					if(_ids==null || _ids==""){
						crossAPI.tips("请选择服务类别",1500);
						return;
					}
					var staffId="123";//_index.getUserInfo().staffId;
					ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=insertCollection&srtypeid='+_ids+'&creator='+staffId+'',function(result){
						  if(ztree!=null && ztree!=""){
								var allNodes=ztree.getNodes();
						        var nodes = ztree.transformToArray(allNodes);
						        if(nodes.length>0){
						            for(var i=0;i<nodes.length;i++){
						                if(nodes[i].checked==true){
						                	nodes[i].checked=false;
						                }
						            }
						        }
						        ztree.refresh();
						  }
					
					        _ids="";
					        $('#selectContents').html("");
					        _number=0;
					        
					        $("#GS").html(_number);
						crossAPI.tips(result.bean.start,1500);
					})
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
									 $('#selectContents').find('input[type="checkbox"]:checked').parent('li').html("");
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
						 crossAPI.tips("请选择删除的服务类别",1500);
					 }
		            }
				 var Hot = function(){
						$('.rightTri').toggleClass('lowerTri')
						$("#ztreeT ul").finish().toggle(300);
					}	
				
				
				 IndexLoad(function(IndexModule, options){
						_index = IndexModule;
						
						eventInit();
						
					});
	});
	
	var dialogConfig1 = {
            id:'comfirm',
            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
            // delayRmove:3, //延迟删除秒数设定 默认3秒
            title:'标题',    //对话框标题
            content:'这里是对话框的内容', //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
            ok:function(){}, //确定按钮的回调函数 
            okValue: '确定',  //确定按钮的文本
            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
            cancelValue: '取消',  //取消按钮的文本
            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
            width:600,  //对话框宽度
            height:360, //对话框高度
            skin:'dialogSkin',  //设置对话框额外的className参数
            fixed:false, //是否开启固定定位 默认false不开启|true开启
            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
            modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
        }
	
});

