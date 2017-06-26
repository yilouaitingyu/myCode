
define( [ 'Util', 'list', 'indexLoad','date','selectTree','simpleTree','ajax'],
		function(Util, List,IndexLoad,MyDate,SelectTree,simpleTree,ajax) {
			var _index;
			var list;
			var ctiData;
			IndexLoad(function(IndexModule, options){
				_index = IndexModule;
				//事件初始化
				eventInit();
				var data = {
						
				};
				listSearch(data);
				date();
				staffid();
			 });
			var Tree = function(){
				ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypess',function(result){
			     	var zNode =result.beans;
			     	
			     	var setting = {  
			     			 view: {  
			                     selectedMulti: false        //禁止多点选中  
			                 },  
					        check: {  
					            enable: false//是否启用 复选框
					        },  
					        data: {  
					            simpleData: {  
					                enable: true ,
					                idKey: "id",  
				                    pIdKey: "pId",  
				                    rootPId: "" 
					            }  
					        },
					        callback: {  
				                onClick: function(treeId, treeNode) { 
				                    var treeObj = $.fn.zTree.getZTreeObj(treeNode); 
				                    var selectedNode = treeObj.getSelectedNodes()[0];
				                    if(selectedNode.id.length==7){
				                    	ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&srtypeId='+selectedNode.id+'',function(result){
					    			     	var Node =result.beans;
					    			     	var setting = {  
					   					        check: {  
					   					            enable: true  //是否启用 复选框  
					   					        },  
					   					        data: {  
					   					            simpleData: {  
					   					                enable: true 
					   					            } 
					   					        },
					   					     callback: {  
					   				            onCheck: zTreeOnCheck  
					   				        },  
					    			     	}
					    			     	function zTreeOnCheck(event, treeId, treeNode) {  
					    				          crossAPI.tips("aaa",1500);
					    				        };
					    			     	 var ztree=$.fn.zTree.init($("#txtIds"), setting, Node);
					    			     	 crossAPI.tips("123",1500);
					    			     	console.log(ztree.getNodes());
					                    });
				                    }
				                    1500     
				                },
				                
				            }  
					    };
			     	  
			     	 $.fn.zTree.init($("#treeDemo"), setting, zNode);
			     	 
			     });
			}
			var eventInit = function() {
				$('.btnSearch').on('click', search);
				$('.btnClear').on('click', clear);
				$("#listContainer").on("click",".serialnoId",contactMain);
				Tree();
				$('#collection').on('click', collection);
			};
			var collection=function(){
				//获取员工工号
				var staffId=_index.getUserInfo().staffId;
				//获取选中的服务请求类别编号
				
			}
			var clear = function(e) {
				$("input").val("");
				var date = new MyDate();
				date.setHours(0, 0, 0, 0);
				$('#startTime').val(date.format("yyyy-MM-dd hh:mm:ss"));
				date.setHours(23, 59, 59, 0);
				$('#endTime').val(date.format("yyyy-MM-dd hh:mm:ss"));
			}

			var search = function(e) {
				var data = Util.form.serialize($("form"));
				console.log(data);
				listSearch(data);
			}
			
			//创建《客户接触详情》选项卡
			var contactMain = function(e){
				var serialno = $(e.currentTarget).text();
				Util.ajax.postJson('/ngwf_he/front/sh/customerCon!execute?uid=customerCon002',{"serialno":serialno},function(data){
					_index.createTab({
						 title:'客户接触详情',
						 url:'/ngwf_he/src/html/customerCon/CustConDetail.html', 
						 closeable:true, //选项卡是否可以关闭，支持true|fal或者1|0  
						 width:90,//选项卡宽度，单位px
						 option:{
							 "custBean":data.bean
						 }
					 });
				});
			}
			
			var date = function(){
				//开始日期组件
				var config = new MyDate({
			        el:$('#startTime'),
			        label:'开始日期',
			        name:'startTime',    //开始日期文本框name
			        format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
			        defaultValue:laydate.now(0)+' 00:00:00', //默认日期值
			        min: laydate.now(0),      //最小日期限制
			        istime: true,
			        istoday: true,
			        choose:function(){} //用户选中日期时执行的回调函数
			    });
				
				//结束日期组件
			    var date1 = new MyDate( {
			        el:$('#endTime'),
			        label:'结束日期',
			        name:'endTime',    //开始日期文本框name
			        format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
			        defaultValue:laydate.now(0)+' 23:59:59', //默认日期值
			        min: laydate.now(0),         //最小日期限制
			        istime: true,
			        istoday: true,
			        choose:function(){} //用户选中日期时执行的回调函数
			    });
			    
			  //服务请求类别组件
			   var select =  new SelectTree({
			        el:$('#treeDemo'),
			        title:'服务请求选择',
			        label:'服务请求类别',
			        check:true,
			        async:true,
			        name:'requestType1',
			        url:'/ngwf_he/front/sh/serviceReq!execute?uid=acceptanceReques001&userId=2'
			    });
			}
			
			var staffid = function(){
				var staffId = _index.getUserInfo().staffId;
				$("#fm03").val(staffId);
			}
			
			var listSearch = function(data) {
				var config = { 
						el:$('#listContainer'),
				        field:{
				            boxType:'checkbox',
				            key:'id',
				            popupLayer:
				            {
				                width:800,
				                height:250
				            },
				            items:[
				                { text:'流水号',name:'serialno',render:function(item,val){
				                	val = '<a  class="serialnoId" >'+val+'</a>';
				                	return val;
				        		  }},
				                { text:'开始时间',name:'contactstarttime'},
				                { text:'接触时长',name:'contactduration' },
				                { text:'保持时长',name:'holdduration' },
				                { text:'受理号码',name:'subsnumber' },
				                { text:'主叫号码',name:'callerno' },
				                { text:'客户姓名',name:'custname' },
				                { text:'客户地市',name:'custcityid' },
				                { text:'用户级别',name:'subslevelid' },
				                { text:'挂机方',name:'staffhangup' },
				                { text:'满意度',name:'mediatypeId' },
				                { text:'二次回复',name:'' },
				                { text:'是否已质检',name:'qcflag' },
				                { text:'质检员',name:'evterid' },
				                { text:'接触编号',name:'contactid' },
				                { text:'员工账号',name:'staffid' },
				                { text:'员工地市',name:'staffcityid' },
				                { text:'被叫号码',name:'calledno' },
				                { text:'接触渠道',name:'contactchannelid' },
				                { text:'媒体类型',name:'mediatypeid' },
				                { text:'接触方式',name:'contactmodeid' },
				                { text:'语种',name:'languagetypeid' },
				                { text:'呼叫轨迹',name:'' },
				                { text:'是否已处理',name:'isprocessed' },
				                { text:'转接失败原因',name:'' },
				                { text:'备注',name:'remark' },
				                { text:'技能队列',name:'' }
				            ]
				        },
				        page:{
				            perPage:10,
				            align:'right'
				        },
				        data:{
				            url:'/ngwf_he/front/sh/contact!execute?uid=c001'
				        }}
				list = new List(config);
				list.search(data);
				var total;
				list.on("success",function(result){
					total=list.total;
					if(total == 0){
						var content='共'+total+'个查询结果';
						$('#total').html(content);
						return;
					}
					if(null != total && "" != total)
					{
						var content='共'+total+'个查询结果';
						$('#total').html(content);
					}
				})
			};
		});