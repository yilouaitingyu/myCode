define(['Util','list','indexLoad','date',
        'text!module/workflow/acceptorder/historyWorkInfo.html'],   
        function(Util,List,IndexLoad,Date,Html_historyWorkInfo){
			var $el;
			var _index;
			var _options;				
		var initialize = function(index, options){
				$el = $(Html_historyWorkInfo);
				_index = index;
				_options=options;
				crossAPI.tips(options,3000);
				historyworkList.call(this,$el);
				this.content = $el;
		};
		var historyworkList=function(){
	        var callerNo = $("#aor_Basapltel").val();
	        crossAPI.tips(callerNo,3000);
	        if(!callerNo){
	        	return;
	        }
            var config = {
                el:$('.listContainer',$el),
                className:'listContainer',
                field:{
                    boxType:'checkbox',
                    key:'id',                           
                    items:[
                       
                        { 
                            text:'工单类别',
                            name:'WORKORDERTYPE',
                            className:'w120',                                
                        },
                        { text:'工单流水号',
                          name:'SERIALNO',click:function(e,item){
			        	    	 openDetails(item);
			        	     }                               
                        },
                        { text:'受理号码',name:'SUBSNUMBER' },
                        { text:'建单人',name:'ACCEPTSTAFFNAME'},
                        { text:'建单时间',name:'CREATETIME' },
                        { text:'紧急程度',name:'URGENTID' },
                        { text:'完成时间',name:'CREATETIME' },
                        { text:'操作状态',name:'OPERSTATUS' }
                    ],
//                 
                },
                page:{
                    customPages:[2,3,5,10,15,20,30,50],
                    perPage:10,
                    total:true,
                    align:'right'                    
                },
                data:{
                    url:'/ngwf_he/front/sh/workflow!execute?uid=batchWorkInfoQuery'
                }
            };
            console.log(subsnumber+"32");
            //按上面的配置创建新的列表
            var list1 = new List(config);
            //
            list1.search({
            	'callerNo':callerNo
            	
            });
            list1.on('success',function(result){
                console.log(result)
            });
            
            Util.ajax.getJson('/ngwf_he/front/sh/workflow!execute?uid=selectAgentOvertime', { staffId:'101' }, function(result, isOk){
            	console.log(result);
                //result 成功或失败后的数据
                //isOk 布尔值，接口是否正常返回值（仅与系统网络有关）
              })
		}
		var startdate=new Date({
			el:$('#startTime'),
            label:'',
            name:'startTime',    //开始日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
		var enddate=new Date({
			el:$('#endTime'),
            label:'',
            name:'endTime',    //结束日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
		 var openDetails = function (item){
		               CrossAPI.createTab(
									'工单详情',
									getBaseUrl()+'/ngwf_he/src/module/workflow/waitReadDetail/waitReadDetail.html',
									{"serialno":item.data.SERIALNO
									});
		
  }

	return initialize;
});