define(['Util', 'indexLoad', 'tab', 'validator', 'dialog', 'crossAPI', 'simpleTree', 'js/workflow/processinfoDetail/varsOfWorkflow'],
function(Util, IndexLoad, Tab, Validator, Dialog, CrossAPI, SimpleTree, vars) {
    // 对于全局参数，命名请带下划线
    var _index, _options, _pageUrl, // 投诉类型对应page
    _flowId, // 对应的templateId
    _serviceId, // 对应服务器请求Id
    _srTypeId, _formValidator, // 全局验证对象
    _tab,
    _orderInfo;//工单信息
    var _tabTitle = ["投诉基本信息", "流程记录", "操作信息", "附件(0)", "历史工单查询"];
    // pageInit获取url并刷新页面中的功能页签与按钮
    var pageInit = function() {
    	getAcceptAddressInfo();
        // 获取登录人信息 放到_options.userInfo里边
        crossAPI.getIndexInfo(function(info) {
            _options.userInfo = info.userInfo;
            //判断角色 并将流程模板id  processDefId放入_option.processDefId中
            currentRole();
            // 根据所选投诉类型 查询所映射的基本信息页面
            var routedata = {
                "routeKey": _srTypeId,
                "staffId": _options.userInfo.staffId
            };
            Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=routeTarget', routedata, function(json2, status) {
                console.log(json2.bean);
                _pageUrl = json2.bean.pageUrl;
                _flowId = json2.bean.flowId;
                _serviceId = json2.bean.serviceId;
                _options.pageUrl = json2.bean.pageUrl;
                _options.serviceId = json2.bean.serviceId;
                _options.templateId = json2.bean.flowId;
                _options.srTypeId = _srTypeId;
                // js动态生成选项卡
                tabContainerInit(_options);
                buttonInit();
                
            });
        });
    };//queryAcceptAddressInfo
    var getAcceptAddressInfo = function() {
    	var srTypeId='0004014';
    	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryAcceptAddressInfo', {'srTypeId':srTypeId}, function(json2, status) {
    		 
    		
        });
    };
    var eventInit = function() {
    	$('#aor_Bastellocal').click(numBelgCity);
    	$('#aor_Basqueshappend').click(happenPlaceCity);
//    	$('#selectedNodes').click(getSelectedValue);
//    	$("#aor_Basacccity").change(function(){
//    		var url='/ngwf_he/front/sh/workflow!execute?uid=queryNumBelgCity&id='+$("#aor_Basacccity").val();
//    		numBelgCity(url);
//    	});
    };
    var getSelectedValue=function(){
    	var a=_simpleTree.getSelectedNodes();
    }
    var _simpleTree1,_simpleTree2;
    var happenPlaceCity=function(){
    	 
    	var settings = {
	            treeId: "happenPlaceTree",      //zTree 的唯一标识，初始化后，等于 用户定义的容器的 id 属性值
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
	                onClick:ztreeClick2
	            },
	            check:{
	                enable:false,        //设置节点上是否显示 checkbox / radio
	                chkboxType : {"Y": "", "N": "ps"},        //勾选 checkbox 对于父子节点的关联关系。
                 //[setting.check.enable = true 且 setting.check.chkStyle = "checkbox" 时生效]
                 //							Y 属性定义 checkbox 被勾选后的情况； 
	                //                          N 属性定义 checkbox 取消勾选后的情况； 
	                //                          "p" 表示操作会影响父级节点； 
	                //                          "s" 表示操作会影响子级节点。
	                //                          请注意大小写，不要改变
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
//	                    title: "",
	                    url: "url"
	                },
	                simpleData:{
	                    enable: true,
	                    idKey: "id",
	                    pIdKey: "parentId",
	                    rootPId: null
	                }
	            }
	        };
    	_simpleTree2 = new SimpleTree.tierTree($('#happenPlaceTreeContainer'),'/ngwf_he/front/sh/workflow!execute?uid=queryHappenPlace',settings);
    	$('#selectHappenPlace').removeClass('hide').addClass('show');
    };
    
    var numBelgCity=function(){
    	var settings = {
	            treeId: "numBelgTree",      //zTree 的唯一标识，初始化后，等于 用户定义的容器的 id 属性值
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
	                onClick:ztreeClick1
	            },
	            check:{
	                enable:false,        //设置节点上是否显示 checkbox / radio
	                chkboxType : {"Y": "", "N": "ps"},        //勾选 checkbox 对于父子节点的关联关系。
                 //[setting.check.enable = true 且 setting.check.chkStyle = "checkbox" 时生效]
                 //							Y 属性定义 checkbox 被勾选后的情况； 
	                //                          N 属性定义 checkbox 取消勾选后的情况； 
	                //                          "p" 表示操作会影响父级节点； 
	                //                          "s" 表示操作会影响子级节点。
	                //                          请注意大小写，不要改变
	                chkStyle : "checkbox"     //勾选框类型(checkbox 或 radio）[setting.check.enable = true 时生效],默认值："checkbox"
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
//	                    title: "",
	                    url: "url"
	                },
	                simpleData:{
	                    enable: true,
	                    idKey: "sId",
	                    pIdKey: "suprNodeId",
	                    rootPId: null
	                }
	            }
	        };
    	_simpleTree1 = new SimpleTree.tierTree($('#numBelgCityTreeContainer'),"/ngwf_he/front/sh/workflow!execute?uid=queryNumBelgCity",settings);
    	$('#selectNumBelgCity').removeClass('hide').addClass('show');
    };
    
    var ztreeClick1= function(event,treeId,treeNode){
    	if(!treeNode.isParent){
    		 
    		$("input[name='numBelgCityCode']").val(treeNode.sId);
    		$("input[name='numBelgCityName']").val(treeNode.fullName);
    	}else{
    		$("input[name='numBelgCityCode']").val('');
    		$("input[name='numBelgCityName']").val('');
    	}
    };
    
    var ztreeClick2= function(event,treeId,treeNode){
    	 
    	if(!treeNode.isParent){
    		$("input[name='quHapnAddrName']").val(treeNode.fullname);
    		$("input[name='quHapnAddr']").val(treeNode.id);
    	}else{
    		$("input[name='quHapnAddrName']").val('');
    		$("input[name='quHapnAddr']").val('');
    	}
    };
    
    //判断当前登录人员是什么角色（话务员、复核人员）
    var currentRole = function() {
    	var params = {
    		staffId: _options.userInfo.staffId
        };
    	var roleId='';
    	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryRoleIdByStaffId', params, function(json2, status) {
    		$(json2.beans).each(function(index,element){
    			if(index==0){
    				roleId=element.roleId;
    			}else{
    				roleId+=(','+element.roleId);
    			}
    		});
    	});
    	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=getProcessDefId', {'itemId':'221001007'}, function(json2, status) {
    		 
    		//zztest_kf:1:0819394793920784D18TH:101;zztest_td:1:0819395427237874D18TH:01
    		var processDefIdString = json2.beans[0].value;
    		var strs=processDefIdString.split(";");
    		var roleIds1=strs[0].split(":")[3];
    		var processDefId1=strs[0].split(":"+roleIds1)[0];
    		var roleIds2=strs[1].split(":")[3];
    		var processDefId2=strs[1].split(":"+roleIds2)[0];
    		if(roleId==''){
    			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryRoleIdByStaffId', params, function(json2, status) {
    	    		$(json2.beans).each(function(index,element){
    	    			if(index==0){
    	    				roleId=element.roleId;
    	    			}else{
    	    				roleId+=(','+element.roleId);
    	    			}
    	    		});
    	    	});
    		}
    		 
    		var roleIds=roleId.split(",");
    		if(roleIds.length==1){
    			if(roleIds1.indexOf(roleIds)!=-1){
    				_options.processDefId=processDefId1;
    			}else if(roleIds2.indexOf(roleIds)!=-1){
    				_options.processDefId=processDefId2;
    			}
    		}else{
    			$(roleIds).each(function(index,element){
    				if(roleIds1.indexOf(element)!=-1){
        				_options.processDefId=processDefId1;
        				return false;
        			}else if(roleIds2.indexOf(element)!=-1){
        				_options.processDefId=processDefId2;
        				return false;
        			}
        		});
    		}
    	});
    };
    
    // js动态生成选项卡
    var tabContainerInit = function(target) {
        var config = {
            el: $('#aor_tabContainer'),
            direction: 'horizontal',
            tabs: [{
                title: _tabTitle[0],
                // 图标的class，用户配置该项时，在tab标题文字的前端生成一个span标签
                className: 'complainInfo',
                click: function(e, tabData) {
                    require([target.pageUrl], function(BasicMessage) {
                    	_formValidator=null;
                        var basicMessage = new BasicMessage(_index, _options);
                        _tab.content('');
                        $('#aor_tabWrap2').empty(); // 通过删除元素删除过去添加的点击事件
                        $("#aor_tabWrap2").append('<div id="aor_complainInfo"></div>');
                        $('#aor_complainInfo').html(basicMessage.content);
                        eventInit();
                        $('#aor_complainInfo').removeClass('hide').addClass('show');
                        // 建单人基本信息列表
                        require(['js/workflow/outlayer/staffBasicInfo'], function(StaffBasicInfo) {
                        	new StaffBasicInfo(_index, _options);
                        });
                        _formValidator = null;
                        _formValidator = basicMessage.validateForm();
                        //输入框回填
                        setInputsVal();
                    });
                    $("div.startOperation").removeClass('hide').addClass('show');
                }
            },
            {
                title: _tabTitle[1],
                className: 'flowRecord',
                click: function(e, tabData) {
                	$('#aor_complainInfo').removeClass('show').addClass('hide');
                    require(['js/workflow/oneservicecompain/flowRecord'], function(FlowRecord) {
                    	getInputsVal();
                        var flowRecord = new FlowRecord(_index, _options);
                        _tab.content(flowRecord.content);
                        // 设置流程记录左边的竖线条长度和右边的table一样高
                        $(".t-table").each(function(index,element){
		    				  var _height = $(this).height();	  
		    				  $(".flowRecord_bar li").eq(index).css("height",_height+10+"px");
		    				  $(".flowRecord_bar li").eq(index).find(".flowRline").css("height",_height+"px");
		    				  $(".flowRecord_bar li").eq(index).find("span").css("height",_height+10+"px");
		    				  $(".flowRecord_bar").css("visibility","visible");
		    				  $("#detailPaneSecond").css("visibility","visible");
		    			  })
                    });
                    $("div.startOperation").removeClass('show').addClass('hide');
                }
            },
            {
                title: _tabTitle[2],
                className: 'operationRecord',
                click: function(e, tabData) {
                	$('#aor_complainInfo').removeClass('show').addClass('hide');
                    require(['js/workflow/oneservicecompain/operateInfo'], function(operateInfo) {
                    	getInputsVal();
                        var operateInfo = new operateInfo(_index, _options);
                        _tab.content(operateInfo.content);
                    });
                    $("div.startOperation").removeClass('show').addClass('hide');
                }
            },
            {
                title: _tabTitle[3],
                className: "attachmentFile",
                click: function(e, tabData) {
                	$('#aor_complainInfo').removeClass('show').addClass('hide');
                    require(['js/workflow/oneservicecompain/attachUpdate'], function(firserBag) {
                        getInputsVal();
                        var firserBag = new firserBag(_index, _options);
                        _tab.content(firserBag.content);
                    });
                    $("div.startOperation").removeClass('show').addClass('hide');
                }
            },
            {
                title: _tabTitle[4],
                className: "historyWorkInfo",
                click: function(e, tabData) {
                	$('#aor_complainInfo').removeClass('show').addClass('hide');
                    require(['js/workflow/oneservicecompain/historyWorkInfo'], function(historyWorkInfo) {
                        getInputsVal();
                        var historyWorkInfo = new historyWorkInfo(_index, _options);
                        _tab.content(historyWorkInfo.content);
                    });
                    $("div.startOperation").removeClass('show').addClass('hide');
                }
            }]
        };
        _tab = new Tab(config);
    };
    // 点击投诉基本类型的时候.要进行数据回填;
    var setInputsVal = function() {
        // 因为时间框是动态创建的.设置id,作为对象的键
        $("input[name='joinNetTime']").attr("id", "nettime");
        $("input[name='expctFdbkTime']").attr("id", "backtime");
        $("input[name='acptTime']").attr("id", "acptTime");
        $("input[name='datetime']").attr("id", "datetime");
        var mark;
        $("input").each(function() {
        	mark = $(this).attr("id");
        	if(_options[mark]){
              $(this).val(_options[mark]);
        	}
        });
        $("select").each(function() {
            mark = $(this).attr("id");
            if(_options[mark]){
                $(this).val(_options[mark]);
                console.log(_options[mark])
          	}
        });
        $("textarea").each(function() {	
            mark = $(this).attr("id");
            if(_options[mark]){
            	$(this).val(_options[mark]);
          	}
            
        });
    };
    // 点击的时候获取input框的val()并存储;
    var getInputsVal = function() {
        var mark;
        $("input[name='joinNetTime']").attr("id", "nettime");
        $("input[name='expctFdbkTime']").attr("id", "backtime");
        $("input[name='acptTime']").attr("id", "acptTime");
        $("input[name='datetime']").attr("id", "datetime");
        $("input").each(function() {
            mark = $(this).attr("id");
            if($(this).val() !=""){
            	 _options[mark] = $(this).val();
            }
        });
        $("select").each(function() {
            mark = $(this).attr("id");
            if($(this).val() !=""){
            	_options[mark] = $(this).val();
           }    
        });
        $("textarea").each(function() {
            mark = $(this).attr("id");
            if($(this).val() !=""){
            	_options[mark] = $(this).val();
           } 
        })
        console.log(_options);
    };

    // 按钮初始化（不用的页面按钮个数、功能不同）
    var buttonInit = function() {
        var nodeData = {
            "templateId": _flowId,
            // 获取路由目标中的模板
            "activityType": "startEvent"
        };
        // 请求后台添加操作按钮
        Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=nodeData005', nodeData, function(json2, status) {
            var beans = json2.beans;
            $("div.startOperation").empty(); // 重新切换页面的时候先清空之前的按钮
            // 先暂时这样添加 直接答复按钮,后期要按权限进行加载;
            var Btn = '<a class="btn btn-blue" id="aor_Save">保存</a><a class="btn btn-blue" id="aor_directReply">直接答复</a>';
            $("div.startOperation").append($(Btn));
            for (var item in beans) {
                // 解析 为工单添加按钮
                $("div.startOperation").append("<a class='btn btn-blue fl' id='" + beans[item].lineid + "' actionId='" + beans[item].actionId + "'>" + beans[item].linename + "</a>"); // 添加节点按钮
                // 为工单添加操作按钮事件
                buttonBind("#" + beans[item].lineid, beans, item);
            }
            // 保存按钮事件
            $('#aor_Save').on('click', saveForm);
            // 点击直接答复时弹框事件
            directReplyfn();
        })
    };

    var buttonBind = function(targetId, beans, item) {
        $(targetId).bind('click', function() {
            if (_formValidator.form()) {
                nodeActionId = $(this).attr("actionId"); // 点击设置当前操作节点
                // 根据节点显示不同的操作页面 start
                var nodeData = {
                    "id": nodeActionId
                };
                // 请求后台获取id对应的nodeAction工单出口配置
                Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=nodeData006', nodeData, function(json, status) {
                    var nodeActionInfo = json.bean;
                    _options.nodeActionInfo = nodeActionInfo;
                    console.log(nodeActionInfo);
                    require(['' + nodeActionInfo.action], function(operateInfo) {
                        var operateInfo = new operateInfo(_index, _options);
                        var config = {
                            mode: 'normal',
                            // 对话框模式，默认normal标准|tips浮动层|confirm确认对话框
                            // delayRmove:3,
                            // //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
                            title: nodeActionInfo.lineName,
                            // 对话框标题
                            content: operateInfo.content,
                            // 对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
                            ok: function() {
                            	
                            	return operateInfo.form_commit();

                            },
                            // 确定按钮的回调函数
                            okValue: nodeActionInfo.lineName,
                            // 确定按钮的文本
                            cancel: function() {
                                console.log('点击了取消按钮')
                            },
                            // 取消按钮的回调函数
                            cancelValue: '取消',
                            // 取消按钮的文本
                            cancelDisplay: true,
                            // 是否显示取消按钮
                            // 默认true显示|false不显示
                            button: [],
                            width: operateInfo.width,
                            // 对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
                            height: operateInfo.height,
                            // 对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
                            skin: 'dialogSkin',
                            // 设置对话框额外的className参数
                            fixed: false,
                            // 是否开启固定定位
                            // 默认false不开启|true开启
                            quickClose: false,
                            // 点击空白处快速关闭//
                            // 默认false不关闭|true关闭
                            modal: true
                            // 是否开启模态框状态
                            // 默认false不开启|true开启,confirm默认状态为true
                        }
                        var dialog = new Dialog(config)
                    });
                })
            } else {
                return;
            }
        });
    };

    var submitForm = function(nodeActionInfo, params) {
        // 初始化信息
        $('#bizTypeId').val(_srTypeId);
        $('#reqstUrlAddr').val(_options.pageUrl);
        $('#processId').val('');
        $('#processDefId').val(_flowId);
        var nodeData = {
            "id": nodeActionId
        };
        // 请求后台获取id对应的nodeAction工单出口配置
        Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=nodeData006', nodeData, function(json, status) {
            var nodeAction = json.bean;
            console.log(json.bean);
            // 获取varMap json字符串
             
            var varMap = vars.varsOfWorkflow(nodeActionInfo, params.hildleGroupId, params.hildleManId);
            // $("#vars").val(varMap);
            var formJson = $("#aor_form").serializeObject();
            //服务请求id
            formJson.srvReqstId = _options.serviceId;
            //投诉类型
            formJson.bizTypeId = $('#bizTypeId').val();
            // 请求后台员工信息.按权限加载按钮
            formJson.loginStaffId = _options.userInfo.staffId;
            formJson.loginStaffName = _options.userInfo.staffName;
             
            console.log("get staff end.");
            formJson.vars = varMap;
            formJson.nodeId = nodeActionInfo.nodeId; // 或者是
            // activityParentId
            formJson.nodeType = nodeActionInfo.nodeType;
            formJson.nextNodeId = nodeActionInfo.activityId;
            formJson.handlingRole = params.hildleGroupId;
            formJson.handlingStaff = params.hildleManId;
            formJson.dspsOpinDesc = params.dspsOpinDesc;
            formJson.nodeNm = nodeActionInfo.nodeName;
            formJson.nextNodeNm = nodeActionInfo.activityName;
            formJson.autoRecheck = params.autoRecheck;
            formJson.nextHandlingStaff = params.hildleManId;
            formJson.nextHandlingRole = params.hildleGroupId;
            formJson.operateType = "0045";
            formJson.causeType = "";
            formJson.description = _options.userInfo.staffName+"【"+_options.userInfo.staffId+"】创建并启动工单";
            if($("#wrkfmTypeCd").val()=="" || $("#wrkfmTypeCd").val()==null){
            	formJson.processType = $("#wrkfmTypeCd").val();
            }else{
            	formJson.processType = _srTypeId.substring(0,3);
            }
            
            // 抄送
            formJson.sendccstaffdatas = params.sendccstaffdatas;
            formJson.sendccgroupdatas = params.sendccgroupdatas;
            console.log(formJson);
            Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=acceptOrder001', formJson, function(result) {
                if (result.returnCode == "0") {
                    CrossAPI.tips("添加工单成功",3000);
                    CrossAPI.destroyTab('建单');
                } else {
                    CrossAPI.tips("添加工单失败，请联系系统管理员。",3000);
                }
            },
            true);
        });
    };

    var saveForm = function() {
        // 点击保存的验证对象创建 start
        var config = {
            el: $('#aor_complainInfo'),
            dialog: true,
            // 是否弹出验证结果对话框
            rules: {
                // 主叫号码必须有,并且是手机号格式
                callingNum: "required|mobile",
                // 受理工号.必须有
                acptTelnum: "required|mobile"
            },
            messages: {
            	callingNum:{
                	required:"来电号码不能为空，请填写"
                },
                acptTelnum:{
                	required:"受理号码不能为空，请填写"
                }
            }
        };
        var _saveForm = new Validator(config);
        // 点击保存的验证对象创建 end
        if (_saveForm.form()) {
            $('#bizTypeId').val(_srTypeId);
            $('#reqstUrlAddr').val(_options.pageUrl);
            var formJson = $("#aor_form").serializeObject();
            //服务请求ID
            formJson.srvReqstId = _options.serviceId;
            //投诉类型
            formJson.bizTypeId = $('#bizTypeId').val();
            Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=acceptOrder002', formJson, function(result) {
                if (result.returnCode == "0") {
                    CrossAPI.tips("保存工单成功",3000);
                } else {
                    CrossAPI.tips("保存工单失败，请联系系统管理员。",3000);
                }
            },
            true);
        } else {
            return;
        }
    };

    // 点击修改按钮 进行切换页面的函数;
    var num = 0;
    var editButtonEvent = function() {
        $("#editpage").off("click").on("click", function() {
            var arr = ['001006', '001001', '002', '001002', '001'];
            num = num + 1;;
            if (num == 5) {
                num = 0;
            }
            srTypeId = arr[num];
            $("#wrkfmTypeCd").find("option").eq(num+1).attr("selected", "selected");

            var routedata = {
                "routeKey": srTypeId
            }
            Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=routeTarget', routedata, function(json2, status) {
                if (status) {
                    getInputsVal();
                    _pageUrl = json2.bean.pageUrl;
                    _flowId = json2.bean.flowId;
                    _serviceId = json2.bean.serviceId;
                    _options.pageUrl = json2.bean.pageUrl;
                    _options.serviceId = json2.bean.serviceId;
                    _options.templateId = json2.bean.flowId;
                    _options.srTypeId = _srTypeId;
                    console.log(_options)
                    $('#aor_tabWrap1').empty(); // 通过删除元素删除过去添加的点击事件
                    $("#aor_tabWrap1").append('<div id="aor_tabContainer"></div>');
                    _tab = null;
                    _formValidator = null;
                     
                    tabContainerInit(_options);
                }
            })
        });
    };
    // 倒计时功能
    var aorTimerind = function() {
        var timer = $('#aor_timerind').html();
        var time = timer.split(":");
        var aorHour = time[0];
        var aorMinu = time[1];
        var mytimer = setInterval(function() {
            if (aorMinu == "00") {
                aorMinu = 60;
                aorHour--;
            }
            aorMinu--;
            if (aorMinu < 10) {
                var aorMinua = "0" + aorMinu;
            } else {
                var aorMinua = aorMinu;
            }
            if (aorHour < 10) {
                var aorHoura = "0" + aorHour;
            } else {
                var aorHoura = aorHour;
            }
            if (aorHoura == "00" && aorMinua == "00") {
                clearInterval(mytimer);
                CrossAPI.destroyTab('建单');
            }
            $('#aor_timerind').html(aorHoura + ":" + aorMinua);
        },
        1000)

    };

    // 点击直接回复时弹出弹框;
    var directReplyfn = function() {
        $("#aor_directReply").on("click", function() {
            if (_formValidator.form()) {
                var directDialouge; // 弹窗的内容
                require(['js/workflow/outlayer/directReply'], function(Repeatcheck) {
                    var Repeatcheck = new Repeatcheck(_index, _options);
                    directDialouge = Repeatcheck.content;
                    var config = {
                        mode: 'normal',
                        // 对话框模式，默认normal标准|tips浮动层|confirm确认对话框
                        // delayRmove:3,
                        // 延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
                        title: '直接答复',
                        // 对话框标题
                        content: directDialouge,
                        // 对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
                        ok: function() {
                            directReplyForm();
                        },
                        // 确定按钮的回调函数
                        okValue: '确定',
                        // 确定按钮的文本
                        cancel: function() {
                            console.log('点击了取消按钮')
                        },
                        // 取消按钮的回调函数
                        cancelValue: '取消',
                        // 取消按钮的文本
                        cancelDisplay: true,
                        // 是否显示取消按钮
                        // 默认true显示|false不显示
                        // button: [ // 自定义按钮组
                        // {
                        // value: '同意',
                        // // 按钮显示文本
                        // callback: function()
                        // { // 自定义按钮回调函数
                        // return false; //
                        // 阻止窗口关闭
                        // }
                        // } ],
                        width: 600,
                        // 对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
                        height: 234,
                        // 对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
                        skin: 'dialogSkin',
                        // 设置对话框额外的className参数
                        fixed: false,
                        // 是否开启固定定位
                        // 默认false不开启|true开启
                        quickClose: false,
                        // 点击空白处快速关闭
                        // 默认false不关闭|true关闭
                        modal: true
                        // 是否开启模态框状态
                        // 默认false不开启|true开启,confirm默认状态为true
                    }
                    var dialog = new Dialog(config)
                });
            }
        })
    };
    // 直接答复，将表单提交
    var directReplyForm = function() {
        $('#bizTypeId').val(_srTypeId);
        $('#reqstUrlAddr').val(_options.pageUrl);
        // 先暂时这样 后期如果没有影响的话再删
        var dr_formjson = $("#dr_form").serializeArray(); // 获取弹窗内的所有元素并对象化;
        var formJson = $("#aor_form").serializeArray();
        //服务请求ID
        formJson.push({name: "srvReqstId", value: _options.serviceId});
        //投诉类型
        formJson.push({name: "bizTypeId", value: $('#bizTypeId').val()});
        $.each(dr_formjson, function(index, item) {
            formJson.push(item);
        });
        
        Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=acceptOrder003', formJson, function(result) {
            if (result.returnCode == "0") {
                CrossAPI.tips("直接答复工单成功",3000);
                CrossAPI.destroyTab('建单');
            } else {
                CrossAPI.tips("直接答复工单失败，请联系系统管理员。",3000);
            }
        },
        true);
    }

    // 序列化 输入框的值;
    $.fn.serializeObject = function() {
        var json = {};
        var arrObj = this.serializeArray();
        $.each(arrObj, function() {
            if (json[this.name]) {
                if (!json[this.name].push) {
                    json[this.name] = [json[this.name]];
                }
                json[this.name].push(this.value || '');
            } else {
                json[this.name] = this.value || '';
            }
        });
        return json;
    };

    // 页面初始化方法，（如初始化参数，复杂的逻辑，请另开方法，并在里面执行）
    IndexLoad(function(indexModule, options) {
        _index = indexModule;
        // _options = options;
        _options = {};
        _srTypeId = "001006"; // 对应选择的投诉类型Id
        // 页面初始化，页签 按钮 初始化
        pageInit();
        // 点击修改事件 后期需要删除
        editButtonEvent();
        // 倒计时
        aorTimerind();
    });
});