define(['Util','list','date','select','dialog','crossAPI','js/workflow/commonTip/commonTip'],   
	function(Util,list, DDate,Select,Dialog,CrossAPI,commonTip){
		var list;
		var staffId;
		var staffName;
		var pop = new commonTip();
		var pageArr=[2,3,5,10,15,20,30,50];
		var initialize = function(){
			CrossAPI.getIndexInfo(function(info){
		    	staffId =info.userInfo.staffId;		    	
				staffName=info.userInfo.staffName;
				eventInit();
				var startTime= $("input[name=startTime]").val();
				var endTime=$("input[name=endTime]").val();
		    	wrList({staffId:staffId,staffName:staffName,startTime:startTime,endTime:endTime});
            })		    	
		    	loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','acceptcity');//受理地市
		    	loadDictionary('staticDictionary_get','HEBEI.DIC.SUBSBRAND','subsbrand');//加载客户品牌信息
		    	loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','subslevel');//加载客级别信息
		    	loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','urgentid');//加载紧急程度信息
		    	loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','isaccept');//是否受理
		    	loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.TYPE',
				'casetypeCode')//工单类型
		};		
		
		 var eventInit=function(){
			 $('#wr_Search').on('click',searchWR);
			 $('#wr_Reset').on('click',resetWR);
			 
		 };
		 
		
	
		 
		 var searchWR = function(){			 
			 var serialno = $("#serialno").val();
			 var acceptstaffname = $("#acceptstaffname").val();
			 var starttime = $("input[name=startTime]").val();
			 var endtime = $("input[name=endTime]").val();
			 var subsbrand = $("#subsbrand").val();
			 var subslevel = $("#subslevel").val();
			 var acceptcity = $("#acceptcity").val();
			 var urgentid = $("#urgentid").val();
			 //预留新旧业务
			 var businesstype =$("#businesstype").val();
			 var complaintype =$("#complaintype").val();
			 var subsnumber = $("#subsnumber").val();
			 var isaccept = $("#isaccept").val();
			 var contactphone1 = $("#contactphone1").val();
			 var callerno =$("#callerno").val();
			 var conplainid =$("#conplainid").val() ;
			 var casetypeCode = $("select[name='casetypeCode']")[0].value ;
			 var data = {
					"serialno":serialno,
					"acceptstaffname": acceptstaffname,
					"starttime": starttime,
					"endtime":endtime,
					"subsbrand":subsbrand,
					"subslevel":subslevel,
					"acceptcity":acceptcity,
					"urgentid":urgentid,
					//预留新旧业务
					"businesstype":businesstype,
					"complaintype":complaintype,
					"subsnumber":subsnumber,
					"isaccept":isaccept,
					"contactphone1":contactphone1,
					"callerno":callerno,
					"staffId":staffId,
					"staffName":staffName,
					"conplainid":conplainid,
					"casetypeCode" : casetypeCode
					
			 };
			 wrList(data);
			 
		 };
		 
		 
		 
		 
		 
		 var resetWR = function(){
			 $("#serialno").val('');
			 $("#acceptstaffname").val('');
			 $("#starttime").val(startTime);
			 $("#endtime").val(endTime);
			 $("#subsbrand").val('');
			 $("#subslevel").val('');
			 $("#acceptcity").val('');
			 $("#urgentid").val('');
			 //预留新旧业务
			 $("#businesstype").val('');
			 $("#complaintype").val('');
			 $("#subsnumber").val('');
			 $("#isaccept").val('');
			 $("#contactphone1").val('');
			 $("#callerno").val('');
			 $("#conplainid").val('');
			 wrList({staffId:staffId,staffName:staffName,startTime:startTime,endTime:endTime})
			 
		 };
		 
		 
		 //获取当前时间并把当前时间显示在页面  暂时使用  start
         Date.prototype.Format = function(fmt) { // author: meizz
             var o = {
                 "M+": this.getMonth() + 1,
                 // 月份
                 "d+": this.getDate(),
                 // 日
                 "h+": this.getHours(),
                 // 小时
                 "m+": this.getMinutes(),
                 // 分
                 "s+": this.getSeconds(),
                 // 秒
                 "q+": Math.floor((this.getMonth() + 3) / 3),
                 // 季度
                 "S": this.getMilliseconds() // 毫秒
             };
             if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
             for (var k in o)
             if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
             return fmt;
         }

         var nowDate = new Date();
         var endTime = nowDate.Format("yyyy-MM-dd hh:mm:ss"); //当前时间的格式;
         var t = nowDate.getTime() - 31* 24 * 60 * 60 * 1000; //当前时间往后推迟七天
         var startTime = new Date(t).Format("yyyy-MM-dd hh:mm:ss");         
         
		 
         var time =  new DDate( {
	            el:$('.datetime'),
	            label:'开始结束日期：',     //label内容
	            double:{    //支持一个字段里显示两个日期选择框
	                start:{
	                    name:'startTime',   //开始日期文本框name
	                    format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
	                    defaultValue:startTime,     //默认日期值
	                    max: '2099-06-16 23:59:59', //最大日期
	                    istime: true,       
	                    istoday: false,
	                    choose: function(datas){
	                        var nowStartTime = $("input[name='startTime']").val();
	                        var nowEndTime = $("input[name='endTime']").val();	
	                        var startDate =convertDateFromString(nowStartTime);
	                        var endDate =convertDateFromString(nowEndTime);
	                        if((nowStartTime!=null && nowStartTime!='')&&(nowEndTime!=null && nowEndTime!='')){
	                        	   var MaxTime = 31*3600*24*1000;
	                        	   var TimeCount = parseInt(endDate.getTime())-parseInt(startDate.getTime());
	                        	   console.log(TimeCount);
	                        	   if(TimeCount>MaxTime || TimeCount <0){
	                        		   pop.text({text:"请选择31天内的进行查询"});
	                        		   $("input[name='startTime']").val(startTime);
	                        	   }
	                        }
	                    }
	                },
	                end:{
	                    name:'endTime',     //结束日期文本框name
	                    format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
	                    defaultValue:endTime,     //默认日期值
	                    max: '2099-06-16 23:59:59', //最大日期
	                    istime: true,
	                    istoday: false,
	                    choose: function(datas){
	                    	var nowStartTime = $("input[name='startTime']").val();
		                    var nowEndTime = $("input[name='endTime']").val();	
	                        var startDate =convertDateFromString(nowStartTime);
	                        var endDate =convertDateFromString(nowEndTime);
	                    	if((nowStartTime!=null && nowStartTime!='')&&(nowEndTime!=null && nowEndTime!='')){
	                        	   var MaxTime = 31*3600*24*1000;	                        	   
	                        	   var TimeCount = parseInt(endDate.getTime())-parseInt(startDate.getTime());
	                        	   console.log(TimeCount);
	                        	   if(TimeCount>MaxTime || TimeCount <0){
	                        		   pop.text({text:"请选择31天内的进行查询"})
	                        		   $("input[name='endTime']").val(endTime);
	                        	   }
	                        }    //设置开始日期的最大日期
	                    }
	                }
	            }
	        });	
//		加载select里内容
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
			
			
			
		
		//加载待阅工单列表
			var wrList = function(data){
				var config = {
						el:$('#wr_List'),
					    field:{ 
					        key:'id',         		        	
					        items: [{text: '业务类型',name:'casetypeCode',
					        	render : function(item, val) {
					        		return getActionName("HEBEI.WF.ORDER.TYPE",val);																											
								}
					                },		                       
		                            {text: '工单流水号', name: 'serialno',
					                	click:function(e,item){
						        	    	 openDetails(item);
						        	     },render:function(item,val,$src){
						        	    	 return "<span style='color:#0085D0'>"+val+"</span>"
						        	     }	
		                            },
		                            {text:'客户星级',name:'starlevelinfo',
		                            	render : function(item, val) {
							        		return getActionName("CCT_CUSTSTARLEVEL",val);																											
										}},
		                            {text:'受理号码',name:'subsnumber'},
		                            {text: '建单时间', name: 'createtime'},
		                            {text:'紧急程度',name:'urgentid',
		                            	render : function(item, val) {
							        		return getActionName("HEBEI.EDUCATION.TYPE",val);																											
										}
		                            },
		                            {text:'完成时间',name:'completetime'},
		                            {text:'处理组/人',name:'handlingdept'},
		                            {text:'操作状态',name:'operstatus',
		                            	render : function(item, val) {
							        		return getActionName("HEBEI.DIC.OPERASTATUS",val);																											
										}},
		                            {text: '是否受理',name:'isaccept',},		                            	
		                            {text: '受理人',name:'acceptstaffno'}
		                    ]
					        
					    }, page:{
		                    customPages:[2,3,5,10,15,20,30,50],
		                    perPage:10,
		                    total:true,
		                    align:'right'                    
		                },					    
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=waitReadOrder001'
					    }
					}
				this.list = new list(config);
				this.list.search(data);
				this.list.on('success', function(result) {
					//解决条数选择框下面数字重复的问题
					var index =$.inArray(($(".selectPerPage").val()-0),pageArr);
					$(".selectPerPage option").eq(index+1).remove();
				});

			}
			
			//打开详情
			 var openDetails = function (item){
		    	
//						Util.ajax.postJson(
//								'/ngwf_he/front/sh/workflow!execute?uid=detailDataLock',
//								lockdata, function(json2, status) {
				               CrossAPI.createTab(
											'工单详情_'+item.data.subsnumber,
											getBaseUrl()+'/ngwf_he/src/module/workflow/processinfoDetail/processinfoDetail.html',
											{"serialno":item.data.serialno,
											"workItemId":""	
											 
											});
//								})
				
		     }
			 
			
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
			//string转换为date的函数
				function convertDateFromString(dateString) { 
					if (dateString) { 
					var arr1 = dateString.split(" "); 
					
					var sdate = arr1[0].split('-'); 
					var date = new Date(sdate[0], sdate[1]-1, sdate[2]); 
					return date;
					} 
				}
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
				}

			return initialize();
});