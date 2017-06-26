define(['Util','list','dialog','date','indexLoad'],   
	function(Util,List,Dialog,Date,IndexLoad){
		var list;
		var initialize = function(){
		    	eventInit();
		    	ctiList({});
		    	};		
		
		 var eventInit=function(){
			
			 $('#knowledge_Search').on('click',knowledgeInfo);
			 $('#knowledge_Reset').on('click',resetInfo);
			  };
		
		//字典
			var loadDictionary=function(mothedName,dicName,seleId){
						var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
						var seleOptions="";
						Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
							$.each(result.beans,function(index,bean){
								//品牌工单中保存的是品牌名{
								if("subsbrand"==seleId){
									seleOptions+="<option  value='"+bean.name+"'>"+bean.name+"</option>";
								}
									else
										seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"	
							});
							$('#'+seleId).append(seleOptions);
							console.log(seleOptions);
						},true);
					};
		 
		 //重置按钮
		 var resetInfo = function (){		 	
			 $("input[name='approvestaff']")[0].value='';
			 $("select[name='approveresult']")[0].value='';
			 $("input[name='starttime']")[0].value='';
			 $("input[name='endtime']")[0].value='';
			
		 };
		 //查询按钮事件
		 var knowledgeInfo = function (){
			 var approvestaff = $("input[name='approvestaff']")[0].value;
			 var approveresult = $("select[name='approveresult']")[0].value;
			 var starttime = $("input[name='starttime']")[0].value;
			 var endtime = $("input[name='endtime']")[0].value;
			 var data = {
					"approvestaff":approvestaff,
					"approveresult": approveresult,
					"starttime": starttime,
					"endtime": endtime
			 };
			 ctiList(data);
		 };
		 var startdate=new Date({
				el:$('#starttime'),
	            label:'',
	            name:'starttime',    //开始日期文本框name
	            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
	            defaultValue:'',     //默认日期值
				max : '2099-06-16 23:59:55',
	            istime: true,    
	            istoday: false,
	            choose:function(){
	            }
			});
			var enddate=new Date({
				el:$('#endtime'),
	            label:'',
	            name:'endtime',    //结束日期文本框name
	            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
	            defaultValue:'',     //默认日期值
				max : '2099-06-16 23:59:55',
	            istime: true,    
	            istoday: false,
	            choose:function(){
	            }
			});
		 var num = 0; // 复选框选择工单条数
		//加载历史预警信息列表
			var ctiList = function(data){
				var config = {
						el:$('#historylist'),
					    field:{ 
							boxType : 'checkbox',
					        key:'id',         		        	
					        items: [{text: '工单知识编号',name:'colukngid'},		                       
		                            {text: '建单时间', name: 'accepttime',sorting: 1},
		                            {text: '建单人', name: 'acceptstaffno'},
		                            {text: '审批时间', name: 'approvetime'},
		                            {text: '审核人', name: 'approvestaff'},
		                            {text: '审核结果', name: 'approveresult'}
		                    ]
					        
					    },
					    page:{
					        perPage:10,    
					        align:'right' ,
					        total : true,
					        button : {
								className : 'operateButtons',
								items : [
										{
											text : "已选择0条工单",
											name : '',
											click : function(e) {
												
											}
										},
										{
											text : '导出',
											name : '',
											click : function(e) {
												// 导出
												var datas = list.getCheckedRows();
												if (datas.length == 0) {
													crossAPI.tips("请至少选择一条信息!",3000);
													return;
												}//
												var params ="1";
											}
										}
										 ]
							}
					    },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=knowledgelog001'
					    }
					}
				var list = new List(config);
				list.search(data);
				//全选 统计条数；
				$(' th input[type=checkbox]',$el).on('click',function(e){
		            var checkedAll = $(e.currentTarget).prop(':checked');
		            if(checkedAll){
		            	$(".btnCustom0").val("已选择" + list.total + "条工单");
		            	num =list.total;
		            }
		            else{
		            	$(".btnCustom0").val("已选择0条工单");
		            	num=0;
		            }
		            	
		        });
				//创建节点放在受理后面
				list.on('checkboxChange', function(e, item, checkedStatus) {// 事件处理代码
					if (checkedStatus == 1) {
						num++
						$(".btnCustom0").val("已选择" + num + "条工单")
					} else {
						num--
						$(".btnCustom0").val("已选择" + num + "条工单")
					}
				})
			}
			return initialize();
});