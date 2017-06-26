define(['Util','select','indexLoad',"detailPanel","jquery",'validator','dialog',
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/distribute.html',
        'style!css/workflow/outlayer/distributel.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Validator,Dialog,vars,commonTip,Html_dealUrge){
	var $el;
	var _index;
	var _options;
	var nodeActionInfo;
	var processinfo;
	var workItem;
	var _formValidator;
	var commonTip = new commonTip();
		var initialize = function(index, options){
			$el = $(Html_dealUrge);
			_index = index;
			_options=options;
			nodeActionInfo = options.nodeActionInfo;
			processinfo = options.processinfo;
			workItem = options.workItem;
			this.width=600;
			this.height=185;
			this.validateForm();
			this.eventInit();
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		eventInit:function(){
			$("#assignment",$el).click(function(){				
      	        require(['js/workflow/outlayer/ztree'],function(ztree){
      	           _options.sendArr = [];
       		       _options.copyArr = [];
				   var ztree = new ztree(_index,_options);
				   var config = {
         		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//         		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
         		            title:'处理人',    //对话框标题
         		            content:ztree.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
         		            ok:function(){
         		            	//初始化信息
         		            	$("#hildleManId",$el).val("");
         		            	$("#hildleGroupId",$el).val("");
         		            	$("#rpc_dealpeople",$el).val("");
         		            	var handleGroup = ""; //选择处理工作组
         		            	var handleStaff = ""; //选择处理人
         		            	var handlePer = "";   //显示的处理工作组以及人
         		            	$("#orderDealPer dd.distribute.group").each(function(){  //遍历列表中的处理工作组
         		            		if(handleGroup == ""){
         		            			handleGroup += $(this).find("input[type=checkbox]").val();
         		            		}else{
         		            			handleGroup += ","+$(this).find("input[type=checkbox]").val();
         		            		}
         		            		if(handlePer == ""){
         		            			handlePer +=$(this).find("span.workgroup").text();
         		            		}else{
         		            			handlePer +=","+$(this).find("span.workgroup").text();
         		            		}
         		            		this.remove();
         		            	})
         		            	$("#orderDealPer dd.distribute.staff").each(function(){ //遍历列表中的处理人
         		            		if(handleStaff == ""){
         		            			handleStaff += $(this).find("input[type=checkbox]").val();
         		            		}else{
         		            			handleStaff += ","+$(this).find("input[type=checkbox]").val();
         		            		}
         		            		if(handlePer == ""){
         		            			handlePer +=$(this).find("span.workgroup").text()+"("+$(this).find("span.person").text()+")";
         		            		}else{
         		            			handlePer +=","+$(this).find("span.workgroup").text()+"("+$(this).find("span.person").text()+")";
         		            		}
         		            		this.remove();
         		            	})
         		            	 
         		            	var toCopyGroup=new Array();
         		            	var toCopyStaff=new Array();
         		            	//获取被抄送组 
         		            		$("#orderDealPer dd.sendCopy.group").each(function(){  //遍历列表中的处理工作组
             		            			toCopyGroup.push($(this).find("input[name=sendCopyGroup]").val());
             		            	});
         		            	//获取被抄送人
         		            	$("#orderDealPer dd.sendCopy.staff").each(function(){  //遍历列表中的处理工作组
         		            		toCopyStaff.push($(this).find("input[name=sendCopyStaff]").val());
             		            });
         		            	 
         		            	$("#toCopyGroupStr",$el).val(toCopyGroup.join(","));//被抄送组 转化成 字符串
         		            	$("#toCopyStaffStr",$el).val(toCopyStaff.join(","));//被抄送人员 转化成 字符串
         		            	$("#hildleManId",$el).val(handleStaff);
         		            	$("#hildleGroupId",$el).val(handleGroup);
         		            	$("#rpc_dealpeople",$el).val(handlePer);
         		            	console.log(ztree.sendArr);
         		            	}, //确定按钮的回调函数 
         		            okValue: '确定',  //确定按钮的文本
         		            cancel: function(){
         		            	//$("#operTree").remove();
         		            	$("#orderDealPer .distribute").remove();
         		            	$("#orderDealPer .sendCopy").remove();
         		            	dialog.remove();
         		            },  //取消按钮的回调函数
         		            cancelValue: '取消',  //取消按钮的文本
         		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
         		            width:1000,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
         		            height:400, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
         		            skin:'dialogSkin',  //设置对话框额外的className参数
         		            fixed:false, //是否开启固定定位 默认false不开启|true开启
         		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
         		            modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
         		        }
         		        var dialog = new Dialog(config)
		});
     })
		},
		// 校验form表单数据有效性
		validateForm : function() {
			 var config = {
		            el: $el,
		            rules: {
		            	handleMan: "required"
		            }
			 };
			 _formValidator = new Validator(config);
		},
		//派发(处理节点自循环)
		but_commit:function(){
			if(_formValidator.form()){
				hildleManId = $("#hildleManId",$el).val();
	            hildleGroupId = $("#hildleGroupId",$el).val();
	             //抄送
	            var sendccgroupdatas =$("#toCopyGroupStr",$el).val();//被抄送组 
	    		var sendccstaffdatas=$("#toCopyStaffStr",$el).val();//被抄送人员 
	            var distributeData = {
	            		"workItemId":workItem.workItemId,
	            		"wrkfmShowSwftno":processinfo.wrkfmShowSwftno,
	            		"handlingRole":hildleGroupId,
	            		"handlingStaff":hildleManId,
	            		"loginStaffId":_options.loginStaffId,
						"loginStaffName":_options.loginStaffName,
	            		"operationDescribe":$("#handingComment").val(),
	            		//添加操作日志
	            		"processDefId":processinfo.seqprcTmpltId,
		 				"nodeId":nodeActionInfo.nodeId,
		 				"operateType":"0003",//转派工单
		 				"causeType":"",
		 				"description":_options.loginStaffName+"【"+_options.loginStaffId+"】对工单进行转派",
		 				"processType":processinfo.wrkfmTypeCd,
		 				"sendccstaffdatas":'['+sendccstaffdatas+']',//被抄送人为list

	            }
	            Util.ajax.postJson(
				          '/ngwf_he/front/sh/workflow!execute?uid=handleDistributeData',
				          distributeData, function(json, status) {
				          //initialize.prototype.sendCC();
					      alert("操作成功！",3000);
				})
			}else{
				 return false;
			}  
		},
		form_commit : function(){
			 if (_formValidator.form()) {
				 $('#bizTypeId').val(_options.srTypeId);
                 $('#reqstUrlAddr').val(_options.pageUrl);
                 $('#processId').val('');
                 $('#processDefId').val(_options.templateId);
                 var hildleManId = $("#hildleManId",$el).val();
                 var hildleGroupId = $("#hildleGroupId",$el).val();
                 var dspsOpinDesc = $("#handingComment",$el).val();
                 var autoRecheck = "0";
                 var sendccstaffdatas = '[' + $("#toCopyStaffStr",$el).val() + ']'; // 被抄送组
                 var sendccgroupdatas = '[' + $("#toCopyGroupStr",$el).val() + ']'; // 被抄送人员
                 var varMap = vars.varsOfWorkflow(nodeActionInfo, hildleGroupId, hildleManId);
                 // $("#vars").val(varMap);
                 var formJson = $("#aor_form").serializeObject();
                 //服务请求id
                 formJson.srvReqstId = _options.serviceId;
                 //投诉类型
                 formJson.bizTypeId = $('#bizTypeId').val();
                 // 请求后台员工信息.按权限加载按钮
                 formJson.loginStaffId = _options.userInfo.staffId;
                 formJson.loginStaffName = _options.userInfo.staffName;
                 formJson.vars = varMap;
                 formJson.nodeId = nodeActionInfo.nodeId; // 或者是
                 // activityParentId
                 formJson.nodeType = nodeActionInfo.nodeType;
                 formJson.nextNodeId = nodeActionInfo.activityId;
                 formJson.handlingRole = hildleGroupId;
                 formJson.handlingStaff = hildleManId;
                 formJson.dspsOpinDesc = dspsOpinDesc;
                 formJson.nodeNm = nodeActionInfo.nodeName;
                 formJson.nextNodeNm = nodeActionInfo.activityName;
                 formJson.autoRecheck = autoRecheck;
                 formJson.nextHandlingStaff = hildleManId;
                 formJson.nextHandlingRole = hildleGroupId;
                 formJson.operateType = "0045";
                 formJson.causeType = "";
                 formJson.description = _options.userInfo.staffName+"【"+_options.userInfo.staffId+"】创建并启动工单";
                 if($("#wrkfmTypeCd").val()=="" || $("#wrkfmTypeCd").val()==null){
                 	formJson.processType = $("#wrkfmTypeCd").val();
                 }else{
                 	formJson.processType = _options.srTypeId.substring(0,3);
                 }
                 
                 // 抄送
                 formJson.sendccstaffdatas = sendccstaffdatas;
                 formJson.sendccgroupdatas = sendccgroupdatas;
                 console.log(formJson);
                 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=acceptOrder001', formJson, function(result) {
                     if (result.returnCode == "0") {
                    	 commonTip.text({text:"操作成功！"},function(){
				        		crossAPI.destroyTab('建单');
				        	});
                     } else {
                         commonTip.text({text:"添加工单失败，请联系系统管理员。"});
                     }
                 },
                 true);
             } else { // 校验不通过
                 return false;
             }
		},
		sendCC:function(){
 		//抄送提交
		var sendccgroupdatas =$("#toCopyGroupStr",$el).val();//被抄送组 
		var sendccstaffdatas=$("#toCopyStaffStr",$el).val();//被抄送人员 
		var params={		//"sendccid":sendccid,  //抄送日志编号
								"loginStaffId":_options.loginStaffId,
								"loginStaffName":_options.loginStaffName,
								"wrkfmShowSwftno":processinfo.wrkfmShowSwftno,
				 				"workItemId":workItem.workItemId,
				 				"sendccstaffdatas":'['+sendccstaffdatas+']',//被抄送人为list
				 				"sendccgroupdatas":'['+sendccgroupdatas+']'//被抄组为list
				 				
					};
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=sendCC001',params,function(result){
				},true);
		}
		});
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
    }; // 序列化 输入框的值;
	return initialize;
});