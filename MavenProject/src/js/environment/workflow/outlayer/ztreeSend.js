define(['Util','select',"list",'indexLoad',"detailPanel","simpleTree","hdb",
        'text!module/workflow/outlayer/ztreeSend.html','js/workflow/commonTip/commonTip',
        'style!css/workflow/outlayer/ztreeSend.css'],   
	function(Util,Select,List,IndexLoad,DetailPanel,SimpleTree,Hdb,Html_ztree,commonTip){
	var $el,  //本模板
	    _index, // 本页面的参数,可以和主页面进行数据交互;
	    _options, // 本页面参数,可以和主页面进行数据交互
	    simpleTree,//创建的树对象
		sendArr,//派发过去的人的id 数组用于防止重复派发
		topList,
		downList,
		copyArr,//抄送人的id 用于防止重复抄送;
		numDown,
		numUp;
	var commonTip= new commonTip();
		var initialize = function(index, options){
			$el = $(Html_ztree);
			_index = index;
			_options=options;
			this.toplist();
			this.downlist();
			this.ztree();
			this.sendOrder(); // 添加派发按钮事件
			this.copyOrder(); //添加抄送事件按钮
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype,{
          ztree:function(){
            var setting = {
                    treeId: $("#ztree_contain",$el),  //zTree 的唯一标识，初始化后，等于 用户定义的容器的 id 属性值
                    treeObj:"treeObj",
                    async:{
                        enable: false,        //是否开启异步加载模式
                        //以下配置,async.enable=true时生效
                        url: '/ngwf_he/front/sh/workflow!execute?uid=queryStaffByGroupId',      //Ajax获取数据的地址
                        type: "post",      //Ajax的http请求模式
                        autoParam: ["id"]     //异步加载时需要自动提交父节点属性的参数
                        
                    },
                    callback:{
//                        beforeClick: beforeClick,
                        onClick: zTreeOnClick,
                        onCheck: zTreeOnCheck
                    },
                    check:{
                        enable: true,        //设置节点上是否显示 checkbox / radio
                        chkboxType : {"Y": "", "N": "ps"},        //勾选 checkbox 对于父子节点的关联关系。
                        chkStyle : "checkbox",     //勾选框类型(checkbox 或 radio）[setting.check.enable = true 时生效],默认值："checkbox"
                    },
                    view:{
                        showIcon: true,     //是否显示节点图标，默认值为true
                        showLine: true,     //是否显示节点之间的连线，默认值为true
                        showTitle: true,    //是否显示节点的 title 提示信息(即节点DOM的title属性)，与 setting.data.key.title 同时使用
                        fontCss: {},        //自定义字体
                        nameIsHTML: false  // name 属性是否支持HTML脚本,默认值为false
                    },
                    data:{
                        keep:{
                            leaf: false,
                            parent: false
                        },
                        key:{
                            checked: "checked",
                            children: "children",
                            name: "name",
                            title: "",
                            url: ""
                        },
                        simpleData:{
                            enable: true,
                            idKey: "staffId",
                            pIdKey: "groupId",
                            rootPId: null
                        }
                    }
                }
            var simpleTree = new SimpleTree.tierTree($("#ztree_contain",$el),'/ngwf_he/front/sh/workflow!execute?uid=queryAllWorkGroup',setting);     //$el 表示组件的容器，datas 表示数据，setting 表示配置 
			//节点勾选事件
			function zTreeOnCheck(event, treeId, treeNode){
				 
				var temp="";
				//将隐藏清空
				$('#dspsWorkGrpId',$el).val("");
        		$('#dspsStaffNum',$el).val("");
				if("N"==treeNode.isLoad){
					console.log("子节点")
					console.log(treeNode)
	        		temp =treeNode.id+"@"+treeNode.name+"@"+treeNode.getParentNode().id+"@"+treeNode.getParentNode().name;
	        		if(treeNode.checked){//选中
						if($('#staffs',$el).val()=="")
							$('#staffs',$el).val(temp);
						else
							$('#staffs',$el).val($('#staffs',$el).val()+","+temp);
					}else{//取消选中
						var array=$('#staffs',$el).val().split(",");
						for(var i=0;i<array.length;i++){
							if(array[i]==temp){
								array.splice(i,1);
								break;
							}
								
						}
						$('#staffs',$el).val(array.join(","));
						 
					}
				}else{
					//子节点
					temp=treeNode.id+"@"+treeNode.name;
					if(treeNode.checked){//选中
						if($('#groups',$el).val()=="")
							$('#groups',$el).val(temp);
						else
							$('#groups',$el).val($('#groups',$el).val()+","+temp);
					}else{//取消选中
						var array=$('#groups',$el).val().split(",");
						for(var i=0;i<array.length;i++){
							if(array[i]==temp){
								array.splice(i,1);
								break;
							}
								
						}
						$('#groups',$el).val(array.join(","));
						 
					}
					console.log("父节点")
					console.log(treeNode)
					
				}
			}
			//节点单击事件
			function zTreeOnClick(event, treeId, treeNode) {
				if(treeNode.isLoad=="N"){
					return ;
				}
				if(treeNode.isLoad==""||treeNode.isLoad==null||treeNode.isLoad == undefined){
					console.log("isLoad")
					//父节点不加载
					if(treeNode.isParent){
						
					}else{
						//子节点
						//请求人员方法
						Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryStaffByGroupId',{'id':treeNode.id},function(result,isOk){
							console.log(result.beans)
							if(result.beans.length==0){
								commonTip.text({text:"该工作组下没有员工"});
								return;
							}
							simpleTree.addNodes(treeNode,result.beans,true);
							//展开此节点
							simpleTree.expandNode(treeNode, true, true, true);
						})
					}
					//beforeClick();
				}
			}
        	
       },
       //    添加至震荡工单抄送列表
       sendOrder:function(){
       	  $("#sendOrder",$el).on("click",function(){
       		   
       		var copytotype="01";
          	var staffs = $("#staffs",$el).val();
			var groups =$("#groups",$el).val();
          	var params ={
          			"staffs":staffs,
          			"groups":groups,
          			"copytotype":copytotype
          	}
          //新增
          	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=sendCCConfig003',params,function(result){
          		
          		if(result.returnCode =="0")
					{
						commonTip.text({text:"新增成功"});
					}else{
						commonTip.text({text:"新增失败，请联系管理员"});
					}
          		topList.search({});
			},true);

      		
       		  
       	  });
       },
       //     添加至潜在升级抄送列表
       copyOrder:function(downlist){
       	  $("#copyOrder",$el).on("click",function(){
       		 
       		var copytotype="02";
          	var staffs = $("#staffs",$el).val();
			var groups =$("#groups",$el).val();
          	var params ={
          			"staffs":staffs,
          			"groups":groups,
          			"copytotype":copytotype
          	}
          //新增
          	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=sendCCConfig003',params,function(result){
          		
          		if(result.returnCode =="0")
					{
          			commonTip.text({text:"新增成功"});
					}else{
						commonTip.text({text:"新增失败，请联系管理员"});
					}	
          		 
          		downList.search({});
			},true);
       		  
       	  
       	  });
       },
       
    // 创建右侧上方添加至震荡工单列表
    downlist:function(){
    	var config = {
    		    el:$("#rightDown",$el),  //要绑定的容器
    		    className:'rightTop',      //设置list容器的类名
    		    field:{     //字段设置
    		        boxType:'checkbox',     //行类型，checkbox复选框|radio单选框
    		        key:'id',           //主键，必须设置该项
    		        items:[     //列设置，必须设置该项
    		            { 
    		                text:'工作组', //列文本设置
    		                name:'groupName',    //列字段设置
    		                className:'w120'  //列classs属性
    		            }, 
    		            { text:'人员',name:'staffName' ,
    		            	render:function (item){
                        	if(item.staffName==""||item.staffName==null)
                        		return "所有人";
                        	else
                        		return item.staffName;
                          }	
    		            }
    		        ],
    		        
    		    },
    		    page:{  //分页设置
    		        perPage:5,     //每页显示多少条记录
    		        button:{    //分页左侧按钮设置
    		            items:[
    		                { 
    		                    text:'删除',  //按钮文本
    		                    name:'deleter', //按钮名称
    		                    click:function(item){   //按钮点击时处理函数
    		                    	// 删除
									var datas = downList.getCheckedRows();
									if (datas.length == 0) {
										commonTip.text({text:"请至少选择一条信息"});
										return;
									}
									var  copyconfids = "";
									for( var i=0;i<datas.length;i++){
										if(copyconfids=="")
											copyconfids=datas[i].copyconfid;
										else
											copyconfids+=","+datas[i].copyconfid
									}
									var params={
											"copyconfids":copyconfids
									}
									Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=sendCCConfig002',params,function(result){
										
										if(result.returnCode =="0")
     	         						{
     	         							commonTip.text({text:"删除成功"});
     	         						}else{
     	         							commonTip.text({text:"删除失败，请联系管理员"});
     	         						}	
										//downList = new List(config);
								    	downList.search({});
									},true);	
									$(' th input[type=checkbox]',this.$el).attr("checked", false);
    		                    } 
    		                }
    		            ]
    		        }
    		    },
    		    data:{  //数据源设置
    		        url:'/ngwf_he/front/sh/workflow!execute?uid=sendCCConfig001&copytotype=02' //数据接口路径
    		    }

    		};
    	downList = new List(config);
    	downList.search({});
    },
    toplist:function(){
    	var config = {
    		    el:$("#rightTop",$el),  //要绑定的容器
    		    className:'rightTop',      //设置list容器的类名
    		    field:{     //字段设置
    		        boxType:'checkbox',     //行类型，checkbox复选框|radio单选框
    		        key:'id',           //主键，必须设置该项
    		        items:[     //列设置，必须设置该项
    		            { 
    		                text:'工作组', //列文本设置
    		                name:'groupName',    //列字段设置
    		                className:'w120'  //列classs属性
    		                
    		            }, 
    		            { text:'人员',name:'staffName' ,
    		            	render:function (item){
	                        	if(item.staffName==""||item.staffName==null)
	                        		return "所有人";
	                        	else
	                        		return item.staffName;
    		            	}	
    		            }
    		        ],
    		        
    		    },
    		    page:{  //分页设置
    		        perPage:5,     //每页显示多少条记录
    		        button:{    //分页左侧按钮设置
    		            items:[ 
    		                { 
    		                    text:'删除',  //按钮文本
    		                    name:'deleter', //按钮名称
    		                    click:function(item){   //按钮点击时处理函数
    		                    	// 删除
									var datas = topList.getCheckedRows();
									if (datas.length == 0) {
										commonTip.text({text:"请至少选择一条信息"});
										return;
									}
									var  copyconfids = "";
									for( var i=0;i<datas.length;i++){
										if(copyconfids=="")
											copyconfids=datas[i].copyconfid;
										else
											copyconfids+=","+datas[i].copyconfid
									}
									var params={
											"copyconfids":copyconfids
									}
									Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=sendCCConfig002',params,function(result){
										
										if(result.returnCode =="0")
     	         						{
											commonTip.text({text:"删除成功"});
     	         						}else{
     	         							commonTip.text({text:"删除失败，请联系管理员"});
     	         						}	
										topList.search({});
									},true);
									$(' th input[type=checkbox]',this.$el).attr("checked", false);
    		                    } 
    		                },
    		            ]
    		        }
    		    },
    		    data:{  //数据源设置
    		        url:'/ngwf_he/front/sh/workflow!execute?uid=sendCCConfig001&copytotype=01'//数据接口路径
    		    }

    		};
    	topList = new List(config);
    	topList.search({});
    },
		});
	return initialize;
});