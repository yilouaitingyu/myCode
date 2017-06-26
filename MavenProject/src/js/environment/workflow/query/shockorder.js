define(['Util','list','dialog','date','crossAPI','js/workflow/commonTip/commonTip'],   
	function(Util,List,Dialog,DDate,CrossAPI,commonTip){
		var list;
		var defaultStartTime;
		var defaultEndTime;
		var pop = new commonTip();
		var pageArr=[2,3,5,10,15,20,30,50];
		var loginStaffId
		var initialize = function(){
			CrossAPI.getIndexInfo(function(info){
				loginStaffId =info.userInfo.staffId;		    					
				eventInit();
		    	ctiList({});
               })
		    	
		    	};		
		
		 var eventInit=function(){
			 loadDictionary('staticDictionary_get','HEBEI.DIC.SUBSBRAND','subsbrand');//加载客户品牌信息
			 loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','acceptcity');//受理地市
			 loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','urgentid');//加载紧急程度信息
			 loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','isaccept');//是否受理
			 loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','custlevel');//加载客级别信息
			 
			 loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.TYPE',
				'casetypeCode')//工单类型
		    	
			 $('#shockOrder_Search').on('click',shockOrderInfo);
			 $('#shockOrder_Reset').on('click',resetInfo);
			 //$('#trajectory_Search').on('click',add_trajectory);			
			 $('#sendCC').on('click',dialog_sendCC);
			 
		 };
		 //抄送
		 var dialog_sendCC =function (){
			 var handlingstaff="1001"//操作员工编号
			 var serialno ="201703161410598168545601599587"//工单编号
			 var workitemid ="201703161410598168545601599587"//工作项编号
			 var params={		//"sendccid":sendccid,  //抄送日志编号
								"handlingstaff":handlingstaff,
								"serialno":serialno,
				 				"workitemid":workitemid,
				 				"sendccstaffdatas":'[{"sendccstaff":"001001","sendccstaffname":"小强"},{"sendccstaff":"001002","sendccstaffname":"小李子"}]',//被抄送人为list
				 				"sendccgroupdatas":'[{"sendccgroupid":"001","sendccgroupname":"1组"},{"sendccgroupid":"002","sendccgroupname":"2组"}]'//被抄组为list
						};
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=sendCC001',params,function(result){
				},true);
		 }
		 
		 		 		
		 
		
		//字典
		var loadDictionary=function(mothedName,dicName,seleId){
				var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
				var seleOptions="";
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
					$.each(result.beans,function(index,bean){
						//品牌工单中保存的是品牌名{
						if("subsbrand"==seleId){
							seleOptions+="<option  value='"+bean.name+"'>"+bean.name+"</option>";
						}
							else
								seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"	
					});
					$('#'+seleId).append(seleOptions);
					console.log(seleOptions);
				},true);
			};		 
		 //重置按钮
		 var resetInfo = function (){	
			 
			 $("input[name='serialno']")[0].value='';
			 $("input[name='acceptstaffname']")[0].value='';
			 $("input[name='starttime']").val(startTime);
			 $("input[name='endtime']").val(endTime);
			 $("input[name='contactphone1']")[0].value='';
			 $("input[name='subsnumber']")[0].value='';
			 $("input[name='callerno']")[0].value='' ;
			 $("input[name='complaintype']")[0].value='' ;
			 $("input[name='conplainid']")[0].value=''
			 //select取值 
			 $("select[name='subsbrand']")[0].value ='' ;
			 //var subslevel =$("select[name='subslevel']")[0].value ='' ;			 
			 $("select[name='acceptcity']")[0].value ='' ;
			 $("select[name='urgentid']")[0].value ='';
			 $("select[name='custlevel']")[0].value =''    ;
			 $("select[name='isaccept']")[0].value  =''  ;
			 $("select[name='casetypeCode']")[0].value  =''  ;
			 
			 list.search({
						
						"starttime": defaultStartTime,
						"endtime":defaultEndTime,
						
				 });
		 };
		 //查询按钮事件
		 var shockOrderInfo = function (){
			 var serialno = $("input[name='serialno']")[0].value;
			 var acceptstaffname = $("input[name='acceptstaffname']")[0].value;
			 var starttime = $("input[name='starttime']")[0].value;
			 var endtime = $("input[name='endtime']")[0].value;
			 var contactphone1 = $("input[name='contactphone1']")[0].value;
			 var subsnumber = $("input[name='subsnumber']")[0].value;
			 var callerno =$("input[name='callerno']")[0].value ;
			 var complaintype =$("input[name='complaintype']")[0].value ;
			 var conplainid =$("input[name='conplainid']")[0].value ;
			 
			 //select取值
			 var subsbrand =$("select[name='subsbrand']")[0].value  ;
			 var acceptcity =$("select[name='acceptcity']")[0].value  ;
			 var urgentid =$("select[name='urgentid']")[0].value ;
			 var custlevel =$("select[name='custlevel']")[0].value  ;   
			 var isaccept =$("select[name='isaccept']")[0].value  ; 
			 var casetypeCode = $("select[name='casetypeCode']")[0].value  ;
			 var data = {
					"serialno":serialno,
					"starttime": starttime,
					"endtime":endtime,
					"contactphone1":contactphone1,
					"subsnumber":subsnumber,
					"subsbrand":subsbrand,
					"acceptcity":acceptcity,
					"urgentid":urgentid,
					"callerno":callerno,
					"custlevel":custlevel,
					"complaintype":complaintype,
					"isaccept":isaccept,
					"acceptstaffname":acceptstaffname,
					"complainid" : conplainid,
                    "casetypeCode" :casetypeCode
			 };
			 ctiList(data);
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
         var endTime = nowDate.Format("yyyy-MM-dd 23:59:59"); //当前时间的格式;
         var t = nowDate.getTime() - 31* 24 * 60 * 60 * 1000; //当前时间往后推迟七天
         var startTime = new Date(t).Format("yyyy-MM-dd hh:mm:ss");                
		 
         
         var time =  new DDate( {
	            el:$('.datetime'),
	            label:'开始结束日期：',     //label内容
	            double:{    //支持一个字段里显示两个日期选择框
	                start:{
	                    name:'starttime',   //开始日期文本框name
	                    format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
	                    defaultValue:startTime,     //默认日期值
	                    max: '2099-06-16 23:59:59', //最大日期
	                    istime: true,       
	                    istoday: false,
	                    choose: function(datas){
	                        var nowStartTime = $("input[name='starttime']").val();
	                        var nowEndTime = $("input[name='endtime']").val();	
	                        var startDate =convertDateFromString(nowStartTime);
	                        var endDate =convertDateFromString(nowEndTime);
	                        if((nowStartTime!=null && nowStartTime!='')&&(nowEndTime!=null && nowEndTime!='')){
	                        	   var MaxTime = 31*3600*24*1000;
	                        	   var TimeCount = parseInt(endDate.getTime())-parseInt(startDate.getTime());
	                        	   console.log(TimeCount);
	                        	   if(TimeCount>MaxTime || TimeCount <0){
	                        		   pop.text({text:"请选择31天内的进行查询"});
	                        		   $("input[name='starttime']").val(startTime);
	                        	   }
	                        }
	                    }
	                },
	                end:{
	                    name:'endtime',     //结束日期文本框name
	                    format: 'YYYY-MM-DD hh:mm:ss',   //日期格式
	                    defaultValue:endTime,     //默认日期值
	                    max: '2099-06-16 23:59:59', //最大日期
	                    istime: true,
	                    istoday: false,
	                    choose: function(datas){
	                    	var nowStartTime = $("input[name='starttime']").val();
		                    var nowEndTime = $("input[name='endtime']").val();	
	                        var startDate =convertDateFromString(nowStartTime);
	                        var endDate =convertDateFromString(nowEndTime);
	                    	if((nowStartTime!=null && nowStartTime!='')&&(nowEndTime!=null && nowEndTime!='')){
	                        	   var MaxTime = 31*3600*24*1000;	                        	   
	                        	   var TimeCount = parseInt(endDate.getTime())-parseInt(startDate.getTime());
	                        	   console.log(TimeCount);
	                        	   if(TimeCount>MaxTime || TimeCount <0){
	                        		   pop.text({text:"请选择31天内的进行查询"});
	                        		   $("input[name='endtime']").val(endTime);
	                        	   }
	                        }    //设置开始日期的最大日期
	                    }
	                }
	            }
	        });	
		//加载历史预警信息列表
			var ctiList = function(data){
				var config = {
						el:$('#historylist'),
					    field:{ 
					        key:'id',         		        	
					        items: [{text: '业务类型',name:'casetype',
					        	render : function(item, val) {
					        		return getActionName("HEBEI.WF.ORDER.TYPE",val);																											
								}	
					        },		                       
		                            {text: '工单编号', name: 'serialno',
					        	     click:function(e,item){
					        	    	 openDetails(item);
					        	     },					        	    
					        	     render:function(item,val,$src){
											return "<span style='color:#0085D0'>"+val+"</span>"
										},
		                            },
		                            
		                            {text:'客户星级',name:'starlevelinfo',
		                            	render : function(item, val) {
						        		return getActionName("CCT_CUSTSTARLEVEL",val);																											
									}},
		                            {text:'受理号码',name:'subsnumber'},
		                            {text: '建单时间', name: 'createtime'},		                            	
		                            {
		                            	text:'紧急程度',
		                            	name:'urgentid',
		                            	render : function(item, val) {
							        		return getActionName("HEBEI.EDUCATION.TYPE",val);																											
										}
		                            
		                            },
		                            {text:'完成时间',name:'archivedate'},
		                            {text:'处理组/人',name:'handling'},
		                            {text:'操作状态',name:'operstatus',
		                            	render : function(item, val) {
							        		return getActionName("HEBEI.DIC.OPERASTATUS",val);																											
										}		                            	
		                            },
		                            {text: '是否受理',name:'isaccept'		                            			                            	
		                            },
		                            {text: '受理人',name:'acceptstaffno'}
		                    ]
					        
					    },
					     page:{
		                    customPages:pageArr,
		                    perPage:10,
		                    total:true,
		                    align:'right'                    
		                },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=shockOrder001'
					    }
					}
				list = new List(config);
				list.on('success', function(result) {
					//解决条数选择框下面数字重复的问题
					var index =$.inArray(($(".selectPerPage").val()-0),pageArr);
					$(".selectPerPage option").eq(index+1).remove();
					//解决切换条数和点击上下页 已选择条数不置0,复选框不清除已选择的问题;
					$(".checkAllWraper>input").prop("checked",false);
					// 下面这个有些页面不需要 
					$(".allChecked").prop("checked",false);
					$(".btnCustom0").prop("disabled",true);
				});
				list.search(data);
			}
			
			//打开详情
			 var openDetails = function (item){
				 console.log(item);
				                CrossAPI.createTab(
											'工单详情_'+item.data.subsnumber,
											getBaseUrl()+'/ngwf_he/src/module/workflow/processinfoDetail/processinfoDetail.html',
											{"serialno":item.data.serialno,
											 workItemId:""
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
				}

			return initialize();			
});