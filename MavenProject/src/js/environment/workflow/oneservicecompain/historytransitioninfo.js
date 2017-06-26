define(['Util','list','indexLoad','date',
        'text!module/workflow/oneservicecomplain/historytransitioninfo.html',
        'style!css/workflow/oneservicecompain/historyWorkInfo.css'],   
        function(Util,List,IndexLoad,myDate,Html_historytransitioninfo){
			var $el;
			var _index;
			var _options;
			var list;
			var acptNum;
			var finalNum;
	
		var initialize = function(index, options){
				$el = $(Html_historytransitioninfo);
				_index = index;
				_options=options;
				acptNum =options.processinfo.acptNum;
				finalNum = options.processinfo.acptNum;
				$("#acptNum",$el).val(acptNum);
				this.eventInit();
				this.dictionaryInit();
				historyworkList.call(this,$el);
				this.eventSearch();
				this.eventRest();
				this.content = $el;
				this.width=1200;
				this.height=600;
		};
		$.extend(initialize.prototype, Util.eventTarget.prototype, {
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
	            var endTime = nowDate.Format("yyyy-MM-dd hh:mm:ss"); //当前时间的格式;
	            var t = nowDate.getTime() - 60* 24 * 60 * 60 * 1000; //当前时间往后推迟七天
	            var startTime = new Date(t).Format("yyyy-MM-dd hh:mm:ss");
				
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
			eventSearch:function(){				
				$("#historySearch",$el).on("click",function(){
					var wrkfmShowSwftNo=$("input[name='wrkfmShowSwftNo']",$el).val();
					var acceptStaffName=$("input[name='acceptStaffName']",$el).val();
					var acptNum=$("input[name='acptNum']",$el).val();
					var callingNum=$("input[name='callingNum']",$el).val();
					var startTime=$("input[name='startTime']",$el).val();
					var endTime=$("input[name='endTime']",$el).val();
					var acptModeCd=$("input[name='acptModeCd']",$el).val();
					var worfmStsCd=$("input[name='worfmStsCd']",$el).val();
					var custBrandCode=$("input[name='custBrandCode']",$el).val();
					var custLvlCd=$("input[name='custLvlCd']",$el).val();
					var acptNumBelgCityCode=$("input[name='acptNumBelgCityCode']",$el).val();
					var fstConcTelNum=$("input[name='fstConcTelNum']",$el).val();
					var sevReqstType=$("input[name='sevReqstType']",$el).val();
					var endTime=$("input[name='endTime']",$el).val();//透明化短号码
					var custStsCd=$("input[name='custStsCd']",$el).val();
					var custStargrdCd=$("input[name='custStargrdCd']",$el).val();
															
					var param ={
							wrkfmShowSwftNo:wrkfmShowSwftNo,
							acceptStaffName:acceptStaffName,
							acptNum:acptNum,
							callingNum:callingNum,
							startTime:startTime,
							endTime:endTime,
							acptModeCd:acptModeCd,
							worfmStsCd:worfmStsCd,
							custBrandCode:custBrandCode,
							custLvlCd:custLvlCd,
							acptNumBelgCityCode:acptNumBelgCityCode,
							fstConcTelNum:fstConcTelNum,
							sevReqstType:sevReqstType,
							custStsCd:custStsCd,
							custStargrdCd:custStargrdCd
							
					}
					list.search(param);
				})
			},
			eventRest:function(){
				$("#historyRest",$el).on("click",function(){
					$("input[name='wrkfmShowSwftNo']",$el).val('');
					$("input[name='acceptStaffName']",$el).val('');					
					$("input[name='callingNum']",$el).val('');					
					$("#acptNum",$el).val(finalNum);
					$("input[name='startTime']",$el).val('');
					$("input[name='endTime']",$el).val('');
					$("input[type=radio][value=1]").attr("checked",true);
					list.search({
									            	
					});
					
				})
				
			},
			// 动态获取下拉框
	        loadDictionary: function(mothedName, dicName, seleId) {
	            var params = {
	                method: mothedName,
	                paramDatas: '{typeId:"' + dicName + '"}'
	            };
	            var seleOptions = "<option value=' '>请选择</option>";
	            // 
	            Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF', params, function(result) {
	                $.each(result.beans, function(index, bean) {
	                    seleOptions += "<option  value='" + bean.value + "'>" + bean.name + "</option>"
	                });
	                $('#' + seleId, $el).append(seleOptions);
	            },
	            true);
	        },
			dictionaryInit: function() {	           	            
	            this.loadDictionary('staticDictionary_get', 'CSP.PUB.ACCEPTMODE', 'acptModeCd'); //加载受理方式信息
	            this.loadDictionary('staticDictionary_get', 'ECP.PUB.USERBRAND', 'custBrandCode'); //加载客户品牌信息
	            this.loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.LEVEL', 'custLvlCd'); //加载客级别信息 
	            this.loadDictionary('staticDictionary_get', 'HEBEI.ORDER.STATE','worfmStsCd');//加载工单状态				
	            this.loadDictionary('staticDictionary_get', 'HEBEI.ACCEPT.CITY', 'acptNumBelgCityCode'); //加载受理地市
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
                            text:'工单类别',
                            name:'SRTYPEID',
                            render : function(item, val) {
								if(val=='1'){
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
                          name:'SERIALNO'                              
                        },
                        { text:'受理号码',name:'SUBSNUMBER' },
                        { text:'建单人',name:'ACCEPTSTAFFNAME'},
                        { text:'建单时间',name:'CREATETIME' },
                        { text:'紧急程度',name:'URGENTID' ,render : function(e,val){
                        	if(val=='01'){
								return "一般";
							}else if(val=='02'){
								return "紧急";
							}else if(val=='03'){
								return "非常紧急";
							}
                        }},
                        { text:'完成时间',name:'COMPLETETIME' },
                        { text:'操作状态',name:'OPERSTATUS' },                                               
                        { text:'是否潜在升级',name:'ISTALKUPGRADE', render : function(item, val) {
							if(val=='1'){
								return "是";
							}else if(val=='0'){
								return "否";
							}
																									
						}                                
                    },
                                                     
                    ],
//                 
                },
                page:{
                    customPages:[2,3,5,10,15,20,30,50],
                    perPage:10,
                    total:true,
                    align:'right'                    
                },
                data:{
                    url:'/ngwf_he/front/sh/workflow!execute?uid=selectTransitionHistory'
                }
            };
            
            //按上面的配置创建新的列表
            list = new List(config);
            //
            list.search({
            	acptNum:acptNum,
            	
            });
            list.on('success',function(result){
                
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
      

	return initialize;
});