define(['Util','list','date','indexLoad','js/workflow/commonTip/commonTip'],   
	function(Util,List,Date,IndexLoad,commonTip){
		var list;
		var _opt;
		var  commonTip = new commonTip();
		IndexLoad (function(index,options){
			_opt = options;
			moreworkList({});
			dictionaryInit();
			selectInfo1();
			eventInit();
		       
		});	
		var eventInit = function(){
			$('#Set_addInfo').on('click',addSetInfo);
			$('#Set_updateInfo').on('click',saveUpdateInfo);
			$('#Set_btn01').on('click',showInfo);
			$('#ft_query').on('click',queryTerm);
			
		}
		
		//按条件查询
		var queryTerm = function (){
			var fromParticipant = $('#ft_createPer').val(); 
			var acceptCity = $('#ft_acceptCity').val(); 
			var businessType = $('#ft_orderType').val(); 
			var srTypeId = $('#ft_requestType').val(); 
			var dynachar1 = $('#ft_createMethod').val(); 
			var dynachar2 = $('#ft_priority').val(); 
			var data = {
					"fromParticipant":fromParticipant,
					"acceptCity":acceptCity,
					"businessType":businessType,
					"srtypeId":srTypeId,
					"dynachar1":dynachar1,
					"dynachar2":dynachar2
			}
					moreworkList(data);
		}
		
		//目的节点下拉框
		var selectInfo1 = function(){
			var params = {"seqprcTmpltId":_opt.seqprcTmpltId};
			var seleOptions="";
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=ft001',params,function(result){
				$.each(result.beans,function(index,bean){
					seleOptions+="<option  value='"+bean.node_id+"'>"+bean.node_nm+"</option>"
				});
				$('#more_directnode').append(seleOptions);
				$('#more_fromnode').append(seleOptions);
			},true);
		}
		
		//下拉框加载数据字典方法
	    var loadDictionary=function(mothedName,dicName,seleId){
					var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
					var seleOptions="";
					Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
						$.each(result.beans,function(index,bean){
							seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
						});
						$('#'+seleId).append(seleOptions);
					},true);
	    };
	    
	    var dictionaryInit = function()
	    {
	    	loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','more_acceptCity');//受理地市
	    	loadDictionary('staticDictionary_get','HEBEI.ORDER.TYPE','more_orderType');//工单类别
	    	loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','ft_acceptCity');//受理地市
	    	loadDictionary('staticDictionary_get','HEBEI.ORDER.TYPE','ft_orderType');//工单类别
	    	loadDictionary('staticDictionary_get','HEBEI.COMPLAIN.METHOD','ft_createMethod');//建单渠道
	    	loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','ft_priority');//建单渠道
	    	loadDictionary('staticDictionary_get','HEBEI.COMPLAIN.METHOD','more_createMethod');//建单渠道
	    	loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','more_urgency');//建单渠道
	    };	
		
		//增加其他指向派单页面
		var showInfo = function (){
			resetInfo();
			$('#popuplayer').addClass('show').removeClass('hide');
			$('#Set_addInfo').addClass('show').removeClass('hide');
			$('#Set_updateInfo').addClass('hide').removeClass('show');
		}
		//保存
		var addSetInfo = function (){
			var fromParticipant = $('#more_createPer').val();
			var fromNode = $('#more_fromnode').val();
			var toNode = $('#more_directnode').val();
			var acceptCity= $('#more_acceptCity').val();
			var businessType = $('#more_orderType').val();
			var srTypeId = $('#more_serviceclass').val();
			var dynachar1 = $('#more_createMethod').val();
			var dynachar2 = $('#more_urgency').val();
			var dynachar3 = $('#more_complainArea').val();
			var handleParticipant = $('#more_handleGroup').val();
			var priority = $('#more_priority').val();
			var data = {
				"fromParticipant":fromParticipant,
				"fromNode":fromNode,
				"toNode":toNode,
				"acceptCity":acceptCity,
				"businessType":businessType,
				"srTypeId":srTypeId,
				"dynachar1":dynachar1,
				"dynachar2":dynachar2,
				"dynachar3":dynachar3,
				"handleParticipant":handleParticipant,
				"priority":priority
			}
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=set002',data,function(result){
				$('#popuplayer').addClass('hide').removeClass('show');
				if(result.returnCode=="0"){
					commonTip.text({text:"添加成功！"});
				}else{
					commonTip.text({text:"添加失败！"});
				}
				resetInfo();
				moreworkList({});
			},true);
		}
		//列表展示
		var moreworkList = function(data){
		var config = {
				el:$('#moreworkList'),
			    field:{ 
			        key:'id',         		        	
			        items: [
			                {text:'动态配置关系编号',name:'dynId',className:'hide'},
			                {text:'源节点',name:'fromNode',className:'hide'},
			                {text:'目的节点',name:'toNode',className:'hide'},
			                {text: '服务请求类别',name:'srTypeId'},		                       
                            {text: '建单人单位', name: 'fromParticipant'},
                            {text:'工单类型',name:'businessType'},
                            {text:'受理地市',name:'acceptCity'},
                            {text: '建单渠道', name: 'dynachar1'},
                            {text:'紧急程度',name:'dynachar2'},
                            {text:'投诉归属地',name:'dynachar3',className:'hide'},
                            {text:'处理组',name:'handleParticipant'},
                            {text:'优先级',name:'priority',className:'hide'},
                            {text:'操作',name:'operation',render:function(item,val){ 
		                        if(val==null){
		                        	return '<a class="btn btn-blue" id="">删除</a> ';
		                        } 
							},click : function(e, item) { // 按钮点击时处理函数
								var dynId = item.data.dynId;
								var data ={"dynId":dynId};
								Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=set003',data,function(result){
									commonTip.text({text:"删除成功！"});
								},true);
								moreworkList({});
									}
                            }
                    ]
			    },
			    page:{
			        perPage:10,    
			        align:'right'  
			    },
			    data:{
			        url:'/ngwf_he/front/sh/workflow!execute?uid=set001'
			    }
			}
		list = new List(config);
		list.search(data);
		//修改
		list.on('rowClick',function(e,item){
			secondShowInfo(item);
		});
	}
		//回显
		var secondShowInfo = function (item){
			resetInfo();
			$('#popuplayer').addClass('show').removeClass('hide');
			$('#Set_addInfo').addClass('hide').removeClass('show');
			$('#Set_updateInfo').addClass('show').removeClass('hide');
			$('#more_createPer').val(item.fromParticipant);
			$('#more_directnode').val(item.toNode);
			$('#more_fromnode').val(item.fromNode);
			$('#more_acceptCity').val(item.acceptCity);
			$('#more_orderType').val(item.businessType);
			$('#more_serviceclass').val(item.srTypeId);
			$('#more_createMethod').val(item.dynachar1);
			$('#more_urgency').val(item.dynachar2);
			$('#more_complainArea').val(item.dynachar3);
			$('#more_handleGroup').val(item.handleParticipant);
			$('#more_priority').val(item.priority);
			$('#more_dynId').val(item.dynId);
		}
		//保存修改
		var saveUpdateInfo = function (){
			var fromParticipant = $('#more_createPer').val();
			var toNode = $('#more_directnode').val();
			var fromNode = $('#more_fromnode').val();
			var acceptCity = $('#more_acceptCity').val();
			var businessType = $('#more_orderType').val();
			var srTypeId = $('#more_serviceclass').val();
			var dynachar1 = $('#more_createMethod').val();
			var dynachar2 = $('#more_urgency').val();
			var dynachar3 = $('#more_complainArea').val();
			var handleParticipant = $('#more_handleGroup').val();
			var priority = $('#more_priority').val();
			var dynId = $('#more_dynId').val();
			var data = {
				"dynId":dynId,
				"fromParticipant":fromParticipant,
				"toNode":toNode,
				"fromNode":fromNode,
				"acceptCity":acceptCity,
				"businessType":businessType,
				"srTypeId":srTypeId,
				"dynachar1":dynachar1,
				"dynachar2":dynachar2,
				"dynachar3":dynachar3,
				"handleParticipant":handleParticipant,
				"priority":priority
			}
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=set004',data,function(result){
				if(result.returnCode=="0"){
					commonTip.text({text:"修改成功！"});
					resetInfo();
					$('#popuplayer').addClass('hide').removeClass('show');
					moreworkList({});
				}else{
					commonTip.text({text:"修改失败！"});
				}
			},true);
		}
		
		//清空
		var resetInfo = function (){
			$('.resetInfo').val('');
		}
		
});

