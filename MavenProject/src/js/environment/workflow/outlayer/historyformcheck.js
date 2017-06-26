define(['Util','date',"list",'select','dialog','jquery',
       'text!module/workflow/outlayer/historyformcheck.html',
       'style!css/workflow/outlayer/historyformcheck.css'],
function(Util,MyDate,List,Select,Dialog,$,Html_history){
	   var $el;
	   var _index;
	   var _options;
	   //定义一个对象
	   var initialize  = function(index,options){
		   $el = $(Html_history);
			_index = index;
			_options = options;
			this.dateInit();
			this.ListConfig();
//			this.dateCheck($el);
			this.content=$el;
	   };
	   //  jq 扩展对象的方法,扩展原形对象,之后在构造函数中调用;
	   $.extend(initialize.prototype,{
	   	//时间选择框的设置
	   	dateCheck:function(){
	   		Date.prototype.Format=function (fmt) { //author: meizz 
			    var o = {
			        "M+": this.getMonth() + 1, //月份 
			        "d+": this.getDate(), //日 
			        "h+": this.getHours(), //小时 
			        "m+": this.getMinutes(), //分 
			        "s+": this.getSeconds(), //秒 
			        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			        "S": this.getMilliseconds() //毫秒 
			    };
			    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			    for (var k in o)
			    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			    return fmt;
			};
	   	 	var nowDate=new Date();//获取当前时间
			var time2 = nowDate.Format("yyyy/MM/dd hh:mm:ss");//当前时间格式化
			var t=nowDate.getTime()-5*24*60*60*1000;//当前时间减去5天为起始时间
			var time1=new Date(t).Format("yyyy/MM/dd hh:mm:ss");//获取到的五天前的时间格式化
			var date1 = new MyDate({
                  el:$('#startTime',$el),
                  label:'开始时间',
                  double:{    //支持一个字段里显示两个日期选择框
                      start:{
                          name:'startTime',
                          format: 'YYYY/MM/DD hh:mm:ss',
                          defaultValue:time1,      //默认日期值
                          max: '2099/06/16 23:59:59',
                          istime: true,
                          istoday: false
                      },
                      end:{
                          name:'endTime',
                          format: 'YYYY/MM/DD hh:mm:ss',
                          defaultValue:time2,     //默认日期值
                          max: '2099/06/16 23:59:59',
                          istime: true,
                          istoday: false
                      }
                  }
              });
	   	
	   	},
	   
	   	//列表详情方法设置;	
	   	ListConfig:function(){
	   	   var num = 0; //选择条数的变量
	   	   var config = {
                        el:$('#listContainer',$el),
                        className:'listContainer',
                        field:{
                            key:'id',
                            items:[
                                { 
                                    text:'工单类别'
                                },
                                { 
                                    text:'工单流水号',
                                    name:'anoceTitleNm',
                                    className:'w120'
                                },
                                { text:'受理号码',
                                  name:'typeNm',
                                  render:function(item,val){
                                        return '<a href="">链接</a>';
                                    }
                                },
                                { text:'建单人',name:'ans' },
                                { text:'建单时间',name:'ano'},
                                { text:'紧急程度',name:'anoceRecStsCdShow' },
                                { text:'完成时间',name:'anoceRecStsCdShow' },
                                { text:'操作状态',name:'anoceRecStsCdShow' },
                                { text:'是否潜在升级',name:'anoceRecStsCdShow' },
                                { text:'透明化短号码',name:'anoceRecStsCdShow' }
                            ]
                        },
                        page:{
                            customPages:[2,3,5,10,15,20,30,50],
                            perPage:2,
                            total:true,
                            align:'right',
                            button:{
                                className:'btnStyle',
                                // url:'../js/list/autoRefresh',
                                items:[
                                    {
                                        text:'已选择几条工单',
                                        name:'deleter',
                                        click:function(e){
                                            // 打印当前按钮的文本
                                           console.log('点击了删除按钮'+'+'+this.text)
                                        }
                                    }, 
                                     {
                                        text:'受理',
                                        name:'deleter',
                                        click:function(e){
                                            // 打印当前按钮的文本
                                           console.log('点击了删除按钮'+'+'+this.text)
                                        }
                                    },
                                    {
                                        text:'释放',
                                        name:'stopToggle',
                                        click:function(e){
                                            // 打印当前按钮的文本
                                            console.log( console.log(list.getSelected()));
                                        }
                                    },
                                     {
                                        text:'导出',
                                        name:'deleter',
                                        click:function(e){
                                            // 打印当前按钮的文本
                                           console.log('点击了删除按钮'+'+'+this.text)
                                        }
                                    }
                                ]
                            }
                        },
                        data:{
                            url:'data.json'
                        }
                    };
                    //按上面的配置创建新的列表
                    var list = new List(config);
                    //
                    list.search({});
	   },
	   //从数据字典请求数据;
	   loadDictionary:function(mothedName,dicName,seleId){
		var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
		var seleOptions="";
				
		  Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
			$.each(result.beans,function(index,bean){
				seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
			});
			$('#'+seleId, $el).append(seleOptions);
		  },true);
	    },
       // 调用请求数据的方法,填充到页面
       dateInit : function(){
				this.loadDictionary('staticDictionary_get','CSP.PUB.PROVINCE','aor_Basserpri');//加载省份信息
	    	    this.loadDictionary('staticDictionary_get','HEBEI.CUSTOM.CITY','aor_Bassercity');//加载客户地市信息
	    	    this.loadDictionary('staticDictionary_get','CSP.PUB.ACCEPTMODE','aor_Basaccway');//加载受理方式信息
	    	    this.loadDictionary('staticDictionary_get','ECP.PUB.USERBRAND','aor_Basbrand');//加载客户品牌信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','aor_Basrange');//加载客级别信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.SEND.TYPE','aor_Seccommit');//加载提交方式信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.TEL.TYPE','aor_Secconcattel');//加载联系方式信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','aor_Bassosrange');//加载紧急程度信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.FOLLOW.HANDLE','aor_Basfollow');//加载跟进处理信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.COMPLAIN.METHOD','aor_Basaskway');//加载投诉途径信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.NET.TYPE','aor_Basnetclass');//加载投诉途径信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','aor_Basacccity');//加载投诉途径信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.QUESTION.TYPE','aor_Basallques');//加载集中问题分类信息
		    	this.loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Basdif');
		    	this.loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Secisrep');
		    	this.loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Basemotion');
		    	this.loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','aor_Bashidename');
		    	this.loadDictionary('staticDictionary_get','HEBEI.ORDER.MODEL','aor_Basmodule');
		  },
	   //对象拓展结束
	   
	   
       });
	   return initialize;
});

