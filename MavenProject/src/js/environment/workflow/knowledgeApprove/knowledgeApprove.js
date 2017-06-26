define(['Util','list','date','crossAPI'],   
	function(Util,list,Date,CrossAPI){
		var list;
		var initialize = function(){
		    	eventInit();
				dateInit();
				knowList({});
		};		
		
		 var eventInit=function(){
			 $('#know_checkout').on('click',knowCheckout);//查询
			 $('#kunow_reset').on('click',kunowReset);//重置
		 };
		 
		 //重置按钮
		 var kunowReset = function (){
			 $("#accepttimeStart").val('');
			 $("#accepttimeEnd").val('');
			 $("#acceptStaffno").val('');
			 $("#approver").val('');
			 $("#coluKngCategory").val('');
			 $("#state").val('');
		 };
		 
		 //查询按钮事件
		 var knowCheckout = function (){
			 var data={
					 "accepttimeStart":$("#accepttimeStart input[name='accepttimeStart']").val(),
					 "accepttimeEnd":$("#accepttimeEnd input[name='accepttimeEnd']").val(),
					 "acceptStaffno":$("#acceptStaffno").val(),
					 "approver":$("#approver").val(),
					 "coluKngCategory":$("#coluKngCategory").val(),
					 "state":$("#state").val()
			 }
			 knowList(data);
		 };
		
		 
		var date=new Date({
			el:$('#accepttimeStart'),
            label:'建单时间开始',
            name:'accepttimeStart',    //开始日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
		var enddate=new Date({
			el:$('#accepttimeEnd'),
            label:'建单时间结束',
            name:'accepttimeEnd',    //结束日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
		var dateInit = function(){
			loadDictionary('staticDictionary_get','HEBEI.KNOWLEDGE.STATE','state');//知识状态
			loadDictionary('staticDictionary_get','HEBEI.KNOWLEDGE.COLUKNGCATEGORY','coluKngCategory');//知识分类
		};
		
//      动态获取下拉框
		//queryStaticDatadictRest
			var loadDictionary=function(mothedName,dicName,seleId){
				var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
				var seleOptions="";
				// 
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
					$.each(result.beans,function(index,bean){
						seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
					});
					$('#'+seleId).append(seleOptions);
					console.log(seleOptions);
				},true);
			};
		
		//加载知识已审批列表
			var knowList = function(data){
				var config = {
						el:$('#knowledgeListCon'),
					    field:{ 
					        key:'serialno',         		        	
					        items: [{text: '关联投诉工单',name:'serialno'},		                       
		                            {text: '建单时间', name: 'accepttime'},
		                            {text:'建单人',name:'acceptstaffno'},
		                            {text:'知识分类',name:'colukngcategory'},
		                            {text: '状态', name: 'state'}
		                    ]
					        
					    },
					    page:{
					        perPage:10,    
					        align:'right'  
					    },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=queryExaminedKnowledge'
					    }
					}
				this.list = new list(config);
				this.list.search(data);
				this.list.on('rowClick',function(e,item){//行单击事件
					
						CrossAPI.createTab(
							'知识详情',
							'http://localhost:8080/ngwf_he/src/module/workflow/knowledgeDetails/knowledgeDetails.html',
							{
								"serialno":item.serialno,
								"state":item.state
						});
				});
			}

			return initialize();
});