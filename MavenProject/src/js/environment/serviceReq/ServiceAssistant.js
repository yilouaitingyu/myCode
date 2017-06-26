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
				IndexLoad(function(IndexModule, options){
					_index = IndexModule;
					//事件初始化
					eventInit();
				 });
				var eventInit = function() {
					Tree();
				};
				
				
				var Tree = function(){
					Ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypess',function(result){
    			     	var zNode =result.beans;
    			     	
    			     	var setting = {  
    			     			 view: {  
    			     			    selectedMulti: false,     //禁止多点选中  
    			     				showIcon: false     //是否显示节点图标，默认值为true	
    			     				
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
    				                    	Ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&srtypeid='+selectedNode.id+'',function(result){
    					    			     	var Node =result.beans;
    					    			     	var setting1 = {  
    					    			     		view: {  
    					     			     			    selectedMulti: false,     //禁止多点选中  
    					     			     				showIcon: true    //是否显示节点图标，默认值为true	     			     				
    					     			     		},	
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
        					    			     			content="<li><input type='checkbox' name='"+treeNode.id+"'/><label>"+treeNode.fullname+"</label></li>";
        					    			     			_ids+=treeNode.id+",";
        					    			     			_number+=1;
        					    			     		}else{
        					    			     			content+="<li><input type='checkbox' name='"+treeNode.id+"'/><label>"+treeNode.fullname+"</label></li>";
        					    			     			_ids+=treeNode.id+",";
        					    			     			_number+=1;
        					    			     		}
    					    			     			//crossAPI.tips(content,3000);
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
		
	})
	
});