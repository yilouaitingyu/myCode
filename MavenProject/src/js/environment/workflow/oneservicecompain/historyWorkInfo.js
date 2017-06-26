define(['Util','list','indexLoad','date','crossAPI',
        'text!module/workflow/oneservicecomplain/historyWorkInfo.html',
        'style!css/workflow/oneservicecompain/historyWorkInfo.css'],   
        function(Util,List,IndexLoad,myDate,CrossAPI,Html_historyWorkInfo){
			var $el;
			var _index;
			var _options;
			var list;
			var acptNum;
			var finalNnm;
			var pageArr =[2,3,5,10,15,20,30,50];
		var initialize = function(index, options){
				$el = $(Html_historyWorkInfo);
				_index = index;
				_options=options;
				if(_options.aor_basaccepttelnum){
					acptNum =_options.aor_basaccepttelnum;
					finalNnm = _options.aor_basaccepttelnum;
				}else if(_options.processinfo){
					acptNum =_options.processinfo.acptNum;
					finalNnm = _options.processinfo.acptNum;
				}else{
					acptNum ="";
					finalNnm = ""
				}
				$("#acptNum",$el).val(acptNum);
				this.eventInit();			    
				historyworkList.call(this,$el);
				this.eventSearch();
				this.eventRest();
				this.content = $el;
		};
		$.extend(initialize.prototype, Util.eventTarget.prototype, {
			eventDate:function(startTime,endTime){

				var time =  new myDate( {
			            el:$('.datetime',$el),
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
			                        var startTime = $("input[name='startTime']").val();
			                        var endTime = $("input[name='endTime']").val();	
			                        var startDate =convertDateFromString(startTime);
			                        var endDate =convertDateFromString(endTime);
			                        if((startTime!=null && startTime!='')&&(endTime!=null && endTime!='')){
			                        	   var MaxTime = 60*3600*24*1000;
			                        	   var TimeCount = parseInt(endDate.getTime())-parseInt(startDate.getTime());
			                        	   console.log(TimeCount);
			                        	   if(TimeCount>MaxTime || TimeCount <0){
			                        		   crossAPI.tips("开始时间不大于结束时间并且结束时间不能大于开始时间两个月",3000);
			                        		   $("input[name='startTime']").val("");
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
			                    	var startTime = $("input[name='startTime']").val();
			                        var endTime = $("input[name='endTime']").val();	
			                        var startDate =convertDateFromString(startTime);
			                        var endDate =convertDateFromString(endTime);
			                    	if((startTime!=null && startTime!='')&&(endTime!=null && endTime!='')){
			                        	   var MaxTime = 60*3600*24*1000;
			                        	   console.log(MaxTime);
			                        	   var TimeCount = parseInt(endDate.getTime())-parseInt(startDate.getTime());
			                        	   console.log(TimeCount);
			                        	   if(TimeCount>MaxTime || TimeCount <0){
			                        		   crossAPI.tips("开始时间不大于结束时间并且结束时间不能大于开始时间两个月",3000);
			                        		   $("input[name='endTime']").val("");
			                        	   }
			                        }    //设置开始日期的最大日期
			                    }
			                }
			            }
			        });	
			},			
			eventInit:function(){
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
	           
	            var t = nowDate.getTime() - 30* 24 * 60 * 60 * 1000; //当前时间往后推迟七天
	            var startTime = new Date(t).Format("yyyy-MM-dd hh:mm:ss");
	            var _this=this;
	            _this.eventDate(startTime,endTime)
	            
	            //给radio绑定事件
	            $("input[type=radio]",$el).on("click",function(){	            	
	            	var defaultTime = $(this).val();
	            	if(defaultTime=="1"){
	            		t=nowDate.getTime() - 30* 24 * 60 * 60 * 1000;
	            		startTime = new Date(t).Format("yyyy-MM-dd hh:mm:ss");
	            		endTime = nowDate.Format("yyyy-MM-dd hh:mm:ss");
	            		_this.eventDate(startTime,endTime)
	            	}else if(defaultTime=="2"){
	            		t=nowDate.getTime() - 60* 24 * 60 * 60 * 1000;
	            		startTime = new Date(t).Format("yyyy-MM-dd hh:mm:ss");
	            		endTime = nowDate.Format("yyyy-MM-dd hh:mm:ss");
	            		_this.eventDate(startTime,endTime)
	            	}else if(defaultTime=="3"){
	            		var s=nowDate.getTime() - 60* 24 * 60 * 60 * 1000;
	            		endTime=new Date(s).Format("yyyy-MM-dd hh:mm:ss");
	            		t=nowDate.getTime() - 120* 24 * 60 * 60 * 1000;
	            		startTime = new Date(t).Format("yyyy-MM-dd hh:mm:ss");
	            		_this.eventDate(startTime,endTime)
	            	}
	            })
	            
					    	
			},
			eventSearch:function(){
				
				$("#historySearch",$el).on("click",function(){
					var wrkfmShowSwftNo=$("input[name='wrkfmShowSwftNo']",$el).val();
					var acceptStaffName=$("input[name='acceptStaffName']",$el).val();
					var acptNum=$("input[name='acptNum']",$el).val();
					var callingNum=$("input[name='callingNo']",$el).val();
					var startTime=$("input[name='startTime']",$el).val();
					var endTime=$("input[name='endTime']",$el).val();															
					var param ={
							wrkfmShowSwftNo:wrkfmShowSwftNo,
							acceptStaffName:acceptStaffName,
							acptNum:acptNum,
							callingNum:callingNum,
							startTime:startTime,
							endTime:endTime							
							
					}
					list.search(param);
				})
			},
			eventRest:function(){
				var _this=this;
				$("#historyRest",$el).on("click",function(){
					$("input[name='wrkfmShowSwftNo']",$el).val('');
					$("input[name='acceptStaffName']",$el).val('');
					$("input[name='acptNum']",$el).val(finalNnm);
					$("input[name='callingNo']",$el).val('');					
					$("input[type=radio][value=1]").attr("checked",true);
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
		            
		            var t = nowDate.getTime() - 30* 24 * 60 * 60 * 1000; //当前时间往后推迟七天
		            var startTime = new Date(t).Format("yyyy-MM-dd hh:mm:ss");		            
		            _this.eventDate(startTime,endTime)					
		            $("#acptNum").val(acptNum)
		            var startTime=$("input[name='startTime']",$el).val();
					var endTime=$("input[name='endTime']",$el).val();		            
					
				})
				
			},radioClick:function(){
				
			}
			
			
		});
		var historyworkList=function($el){
	       	        
            var config = {
                el:$('.listContainer',$el),
                className:'listContainer',
                field:{
                    boxType:'checkbox',
                    key:'id',                           
                    items:[
                       
                        { 
                            text:'业务类型',
                            name:'SRTYPEID',
                            render : function(item, val) {
								if(val=='001'){
									return "一级客服投诉";
								}else if(val=='002'){
									return "集团投诉";
								}else if(val=='003'){
									return "受理";
								}else if(val=='004'){
									return "咨询";
								}else if(val=='005'){
									return "建议";
								}
																										
							}                                
                        },
                        { text:'工单流水号',
                          name:'serialno',
                          click:function(e,item){
			        	    	 openDetails(item);
			        	     },
			        	     render:function(item,val,$src){
			        	    	return "<span style='color:#0085D0'>"+val+"</span>"
			        	    	}
                        },
                        { text:'受理号码',name:'SUBSNUMBER' },
                        { text:'建单人',name:'ACCEPTSTAFFNAME'},
                        { text:'建单时间',name:'CREATETIME' },
                        { text:'紧急程度',name:'URGENTID',render : function(e,val){
                        	if(val=='01'){
								return "一般";
							}else if(val=='02'){
								return "紧急";
							}else if(val=='03'){
								return "非常紧急";
							}
                        }},
                        { text:'完成时间',name:'COMPLETETIME' },
                        { text:'操作状态',name:'OPERSTATUS',render : function(e,val){
                        	if(val=='0'){
								return "错误";
							}else if(val=='1'){
								return "正确";
							}
                        }}
                    ]
                },
                page:{
                    customPages:pageArr,
                    perPage:10,
                    total:true,
                    align:'right'                    
                },
                data:{
                    url:'/ngwf_he/front/sh/workflow!execute?uid=queryHistoryOrderList'
                }
            };
            
       	 var openDetails = function (item){		    	                    
		               CrossAPI.createTab(
									'历史工单详情_'+item.data.subsnumber,
									getBaseUrl()+'/ngwf_he/src/module/workflow/processinfoDetail/processinfoDetail.html',
									{"serialno":item.data.serialno,
									"workItemId":""	
									});
		            
}
           
            //按上面的配置创建新的列表
            list = new List(config);
            list.on('success', function(result) {
				//解决条数选择框下面数字重复的问题
				var index =$.inArray(($(".selectPerPage").val()-0),pageArr);
				$(".selectPerPage option").eq(index+1).remove();
				//解决切换条数和点击上下页 已选择条数不置0,复选框不清除已选择的问题;
				$(".checkAllWraper>input").prop("checked",false);
				// 下面这个有些页面不需要 
				$(".allChecked").prop("checked",false);
			});

            //
            $("#acptNum").val(acptNum)
            var startTime=$("input[name='startTime']",$el).val();
			var endTime=$("input[name='endTime']",$el).val();
            list.search({
            	acptNum:acptNum,
            	startTime:startTime,
            	endTime:endTime
            });
            list.on('success',function(result){
                console.log(result)
            });
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
      

	return initialize;
});