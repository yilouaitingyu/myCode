define(['Util','list','date','timer','select',
        'text!module/workflow/oneservicecomplain/one_operateInfo.html',
        'style!css/workflow/oneservicecompain/one_operateInfo.css'],   
	function(Util,List,Date,Timer,Select,Html_operateInfo){
		
		var $el;
		var _index;
		var _options;
		var initialize = function(index, options){
			$el = $(Html_operateInfo);
			_index = index;
			_options=options;
			orderChangeList.call(this,$el);
		    yijiList.call(this,$el);
		    yijiQuality.call(this,$el);
		    this.content = $el;
		};		

		var orderChangeList=function(data){
		 	var params = {serialno:"123456"};
		Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=orderEvaluate001',params,function(result){
			$.each(result.beans,function(index,bean){
				if (bean.segmenttype=="01") {
					$('#Ord_satisfy',$el).html(bean.appraise);
					$('#Job_number',$el).html("123");
					$('#Remarks',$el).html(bean.remark);
					$('#Dissatisfied_a',$el).html(bean.reason1);
					$('#Dissatisfied_b',$el).html(bean.reason2);
				}
				if (bean.segmenttype=="02") {
					$('#Non_single',$el).html(bean.appraise);
					$('#Non_remarks',$el).html(bean.remark);
					$('#Non_dissatisfieda',$el).html(bean.reason1);
					$('#Non_dissatisfiedb',$el).html(bean.reason2);
				}
				if (bean.segmenttype=="03") {
					$('#Treatment_link',$el).html(bean.appraise);
					$('#Evaluation_remarks',$el).html(bean.remark);
					$('#Dissatisfied_c',$el).html(bean.reason1);
					$('#Dissatisfied_d',$el).html(bean.reason2);
					$('#Evaluation_department',$el).html(bean.appraisedept);
					$('#Be_evaluated',$el).html(bean.beappraisedept);
				}
			});
		},true);
	};
//		加载列表
	var yijiList = function(){
		var i = 1;
		var config = {
				el:$('#tabfor_Move',$el),
			    field:{ 
			        key:'id',         		        	
			        items: [{text: '序号',name:'num', render:function(item,val){ 
			        	//重写列表展示
                        if(val==null){
                        	return i++;
                        }
                    }},		                       
                            {text: '字段名称', name: 'fieldName'},
                            {text:'新值',name:'newField'},
                            {text:'原有值',name:'oldField'},
                            {text: '修改人', name: 'recoder'},
                            {text:'修改时间',name:'changeTime'}
                    ]
			    },
			    page:{
			    	customPages:[2,3,5,10,15,20,30,50],
                    perPage:2,
                    total:true,
                    align:'right'
			    },
			    data:{
			        url:'/ngwf_he/front/sh/workflow!execute?uid=operate001&serviceid="123456"'
			    }
			}
		console.log("3333333")
		var list2 = new List(config);
		list2.search({});
	};
	
	
	var yijiQuality = function(){
		var i =1;
		var config = {
				el:$('#tabfor_quality',$el),
			    field:{ 
			        key:'id',         		        	
			        items: [{text: '序号',name:'num', render:function(item,val){ 
			        	//重写列表展示
                        if(val==null){
                        	return i++;
                        }
                    }},		                       
                            {text: '抽取时间', name: 'wf_create'},
                            {text:'是否致命性错误',name:'isdeadly'},
                            {text:'被考评人',name:'staffid'},
                            {text: '得分', name: 'score'},
                            {text:'评语结果',name:'remark'}
                    ]
			        
			    },
			    page:{
			    	 customPages:[2,3,5,10,15,20,30,50],
	                    perPage:2,
	                    total:true,
	                    align:'right'  
			    },
			    data:{
			        url:'/ngwf_he/front/sh/workflow!execute?uid=orderQuality001&serialno="123456"'
			    }
			}
		var list1 = new List(config);
		list1.search({});
	}

return initialize;
});