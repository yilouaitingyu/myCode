require(
		[ 'date', "list", 'select','dialog','jquery' ],
		function(MyDate, List,Select,Dialog, $) {
			var list;
			Date.prototype.Format = function (fmt) { //author: meizz 
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
			}			
			$(function() {
				var nowDate=new Date();
				var time2 = nowDate.Format("yyyy/MM/dd hh:mm:ss");
				console.log(time2)
				//当前时间减去5天为起始时间
				var t=nowDate.getTime()-5*24*60*60*1000;
				var time1=new Date(t).Format("yyyy/MM/dd hh:mm:ss");
				console.log(time1);
			     var date1 = new MyDate( {
                     el:$('#startTime'),
                     label:'开始时间',
                     double:{    //支持一个字段里显示两个日期选择框
                         start:{
                             name:'startTime',
                             format: 'YYYY/MM/DD hh:mm:ss',
                             defaultValue:time1,      //默认日期值
//                           min: laydate.now(-1),
                             max: '2099/06/16 23:59:59',
                             istime: true,
                             istoday: false
                         },
                         end:{
                             name:'endTime',
                             format: 'YYYY/MM/DD hh:mm:ss',
                             defaultValue:time2,     //默认日期值
//                           min: laydate.now(-1),
                             max: '2099/06/16 23:59:59',
                             istime: true,
                             istoday: false
                         }
                     }
                 });
                 //自定义事件测试
		 
		})//  时间设置结束标签
		//下拉框开始设置;
		
		
			 var data = [
                        {
                            "name":"11111",       //下拉框文本
                            "value":"13612345611",  //下拉框值
                            "address":"郑州"      //基它值
                        },
                        {
                            "name":"22222",
                            "value":"13612342358",
                            "address":"郑州"
                        },
                        {
                            "name":"33333",
                            "value":"13612342358",
                            "address":"郑州"
                        },
                        {
                            "name":"44444",
                            "value":"13612342358",
                            "address":"郑州"
                        }
                    ];
          //主叫号码下拉框开始;          
           var callNumberSelectConfig = {
                    el:$("#callNumber"),       //要绑定的容器
                    label:'主叫号码',     //下拉框单元左侧label文本
                    name:'callNumber',    //下拉框单元右侧下拉框名称
//                  topOption:"所有", //设置最顶部option的text属性
//                  value:''，//初始选中项设置 默认是按value，如果你想按id设置 也可以 value:["id",1],这样设置
                    datas: data         //数据源
                    //  url:'../data/select.json'   //数据源，不建议使用，后期将会移除
                   };
               var callNumberSelect = new Select(callNumberSelectConfig);
		//受理号码下拉框开始
		var acceptNumberSelectConfig = {
                    el:$("#acceptNumber"),      
                    label:'受理号码',     
                    name:'acceptNumber',    
                    datas: data         //数据源
                   };
               var acceptNumberSelect = new Select(acceptNumberSelectConfig);
		//是否受理下拉框
			var whetherAcceptSelectConfig = {
                    el:$("#whetherAccept"),      
                    label:'是否受理',     
                    name:'whetherAccept',    
                    datas: data         //数据源
                   };
               var whetherAcceptSelect = new Select(whetherAcceptSelectConfig);
		//客户品牌下拉框开始
		   var clientBrandSelectConfig = {
                    el:$("#clientBrand"),       
                    label:'客户品牌',     
                    name:'clientBrand',  
                    datas: data      
                   };
               var clientBrandSelect = new Select(clientBrandSelectConfig);
		//客户级别选择
		   var customerLevelSelectConfig = {
                    el:$("#customerLevel"),      
                    label:'客户级别',     
                    name:'customerLevel',    
                    datas: data         //数据源
                   };
               var customerLevelSelect = new Select(customerLevelSelectConfig);  
		//受理地市选择开始
		    var acceptAreaSelectConfig = {
                    el:$("#acceptArea"),      
                    label:'受理地市',     
                    name:'acceptArea',    
                    datas: data         //数据源
                   };
               var acceptAreaSelect = new Select(acceptAreaSelectConfig);
        //紧急程度选择
            var urgentDegreeSelectConfig = {
                    el:$("#urgentDegree"),      
                    label:'紧急程度',     
                    name:'urgentDegree',    
                    datas: data         //数据源
                   };
               var urgentDegreeSelect = new Select(urgentDegreeSelectConfig);
        //新旧业务选择
           var newOldWorkSelectConfig = {
                    el:$("#newOldWork"),      
                    label:'新旧业务',     
                    name:'newOldWork',    
                    datas: data         //数据源
                   };
               var newOldWorkSelect = new Select(newOldWorkSelectConfig); 
        //业务类型选择
           var serviceTypeSelectConfig = {
                           el:$("#serviceType"),      
                           label:'业务类型',     
                           name:'serviceType',    
                           datas: data         //数据源
                   };
           var serviceTypeSelect = new Select(serviceTypeSelectConfig);
         //投诉类型选择
            var complainTypeSelectConfig = {
                           el:$("#complainType"),      
                           label:'投诉类型',     
                           name:'complainType',    
                           datas: data         //数据源
                   };
           var complainTypeSelect = new Select(complainTypeSelectConfig);
         //是否重复投诉
          var whetherRepeatSelectConfig = {
                           el:$("#whetherRepeat"),      
                           label:'是否重复投诉',     
                           name:'whetherRepeat',    
                           datas: data         //数据源
                                         };
           var whetherRepeatSelect = new Select(whetherRepeatSelectConfig);
         //投诉内容
         var complainContentSelectConfig = {
                           el:$("#complainContent"),      
                           label:'是否重复投诉',     
                           name:'complainContent',    
                           datas: data         //数据源
                                         };
           var complainContentSelect = new Select(complainContentSelectConfig);
            
		//列表详情开始位置
		        var num = 0;
                $(function(){
                    var config = {
                        el:$('#listContainer'),
                        className:'listContainer',
                        field:{
                            boxType:'checkbox',
                            key:'id',
                            popupLayer:
                            {
                                text:"详情",
                                width:800,
                                height:250,
                                groups:[
                                    {
                                        title:'<span style="color:#f00; ">title0</span>',
                                        items:
                                            [
                                                [
                                                    {text:'公告名称',name:'anoceTitleNm'},
                                                    {text:'公告ID',name:'anoceId'}
                                                ]
                                            ]
                                    },
                                    {
                                        title:'title1',
                                        items:
                                            [
                                                [
                                                    {text:'公告类型',name:'typeNm'},
                                                    {text:'公告类别ID',name:'anoceTypeId'}
                                                ],

                                                [
                                                    {text:'发布状态',name:'anoceIssueStsCdShow'},
                                                    {text:'有效状态',name:'anoceRecStsCdShow'}
                                                ],
                                                [
                                                    {text:'生效时间',name:'bgnEffTime'},
                                                    {text:'失效时间',name:'endEffTime'}
                                                ]
                                            ]
                                    },
                                    {
                                        title:'title2',
                                        items:
                                            [
                                                [
                                                    {text:'接收组织',name:'rcvOrgBrnchNm'}
                                                ]
                                            ]
                                    }
                                ]
                            },
                            items:[
                                { 
                                    text:'投诉详情',
//                                  name:'',
                                    render:function(){
                                        return 2;
                                    }  // render:根据传过来的参数,做一些修改之后返回一个新的参数或者a链接
                                },
                                { 
                                    text:'工单类别',
                                    name:'anoceTitleNm',
                                    className:'w120',
                                    render:function(item,val){
                                        return "<a></a>";
                                    }
                                },
                                { text:'工单流水号',
                                  name:'typeNm',
                                  render:function(item,val){
                                        return '<a href="">链接</a>';
                                    }
                                },
                                { text:'星级信息',name:'ans' },
                                { text:'受理',name:'ano'},
                                { text:'建单人',name:'anoceRecStsCdShow' },
                                { text:'紧急程度',name:'anoceRecStsCdShow' },
                                { text:'处理组/人',name:'anoceRecStsCdShow' },
                                { text:'上一环节处理人',name:'anoceRecStsCdShow' },
                                { text:'分配时间',name:'anoceRecStsCdShow' },
                                { text:'剩余处理时间',name:'od' },
                                { text:'剩余派单时间',name:'odr' },
                                { text:'整体时限',name:'odrOp' },
                                { text:'操作状态',name:'odrOpTe' },
                                { text:'是否受理',name:'odrOpe' },
                                { text:'受理人',name:'odrOpe' },
                                { text:'标记',name:'odrOpme' },
                                { text:'是否潜在升级',name:'odrOpme' },
                                { text:'',name:'workitemid',
                                	render:function(item,val){
                                        return "<p style='display:none;'>"+val+"</p>";
                                    }
                                }
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
                                          var str=new Array();
                                          var dates=list.getCheckedRows();
                                          for(var i=0;i<dates.length;i++){
                                        	  str.push(dates[0].workitemid);
                                          }
                                          var url="/ngwf_he/front/sh/workflow!execute?uid=claim001";
                                          date={"workitemids":str};
                                          Util.ajax.postJson(url,date,function(result, isOk){
                                        	  
                                          });
                                          // 打印当前按钮的文本
                                           console.log('点击了删除按钮'+'+'+this.text)
                                        }
                                    },
                                    {
                                        text:'释放',
                                        name:'stopToggle',
                                        click:function(e){
                                            // 打印当前按钮的文本
                                            console.log('点击了暂停按钮'+'+'+this.text)
                                        }
                                    },
                                     {
                                        text:'导出',
                                        name:'deleter',
                                        click:function(e){
                                            // 打印当前按钮的文本
                                           console.log('点击了删除按钮'+'+'+this.text)
                                        }
                                    },
                                ]
                            }
                        },
                        data:{
                            url:'data.json',
                        }
                    };
                    //按上面的配置创建新的列表
                    var list = new List(config);
                    //
                    list.search({});
                    list.on('success',function(result){
                        console.log(result)
                    })
//                 
                    $('#btn').on('click',function(){
                        list.load(arr);
                    })
                })
		
		//列表详情结束位置
		
		// 最外层require
		})