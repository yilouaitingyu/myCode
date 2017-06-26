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
			var serviceCity = $('#ft_acceptArea').val(); 
			var handleParticipant = $('#ft_handleGroup').val(); 
			var data = {
					"fromParticipant":fromParticipant,
					"acceptCity":acceptCity,
					"businessType":businessType,
					"srTypeId":srTypeId,
					"serviceCity":serviceCity,
					"handleParticipant":handleParticipant
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
	    };	
		
		//增加自动派单页面
		var showInfo = function (){
			resetInfo();
			$('#popuplayer').addClass('show').removeClass('hide');
			$('#Set_addInfo').addClass('show').removeClass('hide');
			$('#Set_updateInfo').addClass('hide').removeClass('show');
			$('#select02').on('change',selectInfo);
			$('#select03').on('change',changesInfo);
		}
		var selectInfo = function (){
			var sel01 = $('#select02 option:selected').val();
			var opts;
			if (sel01=="0") {
				$('#select03').html("");
				opts ="<option  value='>'>"+"大于"+"</option>"+"<option  value='='>"+"等于"+"</option>"+"<option  value='<'>"+"小于"+"</option>"+"<option  value='-'>"+"区间"+"</option>";
				$('#select03').append(opts);
			}else if(sel01=="1"){
				$('#select03').html("");
				opts = "<option  value='='>"+"等于"+"</option>";
				$('#select03').append(opts);
				$('#changeInfo').addClass('hide').removeClass('show');
				$('#select07').addClass('hide').removeClass('show');
				$('#select04').addClass('show').removeClass('hide');
			}else if(sel01==""){
				$('#select03').html("");
				$('#select03').append("<option  value=''>"+"请选择"+"</option>");
			}
		}
		var changesInfo = function(){
			if($('#select03').val()=='-'){
				$('#select04').addClass('hide').removeClass('show');
				$('#select07').addClass('show').removeClass('hide');
				$('#changeInfo').addClass('show').removeClass('hide');
			}else{
				$('#changeInfo').addClass('hide').removeClass('show');
				$('#select07').addClass('hide').removeClass('show');
				$('#select04').addClass('show').removeClass('hide');
			}
		}
		//保存
		var addSetInfo = function (){
			var fromParticipant = $('#more_createPer').val();
			var fromParticipantName = $('#more_createPer').text();
			var fromNode = $('#more_fromnode').val();
			var fromNodeName = $('#more_fromnode').find("option:selected").text();
			var toNode = $('#more_directnode').val();
			var toNodeName = $('#more_directnode').find("option:selected").text();
			var acceptCity= $('#more_acceptCity').val();
			var businessType = $('#more_orderType').val();
			var srTypeId = $('#more_serviceclass').val();
			var serviceCity = $('#more_worklocal').val();
			var defaultParticipant = $('#more_telAbout').val();
			var templateId = _opt.seqprcTmpltId;
			var conditions;
			if($('#select03').val()=='-'){
				conditions = $('#select01').val()+"|"+$('#select02').val()+"|"+$('#select03').val()+"|"+$('#select07').val()+"-"+$('#select06').val();
			}else{
				conditions = $('#select01').val()+"|"+$('#select02').val()+"|"+$('#select03').val()+"|"+$('#select04').val();
			}
			var handleParticipant = $('#select05').val();
			var data = {
				"templateId":templateId,	
				"fromParticipant":fromParticipant,
				"fromParticipantName":fromParticipantName,
				"fromNode":fromNode,
				"fromNodeName":fromNodeName,
				"toNode":toNode,
				"toNodeName":toNodeName,
				"acceptCity":acceptCity,
				"businessType":businessType,
				"srTypeId":srTypeId,
				"serviceCity":serviceCity,
				"handleParticipant":handleParticipant,
				"defaultParticipant":defaultParticipant,
				"conditions":conditions
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
                            {text: '受理号码归属地', name: 'serviceCity'},
                            {text:'复核组',name:'defaultParticipant'},
                            {text:'处理组',name:'handleParticipant'},
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
			$('#select02').on('change',selectInfo);
			$('#popuplayer').addClass('show').removeClass('hide');
			$('#Set_addInfo').addClass('hide').removeClass('show');
			$('#Set_updateInfo').addClass('show').removeClass('hide');
			$('#more_createPer').val(item.fromParticipant);
			$('#more_directnode').val(item.toNode);
			$('#more_fromnode').val(item.fromNode);
			$('#more_acceptCity').val(item.acceptCity);
			$('#more_orderType').val(item.businessType);
			$('#more_serviceclass').val(item.srTypeId);
			$('#more_worklocal').val(item.serviceCity);
			$('#more_telAbout').val(item.defaultParticipant);
			var conditions = (item.conditions).split("|");
			$('#select01').val(conditions[0]);
			$('#select02').val(conditions[1]);
			$('#select03').val(conditions[2]);
			$('#select04').val(conditions[3]);
			$('#select05').val(item.handleParticipant);
			$('#more_dynId').val(item.dynId);
		}
		//保存修改
		var saveUpdateInfo = function (){
			var dynId = $('#more_dynId').val();
			var fromParticipant = $('#more_createPer').val();
			var toNode = $('#more_directnode').val();
			var fromNode = $('#more_fromnode').val();
			var acceptCity= $('#more_acceptCity').val();
			var businessType = $('#more_orderType').val();
			var srTypeId = $('#more_serviceclass').val();
			var serviceCity = $('#more_worklocal').val();
			var defaultParticipant = $('#more_telAbout').val();
			var conditions = $('#select01').val()+"|"+$('#select02').val()+"|"+$('#select03').val()+"|"+$('#select04').val();
			var handleParticipant = $('#select05').val();
			var data = {
				"dynId":dynId,
				"fromParticipant":fromParticipant,
				"toNode":toNode,
				"fromNode":fromNode,
				"acceptCity":acceptCity,
				"businessType":businessType,
				"srTypeId":srTypeId,
				"serviceCity":serviceCity,
				"handleParticipant":handleParticipant,
				"defaultParticipant":defaultParticipant,
				"conditions":conditions
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
			$('.resetInfo').val("");
		}
});
