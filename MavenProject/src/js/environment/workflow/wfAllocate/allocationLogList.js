define(
		[ 'Util','date', "list", 'select','dialog','selectTree','jquery' ],
		function(Util,MyDate, List,Select,Dialog,SelectTree,$) {
			
			var list;//表格对象
			
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
	                    	boxType:'checkbox',
	                    	key:'WORK_GRP_ID',
	                        items:[
	                            { 
	                                text:'工作组ID',
	                                name:'WORK_GRP_ID'
	                            },
	                            { 
	                                text:'工作组名称',
	                                name:'WORK_GRP_NM'
	                            },
	                            { 
	                            	text:'分单总数',
	                            	name:'ALLCT_SHET_TOTAL_CNT'
	                            }
	                        ]
	                    },
	                    page:{
	                        customPages:[2,10,15,20,30,50],
	                        perPage:10,
	                        total:true,
	                        align:'right'
	                    },
	                    data:{
	                        url:'/ngwf_he/front/sh/workflow!execute?uid=queryAllocationMonitorList'
	                    }
	                };
	            list = new List(listConfig);
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





