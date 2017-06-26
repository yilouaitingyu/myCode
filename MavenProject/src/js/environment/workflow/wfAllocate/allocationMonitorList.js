define(
		[ 'Util','date', "list", 'select','dialog','selectTree','jquery' ],
		function(Util,MyDate, List,Select,Dialog,SelectTree,$) {
			
			var list;//表格对象
			var pageArr=[2,10,15,20,30,50];
			//所有方法入口处
			var initialize = function() {
				//配置grid
				defineList();
				//配置"查询","重置","保存"等按钮
				defineBtns();
			};
			
			//配置grid
			var defineList=function(){
				var listConfig = {
	                    el:$('#listContainer'),
	                    className:'listContainer',
	                    field:{
	                    	boxType:'radio',
	                    	key:'ID',
	                        items:[
	                            { 
	                                text:'登录工号',
	                                name:'STAFF_ID'
	                            },
	                            { 
	                            	text:'用户全名',
	                            	name:'STAFF_NM'
	                            },
	                            { 
	                            	text:'用户状态',
	                            	name:'STATUS'
	                            },
	                            { 
	                            	text:'当前处理数',
	                            	name:'PRST_DSPS_CNT'
	                            },
	                            { 
	                            	text:'分单总数',
	                            	name:'ALLCT_SHET_TOTAL_CNT'
	                            },
	                            { 
	                            	text:'分单日期',
	                            	name:'ALLCT_SHET_DATE'
	                            },
	                            { 
	                            	text:'未分单次数',
	                            	name:'NOTALLOCATETIMES'
	                            },
	                            { 
	                            	text:'示忙时间',
	                            	name:'NOTALLOCATESTARTTIME'
	                            },
	                            { 
	                            	text:'单次分单值',
	                            	name:'signlenum'
	                            },
	                            { 
	                            	text:'持有工单上限',
	                            	name:'signlemax'
	                            },
	                            { 
	                            	text:'启用/停用',
	                            	name:'PRSN_STS_CD',
	                            	render : function(item, val) {
										if (val == "1") {
											return "<div class='t-tag-done'>启用</div>";
										} else {
											return "<div class='t-tag-todo'>停用</div>"
										}
									}
	                            }
	                        ]
	                    },
	                    page:{
	                        customPages: pageArr,
	                        perPage:10,
	                        total:true,
	                        align:'right'
	                    },
	                    data:{
	                        url:'/ngwf_he/front/sh/workflow!execute?uid=queryAllocationMonitorList'
	                    }
	                };
	            list = new List(listConfig);
	            list.on('success', function(result) {
					//解决条数选择框下面数字重复的问题
					var index =$.inArray(($(".selectPerPage").val()-0),pageArr);
					$(".selectPerPage option").eq(index+1).remove();
					//解决切换条数和点击上下页 已选择条数不置0,复选框不清除已选择的问题;
					$(".checkAllWraper>input").prop("checked",false);
					// 下面这个有些页面不需要 
					$(".allChecked").prop("checked",false);
					$(".btnCustom0").prop("disabled",true);
				});
	            list.search({});
			};
			
            
            //定义按钮
            var defineBtns=function(){
            	 //查询
                $("#searchButton").click(function(){
           	     	var staff_id=$("#staff_id").val();
           	     	var staff_nm=$("#staff_nm").val();
	           	     list.search({
	           	    	'staff_id' : staff_id,
	           	    	'staff_nm' : staff_nm
	           	    })
                });
                //重置
                 $("#resetButton").click(function(){
               	  	$("#staff_nm").val("");
               	  	$("#staff_id").val("");
                 });
                 
            }
			
			return initialize();
});





