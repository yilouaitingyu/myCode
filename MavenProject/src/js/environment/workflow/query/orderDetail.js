define(['Util','list','date','detailPanel','timer','select','selectTree','dialog','indexLoad','tab',
        'text!module/workflow/outlayer/dealreturn.html'],   
	function(Util,list,Date,DetailPanel,Timer,Select,SelectTree,Dialog,IndexLoad,Tab,dealreturn){
		var list;
		var $el;
		var processinfo;
		var workItem;
		var _index;
		var _options;
      
//		加载列表
		var fafList = function(data){
			var config = {
					el:$('#faf_impList'),
				    field:{ 
				        key:'id',         		        	
				        items: [
				                {text: '开始时间',name:'operatetime',
                        	       render : function(item, val) {
                        		        return val.substring(0,val.length-2);
                                   }
                                },		                       
	                            {text: '受理时间', name: 'operatetime',
                        	        render : function(item, val) {
                        		          return val.substring(0,val.length-2);
                                    }
                                },
	                            {text:'执行人',name:'operatorName'},
	                            {text:'动作',name:'operatetype',
	                            	render : function(item, val) {
	                            		return getActionName("HEBEI.ORDER.OPERATE.TYPE",val);//从数据字典中获取动作名称
                                  }
	                            },
	                            //{text: '负责组/人', name: 'operator'},
	                            {text:'完成时间',name:'operatetime',
	                            	render : function(item, val) {
	                            		return val.substring(0,val.length-2);
	                                }
	                            },
	                            {text:'操作内容',name:'description',
	                            	render:function(item, val){
                            		return '<p style="width:300px;white-space:normal;word-break:break-all;">'+val+'</p>';
                            	}}
	                    ]
				        
				    },
				    page:{
				    	customPages:[5,10,15,20,30,50],
				        perPage:5,    
				        align:'right',
				        total:true
				    },
				    data:{
				        url:'/ngwf_he/front/sh/workflow!execute?uid=detailData002&processinstanceid='+_options.serialno
				    }
				}
			this.list = new list(config);
			this.list.search({});
		};
		//查询数据字典，根据value获取中文name值；
		var getActionName = function(typeId,value){
			 var actionName;
			 var params = {
		                method: 'staticDictionary_get',
		                paramDatas: '{typeId:"'+typeId+'"}'
            };
            // 
            Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF', params, function(result) {
                $.each(result.beans, function(index, bean) {
                    if(bean.value == value){
                    	actionName = bean.name;
                    	return false;
                    }
                });   
            },
            true);
            return actionName;
		};
		IndexLoad(function(indexModule, options) {
			_index=indexModule;
			_options=options;
			//获取登录人信息 放到_options里边
		    crossAPI.getIndexInfo(function(info){
		    	_options.loginStaffId=info.userInfo.staffId;
		    	_options.loginStaffName=info.userInfo.staffName;
		    	_options.userInfo = info.userInfo;
            })
			var data = {
		    		"serialno":	options.serialno,
		    };
		    Util.ajax.postJson(
		 		  '/ngwf_he/front/sh/workflow!execute?uid=detailData001',
		 			data, function(json, status) {
		 		//初始化基本信息
		 		processinfo=json.beans[0];
		 		_options.processinfo = processinfo;
				_options.serviceId = processinfo.srvReqstId;
				console.log(_options);
				$("#bizCntt").value=_options.processinfo.bizCntt;
				var params1={"wrkfmShowSwftno":options.serialno};
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=supplementComplant002',params1,function(result){
					var cont=result.beans[0].supplementComplant ;
					$("#adtnlCmplntsDesc").value=cont;
					},true);

				
		 	  });
		    
		    fafList();
		});	
});