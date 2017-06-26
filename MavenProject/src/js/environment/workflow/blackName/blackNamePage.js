define(['Util','list','date','selectTree','select','dialog','indexLoad'],   
	function(Util,List,MyDate,selectTree,Select,Dialog,IndexLoad) {
			var _index;
			var _options;
			var list;
			IndexLoad(function(index,option)
					{
						_index = index;
						_options = option;
						//初始化查询方法
						queryBlackNameListInit();
						eventInit();
					});
			
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
		                           {text:'工单流水号',name:'serialno'},
		                           {text:'服务请求类别',name:'srTypeId'},
		                           {text:'建单时间',name:'createTime'},
		                           {text:'受理号码',name:'acceptNumber'},
		                           {text:'建单人',name:'acceptStaffId'},
		                           {text:'工单状态',name:'workState'},
		                           {text:'完成时间',name:'endTime'},
		                           {text:'整体时限',name:'exprTime'},
		                           {text:'是否有附件',name:'enclosureFlag',
		                        	   render:function(item,val)
		                        	   {
		                        		   if(val =="" || val == null)
		                        		   {
		                        			   return '否';
		                        		   }
		                        		   else
		                        		   {
		                        			   return "是";
		                        		   }
		                        	   }},
		                           {text:'是否签订承诺书',name:'prmsBookFlag'}
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
					        url:'/ngwf_he/front/sh/workflow!execute?uid=queryBlackNameList'
					    }
					}
					list = new List(config);
					validationForQuery(list);
			};
});