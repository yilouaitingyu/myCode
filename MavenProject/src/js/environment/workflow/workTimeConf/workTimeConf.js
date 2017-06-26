define(["Util","validator","indexLoad"], function(Util, Validator,IndexLoad){
	var initialize = function(){
		pageInit();
		eventInit();
	};		
	
	//页面显示初始化
	var pageInit = function(){
		Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=workTimeConf001',{},function(result){
			if(result.returnCode=="0")
			{
				var beans = result.beans;
				if(beans != "" && beans != null)
				{
					var params = beans[0];
					$("#bl_tms_allct_shet_cnt").val(params.BL_TMS_ALLCT_SHET_CNT);
					$("#allct_shet_max_cnt").val(params.ALLCT_SHET_MAX_CNT);
					$("#allct_shet_gap_sec_cnt").val(params.ALLCT_SHET_GAP_SEC_CNT);
					$("#n_allct_shet_tms_cnt").val(params.N_ALLCT_SHET_TMS_CNT);
					$("#isbusy_tmlen_cnt").val(params.ISBUSY_TMLEN_CNT);
					$("#nightShift_startTime").val(params.NIGHTSTARTTIME);
					$("#nightShift_endTime").val(params.NIGHTENDTIME);
					$("#dayShift_startTime").val(params.DAYSTARTTIME);
					$("#dayShift_endTime").val(params.DAYENDTIME);
					
					//0 不启动分单，1 启动分单功能
					var allct_shet_flag = params.ALLCT_SHET_FLAG;
					if(allct_shet_flag=="0")
					{
						//不启动分单，启动按钮可用，停止按钮不可用
						$("#runBtn").addClass("btn-blue").attr("disabled", false);
						$("#stopBtn").removeClass("btn-blue").attr("disabled", true);
						$("#runState").hide();
						$("#stopState").removeClass("hide").show();
					}else if(allct_shet_flag=="1")
					{
						//启动分单，启动按钮不可用，停止按钮可用
						$("#stopBtn").addClass("btn-blue").attr("disabled", false);
						$("#runBtn").removeClass("btn-blue").attr("disabled", true);
						$("#runState").show();
						$("#stopState").hide();
					}
					//工单池状态：0 白班工单池启动，1 夜班工单池启动
					var poolState = params.POOLSTATE;
					if(poolState=="0")
					{
						//白班工单池启动
						$("#nightShiftPool").addClass("btn-blue").attr("disabled", false);
						$("#dayShiftPool").removeClass("btn-blue").attr("disabled", true);
						$(".dayShift").removeClass("hide").show();
						$(".nightShift").hide();
					}else if(poolState=="1")
					{
						//夜班工单池启动
						$("#dayShiftPool").addClass("btn-blue").attr("disabled", false);
						$("#nightShiftPool").removeClass("btn-blue").attr("disabled", true);
						$(".dayShift").hide();
						$(".nightShift").show();
					}
				}	
			}	
		},true);	
	}; 	
	
	var eventInit = function(){
		//"保存配置"按钮点击事件
		$('#saveConfigBtn').click(function(){
			var params = {
				"bl_tms_allct_shet_cnt" : $("#bl_tms_allct_shet_cnt").val(),
				"allct_shet_max_cnt" : $("#allct_shet_max_cnt").val(),
				"allct_shet_gap_sec_cnt" : $("#allct_shet_gap_sec_cnt").val(),
				"n_allct_shet_tms_cnt" : $("#n_allct_shet_tms_cnt").val(),
				"isbusy_tmlen_cnt" : $("#isbusy_tmlen_cnt").val()
			};
			
			
			
	        var config = {
                el: $("#workTimeConfForm"),     //要验证的表单或表单容器
                //submitBtn: $(".btnSearch", $el),    //触发验证的按钮，可不配置
                dialog:true,    //是否弹出验证结果对话框
                rules:{
                	bl_tms_allct_shet_cnt:"required|number|digits|min-1|max-10000",  
                	allct_shet_max_cnt:"required|number|digits|min-1|max-10000", 
                	allct_shet_gap_sec_cnt:"required|number|digits|min-1|max-10000",
                	n_allct_shet_tms_cnt:"required|number|digits|min-1|max-10000",
                	isbusy_tmlen_cnt:"required|number|digits|min-1|max-10000"
                },
                messages:{
                	bl_tms_allct_shet_cnt:{
                        "required":"请填写单次分单值。",       //用户未填写该字段时提示
                        "number":"单次分单值请输入一个大于0的整数", 
                        "digits":"单次分单值请输入一个大于0的整数",
                        "min":"单次分单值请输入一个大于0的整数",
                        "max":"单次分单值设置超出最大值，请修改"
                    },
                    allct_shet_max_cnt:{
                        "required":"请填写分单值上限。",       //用户未填写该字段时提示
                        "number":"分单值上限请输入一个大于0的整数", 
                        "digits":"分单值上限请输入一个大于0的整数",
                        "min":"分单值上限请输入一个大于0的整数",
                        "max":"分单值上限设置超出最大值，请修改"
                    },
                    allct_shet_gap_sec_cnt:{
                        "required":"请填写分单时间间隔。",       //用户未填写该字段时提示
                        "number":"分单时间间隔请输入一个大于0的整数", 
                        "digits":"分单时间间隔请输入一个大于0的整数",
                        "min":"分单时间间隔请输入一个大于0的整数",
                        "max":"分单时间间隔设置超出最大值，请修改"
                    },
                    n_allct_shet_tms_cnt:{
                        "required":"请填写不分单次数。",       //用户未填写该字段时提示
                        "number":"不分单次数请输入一个大于0的整数", 
                        "digits":"不分单次数请输入一个大于0的整数",
                        "min":"不分单次数请输入一个大于0的整数",
                        "max":"不分单次数设置超出最大值，请修改"
                    },
                    isbusy_tmlen_cnt:{
                        "required":"请填写示忙(容忍)时长。",       //用户未填写该字段时提示
                        "number":"示忙(容忍)时长请输入一个大于0的整数", 
                        "digits":"示忙(容忍)时长请输入一个大于0的整数",
                        "min":"示忙(容忍)时长请输入一个大于0的整数",
                        "max":"示忙(容忍)时长设置超出最大值，请修改"
                    }
                }
            }
            var form = new Validator(config);
	        
            //使用验证方法来验证
            if (form.form()){
            	var bl_tms_allct_shet_cnt=$("#bl_tms_allct_shet_cnt").val();
            	var allct_shet_max_cnt=$("#allct_shet_max_cnt").val();
            	if(parseInt(bl_tms_allct_shet_cnt)>=parseInt(allct_shet_max_cnt)){
            		crossAPI.tips("单次分单值不能大于分单值上限",3000);
            		return;
            	}
            	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=workTimeConf002',params,function(result){
					if(result.returnCode =="0")
					{
						crossAPI.tips("分单配置保存成功",3000);
					}else{
						crossAPI.tips("分单配置保存失败，请联系系统管理员。",3000);
					}	
				},true);
            }else{
                return;
            }
		});
		
		//"启动"按钮点击事件
		$('#runBtn').click(function(){
			if($(this).hasClass("btn-blue")){
				$("#runState").show();
				$("#stopState").hide();
				$(this).removeClass("btn-blue").attr("disabled", true);
				$("#stopBtn").addClass("btn-blue").attr("disabled", false);
				
				//发送请求，启动分单
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=workTimeConf002',{"allct_shet_flag" : "1"},function(result){
					if(result.returnCode =="0")
					{
						crossAPI.tips("启动分单成功",3000);
					}else{
						crossAPI.tips("启动分单失败，请联系系统管理员。",3000);
					}	
				},true);
			}
		});
		
		//"停止"按钮点击事件
		$('#stopBtn').click(function(){
			if($(this).hasClass("btn-blue")){
				$("#runState").hide();
				$("#stopState").removeClass("hide").show();
				$(this).removeClass("btn-blue").attr("disabled", true);
				$("#runBtn").addClass("btn-blue").attr("disabled", false);
				
				//发送请求，停止分单
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=workTimeConf002',{"allct_shet_flag" : "0"},function(result){
					if(result.returnCode =="0")
					{
						crossAPI.tips("停止分单成功",3000);
					}else{
						crossAPI.tips("停止分单失败，请联系系统管理员。",3000);
					}	
				},true);
			}
		});
		
		//"保存班次"按钮点击事件
		$('#saveShiftBtn').click(function(){
			var form = null;
			var config = {};
			var params = {};
			if($("#nightShift").is(":visible")){
				params = {
    				"nightStartTime" : $("#nightShift_startTime").val(),
    				"nightEndTime" : $("#nightShift_endTime").val()
	    		};
				
		        config = {
	                el: $("#workTimeShiftForm"),     //要验证的表单或表单容器
	                dialog:true,    //是否弹出验证结果对话框
	                rules:{
	                	nightShift_startTime:"required|time",  
	                	nightShift_endTime:"required|time"
	                },
	                messages:{
	                	nightShift_startTime:{
	                        "required":"请填写夜班工单池开始时间",       //用户未填写该字段时提示
	                        "time":"夜班工单池开始时间格式错误，请修改"
	                    },
	                    nightShift_endTime:{
	                        "required":"请填写夜班工单池结束时间",       //用户未填写该字段时提示
	                        "time":"夜班工单池结束时间格式错误，请修改"
	                    }
	                }
	            };
	            form = new Validator(config);
	            //白班工单池结束时间大于开始时间
			}else if($("#dayShift").is(":visible")){
				params = {
    				"dayStartTime" : $("#dayShift_startTime").val(),
    				"dayEndTime" : $("#dayShift_endTime").val()
	    		};
				
		        config = {
	                el: $("#workTimeShiftForm"),     //要验证的表单或表单容器
	                dialog:true,    //是否弹出验证结果对话框
	                rules:{
	                	dayShift_startTime:"required|time",  
	                	dayShift_endTime:"required|time"
	                },
	                messages:{
	                	dayShift_startTime:{
	                        "required":"请填写白班工单池开始时间",       //用户未填写该字段时提示
	                        "time":"白班工单池开始时间格式错误，请修改"
	                    },
	                    dayShift_endTime:{
	                        "required":"请填写白班工单池结束时间",       //用户未填写该字段时提示
	                        "time":"白班工单池结束时间格式错误，请修改"
	                    }
	                }
	            };
	            form = new Validator(config);
			}	
			//使用验证方法来验证
            if (form&&form.form()){
            	//对白班工单池与夜班工单池进行验证，不可跨天，时间互斥
        		var dayShift_startTime=$("#dayShift_startTime").val().replace(/:/g,"");
        		var dayShift_endTime=$("#dayShift_endTime").val().replace(/:/g,"");
        		var nightShift_startTime=$("#nightShift_startTime").val().replace(/:/g,"");
        		var nightShift_endTime=$("#nightShift_endTime").val().replace(/:/g,"");
        		if(!(parseInt(dayShift_startTime)<=parseInt(dayShift_endTime)&&parseInt(dayShift_endTime)<=parseInt(nightShift_startTime)&&parseInt(nightShift_startTime)<=parseInt(nightShift_endTime))){
        			crossAPI.tips("各班次开始时间小于结束时间且不可跨天，白班工单池结束时间小于等于夜班工单池开始时",3000);
        			return;
        		}
        		
            	//发送服务请求类别
    			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=workTimeConf002',params,function(result){
    				if(result.returnCode =="0")
    				{
    					crossAPI.tips("工单池配置保存成功",3000);
    				}else{
    					crossAPI.tips("工单池配置保存失败，请联系系统管理员。",3000);
    				}	
    			},true);
            }else{
                return;
            }
		});
		
		//"白班工单池"按钮点击事件
		$('#dayShiftPool').click(function(){
			if($(this).hasClass("btn-blue")){
				$(".dayShift").removeClass("hide").show();
				$(".nightShift").hide();
				$(this).removeClass("btn-blue").attr("disabled", true);
				$("#nightShiftPool").addClass("btn-blue").attr("disabled", false);
			}
		});
		
		//"夜班工单池"按钮点击事件
		$('#nightShiftPool').click(function(){
			if($(this).hasClass("btn-blue")){
				$(".dayShift").hide();
				$(".nightShift").show();
				$(this).removeClass("btn-blue").attr("disabled", true);
				$("#dayShiftPool").addClass("btn-blue").attr("disabled", false);
			}
		});
	};

	return initialize();
});