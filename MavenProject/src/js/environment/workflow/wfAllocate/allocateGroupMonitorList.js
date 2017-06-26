define(
		[ 'Util','date', "list", 'select','dialog','selectTree','jquery' ],
		function(Util,MyDate, List,Select,Dialog,SelectTree,$) {
			
			var list;//表格对象
			var pageArr = [2,10,15,20,30,50];
			//所有方法入口处
			var initialize = function() {
				//配置grid
				defineList();
				aorTimerind();
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
	                                text:'组名（工作组）',
	                                name:'CURRENT_LINK_GROUP'
	                            },
	                            { 
	                                text:'待处理量',
	                                name:'HANDLINGNUM'
	                            },
	                            { 
	                            	text:'正在处理量',
	                            	name:'HANDLEDNUM'
	                            },
	                            { 
	                            	text:'合计',
	                            	name:'TOTALNUM'
	                            }
	                        ]
	                    },
	                    page:{
	                        customPages:pageArr,
	                        perPage:10,
	                        total:true,
	                        align:'right'
	                    }, 
	                    data:{
	                        url:'/ngwf_he/front/sh/workflow!execute?uid=queryAllocateGroupMonitorList'
	                    }
	                };
	            list = new List(listConfig);
	            list.search({});
	            list.on('success', function(result) {
					//解决条数选择框下面数字重复的问题
					var index =$.inArray(($(".selectPerPage").val()-0),pageArr);
					$(".selectPerPage option").eq(index+1).remove();
				});

			};
			
//			倒计时功能
			var aorTimerind = function(){
				var timer=$('#aor_timerind').html();
				var time=timer.split(":");
				var aorHour=time[0];
				var aorMinu=time[1];
				
				var mytimer=setInterval(function(){
					if(aorMinu=="00"){
						aorMinu=60;
						aorHour--;
					}
					aorMinu--;
					if(aorMinu<10){
						var aorMinua="0"+aorMinu;
					}else{
						var aorMinua=aorMinu;
					}
					if(aorHour<10){
						var aorHoura="0"+aorHour;
					}else{
						var aorHoura=aorHour;
					}
					if(aorHoura=="00"&&aorMinua=="00"){
						 list.search({});
						 aorHoura="02";
						 aorMinua="00";
					}
					$('#aor_timerind').html(aorHoura+":"+aorMinua);
				},1000)
				
			};
			
            
            //定义按钮
            var defineBtns=function(){
            	 //查询
                $("#searchButton").click(function(){
           	     	var dsps_work_grp_id=$("#dsps_work_grp_id").val();
	           	     list.search({
	           	    	'dsps_work_grp_id' : dsps_work_grp_id
	           	    })
                });
                //重置
                 $("#resetButton").click(function(){
               	  	$("#dsps_work_grp_id").val("");
                 });
                 
            }
			
			return initialize();
});





