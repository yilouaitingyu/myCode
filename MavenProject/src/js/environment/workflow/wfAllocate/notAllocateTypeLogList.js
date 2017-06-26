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
	                    	boxType:'radio',
	                    	key:'ID',
	                        items:[
	                            { 
	                                text:'服务请求类别',
	                                name:'SRV_REQST_TYPE_ID'
	                            },
	                            { 
	                                text:'操作时间',
	                                name:'OP_TIME'
	                            },
	                            { 
	                            	text:'操作人员名称',
	                            	name:'OP_STAFF_NAME'
	                            },
	                            { 
	                            	text:'操作状态',
	                            	name:'ACTION_TYPE_CD',
                            		render : function(item, val) {
										if (val == "save") {
											return "<div class='t-tag-done'>新增</div>";
										} else if(val == "delete"){
											return "<div class='t-tag-todo'>删除</div>"
	                            		} else{
	                            			return "<div class='t-tag-todo'>修改</div>"
	                            		}
									}
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
	                        url:'/ngwf_he/front/sh/workflow!execute?uid=queryNotAllocateTypeLogList'
	                    }
	                };
	            list = new List(listConfig);
	            list.search({});
			};
			
            
            //定义按钮
            var defineBtns=function(){
            	 //查询
                $("#searchButton").click(function(){
           	     	var op_staff_id=$("#op_staff_id").val();
           	     	var srv_reqst_type_id=$("#srv_reqst_type_id").val();
	           	     list.search({
	           	    	'op_staff_id' : op_staff_id,
	           	    	'srv_reqst_type_id' : srv_reqst_type_id
	           	    })
                });
                //重置
                 $("#resetButton").click(function(){
               	  	$("#srv_reqst_type_id").val("");
               	  	$("#op_staff_id").val("");
                 });
                 
            }
			
			return initialize();
});





