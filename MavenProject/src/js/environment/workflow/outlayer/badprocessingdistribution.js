define(['Util','select','indexLoad',"detailPanel","jquery",'validator','dialog',
        'js/workflow/processinfoDetail/varsOfWorkflow',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/outlayer/badprocessingdistribution.html',
        'style!css/workflow/outlayer/repeatcheck.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Validator,Dialog,vars,commonTip,Html_basicMessage){
	var $el;
	var _index;
	var _options;
	var content;
	var nodeActionInfo;
	var processinfo;
	var workItem;
	var _formValidator;
	var commonTip = new commonTip();
		var initialize = function(index, options){
			$el = $(Html_basicMessage);
			_index = index;
			_options=options;
			nodeActionInfo = options.nodeActionInfo;
			processinfo = options.processinfo;
			workItem = options.workItem;
			this.dateInit();
			this.validateForm();
			this.eventInit();
			this.height=230;
			this.width=600;
			this.content = $el;
			
		};	
		$.extend(initialize.prototype, {
            //动态获取下拉框
	        loadDictionary: function(mothedName, dicName, seleId) {
	            var params = {
	                method: mothedName,
	                paramDatas: '{typeId:"' + dicName + '"}'
	            };
	            var seleOptions = "<option value=''>请选择</option>";
	            // 
	            Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF', params, function(result) {
	                $.each(result.beans, function(index, bean) {
	                    seleOptions += "<option value='" + bean.value + "'>" + bean.name + "</option>"
	                });
	                $('#' + seleId, $el).append(seleOptions);
	            },
	            true);
	        },
	        dateInit: function() {
	            this.loadDictionary('staticDictionary_get', 'WFHEBEI.BADORDER.UNSATISFY', 'rec_satisreason'); //不满意原因
	        },
			eventInit:function(){
				$("#rpc_Combuildgrade",$el).change(function () {
					if($("#rpc_Combuildgrade",$el).val()=='0'){
						$("#dissatisfied",$el).addClass('show').removeClass('hide')
					}else{
						$("#dissatisfied",$el).addClass('hide').removeClass('show')
					}
				});
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
         		            	//console.log($("#sddasdasd").serializeObject());
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
         		            	$("#orderDealPer .distribute").remove();
         		            	$("#orderDealPer .sendCopy").remove();
         		            	dialog.remove();
         		            },  //取消按钮的回调函数
         		            cancelValue: '取消',  //取消按钮的文本
         		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
         		            width:1000,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
         		            height:436, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
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
		            	appraise:"required",
		            	handleMan: "required",
		            	handingComment:"required"
		            }
			 };
			 _formValidator = new Validator(config);
		},
	    //提交复核处理
		but_commit:function(){
			if(_formValidator.form()){
				 hildleManId = $("#hildleManId",$el).val();
		            hildleGroupId = $("#hildleGroupId",$el).val();
		            dspsOpinDesc = $("#handingComment",$el).val();
		            //抄送
		            var sendccgroupdatas =$("#toCopyGroupStr",$el).val();//被抄送组 
		    		var sendccstaffdatas=$("#toCopyStaffStr",$el).val();//被抄送人员 
					var varMap = vars.varsOfWorkflow(nodeActionInfo,hildleGroupId,hildleManId);
					var nodeData = {
							        "wrkfmId":processinfo.wrkfmId,
							        "workItemId":workItem.workItemId,
							        "wrkfmShowSwftno":processinfo.wrkfmShowSwftno,
							        "processDefId":processinfo.seqprcTmpltId,
							        "nodeId":nodeActionInfo.nodeId, //或者是 activityParentId
							        "nodeType":nodeActionInfo.nodeType,
							        "nextNodeId":nodeActionInfo.activityId, 
							        "nodeNm":nodeActionInfo.nodeName,
							        "nextNodeNm":nodeActionInfo.activityName,
							        "taskId":workItem.workItemIstncId,
							        "loginStaffId":_options.loginStaffId,
							        "loginStaffName":_options.loginStaffName,
							        "handlingRole":hildleGroupId,
							        "dspsOpinDesc":dspsOpinDesc,
							        "handlingStaff":hildleManId,
							        "operateType":"0052",//处理工单
							        "causeType":"",
							        "description":_options.loginStaffName+"【"+_options.loginStaffId+"】对工单进行"+nodeActionInfo.lineName,
							        "processType":processinfo.wrkfmTypeCd,
							        "vars":varMap,
							        //环节评价
							        "apprasTypeCd":$('#res_checksatisfy',$el).val(),//评价满意度
									"fstNSatisRsnDesc":$('#rpc_Combuildgrade',$el).val(),//不满意原因
									"rmk":$('#rec_satisreasondetail',$el).val(),//不满意原因备注
									"content":$('#rpc_checkintroduce',$el).val(),//处理说明
		                            //抄送
									"sendccstaffdatas":'['+sendccstaffdatas+']',//被抄送人为list
					 				"sendccgroupdatas":'['+sendccgroupdatas+']'//被抄组为list
							        }
					Util.ajax.postJson(
							          '/ngwf_he/front/sh/workflow!execute?uid=operateData',
							           nodeData, function(json, status) {
							        console.log(json);
							        if(json.returnCode=="0"){
							        	commonTip.text({text:"操作成功！"},function(){
							        		crossAPI.destroyTab('工单详情');
							        	})
							        }else{
							        	commonTip.text({text:"操作失败，请联系管理员！"});
							        }					
		 		})
			}else{
				return false;
			}
           
		}
		});
		 
	return initialize;
});