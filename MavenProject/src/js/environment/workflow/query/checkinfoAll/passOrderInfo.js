define(['Util','list','date','jquery','crossAPI'],   
	function(Util,list,MyDate,$,CrossAPI){
		var list;
		var initialize = function(){
		    	eventInit();
		    	passOrderList({});
		};		
		
		 var eventInit=function(){
			$('#queryBtn').on('click',queryInfo);
			$('#resetBtn').on('click',resetInfo);
		 };
		 //按条件查询
		 var queryInfo = function(){
			 var acceptstartTime = $('#com_acceptstartTime div input').val();
			 var acceptendTime = $('#com_acceptendTime div input').val();
			 var backstartTime = $('#com_backstartTime div input').val();
			 var backendTime = $('#com_backendTime div input').val();
			 var data =  {
					 "acceptstartTime":acceptstartTime,
					 "acceptendTime":acceptendTime,
					 "backstartTime":backstartTime,
					 "backendTime":backendTime
			 }
			 passOrderList(data);
		 }
		 
		 //重置
		 var resetInfo = function(){
			$('#com_acceptstartTime div input').val("");
			$('#com_acceptendTime div input').val("");
			$('#com_backstartTime div input').val("");
			$('#com_backendTime div input').val("");
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
            label:'受理开始时间',
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
            label:'受理结束时间',
            name:'acceptendTime',    //结束日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:time2,     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
//		归档开始时间
		var enddate=new MyDate({
			el:$('#com_backstartTime'),
            label:'归档开始时间',
            name:'backstartTime',    //结束日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:time1,     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
//		归档结束时间
		var enddate=new MyDate({
			el:$('#com_backendTime'),
            label:'归档结束时间',
            name:'backendTime',    //结束日期文本框name
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
					        items: [{text: '工单流水号',name:'wrkfmSwftno'},		                       
		                            {text: '业务类型', name: 'wrkfmTypeCd'},
		                            {text:'退单人',name:'currentLinkStaff1'},
		                            {text:'退单人所在组',name:'currentLinkStaff2'},
		                            {text: '退单人所在部门', name: 'currentLinkStaff3'},
		                            {text:'退单人所在单位',name:'currentLinkStaff4'},
		                            {text:'被退回人',name:''},
		                            {text:'被退回人所在组',name:''},
		                            {text:'被退回人所在部门',name:''},
		                            {text: '被退回人所在单位',name:''},
		                            {text: '退单原因',name:'discontent',render:function(item,val){ 
		        			        	//重写列表展示
		                                if(val==null){
		                                	if (item.discontent1!=undefined||item.discontent2!=undefined) {
		                                		return item.discontent1+","+item.discontent2;
											}
		                                }else{
		                                	return;
		                                }
		                                }},
		                            {text: '退单原因说明',name:'opDescribe'},
		                    ]
					        
					    },
					    page:{
					        perPage:10,    
					        align:'right'  
					    },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=commet002&retnBlFlag=1'
					    }
					}
				this.list = new list(config);
				this.list.search(data);
			}
			return initialize();
});