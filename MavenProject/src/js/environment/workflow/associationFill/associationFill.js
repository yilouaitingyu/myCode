define(['Util','list','date','simpleTree'],   
	function(Util,List,Date,SimpleTree){
		var templateId='complaint:1:1015435447411554D18TH';
		var hList;
		var nodeList;
		var initialize = function(){
		    eventInit();
		    dictionaryInit();
		};	
		//下拉框加载数据字典方法
	    var loadDictionary=function(mothedName,dicName,seleId){
					var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
					var seleOptions="";
					Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
						$.each(result.beans,function(index,bean){
							seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
						});
						$('#'+seleId).append(seleOptions);
					},true);
	    };
	    
	    var dictionaryInit = function()
	    {
	    	loadDictionary('staticDictionary_get','HEBEI.DIC.PROCESSTYPE','processType');//工单类别
			loadDictionary('staticDictionary_get','HEBEI.DIC.FLOWTEMPlATEID','flowTemplateId');//模板名称
			loadDictionary('staticDictionary_get','HEBEI.DIC.BASEINFOPAGEID','baseInfoPageId');//基本信息页面
			loadDictionary('staticDictionary_get','HEBEI.DIC.GROUPTYPEID','groupTypeId');//关联工作组类别
			loadDictionary('staticDictionary_get','HEBEI.ORDER.TYPE','fromnode4');//工单类别
	    };	
		
		var eventInit=function(){
			$('.t-tabs-items li').on('click',chooseTab);//切换选项卡
		};
//		zTree
		 var setting = {
		            treeId: "leftTree",      //zTree 的唯一标识，初始化后，等于 用户定义的容器的 id 属性值
		            async:{
		                enable: true,        //是否开启异步加载模式
		                //以下配置,async.enable=true时生效
		                url: "",    //Ajax获取数据的地址
		                type: "post",      //Ajax的http请求模式
		                autoParam: []       //异步加载时需要自动提交父节点属性的参数
		            },
		            callback:{
		                beforeAsync: function(){
		                },       //捕获异步加载之前事件的回调函数，zTree 根据返回值确定是否允许进行异步加载，默认值为null
		                beforeCheck: null,       //捕获 勾选 或 取消勾选 之前事件的回调函数，并且根据返回值确定是否允许 勾选 或 取消勾选，默认值为null
		                beforeCollapse: null,     //捕获父节点折叠之前事件的回调函数，并且根据返回值确定是否允许折叠操作，默认值为null
		                beforeRemove: null ,     //捕获节点被删除之前事件的回调函数，并且根据返回值确定是否允许删除操作，默认值为null
		                onClick:ztreeclick
		                
		            },
		            check:{
		                enable: false        //设置节点上是否显示 checkbox / radio
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
		                    url: "url"
		                },
		                simpleData:{
		                    enable: false,
		                    idKey: "id",
		                    pIdKey: "pId",
		                    rootPId: null
		                }
		            }
		        }
		 function ztreeclick(event,treeId,treeNode){
			 var parentTId = treeNode.parentTId;
			
		 };
		 var nodes2 = [
	                    {id:1, pId:0, name: "父节点1",children:[
	                        {id:'treeDemo_2_span', pId:1, name: "子节点11",children:[
	                             {id:'treeDemo_3_span', pId:2, name: "子节点21"}                                                                      
	                         ]},
	                    ]},
	                    {id:2, pId:1, name: "父节点2",children:[
	                        {id:21, pId:2, name: "子节点21",children:[
	                            {id:211, pId:21, name: "子节点211"},
	                            {id:212, pId:21, name: "子节点212"}
	                        ]}
	                    ]}
	                ];
		 var simpleTree = new SimpleTree.tierTree($('#leftTree'),nodes2,setting);     //$el 表示组件的容器，datas 表示数据，setting 表示配置 

		//切换选项卡
		var chooseTab = function(){
			var index=$(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$('.t-tabs-wrap>li').eq(index).addClass('selected').removeClass('unselected').siblings().addClass('unselected').removeClass('selected');
		}

		
	

		return initialize();

});
