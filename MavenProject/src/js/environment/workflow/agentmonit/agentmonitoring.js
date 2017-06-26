define(
		[ 'Util', 'date', 'list', 'select', 'dialog', 'crossAPI', 'jquery' ],
		function(Util, MyDate, List, Select, Dialog, CrossAPI, $) {
			//当前nodetype，待复核，待处理，待反馈
			var currentNodeType = "01";
			//当前操作人handlingstaff
			var currentUser="101";
			//是否代办页面
			var isWait="";
			var list;
			var state;
			 //获取登录人信息 
			var staffId;
			var staffName
		    crossAPI.getIndexInfo(function(info){
		    	staffId =info.userInfo.staffId;
				staffName=info.userInfo.staffName;		    	            	
            })
			var initialize = function() {
				dealtList();
				timeListContainer();
				readListContainer();
			};
			$(".orderDefer>a").click(
					function(e) {
						$(this).addClass('activeButton').siblings()
								.removeClass('activeButton');
						$("#orderNext select").val($(this).attr("id"));

						//
					});
			// 选项卡效果设
			$('.t-tabs-items li').click(
					function() {
						var $t = $(this).index();
						$(this).addClass('active').siblings().removeClass(
								'active');
						$('.t-tabs-wrap li').eq($t).addClass('selected')
								.siblings().removeClass('selected');
					});

			// 选择框 隐藏 显示按钮点击事件;

			$('.t-list-search-more').click(
					function() {
						if ($('.t-columns-group li').hasClass('hide')) {
							$('.t-columns-group li.hide').addClass('show')
									.removeClass('hide');
							$(this).children('i').addClass(
									'icon-iconfontjiantou-copy').removeClass(
									'icon-iconfontjiantou-copy-copy');
							$(".searchBtnRight").attr("id", "searchBtnRight");
						} else if ($('.t-columns-group li').hasClass('show')) {
							$('.t-columns-group li.show').addClass('hide')
									.removeClass('show');
							$(this).children('i').addClass(
									'icon-iconfontjiantou-copy-copy')
									.removeClass('icon-iconfontjiantou-copy');
							$(".searchBtnRight").removeAttr("id");
						}
					});

			

			
			// 时间设置结束
			// 列表详情开始 start
            var dealtList=function(){
            	var num = 0; // 复选框选择工单条数
    			var config = {
    				el : $('#dealtListContainer'),
    				className : 'dealtListContainer',
    				field : {
    					boxType : 'checkbox',
    					key : 'id',
    					popupLayer : {
    						text : "详情",
    						width : 800,
    						height : 500
    					},
    					items : [
    							{
    								text : '工单类别',
    								name : 'srtypeId',
    								render : function(item, val) {
    									if(val=='001'){
    										return "一级客服投诉";
    									}else if(val=='002'){
    										return "集团投诉";
    									}else if(val=='003'){
    										return "受理";
    									}else if(val=='004'){
    										return "咨询";
    									}else if(val=='005'){
    										return "建议";
    									}
    																											
    								}
    							},
    							{
    								text : '草稿',
    								name : 'draft'
    							},
    							{
    								text : '待复核',
    								name : 'treatment'
    								
    							},
    							{
    								text : '待处理',
    								name : 'review'
    								
    							},
    							{
    								text : '待反馈',
    								name : 'file'
    								
    							},
    							{
    								text : '待回访',
    								name : 'reply'
    								
    							}
    							],
    				},
    				page : {
    					customPages : [ 5, 10, 15, 20, 30, 50 ],
    					perPage : 10,
    					total : true,
    					align : 'right'
    					
    				},
    				data : {
    					url : '/ngwf_he/front/sh/workflow!execute?uid=selectAgentMatters',
    				}
    			};
    			// 按上面的配置创建新的列表
    			var list = new List(config);
    								
    			list.search({
    				'staffId' : staffId,
    				'staffName' : staffName
    			});
    			// 列表详情最 end
    			// 列表详情结束位置
            }
            
            var timeListContainer=function(){
            	var num = 0; // 复选框选择工单条数
    			var config = {
    				el : $('#timeListContainer'),
    				className : 'timeListContainer',
    				field : {
    					boxType : 'checkbox',
    					key : 'id',
    					popupLayer : {
    						text : "详情",
    						width : 800,
    						height : 500
    					},
    					items : [
    							{
    								text : '工单类别',
    								name : 'srtypeId',
    								render : function(item, val) {
    									if(val=='001'){
    										return "一级客服投诉";
    									}else if(val=='002'){
    										return "集团投诉";
    									}else if(val=='003'){
    										return "受理";
    									}else if(val=='004'){
    										return "咨询";
    									}else if(val=='005'){
    										return "建议";
    									}
    																											
    								}
    							},
    							{
    								text : '待复核',
    								name : 'treatment'
    								
    							},
    							{
    								text : '待处理',
    								name : 'review'
    								
    							},
    							{
    								text : '待反馈',
    								name : 'file'
    								
    							},
    							{
    								text : '待回访',
    								name : 'reply'
    								
    							}
    							],
    				},
    				page : {
    					customPages : [ 5, 10, 15, 20, 30, 50 ],
    					perPage : 10,
    					total : true,
    					align : 'right'
    					
    				},
    				data : {
    					url : '/ngwf_he/front/sh/workflow!execute?uid=selectAgentOvertime',
    				}
    			};
    			// 按上面的配置创建新的列表
    			var list = new List(config);
    								
    			list.search({
    				'staffId' : staffId,
    				'staffName' : staffName
    				//"state" : "30050002"
    			});
    			// 列表详情最 end
    			// 列表详情结束位置
            }
            
            var readListContainer=function(){
            	var num = 0; // 复选框选择工单条数
    			var config = {
    				el : $('#readListContainer'),
    				className : 'readListContainer',
    				field : {
    					boxType : 'checkbox',
    					key : 'id',
    					popupLayer : {
    						text : "详情",
    						width : 800,
    						height : 500
    					},
    					items : [
    							{
    								text : '工单类别',
    								name : 'srtypeId',
    								render : function(item, val) {
    									if(val=='001'){
    										return "一级客服投诉";
    									}else if(val=='002'){
    										return "集团投诉";
    									}else if(val=='003'){
    										return "受理";
    									}else if(val=='004'){
    										return "咨询";
    									}else if(val=='005'){
    										return "建议";
    									}
    																											
    								}
    							},
    							{
    								text : '待阅工单',
    								name : 'readCount',    								
    							
    							},
    							{
    								text : '待复核',
    								name : 'treatment'
    								
    							},
    							{
    								text : '待处理',
    								name : 'review'
    								
    							},
    							{
    								text : '待反馈',
    								name : 'file'
    								
    							},
    							{
    								text : '待回访',
    								name : 'reply'
    								
    							}
    							],
    				},
    				page : {
    					customPages : [ 5, 10, 15, 20, 30, 50 ],
    					perPage : 10,
    					total : true,
    					align : 'right'
    					
    				},
    				data : {
    					url : '/ngwf_he/front/sh/workflow!execute?uid=selectAgentReader',
    				}
    			};
    			// 按上面的配置创建新的列表
    			var list = new List(config);
    								
    			list.search({
    				'staffId' : staffId,
    				'staffName' : staffName
    				//"state" : "30050002"
    			});
    			// 列表详情最 end
    			// 列表详情结束位置
            }
									
			return initialize();
			// 最外层require
		})
