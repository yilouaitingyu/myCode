	define(['Util', 'list' ,'ajax','form','dialog','validator','zTree','tab','indexLoad','date'],
				function(Util, List ,ajax, Form, Dialog,Validator,zTree,Tab,IndexLoad,MyDate){
					var _index;
			var list;
			var ctiData;
			var resultBean;
			var Offline;
			var eventInit = function() {
				$('#chaxun').on('click', search);
				$('#chongzhi').on('click', clear);
				
			};
			var clear = function(e) {
				$("input").val("");
				var date = new MyDate();
				$('input[name=beginTime]').val(laydate.now(0)+' 00:00:00');
				$('input[name=endTime]').val(laydate.now(0)+' 23:59:59');
			}

			var search = function(e) {
				var data = Util.form.serialize($("#froms"));
				if(data.endTime==null || data.endTime=="" || data.beginTime==null || data.beginTime==""){
					crossAPI.tips("时间不能为空",1500);
					return;
				}else if(new Date(data.beginTime.replace(/\-/g, "\/"))>=new Date(data.endTime.replace(/\-/g, "\/"))){
					 crossAPI.tips("开始日期不能大于结束日期！",1500); 
					    return;
				}else{
					 var recordtime=getNowFormatDate();
					 var staffId=_index.getUserInfo().staffId;//员工工号
					 var staffName=_index.getUserInfo().staffName;//员工姓名
					 var ipaddr=dialogIP();
					if(data.serialNo!=null && data.serialNo!=""){
						var params = {method:"NGCCT_QUERYCALLAFFIXINFOBYSERIALNO_GET",paramDatas:'{serialNo:"'+data.serialNo+'"}'};
						Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
							Offline=result.bean;
						})
					}
					
					var str={method:'NGCCT_QUERYCONTACTINFO_GET',paramDatas:'{"beginTime":"'+data.beginTime+'","endTime":"'+data.endTime+'","serialNo":"'+data.serialNo+'","callerNo":"","staffId":"'+data.staffId+'"}'};
					 
					listSearch(str);
					 var date={
			 					"recordtime":recordtime,
			 					"logtype":'12',//查询离线录音
			 					"staffId":staffId,
			 					"staffname":staffName,
			 					"outputtype":'12',
			 					"outputname":"离线录音",
			 					"outputcontent":"查询从"+data.beginTime+"至"+data.endTime+"的离线录音数据",
			 					"ipaddr":ipaddr
				 		}
					     Util.ajax.postJson('/ngwf_he/front/sh/customerCon!execute?uid=dialogRecord002',date,function(result){
					     });
				}
			
			}
			//获取当前时间
			var getNowFormatDate=function() {
			    var date = new Date();
			    var seperator1 = "-";
			    var seperator2 = ":";
			    var month = date.getMonth() + 1;
			    var strDate = date.getDate();
			    if (month >= 1 && month <= 9) {
			        month = "0" + month;
			    }
			    if (strDate >= 0 && strDate <= 9) {
			        strDate = "0" + strDate;
			    }
			    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			            + " " + date.getHours() + seperator2 + date.getMinutes()
			            + seperator2 + date.getSeconds();
			    return currentdate;
			}
			var dialogIP=function(){
				 var ipaddr;
				 var url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_='+Math.random();    
				 Util.ajax.postJson(url,{},function(data){  
			    	 ipaddr=data.Ip
			     },true); 
				 return ipaddr;
			}
			var date = function(){
				//开始日期组件
				var config = new MyDate({
			        el:$('#beginTime'),
			        label:'开始日期',
			        name:'beginTime',    //开始日期文本框name
			        format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
			        defaultValue:laydate.now(0)+' 00:00:00', //默认日期值
			        //min: laydate.now(0),      //最小日期限制
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
			        //min: laydate.now(0),         //最小日期限制
			        istime: true,
			        istoday: true,
			        choose:function(){} //用户选中日期时执行的回调函数
			    });
			}
			var listSearch = function(data) {
				var config = { 
						el:$('#biaodan'),
				        field:{
				            boxType:'checkbox',
				            key:'id',
				            popupLayer:
				            {
				                width:800,
				                height:250,
				            },
				            items:[
				                { text:'流水号',name:'serialNo'},
				                { text:'受理号码',name:'subsNumber'},
				                { text:'员工账号',name:'staffId'},
				                { text:'转存路径',name:'recordFilePath',render:function(item,val){
				                	$.each(Offline,function(index,bean){
				                		if(Offline.serialNo==item.serialNo){
					                		val=Offline.recordFilePath;
					                	}else{
					                		val="";
					                	}
				                	})
				                	
				                	
				                	return val;
				        		  } }
				            ]
				        },
				        page:{
				            perPage:10,
				            align:'right'
				        },
				        data:{
				            url:'/ngwf_he/front/sh/common!execute?uid=callCSF'
				        }}
				list = new List(config);
				list.search(data);
				
				
				var total;
				list.on("success",function(result){
					console.log(list.total);
					total=list.total;
					console.log(list);
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
			IndexLoad(function(IndexModule, options){
				_index = IndexModule;
				//事件初始化
				eventInit();
				date();
				search();
			 });

		});
