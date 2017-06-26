define(function(require){
	require(['Util', 'list' ,'ajax','form','dialog','validator','zTree','tab','indexLoad','date'],
				function(Util, List ,ajax, Form, Dialog,Validator,zTree,Tab,IndexLoad,MyDate){
					var _index;
			var list;
			var ctiData;
			var resultBean;
			var start;
			var end;
			var eventInit = function() {
				$('#chaxun').on('click', search);
				$('#chongzhi').on('click', clear);
				$("#biaodan").on("click",".remark",contactMain);
				$("#biaodan").on("click",".serveicId",selectadd);
				$("#biaodan").on("click",".handlingstaffno",staffno);
				$('#daochu').on('click', showDialog);
				$('#reproducing').on('click', reproducing);
				
			};
			var reproducing=function(){
				crossAPI.tips("功能不做",1500);
			}
			
			//服务请求详情
			var selectadd=function(e){
				var numberId = $(e.currentTarget).text();
				Util.ajax.postJson('/ngwf_he/front/sh/serviceReqDetail!execute?uid=selectNumber',{"numberId":numberId},function(data){
					if(data.beans.length>0){
						_index.destroyTab('服务请求详情');
						_index.createTab({
							title:'服务请求详情',
							url:''+getBaseUrl() + '/ngwf_he/src/html/serviceReq/serviceDetail.html', 
							closeable:true, //选项卡是否可以关闭，支持true|fal或者1|0  addNumber
							width:90,//选项卡宽度，单位px
							option:{
								"custBean":data.beans
							}
						});
					}else{
						crossAPI.tips("抱歉,该服务请求已经不存在！",1500);
					}
				});
			}
			
			//加载数据字典(无默认值)
			var dictionaryNoDefault =  function(mythod,typeId,selId){
				var params = {method:mythod,paramDatas:'{typeId:"'+typeId+'"}'};
				var optionDic = "<option value=''>请选择</option>";
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getDic01',params,function(result){
					resultBean=result.beans;
					$.each(result.beans,function(index,bean){
						optionDic += "<option value='"+bean.value+"'>"+bean.name+"</option>";
					});
					$("#"+selId).append(optionDic);
					
				},true);
			};
			
			 var showDialog = function(){
				 _index.showDialog({
			            id:'daochu',
			            title:'选择需要展示的字段',   //弹出窗标题
			            // url:'js/example/city',    //要加载的模块
			            url:'module/example/example.html',    //要加载的模块
			            param:'test param.',    //要传递的参数，可以是json对象，也可以传递方法{ name:'zhangsan', 
			            width:800,  //对话框宽度
			            height:400  //对话框高度
			        });
			    }
			
			
			var clear = function(e) {
				$("input").val("");
				$("#handlingmode").val('');
				var date = new Date();
				/*date.setHours(0, 0, 0, 0);
				date.setDay(01);*/
				$('input[name=startTime]').val(laydate.now(0,'YYYY-MM-DD'+' 00:00:00'));
				date.setHours(23, 59, 59, 0);
				$('input[name=endTime]').val(date.format("yyyy-MM-dd hh:mm:ss"));
			}
			/**格式化日期*/
			Date.prototype.format = function(format){ 
				var o = { 
						"M+" : this.getMonth()+1, //month 
						"d+" : this.getDate(), //day 
						"h+" : this.getHours(), //hour 
						"m+" : this.getMinutes(), //minute 
						"s+" : this.getSeconds(), //second 
						"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
						"S" : this.getMilliseconds() //millisecond 
				} 

				if(/(y+)/.test(format)) { 
					format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
				} 
				for(var k in o) { 
					if(new RegExp("("+ k +")").test(format)) { 
						format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
					} 
				} 
				return format; 
			}
			var search = function(e) {
				var startTime = $("input[name=startTime]").val(); 
				var endTime = $("input[name=endTime]").val(); 
				var Id = $.trim($("input[name=Id]").val()); 
				var handLingstaffno = $.trim($("#handLingstaffno").val()); 
				var handLingmode = $.trim($("#handlingmode").val()); 
				var data = {
							"Id": Id,
							'handLingmode': handLingmode,
							'handLingstaffno': handLingstaffno,
							'startTime': startTime,
							'endTime': endTime
				}
				//console.log(data);
				
				if(data.endTime==null || data.endTime=="" || data.startTime==null || data.startTime==""){
					crossAPI.tips("时间不能为空",1500);
					return;
				}else if(new Date(data.startTime.replace(/\-/g, "\/")) > new Date(data.endTime.replace(/\-/g, "\/"))){
					 crossAPI.tips("开始日期不能大于结束日期！",1500); 
					    return;
				}else{
					listSearch(data);
				}
				
			}
			
			//详情
			var contactMain = function(e,items){
				
				var remarks=$(e.currentTarget).context.id;
				crossAPI.tips(remarks,1500);
				list.on("rowClick",function(e,items){
					var	service=items.serviceId;
					if(remarks ==="remark"){
						var serialno = $(e.currentTarget).text();
						//var beans=list.getCheckedRows();
						Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=transactionDetails&serviceId='+service+'',{"serialno":serialno},function(data){
							_index.destroyTab('异动详情');
							_index.createTab({
								 title:'异动详情',
								 url:'/ngwf_he/src/module/serviceReq/Detailed.html', 
								 closeable:true, //选项卡是否可以关闭，支持true|fal或者1|0  
								 width:90,//选项卡宽度，单位px
								 option:{
									 "custBean":data.beans
								 }
							 });
						})
						remarks=null;
						service=null;
					}else{
						return;
					}
					

				});
			}
			
			$(document).click(function(){
				$('.content').hide();
			})
			
			
			//员工详情
			var staffno = function(e) {
				e.stopPropagation()
				var evt =e|| event;
		    	var bbb =$(this).parent('td').offset().left-185;
       			var ccc = $(this).parent('td').offset().top-190;
       			$('.content').css({'left':bbb,'top':ccc}).toggle();
				var orgaName = "";
				var mobilePhone = "";
				var staffName = "";
				var staffId = $(e.currentTarget).text();
				var params = {
					method : 'functionAuthOrStaffInfo_get',
					paramDatas : '{staffId :"'+staffId+'"}'  
				}
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params, function(result){
					if(result.bean.orgaName && result.bean.mobilePhone && result.bean.staffName){
						orgaName = result.bean.orgaName;
						mobilePhone = result.bean.mobilePhone;
						staffName = result.bean.staffName;
					}
				},true);
				$("#staffId").text(staffId);
				
				if(staffName != "" && staffName.length > 11) {
					var name = staffName.substring(0,11);
					name += "...";
					$("#staffName").text(name);
					$("#staffName").attr("title",staffName);
				}else{
					$("#staffName").text(staffName);
				}
				
				if(orgaName != "" && orgaName.length > 11) {
					var orga = orgaName.substring(0,11);
					orga += "...";
					$("#orgaName").text(orga);
					$("#orgaName").attr("title",orgaName);
				}else{
					$("#orgaName").text(orgaName);
				}
				
				if(mobilePhone != "" && mobilePhone.length > 11) {
					var phone = mobilePhone.substring(0,11);
					phone += "...";
					$("#mobilePhone").text(phone);
					$("#mobilePhone").attr("title",mobilePhone);
				}else{
					$("#mobilePhone").text(mobilePhone);
				}
				/*var dialogConfig = {
						mode:'normal',
						delayRmove:2000, 
						content :
							'<div class="content">'		   
				            +'<p>员工信息</p>'
				            +'<ul class="contentList">'
				            +'<li><span class="listLeft">工号:</span><span>'+ staffId +'</span></li>'    
				            +'<li><span class="listLeft">姓名:</span><span>'+ staffName +'</span></li>'  
				            +'<li><span class="listLeft">部门:</span><span>'+ orgaName +'</span></li>'  
				            +'<li><span class="listLeft">手机:</span><span>'+ mobilePhone +'</span></li>'
						    +'</div>',
						    width : 170,
							height : 130,
						skin : 'dialogSkin',
						fixed : true,
						quickClose : true,
						cancelDisplay:false,
						okDisplay:false,
						modal : false
					}
					var dialog =new Dialog(dialogConfig);
					$('.ui-dialog-footer').addClass('hide');
					$('.content li span:odd').on('mouseover',function(){
						var titles = $(this).text()
						$(this).attr('title',titles)
					})*/
				};
			var date = function(){
				//开始日期组件
				var config = new MyDate({
			        el:$('#startTime'),
			        label:'开始日期',
			        name:'startTime',    //开始日期文本框name
			        format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
			        defaultValue:laydate.now(0,'YYYY-MM-DD '+'00:00:00'), //默认日期值
			        //min: laydate.now(0),      //最小日期限制
			        max: laydate.now(0)+' 23:59:59', //最大日期
			        istime: true,
			        istoday: true,
			        choose:function(){
			        	
			        } //用户选中日期时执行的回调函数
			    });
				
				//结束日期组件
			    var date1 = new MyDate( {
			        el:$('#endTime'),
			        label:'结束日期',
			        name:'endTime',    //开始日期文本框name
			        format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
			        defaultValue:laydate.now(0)+' 23:59:59', //默认日期值
			        //min: laydate.now(0),         //最小日期限制
			        max: laydate.now(0)+' 23:59:59', //最大日期
			        istime: true,
			        istoday: true,
			        choose:function(){} //用户选中日期时执行的回调函数
			    });
			    $('.timegroup label').addClass('necessary')
			}
			
			var staffid = function(){
				var staffId = _index.getUserInfo().staffId;
				$("#fm03").val(staffId);
			}
			
			var listSearch = function(data) {
				var config = { 
						el:$('#biaodan'),
						highlight: false,
				        field:{
				            boxType:'',
				            key:'',
				            popupLayer:
				            {
				                width:800,
				                height:250
				            },
				            items:[
				                { text:'请求编号',name:'serviceid',render:function(item,val){
				                	
			                		val = '<a id="serveicId"  class="serveicId" name='+item.Id+' style="color: blue;">'+val+'</a>';
			                	return val;
			                	}},
				                { text:'处理工号',name:'handlingstaffno',render:function(item,val){
				                	if(val == null||val == undefined){
				                		val = '<a id="staffno" class="handlingstaffno"  style="color: blue;">'+' '+'</a>';
									}else{
										val = '<a id="staffno" class="handlingstaffno"  style="color: blue;">'+val+'</a>';
									}
				                	return val;
				        		  }},
				                { text:'处理时间',name:'handlingtime'},
				                { text:'操作类型',name:'handlingmode',render:function(item,val){
				                	var val = '';
				    					$.each(resultBean,function(index,bean){
				    						if(item.handlingmode==bean.value){
				    							val=bean.name;
				    						}
				    					});
				    					return val;
				    				
				        		  }},
				                { text:'操作描述',name:'remark' }
				            ]
				        },
				        page:{
				            perPage:10,
				            total:true,   
				            align:'right'
				        },
				        data:{
				            url:'/ngwf_he/front/sh/serviceReq!execute?uid=acceptanceReques005'
				        }}
				list = new List(config);
				list.search(data);
				
				
				var total;
				list.on("success",function(result){
					//console.log(list.total);
					total=list.total;
					//console.log(list);
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
			
			var getBaseUrl = function () {
				var ishttps = 'https:' == document.location.protocol ? true: false;
				var url = window.location.host;
				if(ishttps){
					url = 'https://' + url;
				}else{
					url = 'http://' + url;
				}
				return url;
			}
			
			IndexLoad(function(IndexModule, options){
						_index = IndexModule;
						//事件初始化
						eventInit();
						date();
						start = $("#Contanter input[name=startTime]").val(); 
						end = $("#Contanter input[name=endTime]").val(); 
						setTimeout(function(){
							search();
						},10);
						//listSearch({});
						dictionaryNoDefault('staticDictionary_get','HEBEI.DIC.OPSTATUS','handlingmode');
					 });
	});
});