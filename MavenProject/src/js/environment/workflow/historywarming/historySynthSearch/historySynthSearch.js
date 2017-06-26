require(
		[ 'date', "list", 'select','dialog','jquery' ],
		function(MyDate, List,Select,Dialog, $) {
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
          
		//受理方式下拉框开始
		var acceptTypeSelectConfig = {
                    el:$("#acceptType"),      
                    label:'受理方式',     
                    name:'acceptType',    
                    datas: data         //数据源
                   };
               var acceptTypeSelect = new Select(acceptTypeSelectConfig);
		//工作状态下拉框
			var workStationSelectConfig = {
                    el:$("#workStation"),      
                    label:'工作状态',     
                    name:'workStation',    
                    datas: data         //数据源
                   };
               var workStationSelect = new Select(workStationSelectConfig);
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
        //新旧业务选择
           var newOldWorkSelectConfig = {
                    el:$("#newOldWork"),      
                    label:'新旧业务',     
                    name:'newOldWork',    
                    datas: data         //数据源
                   };
               var newOldWorkSelect = new Select(newOldWorkSelectConfig); 
        // 投诉类型选择1
           var oneComplainTypeSelectConfig = {
                           el:$("#oneComplainType"),      
                           label:'业务类型',     
                           name:'oneComplainType',    
                           datas: data         //数据源
                   };
           var oneComplainTypeSelect = new Select(oneComplainTypeSelectConfig);
         //投诉类型选择2
            var twoComplainTypeSelectConfig = {
                           el:$("#twoComplainType"),      
                           label:'投诉类型',     
                           name:'twocomplainType',    
                           datas: data         //数据源
                   };
           var twoComplainTypeSelect = new Select(twoComplainTypeSelectConfig);
		//列表详情开始位置
		        var num = 0;
                $(function(){
                    var config = {
                        el:$('#listContainer'),
                        className:'listContainer',
                        field:{
                            key:'id',
                            items:[
                                { 
                                    text:'工单类别',
//                                  name:''
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