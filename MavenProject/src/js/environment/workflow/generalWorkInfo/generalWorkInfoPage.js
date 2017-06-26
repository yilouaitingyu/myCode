define(['Util','list','date','selectTree','select','dialog','indexLoad'],   
	function(Util,List,MyDate,selectTree,Select,Dialog,IndexLoad) {
			var _index;
			var _options;
			var list;
			
			/**
			 * 事件初始化方法
			 */
			var eventInit = function(){
				$("#searchButton").on("click",searchButton);
				$("#restValue").on("click",resetButton);
			}
			
			/**
			 * 查询按钮方法
			 */
			var searchButton = function(){
				validationForQuery(list);
			}
			
			/**
			 * 重置按钮方法
			 */
			var resetButton = function(){
				 
				$("#acceptNumber").val("");
			}
			/**
			 * 查询条件验证方法
			 */
			var validationForQuery = function(list)
			{
				var aceeptNumber  = $("#acceptNumber").val();
				var param = {"acceptNumber":aceeptNumber};
				list.search(param);
			}
			
			//初始化查询方法
			var queryBlackNameListInit = function(){
				var config = {
						el:$('#listContainer'),
					    field:{
					        items: [
		                           {text:'创建时间',name:'createTime'},
		                           {text:'受理时间',name:'acceptTime'},
		                           {text:'服务请求流水号',name:'serialno'},
		                           {text:'服务请求节点',name:'fullName'},
		                           {text:'受理人',name:'acceptStaffId'},
		                           {text:'受理人所在组',name:'acceptGroup'},
		                           {text:'受理人所在部门',name:'deptName'},
		                           {text:'受理人所在单位',name:'orgaName'},
		                           {text:'受理号码',name:'acceptNumber'},
		                           {text:'受理地市',name:'cityCode'}
		                    ]
					    },
					    page:{
					    	customPages:[5,10,15,20,30,50],
					        perPage:10,    
					        align:'right',
					        total:true,
					        button:{
		                        className:'btnStyle',
		                        items:[
		                        ]
		                    }
					    },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=queryGeneralWorkInfoList'
					    }
					}
					list = new List(config);
					validationForQuery(list);
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
					el : $('#startTime'),
					label : '建单时间',
					double : { // 支持一个字段里显示两个日期选择框
						start : {
							name : 'acceptTimeStart',
							format : 'YYYY/MM/DD hh:mm:ss',
							defaultValue:time1, //默认日期值
							//min: laydate.now(-1),
							//max : '2099/06/16 23:59:59',
							istime : true,
							istoday : false,
						choose: function(datas){
						//this.end.min = datas; //设置结束日期的最小限制
						//this.end.start = datas; //设置结束日期的开始值
						}
						},
						end : {
							name : 'acceptTimeEnd',
							format : 'YYYY/MM/DD hh:mm:ss',
							defaultValue:time2, //默认日期值
							//min: laydate.now(-1),
							//max : '2099/06/16 23:59:59',
							istime : true,
							istoday : false
						}
					}
				};
			var date1 = new MyDate(dateConfig);
			
			IndexLoad(function(index,option)
					{
						_index = index;
						_options = option;
						//初始化查询方法
						queryBlackNameListInit();
						eventInit();
					});
});