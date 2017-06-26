define(
		[ 'Util','date', "list", 'select','dialog','selectTree','jquery','simpleTree' ,'indexLoad'],
		function(Util,MyDate, List,Select,Dialog,SelectTree,$,SimpleTree,IndexLoad) {
			
			var list;//表格对象
			var tree;//树对象
		    var $el = $("body");//系统变量-定义该模块的根节点
		    var defaultData;//系统默认分单数据
			var pageArr=[1,2,10,15,20,30,50];
		    //这里是所有定义与方法的入口
			var initialize = function() {
				//配置grid
				defineList();
				//配置工作组树
				defineTree();
				//配置"保存"按钮
				defineBtns();
				//获取默认分单数据
				getDefaultData();
			};
			
			var getDefaultData=function(){
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=workTimeConf001',{},function(result){
    				if(result.returnCode=="0")
    				{
    					var beans = result.beans;
    					if(beans != "" && beans != null)
    					{
    						defaultData = beans[0];
    					}
    				}
    			},true);
			}
			
			//配置grid
			var defineList=function(){
				var listConfig = {
	                    el:$('#listContainer'),
	                    className:'listContainer',
	                    field:{
	                    	boxType:'checkbox',
	                    	key:'ID',
	                        items:[
								{ 
									text:'登录工号',
									name:'STAFF_ID'
								},
	                            { 
	                                text:'用户全名',
	                                name:'STAFF_NM'
	                            },
	                            { 
	                            	text:'运行状态',
	                            	name:'PRSN_STS_CD',
	                            	render : function(item, val) {
										if (val == "1") {
											return "<div class='t-tag-done'>启用</div>";
										} else {
											return "<div class='t-tag-todo'>停用</div>"
										}
									}
	                            },
	                            { 
	                            	text:'单次分单数',
	                            	name:'SIGNLENUM'
	                            },
	                            { 
	                            	text:'最大分单值',
	                            	name:'SIGNLEMAX'
	                            }
	                        ]
	                    },
	                    page:{
	                        customPages:pageArr,
	                        perPage:10,
	                        total:true,
	                        align:'right',
	                        button:{
                                className:'btnStyle',
                                items:[
                                    {
                                        text:'批量启用',
                                        name:'start',
                                        click:start
                                    },
                                    {
                                        text:'批量停用',
                                        name:'stop',
                                        click:stop
                                    },
                                    {
                                        text:'批量修改',
                                        name:'update',
                                        click:update
                                    }
                                ]
                            }
	                    },
	                    data:{
	                        url:'/ngwf_he/front/sh/workflow!execute?uid=queryAllocatePersonList',
	                    }
	                };
	            list = new List(listConfig);
	            list.search({});
			};
			

			//配置tree
			var defineTree=function(){
				var conf={
						callback: {
							onClick: zTreeOnClick
						}
				};
				Util.ajax.getJson("/ngwf_he/front/sh/workflow!execute?uid=workGroupTreeData",function(json,status){
					tree=new SimpleTree.tierTree($("#treeContainer",$el),json.beans,conf);
		        });
			}
			//树点击事件
			var zTreeOnClick=function(event, treeId, treeNode){
				var treeNodeId=treeNode.id;
				if(treeNode.level=="0"){
					list.search({});
				}else{
					list.search({"work_grp_id":treeNodeId});
				}
			}
			
			
			//配置保存按钮
            var defineBtns=function(){
            	//保存
                $("#btn_edit_save").click(function(){
                	var signlenum=$("#signlenum").val();
                	var signlemax=$("#signlemax").val();
               	 if(!checkedRows){
               		 return;
               	 }
               	 //校验signlenum和signlemax
               	 var reg=/^[1-9]{1,}[0-9]{0,}$/;
               	 if(!reg.test(signlenum)){
               		 crossAPI.tips("单次分单值为正整数",3000);
               		 return;
               	 }
               	 if(!reg.test(signlemax)){
               		crossAPI.tips("分单值上限为正整数",3000);
               		 return;
               	 }
               	 //写入数据到checkedRows
               	 for(var i=0;i<checkedRows.length;i++){
               		checkedRows[i].SIGNLENUM=signlenum;
               		checkedRows[i].SIGNLEMAX=signlemax;
               	 }

             	var checkedRowsstr=JSON.stringify(checkedRows);
               	var params={
						'list':checkedRowsstr
				}
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=updateAllocatePersonList',params,function(result){
					if(result.bean.status=="0"){
						crossAPI.tips("修改成功",3000);
					}
					else{
						crossAPI.tips("修改失败",3000);
					}
				},true);
               	 
	              //返回查询结果
					var nodes =tree.getSelectedNodes();
					if(nodes.length==0){
						list.search({});
					}else if(nodes[0].level==0){
						list.search({});
					}else{
						list.search({"work_grp_id":nodes[0].id});
					}
					$(".t-popup").css("display","none");
                });
            	
            	//取消
                $("#btn_edit_cancel").click(function(){
               	 $(".t-popup").css("display","none");
                });
            	
            	
            }
            
            
			
			//停用
            var stop=function(){
            	var stopList=list.getCheckedRows();
            	if(stopList.length==0){
            		crossAPI.tips("请至少选择一行",3000);
            		return;
            	}
            	for(var i=0;i<stopList.length;i++){
            		stopList[i].PRSN_STS_CD='0';
            		//对于未配置过员工的采用系统默认分单数
            		if(!stopList[i].ID){
            			if(defaultData){
            				stopList[i].SIGNLENUM=defaultData.BL_TMS_ALLCT_SHET_CNT.toString();
            				stopList[i].SIGNLEMAX=defaultData.ALLCT_SHET_MAX_CNT.toString();
            			}
            		}
            	}
            	
            	var stopListstr=JSON.stringify(stopList);
				var params={
						'list':stopListstr
				}
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=updateAllocatePersonList',params,function(result){
					if(result.bean.status=="0"){
						crossAPI.tips("停用成功！",3000);
					}
					else{
						crossAPI.tips("停用失败",3000);
					}
				},true);
				//返回查询结果
				var nodes =tree.getSelectedNodes();
				if(nodes.length==0){
					list.search({});
				}else if(nodes[0].level==0){
					list.search({});
				}else{
					list.search({"work_grp_id":nodes[0].id});
				}
            }

            //启用
            var start=function(){
            	var startList=list.getCheckedRows();
            	if(startList.length==0){
            		crossAPI.tips("请至少选择一行",3000);
            		return;
            	}
            	for(var i=0;i<startList.length;i++){
            		startList[i].PRSN_STS_CD='1';
            		//对于未配置过员工的采用系统默认分单数
            		if(!startList[i].ID){
            			if(defaultData){
            				startList[i].SIGNLENUM=defaultData.BL_TMS_ALLCT_SHET_CNT.toString();
            				startList[i].SIGNLEMAX=defaultData.ALLCT_SHET_MAX_CNT.toString();
            			}
            		}
            	}
            	//写入数据
            	var startListstr=JSON.stringify(startList);
				var params={
						'list':startListstr
				};
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=updateAllocatePersonList',params,function(result){
					if(result.bean.status=="0"){
						crossAPI.tips("启用成功！",3000);
					}
					else{
						crossAPI.tips("启用失败",3000);
					}
				},true);
				//返回查询结果
				var nodes =tree.getSelectedNodes();
				if(nodes.length==0){
					list.search({});
				}else if(nodes[0].level==0){
					list.search({});
				}else{
					list.search({"work_grp_id":nodes[0].id});
				}
            }
            
            //修改
            var checkedRows;
            var update=function(){
            	//获取选选中的数据
            	 checkedRows=list.getCheckedRows();
            	if(checkedRows.length==0){
            		crossAPI.tips("请至少选择一行",3000);
            		return;
            	}
            	
            	$(".t-popup").css("display","block");
            }
            
            //保存
			
			return initialize();
});





