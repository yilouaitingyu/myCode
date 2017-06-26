define(['Util','list','date','simpleTree','selectTree','select','crossAPI','validator','js/workflow/commonTip/commonTip'],   
	function(Util,List,Date,SimpleTree,selectTree,Select,CrossAPI,Validator,commonTip){
//		var templateId='complaint:1:1015435447411554D18TH';
		var list;
		var hList;
		var pList;
		var nodeList;
		var templateId;
		var staffId;
		var staffName;
		var  num=0;
		var nodePageArr =[5,10,15,20,30,50];
		var handPageArr =[5,10,15,20,30,50];
	//	var form;
		var  commonTip = new commonTip();
		var initialize = function(){
				staffIdInit();
		};	
		var staffIdInit = function()
		{
			CrossAPI.getIndexInfo(function(info){
	        	staffId=info.userInfo.staffId;
	        	staffName=info.userInfo.staffName;
	        	//全设置为隐藏
			 	$('#secondshow').addClass('hide').removeClass('show');
			 	$('#thirdshow').addClass('hide').removeClass('show');
			    treeInit();
			   //framePageGroupInit();
		    	eventInit();
		        dictionaryInit();
		        ftList({});		        
		        handleTemplate();
		        srSelect();	
	        })
		}
		//工作组
		var simpleTree;
		var groupSelect = function(){
			$('#popSelect').addClass("show");
			simpleTree = new SimpleTree.tierTree($('#treeContainer'),'/ngwf_he/front/sh/workflow!execute?uid=queryAllWorkGroup',settings);
			if ($(this).attr('id')=="fromnode2") { //判断点击的按钮以增加不同的状态
				$("#selectedNodes").attr("state","1");
			}
			if ($(this).attr('id')=="fromnode3") {
				$("#selectedNodes").attr("state","2");
			}
		}
		//工作组树形回显
		var secondGroupInfo = function(){
			var nodes = simpleTree.getCheckedNodes(true);
			console.log(nodes);
			if(nodes[0].isParent==true){
				commonTip.text({text:"请选择正确的工作组！"});
				$('#popSelect').addClass("show");
				return;
			}else{
				if(nodes.length==1){
					if ($(this).attr('state')=="1") { //判断点击的按钮以增加不同的状态
						$("#fromnode2").val(nodes[0].name);
						$("#fromnode2").attr("name",nodes[0].id);
					}
					if ($(this).attr('state')=="2") {
						$("#fromnode3").val(nodes[0].name);
						$("#fromnode3").attr("name",nodes[0].id);
					}
				}else{
					commonTip.text({text:"只能选择一个！"});
				}
			}
		}
		//框架页面工作组下拉框初始化
		var framePageGroupInit = function(){
			var seleOptions="";
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryGoupByMtt',null,function(result){
				$.each(result.beans[0].children,function(index,bean){
					seleOptions+="<option  value='"+bean.id+"'>"+bean.name+"</option>"
				});
				$('#groupTypeId').append(seleOptions);
			});
		};
		//加载树方法
		var treeInit = function(){
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryTemplateTree',{"loginStaffId":staffId},function(result){
				  //$el 表示组件的容器，datas 表示数据，setting 表示配置 
				var simpleTree = new SimpleTree.tierTree($('#leftTree'),result.beans,setting); 
			});
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
			loadDictionary('staticDictionary_get','HEBEI.DIC.PROCESSTYPE','fm_formclass');//工单类别
			loadDictionary('staticDictionary_get','HEBEI.WF.NODETYPECD','updateNodetype');
			
			
			
	    };	
		
		var eventInit=function(){

			$('.t-tabs-items li').on('click',chooseTab);//切换选项卡
			$('#handleComment_add').on('click',addHandleComment);//添加表单
			$('#cancelComment').on('click',cancelComment);//取消
			$('#saveComment').on('click',saveComment);//保存
			$('#Ft_addInfo').on('click',addInfo)//新增派单关系
			$("#framePageSaveBtn").on("click",saveFramePage);//框架页面新增按钮添加方法
			$('#Ft_btn').on('click',saveInfo)//保存派单关系
			$('#Ft_btn1').on('click',updateInfo)//修改派单关系
			$('#Ft_delInfo').on('click',deleteInfo)//删除派单关系
			$('#Ft_setInfo').on('click',addSetInfo)//添加派单配置
			$('#Ft_disSetInfo').on('click',addDisSetInfo)//添加派单配置
			$('#fromnode2').on('click',groupSelect)//添加工作组配置
			$('#fromnode3').on('click',groupSelect)//添加工作组配置
			$('#selectedNodes').on('click',secondGroupInfo)//添加派单配置
			//$('#addNodeExit').on('click',addNodeExit)//新增节点出口关系
			$("#framePageReset").on("click",framePageReset);//框架页面重置按钮
			$("#fm_saveButton").on("click",fmSaveButton);//二级树中的保存按钮
		};
		
		//二级树种的保存按钮
		var fmSaveButton = function(){
			var baseTemplateId = $("#fm_moduleNum").val();
			var workItemType = $("#fm_formclass").val();
			var params = {"baseTemplateId":baseTemplateId,"workItemType":workItemType};
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=fmSaveButton',params,function(result){
				commonTip.text({text:"修改成功!"});
				treeInit();
			});
		}
		
		// 框架页面重置按钮
		var framePageReset = function(){
			 treeDemo2Init(templateId);
		}
		
		//添加派单配置弹出窗
		var addSetInfo = function (){
			CrossAPI.createTab("自动派单规则配置",getBaseUrl()+"/ngwf_he/src/module/workflow/flowTemplate/morework.html",{"seqprcTmpltId":templateId});
		}
		
		//其他自动指向规则配置
		var addDisSetInfo = function (){
			CrossAPI.createTab("其他自动指向规则配置",getBaseUrl()+"/ngwf_he/src/module/workflow/flowTemplate/dismorework.html",{"seqprcTmpltId":templateId});
		}

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
		                enable:false,        //设置节点上是否显示 checkbox / radio
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
		 var settings = {
		            treeId: "groupTree",      //zTree 的唯一标识，初始化后，等于 用户定义的容器的 id 属性值
		            async:{
		                enable: true,        //是否开启异步加载模式
		                url: "",    //Ajax获取数据的地址
		                type: "post",      //Ajax的http请求模式
		                autoParam: []       //异步加载时需要自动提交父节点属性的参数
		            },
		            callback:{
		                beforeAsync: function(){},       //捕获异步加载之前事件的回调函数，zTree 根据返回值确定是否允许进行异步加载，默认值为null
		                beforeCheck: null,       //捕获 勾选 或 取消勾选 之前事件的回调函数，并且根据返回值确定是否允许 勾选 或 取消勾选，默认值为null
		                beforeCollapse: null,     //捕获父节点折叠之前事件的回调函数，并且根据返回值确定是否允许折叠操作，默认值为null
		                beforeRemove: null ,     //捕获节点被删除之前事件的回调函数，并且根据返回值确定是否允许删除操作，默认值为null
		                onClick:ztreeclick
		                
		            },
		            check:{
		                enable:true,        //设置节点上是否显示 checkbox / radio
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
			 if(parentTId == null)
			 {
			 }
			 else if(parentTId == "leftTree_1")
			 {
				 $('#secondshow').addClass('show').removeClass('hide');
				 $('#thirdshow').addClass('hide').removeClass('show');
				 $("#fm_moduleNum").val(treeNode.baseTemplateId);
				 $("#fm_formclass").val(treeNode.workItemType);
			 }
			 else
			 {
				 $('#secondshow').addClass('hide').removeClass('show');
				 $('#thirdshow').addClass('show').removeClass('hide');
				 //得到模板ID
				 templateId = treeNode.id;
				 //调用进入页面初始化方法
				 treeDemo2Init(templateId);
			 }
		 };
		 
		//二级菜单点击后进入方法
			var treeDemo2Init = function(templateId)
			{		
				    framePageGroupInit();
				 	nodeExit(templateId);
			        selectNodeMessage(templateId);
			      //  pageSelect();
			        getFlowChart(templateId);
			        handleTemplate(templateId);
			        selectInfo(templateId);
				//先设置templateId 为一个固定值 
				//templateId = "templateid111";
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=framePageQuery',{'templateId':templateId},function(result){
					//如果返回结果为空
					if(result.beans.length < 1)
					{
						return;
					}
					//为页面初始化数据
					$("#processType").val(result.beans[0].processType);
					$("#framePageTemplateId").val(result.beans[0].templateId);
					$("#templateName").val(result.beans[0].templateName);
					$("#templateVersion").val(result.beans[0].templateVersion);
					$("#flowTemplateId").val(result.beans[0].flowTemplateId);
					$("#baseInfoPageId").val(result.beans[0].baseInfoPageId);
					$("#groupTypeId").val(result.beans[0].groupTypeId);
					
					$(":input[name='templateName']").attr('value',$("#templateName").val());
					$(":input[name='templateName']").attr('readonly','readonly');
					$(":input[name='templateVersion']").attr('value',$("#templateVersion").val());
					$(":input[name='templateVersion']").attr('readonly','readonly');
				});
			} 
			
			//框架页面 保存按钮方法
			var saveFramePage = function()
			{
				//把templateId设置成能修改
				var flowTemplateId = $("#flowTemplateId").val();
				var baseInfoPageId = $("#baseInfoPageId").val();
				var groupTypeId = $("#groupTypeId").val();
				var templateId = $("#framePageTemplateId").val();
				
				if(flowTemplateId == null || flowTemplateId == "")
				{
					commonTip.text({text:"模板名称不能为空!"});
					return;
				}
				var params = {
						"flowTemplateId":flowTemplateId,
						"baseInfoPageId":baseInfoPageId,
						"groupTypeId":groupTypeId,
						"templateId":templateId
				};
				
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=framePageUpdate',params,function(result){
					commonTip.text({text:"修改成功!"});
				});
			} ;
		 
		 
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
		       // var simpleTree = new SimpleTree.tierTree($('#leftTree'),nodes2,setting);     //$el 表示组件的容器，datas 表示数据，setting 表示配置 
		 
		//删除派单关系
		var deleteInfo = function(){
				var rows=list.getCheckedRows();
				if(rows.length=='0'){
					commonTip.text({text:"请选择一条数据!"});
					return;
				}
				var flag = confirm("确认删除选中的派单关系吗？");
				if (flag) {
				var ids="";
				for(var i=0;i<rows.length;i++){
					ids+=rows[i].id+",";
				}
				var url='/ngwf_he/front/sh/workflow!execute?uid=Dft001';
				var data={'ids':ids};
				Util.ajax.postJson(url,data,function(result){
					if(result.returnCode=='0'){
						commonTip.text({text:"删除成功!"});
						ftList({});
					}else{
						commonTip.text({text:"删除失败!"});
					}
				});
			}
		}
		//保存派单关系
		var saveInfo = function(){
			var fromNodeName = $('#fromnode').val();
			var toNodeName = $('#fromnode1').val();
			var fromParticipantName = $('#fromnode2').val();
			var fromParticipantId = $('#fromnode2').attr("name");
			if (fromParticipantName=="") {
				fromParticipantName = "ALL";
			}
			var toParticipantName =$('#fromnode3').val();
			var toParticipantId = $('#fromnode3').attr("name");
			var businessType = $('#fromnode4').val();
			var srtypeId = $('#fromnode5').val();
			if (businessType=="") {
				businessType="ALL";
			}
			if (srtypeId=="") {
				srtypeId="ALL";
			}
			if (fromNodeName==""||toNodeName==""||toParticipantName=="") {
				commonTip.text({text:"必填项不能为空！"});
				$("#popuplayer").addClass("show");
				return;
			}
			var data = {
					"fromNodeName":fromNodeName,
					"toNodeName":toNodeName,
					"fromParticipantName":fromParticipantName,
					"fromParticipantId":fromParticipantId,
					"toParticipantId":toParticipantId,
					"toParticipantName":toParticipantName,
					"srtypeId":srtypeId,
					"businessType":businessType
			}
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=Aft001',data,function(result){
				if(result.returnCode=="0"){
					commonTip.text({text:"添加成功！"});
					ftList({});
				}else{
					commonTip.text({text:"添加失败！"});
				}
			},true);
		}
		//新增派单关系
		var addInfo = function(){
			resetInfo();
			$('#popuplayer').addClass('show').removeClass('hide');
			$('#Ft_btn1').addClass('hide').removeClass('show');
			$('#Ft_btn').addClass('show').removeClass('hide');
		}
		//修改派单关系
		var changeInfo = function(){
			$('#popuplayer').addClass('show').removeClass('hide');
			$('#Ft_btn1').addClass('show').removeClass('hide');
			$('#Ft_btn').addClass('hide').removeClass('show');
			
		}
		//派单 关系下拉框,源节点
		var selectInfo = function(templateId){
			$('#fromnode').empty();
			$('#fromnode1').empty();
			var params = {"seqprcTmpltId":templateId};
			var seleOptions="<option  value=''>请选择</option>";
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=ft001',params,function(result){
				$.each(result.beans,function(index,bean){
					seleOptions+="<option  value='"+bean.node_id+"'>"+bean.node_nm+"</option>"
				});
				$('#fromnode').append(seleOptions);
				$('#fromnode1').append(seleOptions);
			},true);
		}
		//切换选项卡
		var chooseTab = function(){
			var index=$(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$('.t-tabs-wrap>li').eq(index).addClass('selected').removeClass('unselected').siblings().addClass('unselected').removeClass('selected');
		}
		//关联处理意见模板
		var handleTemplate=function(templateId){
//			var templateId=$('#framePageTemplateId').val();
			var config = {
				el:$('#templateContainer'),
			    field:{
			    	boxType:'checkbox',
			        key:'id',         		        	
			        items: [
                            {text:'流程节点',name:'nodeName'},
                            {text:'服务请求类别编码',name:'srTypeId'},
                            {text: '处理意见模板', name: 'handleComment'},
                            {text:'是否启用',name:'state',
                            	render : function(item,val){
                            		if(val=='0'){
                            			return "启用";
                            		}else{
                            			return "停用";
                            		}
                            	}},
                            {text:'是否必填',name:'mandatory',
                            		render : function(item,val){
                                		if(val=='0'){
                                			return "必填";
                                		}else{
                                			return "否";
                                		}
                                		
                                	},
                            	className:"borderRight"
                            	},
                            {text:'',name:'templateId',className:'hide'
                            },
                            {text:'',name:'nodeId',className:'hide'
                            },
                            {text:'',name:'id',
                            	className:'hide'
                            }
                    ]
			        
			    },
			    page:{
			    	customPages:handPageArr,
			        perPage:5,    
			        align:'right',
			        total:true
			    },
			    data:{
			        url:'/ngwf_he/front/sh/workflow!execute?uid=queryHandleComment'
			    }
			}
			hList = new List(config);
			hList.search({'templateId':templateId});
			hList.on('success', function(result) {
				$(".checkAllWraper>input").prop("checked",false);
				num = 0;
				var index =$.inArray(($("#templateContainer .selectPerPage").val()-0),handPageArr);
				$("#templateContainer .selectPerPage option").eq(index+1).remove();
				$("#templateContainer .checkAllWraper>input").prop("checked",false);
				$("#templateContainer .btnCustom0").removeClass("btn");
                $("#templateContainer .btnCustom0").prop("disabled",true);
			});
			
			$('#templateContainer .checkAllWraper>input').change(function(){
                if($(' #templateContainer .checkAllWraper>input').prop("checked")){
                	$(' #templateContainer .boxWraper > input').each(function(){
                		$(this).prop("checked",true);
                	});
                	num = $('#templateContainer .selected').length;
                	$("#templateContainer .btnCustom0").val("已选择"+num+"条工单");
                }else{
                	$('#templateContainer .boxWraper > input').each(function(){
                		$(this).prop("checked",false);
                	});
                	num = 0;
                	$("#templateContainer .btnCustom0").val("已选择"+num+"条工单");
                }
             });	
		}
		//添加表单
		var addHandleComment=function(){
			$('#addComment').addClass('show').removeClass('hide');
		};
		
		//取消表单
		var cancelComment=function(){
			//commentForm
			$('#commentForm')[0].reset();
			$('#addComment').addClass('hide').removeClass('show');
			$(".ui-popup").remove();
			$(".ui-popup-backdrop").remove();
		}
		
		//保存
		var saveComment=function(){
			
			var config = {
				el: $("#commentForm"),     //要验证的表单或表单容器
				dialog:true,    //是否弹出验证结果对话框
				focusNoChecked:true,
				rules:{
					nodeId:"required",  //设置name=startTime 的元素为必填项，并且是日期格式
					handleComment:"required|length-256",    //设置name=endTime 的元素为必填项，并且是日期格式
					srTypeId:'required'          //设置name=content 的元素为必填项，并且字数不能小于10
				},
				messages:{
					nodeId:{ //设置name=startTime 元素的消息
						required:"请选择处理节点"
					},
					handleComment:{
						required:"请填写处理意见模板内容",
						length:"处理意见模板内容限制256个字符"
					},
					srTypeId:{ //设置name=startTime 元素的消息
						required:"请选择服务请求类别"
					}
				}
			}
			var validateForm = new Validator(config);
			
			
			if(validateForm.form()){
				console.log("验证 通过")
				var handComment=$('#handlecomment').val();
				var selectNode=$('#selectNode').val();
				var templateId=$("#framePageTemplateId").val();
				$(":input[name='templateId']").attr('value',templateId);
				var $form=$('#commentForm');
				var data = Util.form.serialize($form);
				var url='/ngwf_he/front/sh/workflow!execute?uid=saveHandleComment';
				Util.ajax.postJson(url,data,function(result,isOk){
					if(result.returnCode=='0'){
						commonTip.text({text:"添加模板成功!"});
						hList.search({'templateId':templateId});
						$('#addComment').addClass('hide').removeClass('show');
						//把表单清空
						$('#commentForm')[0].reset();
					}else{
						commonTip.text({text:"添加模板失败!"});
					}
				});
			}else{
				$(".ui-popup").css("z-index","103000");
				$("body").off("click").on("click","#commentForm",function(){

						$(".ui-popup").remove();
						$(".ui-popup-backdrop").remove();  
					    	
					})
			}
		}
		//加载派单关系列表
		var ftList = function(data){
			 var config = {
		                el:$('#Ft_oppintOrder'),
		                field:{
		                    boxType:'checkbox',
		                    key:'id',                           
		                    items:[
		                        { text:'配置编号',name:'decisionId',className:'hide'},	
		                        { text:'索引ID',name:'id',className:'hide'},	
		                        { text:'源节点',name:'fromNodeName'},
		                        { text:'目标节点',name:'toNodeName' },
		                        { text:'服务请求类别',name:'srtypeId' },
		                        { text:'源工作组',name:'fromParticipantName'},
		                        { text:'目标工作组',name:'toParticipantName',className:"borderRight" }
		                    ]
		                },
		                page:{
		                	 perPage:10,
		                     align:'right',
	                    	 button:{    //分页左侧按钮设置
	                             items:[ 
									{
										text : "已选择0条工单",//不要改动这个.这个是为了撑开空间
										name : 'deleter',
										click : function(e) {
											// 打印当前按钮的文本
											console.log('点击了删除按钮' + e + this.text)
										}
									}
	                             ]
	                         }
		                },
		                data:{
		                    url:'/ngwf_he/front/sh/workflow!execute?uid=Qft001'
		                }
		            };
			list = new List(config);
			list.search();
			list.on('rowClick',function(e,item){
				changeInfo();
				secondShowInfo(item);
			});
			list.on('success', function(result) {
				$(".checkAllWraper>input").prop("checked",false);
				num = 0;
				$(".checkAllWraper>input").prop("checked",false);
				$(".btnCustom0").val("已选择"+num+"条工单");
				$(".btnCustom0").removeClass("btn");
                $(".btnCustom0").prop("disabled",true);
			});
			$('.checkAllWraper>input').change(function(){
                if($('.checkAllWraper>input').prop("checked")){
                	$('.boxWraper > input').each(function(){
                		$(this).prop("checked",true);
                	});
                	console.log(123)
                	num = $('#Ft_oppintOrder .selected').length;
                	$(".btnCustom0").val("已选择"+num+"条工单");
                }else{
                	$('.boxWraper > input').each(function(){
                		$(this).prop("checked",false);
                	});
                	num = 0;
                	$(".btnCustom0").val("已选择"+num+"条工单");
                }
             });

			list.on('checkboxChange', function(e, item, checkedStatus) {// 事件处理代码
				if (checkedStatus == 1) {
					num++
					if(num==$(".boxWraper>input").length){
						$('.checkAllWraper>input').prop("checked",true);
					}
					$(".btnCustom0").val("已选择"+num+"条工单");
				} else {
					num--
					$('.checkAllWraper>input').prop("checked",false);
					$(".btnCustom0").val("已选择"+num+"条工单");
				}
			});
		}

		//回显
		var secondShowInfo = function (item){
			resetInfo();
			$('#fromnode').val(item.fromNodeName);
			$('#fromnode1').val(item.toNodeName);
			$('#fromnode2').val(item.fromParticipantName);
			$('#fromnode3').val(item.toParticipantName);
			$('#fromnode4').val(item.businessType);
			$('#fromnode5').val(item.srtypeId);
			$('#decision').val(item.decisionId);
		}
		//修改保存
		var updateInfo =function(){
			var fromNodeName = $('#fromnode').val();
			var toNodeName = $('#fromnode1').val();
			var fromParticipantName = $('#fromnode2').val();
			var toParticipantName = $('#fromnode3').val();
			var businessType = $('#fromnode4').val();
			var srtypeId = $('#fromnode5').val();
			var decisionId = $('#decision').val();
			var data ={
					"fromNodeName":fromNodeName,
					"toNodeName":toNodeName,
					"fromParticipantName":fromParticipantName,
					"toParticipantName":toParticipantName,
					"businessType":businessType,
					"srtypeId":srtypeId,
					"decisionId":decisionId
			}
			Util.ajax.postJson("/ngwf_he/front/sh/workflow!execute?uid=updateDispatchInfo",data,function(result){
				if (result.returnCode=="0") {
					commonTip.text({text:"修改成功！"});
					ftList({});
				}else{
					commonTip.text({text:"修改失败！"});
				}
			});
		}
		//清空
		var resetInfo = function(){
			$('.resetInfo').val('');
		}
		
		//出现修改模板页面
		$('#handleComment_update').click(function(){
			var rows=hList.getCheckedRows();
			if('1'!=rows.length){
				commonTip.text({text:"请选择一条数据!"});
				return;
			}
			 $("[name='updateState']").removeAttr("checked");
			 $("[name='updateMandatory']").removeAttr("checked");
			$("input[name='id']").attr('value',rows[0].id);
			$("input[name='templateId']").attr('value',rows[0].templateId);
			$('#updateSelectNode').val(rows[0].nodeId);
			$('#updateSrTypeId').val(rows[0].srTypeId);
			$('#updateComment').val(rows[0].handleComment);
			$("input[name='updateState'][value="+rows[0].state+"]").prop("checked",true); 
			$("input[name='updateMandatory'][value="+rows[0].mandatory+"]").prop("checked",true); 
			$('#updateHandleComment').addClass('show').removeClass('hide');
			
		});
		
		//修改模板
		$('#update').click(function(){
			var config = {
		            el:$("#updateCommentForm"),     //要验证的表单或表单容器
		            dialog:true,    //是否弹出验证结果对话框
		            focusNoChecked:true,
		            rules:{
		            	nodeId:"required",  //设置name=startTime 的元素为必填项，并且是日期格式
		            	handleComment:"required|length-256",    //设置name=endTime 的元素为必填项，并且是日期格式
		            	srTypeId:'required'          //设置name=content 的元素为必填项，并且字数不能小于10
		            },
		            messages:{
		            	nodeId:{ //设置name=startTime 元素的消息
		                    required:"请选择处理节点"
		                },
		                handleComment:{
		                	required:"请填写处理意见模板内容",
		                	length:"处理意见模板内容限制256个字符"
		                },
		                srTypeId:{ //设置name=startTime 元素的消息
		                    required:"请选择服务请求类别"
		                }
		            }
		        }
			var form = new Validator(config);
			//验证成功
			if(form.form()){
				var handComment=$('#updateComment').val();
				var updateSelectNode=$('#updateSelectNode').val();
				$('#updateHandleComment').addClass('hide').removeClass('show');
				var updateForm=$('#updateCommentForm');
				var templateId = $("#framePageTemplateId").val();
				var data=Util.form.serialize(updateForm);
				var url='/ngwf_he/front/sh/workflow!execute?uid=updateHandleComment'
					Util.ajax.postJson(url,data,function(result,isOk){
						if(result.returnCode=='0'){
							commonTip.text({text:"修改成功!"});
							hList.search({'templateId':templateId});
							$("[type='checkbox']").attr('checked',false);
						}else{
							commonTip.text({text:"修改失败!"});
						}
					});
			}else{
				$(".ui-popup").css("z-index","103000");
			$("body").off("click").on("click","#updateCommentForm",function(){

					$(".ui-popup").remove();
					$(".ui-popup-backdrop").remove();  
				    	
				})
				
			}
			
		});
		//删除模板
		$('#handleComment_delete').click(function(){
			var rows=hList.getCheckedRows();
			var templateId = $("#framePageTemplateId").val();
			if(rows.length=='0'){
				commonTip.text({text:"请选择一条数据!"});
				return;
			}
			var flag = confirm("确认删除选中的关联意见模板吗？");
			if(flag){
				var ids="";
				$.each(rows, function(index, obj) {
					ids+=obj.id+",";
				});
				var url='/ngwf_he/front/sh/workflow!execute?uid=deleteTemplate';
				var data={'ids':ids};
				Util.ajax.postJson(url,data,function(result,isOk){
					if(result.returnCode=='0'){
						commonTip.text({text:"删除模板成功!"});
						hList.search({'templateId':templateId});
					}else{
						commonTip.text({text:"删除模板失败!"});
					}
				});
			}
		});
		
		//节点信息和出口配置
		var nodeExit=function(templateId){
			var config = {
					el:$('#nodeContainer'),
				    field:{
				    	boxType:'checkbox',
				        key:'id',         		        	
				        items: [
								{text:'操作',name:'mandatory',
									click:function(e,item){ //列点击事件
									},
									render:function(item,val,$src){
								            //$src 该列td元素的jquery对象引用
								            $src.on('click', 'a', function(e){
								            	$('#nodeExitPro').addClass('show').removeClass('hide');
								            	var config = {
								    					el:$('#nodeExitList'),
								    				    field:{
								    				    	boxType:'checkbox',
								    				        key:'id',         		        	
								    				        items: [
								    	                            {text:'编号',name:'actionId'},
								    	                            {text:'流程模板编号',name:'templateId'},
								    	                            {text: '节点', name: 'nodeId'},
								    	                            {text:'下一节点',name:'nextNodeId'},
								    	                            {text:'出口名称',name:'actionName'},
								    	                            {text:'操作类型',name:'operCode',
								    	                            	render:function(item,val,$src){
								    										var obj=wrapDictionray("HEBEI.WF.NODETYPECD");
								    										return obj[val];
								    									}
								    	                            
								    	                            },
								    	                            {text:'默认出口',name:'defaultPort',
								    	                            	render : function(item, val) {
								    	                            		if(val==""||val==null||val==undefined){
								    	                            			return null ;
								    	                            		}
								    	                            		if(val=='N'){
								    	                            			return "否"
								    	                            		}else{
								    	                            			return "是";
								    	                            		}
								    	                                }
								    	                            
								    	                            },
								    	                            {text:'手动派单',name:'handleFlag',
								    	                            	render : function(item, val) {
								    	                            		if(val==""||val==null||val==undefined){
								    	                            			return null;
								    	                            		}
								    	                            		if(val=='N'){
								    	                            			return "否"
								    	                            		}else{
								    	                            			return "是";
								    	                            		}
								    	                                }
								    	                            },
								    	                            {text:'是否多派',name:'owfmsFlag',
								    	                            	render : function(item, val) {
								    	                            		if(val==""||val==null||val==undefined){
								    	                            			return null;
								    	                            		}
								    	                            		if(val=='N'){
								    	                            			return "否"
								    	                            		}else{
								    	                            			return "是";
								    	                            		}
								    	                                },
								    	                            className:"borderRight"},
								    	                            {text:'',name:'operCode',className:'hide'},
								    	                            {text:'',name:'action',className:'hide'},
								    	                            {text:'',name:'callJsName',className:'hide'},
								    	                            {text:'',name:'privateId',className:'hide'},
								    	                            {text:'',name:'showExprs',className:'hide'}
								    	                            
								    	                    ]
								    				        
								    				    },
								    				    page:{
								    				    	customPages:[5,10,15,20,30,50],
								    				        perPage:5,    
								    				        align:'right',
								    				        total:true
								    				    },
								    				    data:{
								    				        url:'/ngwf_he/front/sh/nodeMessage!execute?uid=queryNodeExit&templateId='+item.templateId+'&nodeId='+item.nodeId,
								    				    }
								    			}
								    			pList = new List(config);
								    			pList.search({});
								    			pList.on('success', function(result) {
								    				$(".checkAllWraper>input").prop("checked",false);
								    				num = 0;
								    				console.log("pList");
								    				$(".checkAllWraper>input").prop("checked",false);
								    				$(".btnCustom0").val("已选择"+num+"条工单");
								    				$(".btnCustom0").removeClass("btn");
								                    $(".btnCustom0").prop("disabled",true);
								    			});
								    			$('.checkAllWraper>input').change(function(){
								                    if($('.checkAllWraper>input').prop("checked")){
								                    	$('.boxWraper > input').each(function(){
								                    		$(this).prop("checked",true);
								                    	});
								                    	console.log(123)
								                    	num = $('#Ft_oppintOrder .selected').length;
								                    	$(".btnCustom0").val("已选择"+num+"条工单");
								                    }else{
								                    	$('.boxWraper > input').each(function(){
								                    		$(this).prop("checked",false);
								                    	});
								                    	num = 0;
								                    	$(".btnCustom0").val("已选择"+num+"条工单");
								                    }
								                 });

								    			pList.on('checkboxChange', function(e, item, checkedStatus) {// 事件处理代码
								    				if (checkedStatus == 1) {
								    					num++
								    					if(num==$(".boxWraper>input").length){
								    						$('.checkAllWraper>input').prop("checked",true);
								    					}
								    					$(".btnCustom0").val("已选择"+num+"条工单");
								    				} else {
								    					num--
								    					$('.checkAllWraper>input').prop("checked",false);
								    					$(".btnCustom0").val("已选择"+num+"条工单");
								    				}
								    			});
								    			
								            })
								            $('#exitNodeName').val(item.nodeName);//节点名称
										//重写列表展示
								        return '<a href="###"><font color=#1A94E6>出口配置</font></a>';
								    } 
								},
	                            {text:'流程模板编号',name:'templateId',
	                            	click:function(e,item){ //列点击事件
	                            	},
	                            	render:function(item,val,$src){
                                        //$src 该列td元素的jquery对象引用
                                        $src.on('click', 'a', function(e){
                                        	$('#updateNodeExitMessage').addClass('show').removeClass('hide');
                            				$('#updateId').val(item.id);
                            				$('#updateTemplateid').val(item.templateId);
                            				$('#updateNodename').attr('readonly','readonly');
                            				$('#updateNodeMessage').val(item.nodeId);
                            				$('#updateNodeMessage').attr("disabled","disabled");
                            				$('#updateNodetype').val(item.nodeType);
                            				$('#updatePagename').val(item.editPageId);
                            				$('#updatePageurl').val(item.readPageId);
                            				$('#updateNodename').val(item.nodeName);
                            				console.log(item.description)
                            				$("#description").val(item.description);
                                        })
	                            		//重写列表展示
	                                    return '<a href="###"><font color=#1A94E6>'+val+'</font></a>';
	                            	} 
	                            	
	                            },
	                            {text:'流程名称',name:'templateName'},
	                            {text: '节点', name: 'nodeId'},
	                            {text:'节点名称',name:'nodeName'},
	                            {text:'',name:'id',className:'hide'},
                            	{text:'',name:'editPageId',className:'hide'},
                            	{text:'',name:'description',className:'hide'},
                            	{text:'',name:'nodeType',className:'hide'},
                            	{text:'',name:'confedif',className:'hide'}
	                    ]
				        
				    },
				    page:{
				    	customPages:[5,10,15,20,30,50],
				        perPage:5,    
				        align:'right',
				        total:true
				    },
				    data:{
				        url:'/ngwf_he/front/sh/nodeMessage!execute?uid=nodeMessage'
				    }
				}
			nodeList = new List(config);
			nodeList.search({'templateId':templateId});
			//行单击事件.修改TODO
			nodeList.on('rowDoubleClick',function(e,item){
			});
			nodeList.on('success', function(result) {
				//解决条数选择框下面数字重复的问题
				var index =$.inArray(($("#nodeContainer .selectPerPage").val()-0),nodePageArr);
				$("#nodeContainer .selectPerPage option").eq(index+1).remove();
				console.log(index,$("#nodeContainer .selectPerPage option"));
				//解决切换条数和点击上下页 已选择条数不置0,复选框不清除已选择的问题;
				$(".checkAllWraper>input").prop("checked",false);
				// 下面这个有些页面不需要 
				$(".allChecked").prop("checked",false);
				num = 0;
				//下面使用html  因为使用text()在  ie8下会报错;
				$(".btnCustom0").val("已选择"+num+"条工单");
                $(".btnCustom0").prop("disabled",true);
			});
	
		};
		//关联模板处理,节点信息和出口配置下拉列表选项
		var selectNodeMessage=function(templateId){
//			var templateId=$('#framePageTemplateId').val();
			var url='/ngwf_he/front/sh/workflow!execute?uid=queryProcessNode';
			var data={'templateId':templateId};
			//根据模板id查询节点
			Util.ajax.postJson(url,data,function(result,isOk){
				var seleOptions="";
				var nodeidOptions="";
				if(result.returnCode=='0'){
					$.each(result.beans, function(index, bean) {
						seleOptions += "<option  value='" + bean.nodeId
						+ "'>" + bean.nodeName + "</option>"
					});
					$.each(result.beans, function(index, bean) {
						nodeidOptions += "<option  value='" + bean.nodeId
						+ "'>" + bean.nodeId + "</option>";
					});
					$("#selectNode").empty();
					$('#nodetype').append(seleOptions);
					$('#nodeMessage').append(nodeidOptions);
					$('#selectNode').append("<option value=''>请选择</option>"+seleOptions);
					$('#updateSelectNode').append(seleOptions);
//					$('#updateNodetype').append(seleOptions);
					$('#updateNodeMessage').append(nodeidOptions);
					$('#exitNextNodeId').append(nodeidOptions);
					$('#exitNodeId').append(nodeidOptions);
				}
			}
			);	
		}

		//保存节点出口
		$('#saveNodeExitMessage').click(function(){
			var templateId=$('#framePageTemplateId').val()
			$('#saveNode_templateid').val(templateId);
			var form=$('#saveNodeMessage');
			var data=Util.form.serialize(form);
			var url='/ngwf_he/front/sh/nodeMessage!execute?uid=saveNodeMessage'
			Util.ajax.postJson(url,data,function(result,isOk){
				if(result.returnCode=='0'){
					commonTip.text({text:"添加成功!"});
					$('#saveNodeMessage')[0].reset();
					nodeList.search({'templateId':templateId});
				}else{
					commonTip.text({text:"添加不成功!"});
				}
			});
		});
		
		//修改节点信息
		$('#update_NodeMessage').click(function(){
			var templateId=$('#framePageTemplateId').val();
			var form=$('#updateNodeExitForm');
			$('#updateNodeMessage').removeAttr("disabled");
			var data=Util.form.serialize(form);
			console.log(data)
			var url='/ngwf_he/front/sh/nodeMessage!execute?uid=updateNodeMessage';
			Util.ajax.postJson(url,data,function(result,isOk){
				if(result.returnCode=='0'){
					commonTip.text({text:"更新节点信息成功!"});
					nodeList.search({'templateId':templateId});
					form[0].reset();
				}else{
					commonTip.text({text:"更新节点信息失败!"});
				}
			})
		});
		//删除节点信息
		$('#deleteNodeExit').click(function(){
			var rows=nodeList.getCheckedRows();
			if(rows.length=='0'){
				commonTip.text({text:"请选择数据!"});
				return;
			}
			var ids="";
			$.each(rows, function(index, obj) {
				ids+=obj.id+",";
			});
			var url='';
			var data={'ids':ids}
			Util.ajax.postJson(url,data,function(result,isOk){
				
			});
		});
		//保存节点出口详情配置
		$('#updateNodeExitDetail').click(function(){
			$('#exitNodeId').removeAttr("disabled");
			$('#exitNextNodeId').removeAttr("disabled");
			
			var $exitForm=$('#updateNodeExitDetails');
			var data = Util.form.serialize($exitForm);
			var url='/ngwf_he/front/sh/nodeMessage!execute?uid=updateNodeExitDetails';
			Util.ajax.postJson(url,data,function(result,isOk){
				if(result.returnCode=='0'){
					commonTip.text({text:"更新成功!"});
					pList.search({});
				}else{
					commonTip.text({text:"更新失败!"});
				}
			});
			
		});
		//节点更新
		$('#updateNodeExit').click(function(){
			var templateId=$('#framePageTemplateId').val();
			console.log(templateId)
			var url='/ngwf_he/front/sh/nodeMessage!execute?uid=updateNodeExit';
			Util.ajax.postJson(url,{'processDefId':templateId,'loginStaffId':staffId},function(result,isOk){
				if(result.returnCode=='0'){
					commonTip.text({text:"更新成功!"});
					nodeList.search({'templateId':templateId});
				}else{
					commonTip.text({text:"更新失败!"});
				}
			});
		});
		//加载服务请求下拉
		var srSelect=function(){
				var seleOptions='';
			Util.ajax.postJson('/ngwf_he/front/sh/nodeMessage!execute?uid=querySrTypeId','',function(result,isOk){
				$.each(result.beans,function(index,bean){
					seleOptions+="<option  value='"+bean.srTypeId+"'>"+bean.fullName+"</option>"
				});
				$('#srTypeId').append(seleOptions);
				$('#updateSrTypeId').append(seleOptions);
			})
		};

		var getFlowChart=function(templateId){
			$('#flowChartResource').attr("src","/ngwf_he/front/sh/nodeMessage!flowChart?uid=flowChart&processDefId="+templateId+"&resourceType=image&loginStaffId="+staffId);
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
		
		//节点出口详情配置
		$('#updateExitNode').click(function(){
			var rows=pList.getCheckedRows();
			if(rows.length==0){
				commonTip.text({text:"请选择一条数据!"});
				return;
			}
			if(rows.length>1){
				commonTip.text({text:"请选择一条数据!"});
				return;
			}
			$('#actionId').val(rows[0].actionId);
			$('#exitNodeDetail').val(rows[0].id);
			$('#nodeExitDetail').addClass('show').removeClass('hide');
			$('#exitTemplateId').val(rows[0].templateId);
			$('#exitTemplateId').attr('readonly','readonly');;
			$('#exitNodeId').val(rows[0].nodeId);
			$('#exitNodeId').attr("disabled","disabled");
			$('#exitNextNodeId').val(rows[0].nextNodeId);//下一节点
			$('#exitNextNodeId').attr("disabled","disabled");
			$('#exitNodeName').attr('readonly','readonly');//节点名称
			$('#operCode').val(rows[0].operCode);
			$("input[name='action']").val(rows[0].action);
			$("input[name='callJsName']").val(rows[0].callJsName);
			$("input[name='privateId']").val(rows[0].privateId);
			$("input[name='showExprs']").val(rows[0].showExprs);
			//下拉列表选中
			$('#defaultPort').val(rows[0].defaultPort);
			$('#exitHandleFlag').val(rows[0].handleFlag);
			$('#exitOwfmsFlag').val(rows[0].owfmsFlag);
		});
		
		//组装数据字典对象
        var wrapDictionray=function(dicName){
        	var params = {
        			method : "staticDictionary_get",
        			paramDatas : '{typeId:"' + dicName + '"}'
        		};
        	var obj={};
        	$.ajax({
        		url:"/ngwf_he/front/sh/common!execute?uid=callCSF",
        		dataType:"json",
        		data:params,
        		async:false,
        		success:function(result){
        			$.each(result.beans, function(index, bean) {
        				obj[bean.value]=bean.name;
        			});
        		}
        	});
        	return obj;
        } 
		
		
		
		return initialize();

});
