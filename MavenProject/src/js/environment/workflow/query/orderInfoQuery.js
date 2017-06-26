define(
		[ 'require','tab','Util', 'date', 'list', 'select', 'dialog', 'crossAPI',
			'./commonQuery',
			'text!module/workflow/query/comprehensiveQuery.html',
			'./comprehensiveQuery'
			],
		function(require,Tab,Util, MyDate, List, Select, Dialog, CrossAPI, commonQuery,comprehensiveQueryHtml) {
			var Init=function(){
				
				gotoPage();
				
			}
			var tabConfig = {
			        el:'#tabContainer',  //要绑定的容器
			        className:'tab',    //组件的className
			        direction:'horizontal',   //按布局 horizontal默认横向|vertical纵向
			        tabs:[  //选项卡内容设置
			            {
			                title:'操作日志',   //选项卡标题
			                className:'tab0', //选项卡的className
			                closeable:0, //是否可以关闭 0false不可以|1true可以
			                render:function(originTab){ //选项卡的内容使用该方法返回值填充
			                },
			                click:function(e, tabData){ //选项卡单击触发
			                	var html = "";
			                	$.get("/ngwf_he/src/module/workflow/query/comprehensiveQuery.html",function(data){
			                		html=data;
			                		tab.content(html);
			                	});
	                            
			                }
			            },
			            {
			                title:'综合查询',   //选项卡标题
			                className:'tab0', //选项卡的className
			                closeable:0, //是否可以关闭 0false不可以|1true可以
			                render:function(originTab){ //选项卡的内容使用该方法返回值填充
			                },
			                click:function(e, tabData){ //选项卡单击触发
			                	var html = comprehensiveQueryHtml;
	                            tab.content(html);
	                            comprehensiveQuery.init(Util, MyDate, List, Select, Dialog, CrossAPI);
			                }
			            },
			            {
			                title:'跨节点工单',   //选项卡标题
			                className:'tab0', //选项卡的className
			                closeable:0, //是否可以关闭 0false不可以|1true可以
			                render:function(originTab){ //选项卡的内容使用该方法返回值填充
			                },
			                click:function(e, tabData){ //选项卡单击触发
			                	var html = "";
	                            tab.content(html);
			                }
			            },
			            {
			                title:'工单异动',   //选项卡标题
			                className:'tab0', //选项卡的className
			                closeable:0, //是否可以关闭 0false不可以|1true可以
			                render:function(originTab){ //选项卡的内容使用该方法返回值填充
			                },
			                click:function(e, tabData){ //选项卡单击触发
			                	var html = "";
	                            tab.content(html);
			                }
			            },
			            {
			                title:'超时工单催办',   //选项卡标题
			                className:'tab0', //选项卡的className
			                closeable:0, //是否可以关闭 0false不可以|1true可以
			                render:function(originTab){ //选项卡的内容使用该方法返回值填充
			                },
			                click:function(e, tabData){ //选项卡单击触发
			                	var html = "";
	                            tab.content(html);
			                }
			            }
			        ]
			    }
			var tab = new Tab(tabConfig);
			
			// 选项卡效果设
			$('.t-tabs-items li').click(
					function() {
						var $t = $(this).index();
						$(this).addClass('active').siblings().removeClass(
								'active');
						$('.t-tabs-wrap li').eq($t).addClass('selected')
								.siblings().removeClass('selected');
					});
			
			return Init();
			// 最外层require
		})
