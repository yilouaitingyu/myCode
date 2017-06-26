define(['Util','list','date','jquery','crossAPI','simpleTree'],   
	function(Util,list,MyDate,$,CrossAPI,SimpleTree){
		var list;
		var initialize = function(){
		    	eventInit();
		    	passOrderList({"acceptstartTime":time1,"acceptendTime":time2});
		};		
		
		 var eventInit=function(){
			$('#queryBtn').on('click',queryInfo);
			$('#resetBtn').on('click',resetInfo);
			$('#com_group').on('click',loadInfo);
			$('#selectedNodes').on('click',secondGroupInfo)//添加派单配置
		 };
		 //加载数据
		 var simpleTree;
		 var loadInfo = function(){
			 $('#popSelect').addClass("show").removeClass("hide");
			 simpleTree = new SimpleTree.tierTree($('#treeContainer'),'/ngwf_he/front/sh/workflow!execute?uid=queryDept',settings);
			 var node=simpleTree.getNodeByParam('id','001');
			simpleTree.expandNode(node, true, false, true);
		 }
		 
		 var secondGroupInfo = function(){
				var nodes = simpleTree.getCheckedNodes(true);
				if(nodes[0].isParent==true){
					crossAPI.tips("请选择正确的工作组！",3000);
					$('#popSelect').addClass("show").removeClass("hide");
					return;
				}else{
					if(nodes.length==1){
							$("#com_group").val(nodes[0].name);
							$("#com_group").attr("name",nodes[0].id);
					}else{
						crossAPI.tips("只能选择一个！",3000);
					}
				}
			}
		 
		 //树结构
		 settings = {
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
		                beforeRemove: null    //捕获节点被删除之前事件的回调函数，并且根据返回值确定是否允许删除操作，默认值为null
		                
		            },
		            check:{
		                enable:true,        //设置节点上是否显示 checkbox / radio
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
		                    title: "",
		                    url: "url"
		                },
		                simpleData:{
		                    enable: false,
		                    idKey: "id",
		                    pIdKey: "id",
		                    rootPId: null
		                }
		            }
		        }
		 
		 //按条件查询
		 var queryInfo = function(){
			 var acceptstartTime = $('#com_acceptstartTime div input').val();
			 var acceptendTime = $('#com_acceptendTime div input').val();
			 var group = $('#com_group').attr("name");
			 var params = {"orgaId":group};
			 var ptyId = "";
			 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryDeptStaff',params,function(result){
				 $.each(result.beans,function(index,bean){
					 ptyId += bean.ptyId+",";
				 });
			 },true);
			 var startLong = (new Date(acceptstartTime)).getTime();
			 var endLong = (new Date(acceptendTime)).getTime();
			 if (startLong > endLong) {
				crossAPI.tips("开始时间不能大于结束时间!",3000);
			}
			 var data =  {
					 "acceptstartTime":acceptstartTime,
					 "acceptendTime":acceptendTime,
					 "group":ptyId
			 }
			 passOrderList(data);
		 }
		 
		 //重置
		 var resetInfo = function(){
			$('#com_acceptstartTime div input').val(time1);
			$('#com_acceptendTime div input').val(time2);
			$('#com_group').val("");
			passOrderList({});
		 }

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
		 
//		 受理开始时间
			var nowDate = new Date();
			var time2 = nowDate.Format("yyyy-MM-dd hh:mm:ss");
			
			var t = nowDate.getTime() - 31 * 24 * 60 * 60 * 1000;
			var time1 = new Date(t).Format("yyyy-MM-dd hh:mm:ss");
			
		var date=new MyDate({
			el:$('#com_acceptstartTime'),
            label:'开始时间',
            name:'acceptstartTime',    //开始日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:time1,     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
//		受理结束时间
		
		var enddate=new MyDate({
			el:$('#com_acceptendTime'),
            label:'结束时间',
            name:'acceptendTime',    //结束日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:time2,     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
		//加载历史预警信息列表
			var passOrderList = function(data){
				var config = {
						el:$('#passOrderList'),
					    field:{ 
					        key:'id',         		        	
					        items: [		                       
		                            {text:'工号', name: 'staffNum'},
		                            {text:'姓名',name:'staffName'},
		                            {text:'新建量',name:'createNum',render:function(item,val){
		                            	if (item.createNum==null) {
											return "0";
										}else{
											return item.createNum;
										}
		                            }},
		                            {text:'派单量',name:'pointNum',render:function(item,val){
		                            	if (item.pointNum==null) {
											return "0";
										}else{
											return item.pointNum;
										}
		                            }},
		                            {text:'外派量',name:'outpointNum',render:function(item,val){
		                            	if (item.outpointNum==null) {
											return "0";
										}else{
											return item.outpointNum;
										}
		                            }},
		                            {text:'销单量',name:'destoryNum',render:function(item,val){
		                            	if (item.destoryNum==null) {
											return "0";
										}else{
											return item.destoryNum;
										}
		                            }},
		                            {text:'处理量',name:'handleNum',render:function(item,val){
		                            	if (item.handleNum==null) {
											return "0";
										}else{
											return item.handleNum;
										}
		                            }},
		                            {text:'回复一级量',name:'replyNum',render:function(item,val){
		                            	if (item.replyNum==null) {
											return "0";
										}else{
											return item.replyNum;
										}
		                            }},
		                            {text:'直接答复量',name:'answerNum',render:function(item,val){
		                            	if (item.answerNum==null) {
											return "0";
										}else{
											return item.answerNum;
										}
		                            }},
		                            {text:'退单量',name:'returnNum',render:function(item,val){
		                            	if (item.returnNum==null) {
											return "0";
										}else{
											return item.returnNum;
										}
		                            }},
		                            {text:'回复客户归档',name:'replyEndNum',render:function(item,val){
		                            	if (item.replyEndNum==null) {
											return "0";
										}else{
											return item.replyEndNum;
										}
		                            }},
		                            {text:'直接归档',name:'endNum',render:function(item,val){
		                            	if (item.endNum==null) {
											return "0";
										}else{
											return item.endNum;
										}
		                            }},
		                            {text:'派发审批量',name:'pointCheckNum',render:function(item,val){
		                            	if (item.pointCheckNum==null) {
											return "0";
										}else{
											return item.pointCheckNum;
										}
		                            }}
		                    ]
					        
					    },
					    page:{
					        perPage:10,    
					        align:'right'  
					    },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=staffWorkNum'
					    }
					}
				this.list = new list(config);
				this.list.search(data);
			}
			return initialize();
});