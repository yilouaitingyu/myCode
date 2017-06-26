define( [ 'Util','indexLoad','selectTree','simpleTree','ajax'],
		function(Util,IndexLoad,SelectTree,SimpleTree,ajax) {
			var _index;
			var _options;
            var nodename;//选中节点的名字
            var id;//id
            var callcontent={};
            var staffId;
			
            var eventInit = function() {
				$('#ok').on('click', ok);//确定
				$('#cancelBtn').on('click', cancel);//取消
				$("#searchDepart").on("click",searchDepart);//搜索
				$('#workGroupName').focus();
				departTree();
			}
            var ok = function(){
				//callcontent.nodename = $('#workGroupName').val();
            	var nodes = zTree_depart.getSelectedNodes();
            	if(nodes.length<=0){
            		_index.tips("请选择节点",1500);
            		return;
            	}
            	/*if(nodes[0].level==0){
            		_index.tips("根节点不能作为选项",1500);
            		return;
            	}*/
            	callcontent.nodename = nodename;
				callcontent.id = id;
				if(_options.tabName=="受理部门"){
					crossAPI.trigger(['请求查询'],'acceptingDepartment',callcontent);
				}else{
					crossAPI.trigger(['未完请求'],'refreshDepart',callcontent);
				}
				_index.destroyDialog();
			}
			
			var cancel = function(){
				_index.destroyDialog();
			}
			
			/**节点选中事件*/
			function nodeClick(event, treeId, treeNode) {
				nodename = treeNode.orgaName;
				id =  treeNode.orgaId;
				$('#workGroupName').val(nodename);
		    }
			
			/**生成树*/
			var departTree=function(){
				var settingDepartTree = {  
   		            check: {  
   		                enable: false 
   		            },  
   		            callback:{
   		            	onClick:nodeClick
   		            },
   		            data: {  
   		            	key:{
			            	name:"orgaName",
			            	children:"child",
			            	url:"",
			            	title:""
			            },
		                simpleData: {  
		                    enable: true ,
		                    idKey: "orgaCode",  
							pIdKey: "superOrgaCode",  
							rootPId: "" 
		                }  
   		            } 
   		            
	      		}
          	  	var params = {
					method : 'NGMTT_GETORGATREEBYSTAFF_GET',
					paramDatas : '{staffId:"'+staffId+'"}'
       		  	}
				var jsons ;
	            Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(data){
	            	jsons = (new Function('return( ' + data.object + ' );'))();//把后台过来的数据直接转换为对象.
	            },true);
	            zTree_depart = $.fn.zTree.init($("#treeContainer"),settingDepartTree , jsons[0]);
          	}
          
			/**enter搜索和图标搜索 start*/
			//enter键
	      /* 	$('#workGroupName').bind('keypress',function(){
	       		if(event.keyCode == 13){ 
		       		depart_Menu = $.fn.zTree.getZTreeObj("treeContainer");
		       		depart_Menu.expandAll(false);
		       		depart_Menu.refresh();//之前选中状态去掉
		       		var workGroupName=$.trim($('#workGroupName').val());
		       		if(workGroupName==''){
		       			crossAPI.tips('请输入你要查找的内容！',3000);
		       			return;
		       		}
		       		var params = {
	 					method : 'workGroupById_get',
	 					paramDatas : '{groupName:"'+workGroupName+'"}'
	         		}
	                Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(data){
		            	   console.log(data);
		           	    if(data.bean=='' || data.beans==''){
		           	    	crossAPI.tips("对不起没有该部门！",3000);
		           	    	$('#workGroupName').val('')
		           	    	return ;
		           	    }
		           	    $.each(data.beans,function(i,bean){
		           		    var node = depart_Menu.getNodeByParam("id",bean.groupId);
		           		    depart_Menu.selectNode(node,true);//指定选中ID的节点  
		           		    depart_Menu.expandNode(node, true, true, false);//指定选中ID节点展开 
		           	    })
	               },true)
	       		}
	       	})*/
	       	//图标搜索
			var searchDepart = function(){
				depart_Menu = $.fn.zTree.getZTreeObj("treeContainer");
	       		depart_Menu.expandAll(false);
	       		depart_Menu.refresh();//之前选中状态去掉
	       		var workGroupName=$.trim($('#workGroupName').val());
	       		if(workGroupName==''){
	       			crossAPI.tips('请输入你要查找的内容！',1500);
	       			return;
	       		}
	       		var params = {
 					method : 'workGroupById_get',
 					paramDatas : '{groupName:"'+workGroupName+'"}'
         		}
                Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(data){
                	console.log(data);
                	if(data.bean=='' || data.beans==''){
	           	    	crossAPI.tips("对不起没有该部门！",1500);
	           	    	$('#workGroupName').val('')
	           	    }
	           	    $.each(data.beans,function(i,bean){
	           		    //superGroupCode,groupCode,groupId,groupTypeId
	           		    var node = depart_Menu.getNodeByParam("id",bean.groupId);
	           		    //arr=bean.groupId;
	           		    depart_Menu.selectNode(node,true);//指定选中ID的节点  
	           		    depart_Menu.expandNode(node, true, true, false);//指定选中ID节点展开 
	           	    })
                })
			}
	       	
	       	IndexLoad(function(IndexModule, options){
				_index = IndexModule;
				_options = options;
				staffId =_index.getUserInfo().staffId;
				eventInit();
		    })
		
})