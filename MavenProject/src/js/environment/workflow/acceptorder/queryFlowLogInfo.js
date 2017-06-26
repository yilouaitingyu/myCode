define(['Util','list','date','selectTree','select','dialog','crossAPI'],   
	function(Util,List,MyDate,selectTree,Select,Dialog,CrossAPI){
		//结果显示页面
		var list;
		var _index;
		var _options;
		var config0;
		var config1;
		var config2;
		var config3;
		var config4;
		var config5;
		var config6;
		var $t = 0;
		var locationUrl;
		var staffId;
		var staffName;
		var initialize = function(index,option){
			_index = index;
			_options = option;
			//员工初始化方法
			CrossAPI.getIndexInfo(function(info){
	        	staffId=info.userInfo.staffId;
	        	staffName=info.userInfo.staffName;
	        	//加载数据字典
				dictionaryInit();
				//初始化查找
				batchWorkItemInfoList();
				//按钮初始化绑定
				buttonInit();
	        });
		};		
		var configForModify = {
	            mode:'confirm',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
	            title:'修改满意度',    //对话框标题
	            content:
	            	"<div class='t-list'>"+
	 				"<div class='t-columns-3'>"+
	                "<ul class='t-columns-group'>"+
	            	"<li>"  +
	            		"<label for='appriaseDeal'>评价处理环节</label>"+
	            		"<div>"+
	            		"<select id='appriaseDeal'>"+
	            		"<option></option>"+
	            		"</select>"+
	            		"<span><i class='icon iconfont icon-ddl-arr'></i></span>"+
	            		"</div>"+
	            		"</li>"+
	            		
	            		"<li>"+
	            		"<label for='appriaseCreate'>评价建单环节</label>"+
	            		"<div>"+
	            		"<select id='appriaseCreate'>"+
	            		"<option></option>"+
	            		"</select>"+
	            		"<span><i class='icon iconfont icon-ddl-arr'></i></span>"+
	            		"</div>"+
	            		"</li>"+
     
	            		"<li>"+
	            		"<label for='beAppraiseDeptModify'>被评价部门</label>"+
	            		"<div>"+
	            		"<select id='beAppraiseDeptModify'>"+
	            		"<option></option>"+
	            		"</select>"+
	            		"<span><i class='icon iconfont icon-ddl-arr'></i></span>"+
	            		"</div>"+
	            		"</li>"+
	            		
	            		"<input type='hidden' id='serialnoModify'/>",
	            		//对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
	            ok:function(){
	            	 
	            		var appriaseDeal = $("#appriaseDeal").val();
	            		var appriaseCreate = $("#appriaseCreate").val();
	            		var beAppraiseDeptModify = $("#beAppraiseDeptModify").val();
	            		var serialnoModify = $("#serialnoModify").val();
	            		var params = {
	            				"appraiseDeal":appriaseDeal,
	            				"appraiseCreate":appriaseCreate,
	            				"beAppraiseDeptModify":beAppraiseDeptModify,
	            				"serialnoModify":serialnoModify
	            		};
	            		//提交修改
	            		Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=updateFlowLogInfo',
	            						 params,
	            						 function(result){
	            			 				$("#searchButton").click();
	            						 });
	            	}, //确定按钮的回调函数 
	            okValue: '确定',  //确定按钮的文本
	            cancel: function(){
	            },  //取消按钮的回调函数
	            cancelValue: '取消',  //取消按钮的文本
	            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
	            button: [ //自定义按钮组
	               
	            ],
	            width:800,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
	            height:180, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
	            skin:'dialogSkin',  //设置对话框额外的className参数
	            fixed:false, //是否开启固定定位 默认false不开启|true开启
	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
	            modal:true  //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
	        }
		//按钮初始化绑定方法
		var buttonInit =function(){
			//查询按钮绑定
			$("#searchButton").on("click",searchButton);
			//重置按钮绑定
			$("#resetButton").on("click",resetButton);
			//页签点击事件
			$('.t-tabs-items li').on("click",frameDeaxClick);
		}
		//页签点击事件
		var frameDeaxClick = function(){
			 //得到选择的页面的下标
            $t = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $('.t-tabs-wrap li').eq($t).addClass('selected').siblings().removeClass('selected');
            if($t == 0)
            {
          	  $("#stageProcess").css("display","none").addClass("hide");
          	  list = new List(config0);
          	  
          	validationForQuery(list);
            }
            else if($t == 1)
            {
          	  $("#stageProcess").css("display","none").addClass("hide");
          	  list = new List(config1);
          	  validationForQuery(list);
            }
            else if($t == 2)
            {
          	  $("#stageProcess").css("display","none").addClass("hide");
          	  list = new List(config2);
          	validationForQuery(list);
            }
            else if($t == 3)
            {
          	  $("#stageProcess").css("display","block").removeClass('hide');          	  
          	  list = new List(config3);
          	validationForQuery(list);
            }
            else if($t == 4)
            {
          	  $("#stageProcess").css("display","none").addClass("hide");
          	  list = new List(config4);
          	validationForQuery(list);
            }
            else if($t == 5)
            {
          	  $("#stageProcess").css("display","none").addClass("hide");
          	  list = new List(config5);
          	validationForQuery(list);
            }
            else if($t == 6)
            {
          	  $("#stageProcess").css("display","none").addClass("hide");
          	  list = new List(config6);
          	validationForQuery(list);
            }
		}
		//查询按钮方法
		var searchButton = function(){
			validationForQuery(list);
		};
		//重置按钮方法
		var resetButton = function(){
			//重置时间
			new MyDate(dateConfig);
			$("#serialno").val("");
			$("#acceptstaffname").val("");
			$("#contactphone1").val("");
			$("#callerno").val("");
			$("#subsnumber").val("");
			$("#processState").val("");
			$("#subsbrand").val("");
			$("#custLevel").val("");
			$("#city").val("");
			$("#urgentId").val("");
			$("#isNewBusiness").val("");
			$("#businessType").val("");
			$("#srid").val("");
			$("#handlingDept").val("");
			$("#content").val("");
		};
		
		//初始化数据字典加载方法
		var dictionaryInit = function()
		{
			//草稿、待复核、处理中、已完成、已关闭、已关闭已质检、已关闭已回访、已作废、审批中、已受理
			loadDictionary('staticDictionary_get','HEBEI.DIC.PROCESSSTATE','processState');//加载工单状态
			
			//客户品牌：全球通、动感地带、神州行、其他
			loadDictionary('staticDictionary_get','SR.USER.BRAND.SUBS.BRAND','subsbrand');//加载客户品牌
			
			//全球通普通用户、动感地带客户、神州行客户、他网客户、本地固话客户、异地漫游客户、长途固话客户、集团客户、贵宾卡、VIP银卡、VIP金卡、VIP钻石卡、国际漫游客户、未知
			loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','custLevel');//加载客户级别
			
			
			//省中心、集团、石家庄、保定、张家口、承德、唐山、廊坊、沧州、衡水、邢台、邯郸、秦皇岛、外省
			loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','city');//加载受理地市
			
			//紧急程度：一般、紧急、非常紧急
			loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','urgentId');//加载紧急程度
			
			loadDictionary('staticDictionary_get','CSP.PUB.YESNO','isNewBusiness');//加载新旧业务
			
			loadDictionary('staticDictionary_get','CSP.BCC.BIZTYPE','businessType');//加载业务类型
			
			loadDictionary('staticDictionary_get','HEBEI.COMPLAIN.TYPE','srid');//加载投诉类型1
			
			loadDictionary('staticDictionary_get','HEBEI.DIC.GROUPTYPEID','workGroup');//加载工作组
			//处理部门：南区客服中心、北区客服中心、石家庄分公司、保定分公司、承德分公司、沧州分公司、廊坊分公司、衡水分公司、秦皇岛分公司、唐山分公司、邢台分公司、张家口分公司、NQ_天宇外包、BQ_天宇外包、省网管中心、省业务支撑中心、邯郸分公司、客户服务中心
			loadDictionary('staticDictionary_get','HEBEI.DEPARTMENT.DEAL','handlingDept');//加载处理部门
		}
		
		//list查询方法（带校验）
		var validationForQuery = function(list)
		{
			var serialno = $("#serialno").val();
			var acceptstaffname = $("#acceptstaffname").val();
			var acceptTimeStart =  $("input[name='acceptTimeStart']")[0].value;
			var acceptTimeEnd =  $("input[name='acceptTimeEnd']")[0].value;
			var contactphone1 = $("#contactphone1").val();
			var callerno = $("#callerno").val();
			var subsnumber = $("#subsnumber").val();
			var processState = $("#processState").val();
			var subsbrand = $("#subsbrand").val();
			var custLevel = $("#custLevel").val();
			var city = $("#city").val();
			var urgentId = $("#urgentId").val();
			var isNewBusiness = $("#isNewBusiness").val();
			var businessType = $("#businessType").val();
			var srid = $("#srid").val();
			var workGroup = $("#workGroup").val();
		
			var handlingDept = $("#handlingDept").val();
			var content = $("#content").val();
			
			if(contactphone1 != null && contactphone1 != "")
			{
				//开始对电话号码的验证
				if(!isphone1(contactphone1))
				{
					return;
				}
			}
			if(callerno != null && callerno != "")
			{
				//开始验证主叫号码
				if(!isphone1(callerno))
				{
					return;
				}
			}
			//开始对时间的验证
			if(acceptTimeStart == null || acceptTimeStart == "")
			{
				CrossAPI.tips("开始时间不能为空",3000);
				return;
			}
			
			if(acceptTimeEnd == null || acceptTimeEnd == "")
			{
				CrossAPI.tips("结束时间不能为空",3000);
				return;
			}
			
			var starTime = new Date(acceptTimeStart.replace(/-/g,"/"));
			var endTime = new Date(acceptTimeEnd.replace(/-/g,"/"));
			var m = (endTime.getTime()-starTime.getTime())/(1000*60*60*24);
			
			if(m<0)
			{
				CrossAPI.tips("结束时间需要大于开始时间",3000);
				return ;
			}
			if(m>30)
			{
				CrossAPI.tips("请查30天内消息",3000);
				return ;
			}
			 
			var returnParam ={	
					"serialno":serialno,
					"acceptstaffname":acceptstaffname,
					"acceptTimeStart":acceptTimeStart,
					"acceptTimeEnd":acceptTimeEnd,
					"contactphone1":contactphone1,
					"callerno":callerno,
					"subsnumber":subsnumber,
					"processState":processState,
					"subsbrand":subsbrand,
					"custLevel":custLevel,
					"city":city,
					"urgentId":urgentId,
					"isNewBusiness":isNewBusiness,
					"businessType":businessType,
					"srid":srid,
					"handlingDept":handlingDept,
					"content":content,
					"workGroup":workGroup
				};
			list.search(returnParam);
		}
		
		/*判断输入是否为合法的电话号码，匹配固定电话或小灵通*/
	     function isphone1(inpurStr)
	     {
	          var partten = /^0(([1,2]\d)|([3-9]\d{2}))\d{7,8}$/;
	          if(partten.test(inpurStr))
	          {
	               return true;
	          }
	          else
	          {
	               CrossAPI.tips('不是电话号码',3000);
	               return false;
	          }
	     }
		
		//展示已批量认领的工单列表信息
		var batchWorkItemInfoList=function(){
			//退单查询结果展示
            config0 = {
                 el:$('#listContainer'),
                 className :'listContainer',
                 field:{
                     items:[
                         { 
                             text:'工单流水号',  //按钮文本
                             name:'serialno',  //按钮名称
                         },
                         { 
                             text:'时间',
                             name:'createTime',
                         },
                         { 
                             text:'执行人',
                             name:'handlingStaff',
                         },
                         { text:'动作',
                           name:'operateType'
                         },
                         { text:'被退回部门',name:'preHandlingDept' ,
                        	 render:function(item,val)
                             {
                          	   return loadDictionaryForList('staticDictionary_get','HEBEI.DEPARTMENT.DEAL',val);
                             }
                         },
                         { text:'操作退单部门',name:'handlingDept',
                        	 render:function(item,val)
                             {
                          	   return loadDictionaryForList('staticDictionary_get','HEBEI.DEPARTMENT.DEAL',val);
                             }
                         },
                         { text:'评价处理环节',name:'appraise',
                        	 render:function(item,val)
                             {
                            	 return loadDictionaryForList('staticDictionary_get','HEBEI.EVALUATE.DEGREE',val);
                             }
                         },
                         { text:'不满意原因1',name:'reason1',
                        	 render:function(item,val)
                        	 {
                        		 return loadDictionaryForList('staticDictionary_get','HEBEI.EVALUATE.REASON',val);
                        	 }
                         },
                         { text:'不满意备注',name:'remark' },
                         { text:'内容',name:'content' }
                     ]
                 },
                 page:{
                     customPages:[2,3,5,10,15,20,30,50],
                     perPage:10,
                     total:true,
                     align:'right',
                     button:{
                         className:'btnStyle',
                         items:[
                            
                             {
                                 text:'导出',
                                 name:'export0',
                                 click:exportFunction
                                 
                             }]
                     }
                 },
                 data:{
                     url:'/ngwf_he/front/sh/workflow!execute?uid=queryLogForBackWork&nodetype=0',
                 }
             };
             //处理催办查询结果展示
             config1 = {
                     el:$('#listContainer'),
                     className:'listContainer',
                     field:{
                         items:[
                             { 
                                 text:'工单流水号',  //按钮文本
                                 name:'serialno'  //按钮名称
                             },
                             { 
                                 text:'时间',
                                 name:'createTime'
                             },
                             { 
                                 text:'执行人',
                                 name:'operator',
                                 className:'w120'
                             },
                             { text:'动作',
                               name:'operateType', 
                             },
                             { text:'内容',name:'content' }
                         ]
                     },
                     page:{
                         customPages:[2,3,5,10,15,20,30,50],
                         perPage:10,
                         total:true,
                         align:'right',
                         button:{
                             className:'btnStyle',
                             items:[
                               
                                 {
                                     text:'导出',
                                     name:'export1',
                                     click:exportFunction
                                 }]
                         }
                     },
                     data:{
                         url:'/ngwf_he/front/sh/workflow!execute?uid=queryLogForReminder&nodetype=1',
                     }
                 };
             
             //处理追单查询结果展示
             config2 = {
                     el:$('#listContainer'),
                     className:'listContainer',
                     field:{
                         items:[
                             { 
                                 text:'工单流水号',  //按钮文本
                                 name:'serialno'  //按钮名称
                             },
                             { 
                                 text:'时间',
                                 name:'createTime'
                             },
                             { 
                                 text:'执行人',
                                 name:'operator',
                                 className:'w120'

                             },
                             { text:'动作',
                               name:'operateType' 
                             },
                             { text:'内容',name:'content' }
                         ]
                     },
                     page:{
                         customPages:[2,3,5,10,15,20,30,50],
                         perPage:10,
                         total:true,
                         align:'right',
                         button:{
                             className:'btnStyle',
                             items:[
                              
                                 {
                                     text:'导出',
                                     name:'export2',
                                     click:exportFunction
                                 }]
                         }
                     },
                     data:{
                         url:'/ngwf_he/front/sh/workflow!execute?uid=queryLogForChaseWork&nodetype=2',
                     }
                 };
             //阶段处理查询结果展示
             config3 = {
                     el:$('#listContainer'),
                     className:'listContainer',
                     field:{
                         items:[
                             { 
                                 text:'工单流水号',  //按钮文本
                                 name:'serialno'  //按钮名称
                             },
                             { 
                                 text:'时间',
                                 name:'createTime'
                             },
                             { 
                                 text:'执行人',
                                 name:'staffno',
                                 className:'w120'

                             },
                             { text:'动作',
                               name:'operateType' 
                             },
                             { text:'阶段处理描述',name:'content' }
                         ]
                     },
                     page:{
                         customPages:[2,3,5,10,15,20,30,50],
                         perPage:10,
                         total:true,
                         align:'right',
                         button:{
                             className:'btnStyle',
                             items:[
                                 {
                                     text:'搜索',
                                     name:'batchRviewSend'
                                     //click:batchReviewSend
                                 },
                                  {
                                     text:'刷新',
                                     name:'release'
                                    // click:releaseButton
                                 },
                                 {
                                     text:'导出',
                                     name:'export3',
                                     click:exportFunction
                                 }]
                         }
                     },
                     data:{
                         url:'/ngwf_he/front/sh/workflow!execute?uid=queryLogForStageProcess&nodetype=3',
                     }
                 };
             //工单建单满意度查询结果展示：
             config4 = {
                     el:$('#listContainer'),
                     className:'listContainer',
                     field:{
                         items:[
                             { 
                                 text:'工单流水号',  //按钮文本
                                 name:'serialno'  //按钮名称
                             },
                             { 
                                 text:'受理号码',
                                 name:'subsNumber'
                             },
                             { 
                                 text:'评价建单环节',
                                 name:'segmentType',
                                 className:'w120',
                                 render:function(item,val)
                                 {
                                	 return loadDictionaryForList('staticDictionary_get','HEBEI.EVALUATE.DEGREE',val);
                                 }
                             },
                             { text:'不满意原因',
                               name:'reason1', 
                               render:function(item,val)
	                           {
	                          		 return loadDictionaryForList('staticDictionary_get','HEBEI.EVALUATE.REASON1',val);
	                           }
                             },
                             { text:'不满意原因2',name:'reason2' ,
                            	 render:function(item,val)
                            	 {
                            		 return loadDictionaryForList('staticDictionary_get','HEBEI.EVALUATE.REASON2',val);
                            	 }
                             },
                             { text:'评价人工号',name:'handlingStaff' },
                             { text:'备注说明',name:'remark' },
                             { text:'评价处理环节',
                               name:'segmentTypeDeal',
                               render:function(item,val)
                               {
                            	   return loadDictionaryForList('staticDictionary_get','HEBEI.EVALUATE.DEGREE',val);
                               }
                             },
                             { text:'评价人工号',name:'handlingStaffDeal' },
                             { text:'备注说明',name:'remarkDeal' },
                             { text:'被评价部门',
                               name:'beAppraiseDept',
                               render:function(item,val)
                               {
                            	   return loadDictionaryForList('staticDictionary_get','HEBEI.DEPARTMENT.DEAL',val);
                               }
                             },
                             
                         ],
                         button:
                         {
                        	 className:'w90',
                        	 items:[ //操作区域按钮设置
                                     { 
                                         text:'修改',  //按钮文本
                                         name:'editor',  //按钮名称
                                         click:function(e,item){     //按钮点击时处理函数
                                        	 var dialog = new Dialog(configForModify);
                                        	//加载select数据字典
                                        	//评价建单环节
                             				loadDictionary('staticDictionary_get','HEBEI.EVALUATE.DEGREE','appriaseDeal');
                             				
                             				//评价处理环节
                             				loadDictionary('staticDictionary_get','HEBEI.EVALUATE.DEGREE','appriaseCreate');
                             				
                             				//被评价部门
                             				loadDictionary('staticDictionary_get','HEBEI.DEPARTMENT.DEAL','beAppraiseDeptModify');
                             				$("#appriaseDeal").val(item.data.segmentTypeDeal);
                             				$("#appriaseCreate").val(item.data.segmentType);
                             				$("#beAppraiseDeptModify").val(item.data.beAppraiseDept);
                             				$("#serialnoModify").val(item.data.serialno);
                                         } 
                                     }
                                     ]
                         }
             
                     },
                     page:{
                         customPages:[2,3,5,10,15,20,30,50],
                         perPage:10,
                         total:true,
                         align:'right',
                         button:{
                             className:'btnStyle',
                             items:[
                                
                                 {
                                     text:'导出',
                                     name:'export4',
                                     click:exportFunction
                                 }]
                         }
                     },
                     data:{
                         url:'/ngwf_he/front/sh/workflow!execute?uid=queryLogForWorkEvalution&nodetype=4',
                     }
                 };
             //复核评价满意度查询结果展示：
             config5 = {
                     el:$('#listContainer'),
                     className:'listContainer',
                     field:{
                         items:[
                             { 
                                 text:'工单流水号',  //按钮文本
                                 name:'serialno'  //按钮名称
                             },
                             { 
                                 text:'受理号码',
                                 name:'subsNumber'
                             },
                             { 
                                 text:'复合评价满意度',
                                 name:'segmentType',
                                 className:'w120',
                                 render:function(item,val)
                                 {
                                	 return loadDictionaryForList('staticDictionary_get','HEBEI.EVALUATE.DEGREE',val);
                                 }

                             },
                             { text:'复合评价不满意原因',
                               name:'reason1',
	                             render:function(item,val)
	                          	 {
	                          		 return loadDictionaryForList('staticDictionary_get','HEBEI.EVALUATE.REASON1',val);
	                          	 }
                             },
                             { text:'复合评价不满意备注',name:'remark' },
                         ]
                     },
                     page:{
                         customPages:[2,3,5,10,15,20,30,50],
                         perPage:10,
                         total:true,
                         align:'right',
                         button:{
                             className:'btnStyle',
                             items:[
                              
                                 {
                                     text:'导出',
                                     name:'export5',
                                     click:exportFunction
                                 }]
                         }
                     },
                     data:{
                         url:'/ngwf_he/front/sh/workflow!execute?uid=queryLogForReviewEvalution&nodetype=5',
                     }
                 };
             
             //工单处理满意度查询结果展示：
             config6 = {
                     el:$('#listContainer'),
                     className:'listContainer',
                     field:{
                         items:[
                             { 
                                 text:'工单流水号',  //按钮文本
                                 name:'serialno'  //按钮名称
                             },
                             { 
                                 text:'受理号码',
                                 name:'subsNumber'
                             },
                             { 
                                 text:'工单处理满意度',
                                 name:'segmentType',
                                 className:'w120',
                                 render:function(item,val)
                                 {
                                	 return loadDictionaryForList('staticDictionary_get','HEBEI.EVALUATE.DEGREE',val);
                                 }

                             },
                             { text:'工单处理不满意原因',
                               name:'reason1', 
                               render:function(item,val)
                          	 	{
                          		 return loadDictionaryForList('staticDictionary_get','HEBEI.EVALUATE.REASON1',val);
                          	 	}
                             },
                             { text:'工单处理不满意备注',name:'remark' },
                         ]
                     },
                     page:{
                         customPages:[2,3,5,10,15,20,30,50],
                         perPage:10,
                         total:true,
                         align:'right',
                         button:{
                             className:'btnStyle',
                             items:[
                               
                                 {
                                     text:'导出',
                                     name:'export6',
                                     click:exportFunction
                                 }]
                         }
                     },
                     data:{
                         url:'/ngwf_he/front/sh/workflow!execute?uid=queryLogForDealEvalution&nodetype=7',
                     }
                 };
			list = new List(config0);
			validationForQuery(list);
		}
		
		var getlocationUrl = function()
		{
			var serialno = $("#serialno").val();
			var acceptstaffname = $("#acceptstaffname").val();
			var acceptTimeStart =  $("input[name='acceptTimeStart']")[0].value;
			var acceptTimeEnd =  $("input[name='acceptTimeEnd']")[0].value;
			var contactphone1 = $("#contactphone1").val();
			var callerno = $("#callerno").val();
			var subsnumber = $("#subsnumber").val();
			var processState = $("#processState").val();
			var subsbrand = $("#subsbrand").val();
			var custLevel = $("#custLevel").val();
			var city = $("#city").val();
			var urgentId = $("#urgentId").val();
			var isNewBusiness = $("#isNewBusiness").val();
			var businessType = $("#businessType").val();
			var srid = $("#srid").val();
			var workGroup = $("#groupSelect").val();
		
			var handlingDept = $("#handlingDept").val();
			var content = $("#content").val();
			
			
			
			if(acceptTimeStart == null || acceptTimeStart == "")
			{
				CrossAPI.tips("开始时间不能为空",3000);
				return;
			}
			
			if(acceptTimeEnd == null || acceptTimeEnd == "")
			{
				CrossAPI.tips("结束时间不能为空",3000);
				return;
			}
			
			var starTime = new Date(acceptTimeStart.replace(/-/g,"/"));
			var endTime = new Date(acceptTimeEnd.replace(/-/g,"/"));
			var m = (endTime.getTime()-starTime.getTime())/(1000*60*60*24);
			
			if(m<0)
			{
				CrossAPI.tips("结束时间需要大于开始时间",3000);
				return ;
			}
			if(m>30)
			{
				CrossAPI.tips("请查30天内消息",3000);
				return ;
			}
			
			var returnParam ={	
					"serialno":serialno,
					"acceptstaffname":acceptstaffname,
					"acceptTimeStart":acceptTimeStart,
					"acceptTimeEnd":acceptTimeEnd,
					"contactphone1":contactphone1,
					"callerno":callerno,
					"subsnumber":subsnumber,
					"processState":processState,
					"subsbrand":subsbrand,
					"custLevel":custLevel,
					"city":city,
					"urgentId":urgentId,
					"isNewBusiness":isNewBusiness,
					"businessType":businessType,
					"srid":srid,
					"handlingDept":handlingDept,
					"content":content,
					"workGroup":workGroup
				};
			locationUrl = "/ngwf_he/front/sh/wordExport!flowDealExport?uid=flowDealExport&frameIndex="+$t;
			
			for(var key in returnParam)
			{
				locationUrl += "&"+key+"="+ returnParam[key];
			}
			return locationUrl;
		}
		//导出方法
		var exportFunction = function(){
			locationUrl = getlocationUrl();
			if(locationUrl == null)
			{
				return;
			}
			else
			{
				window.open(locationUrl);
			}
		}

		//为查询条件加载数据字典方法
		 var loadDictionary=function(mothedName,dicName,seleId){
				var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
				var seleOptions="";
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
					$.each(result.beans,function(index,bean){
						seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
					});
					$('#'+seleId).append(seleOptions);
					console.log(result);
				},true);
			};
			//为list集合加载数据字典
			var loadDictionaryForList=function(mothedName,dicName,val){
				var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
				var seleOptions="";
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
					$.each(result.beans,function(index,bean){
						if(val == bean.value)
						{
							seleOptions =  bean.name;
						}
					});
					console.log(result);
				},true);
				
				return seleOptions;
			};
		
		
			// 添加时间对象原形.设置时间格式;
			Date.prototype.Format = function(fmt) { // author: meizz
				var o = {
					"M+" : this.getMonth() + 1, // 月份
					"d+" : this.getDate(), // 日
					"h+" : this.getHours(), // 小时
					"m+" : this.getMinutes(), // 分
					"s+" : this.getSeconds(), // 秒
					"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
					"S" : this.getMilliseconds()
				// 毫秒
				};
				if (/(y+)/.test(fmt))
					fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
							.substr(4 - RegExp.$1.length));
				for ( var k in o)
					if (new RegExp("(" + k + ")").test(fmt))
						fmt = fmt.replace(RegExp.$1,
								(RegExp.$1.length == 1) ? (o[k])
										: (("00" + o[k])
												.substr(("" + o[k]).length)));
				return fmt;
			}

			var nowDate = new Date();
			var time2 = nowDate.Format("yyyy/MM/dd hh:mm:ss");
			//console.log(time2)
			// 当前时间减去30天为起始时间
			var t = nowDate.getTime() - 30 * 24 * 60 * 60 * 1000;
			var time1 = new Date(t).Format("yyyy/MM/dd hh:mm:ss");
			var dateConfig = {
					el : $('#createTime'),
					label : '建单时间',
					double : { // 支持一个字段里显示两个日期选择框
						start : {
							name : 'acceptTimeStart',
							format : 'YYYY/MM/DD hh:mm:ss',
							defaultValue:time1, //默认日期值
							istime : true,
							istoday : false,
						choose: function(datas){
						}
						},
						end : {
							name : 'acceptTimeEnd',
							format : 'YYYY/MM/DD hh:mm:ss',
							defaultValue:time2, //默认日期值
							istime : true,
							istoday : false
						}
					}
				};
			var date1 = new MyDate(dateConfig);
			
		return initialize();
});