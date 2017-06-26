require(
		['Util', 'date', "list", 'select','dialog','jquery' ],
		function(Util,MyDate, List,Select,Dialog, $) {
			
			var list;
			var _index;
			var _options;
			var initialize = function(index, options){
				_index = index;
				_options = options;
			//隐藏
			$('.sn-list-table').find('th:eq(3)').hide();
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
                    datas: data         //数据源
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
                                	   name:'complaintype',
                                	   className:'w120',
                                	   render:function(item,val){
                                		   return  "<a href=''>详情</a>";
                                	   
                                   } // render:根据传过来的参数,做一些修改之后返回一个新的参数或者a链接
                                   },
                                { 
                                	   text:'工单类别',
                                	   name:'anoceTitleNm',
                                	   className:'w120',
                                	   render:function(item,val){
                                		   return "<a href=''>详情</a>";
                                	   }
                                },
                                { text:'工单流水号',
                                  name:'typeNm',
                                  render:function(item,val){
                                        return '<a href="">链接</a>';
                                    }
                                },
                                { text:'',name:'workitemid',
                                	render:function(item,val){
                                        return "<p style='display:none;'>"+val+"</p>";
                                    }
                                },
                                { text:'星级信息',name:'ans' },
                                { text:'受理',name:'ano'},
                                { text:'建单人',name:'anoceRecStsCdShow1' },
                                { text:'紧急程度',name:'anoceRecStsCdShow2' },
                                { text:'处理组/人',name:'anoceRecStsCdShow3' },
                                { text:'上一环节处理人',name:'anoceRecStsCdShow4' },
                                { text:'分配时间',name:'anoceRecStsCdShow' },
                                { text:'剩余处理时间',name:'od' },
                                { text:'剩余派单时间',name:'odr' },
                                { text:'整体时限',name:'odrOp' },
                                { text:'操作状态',name:'odrOpTe' },
                                { text:'是否受理',name:'odrOpe' },
                                { text:'受理人',name:'odrOpe' },
                                { text:'标记',name:'odrOpme' },
                                { text:'是否潜在升级',name:'odrOpme' }
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
                                        	var str='{\"workitems\":[';
                                          var dates=list.getCheckedRows();
                             
                                          var str="";
                                          
                                          console.log(str);
                                          var url="/ngwf_he/front/sh/workflow!execute?uid=claim001";
                                          Util.ajax.postJson(url,str,function(result, isOk){
                                          });
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
                                    {
                                        text:'归档',
                                        name:'deleter',
                                        click:function(e){
                                            // 打印当前按钮的文本
                                       	require(['js/workflow/outlayer/doFile'],function(operateInfo){
                              			  var operateInfo = new operateInfo(_index,_options);
                              		      var config = {
                              		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//                              		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
                              		            title:'归档',    //对话框标题
                              		            content:operateInfo.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
                              		            ok:function(){
                              		            	//console.log($("#sddasdasd").serializeObject());
                              		            	console.log($("[name='appraise']").val());
                              		            	}, //确定按钮的回调函数 
                              		            okValue: '归档',  //确定按钮的文本
                              		            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
                              		            cancelValue: '取消',  //取消按钮的文本
                              		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
//                              		            
                              		            width:operateInfo.width,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
                              		            height:operateInfo.height, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
                              		            skin:'dialogSkin',  //设置对话框额外的className参数
                              		            fixed:false, //是否开启固定定位 默认false不开启|true开启
                              		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
                              		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
                              		        }
                              		        var dialog = new Dialog(config)
                              		  });
                                        }
                                    },
                                    {
                                        text:'答复工单',
                                        name:'deleter',
                                        click:function(e){
                                            // 打印当前按钮的文本
                                       	require(['js/workflow/outlayer/waitchecklayer'],function(operateInfo){
                              			  var operateInfo = new operateInfo(_index,_options);
                              		      var config = {
                              		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
                              		            title:'答复',    //对话框标题
                              		            content:operateInfo.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
                              		            ok:function(){
                              		            	$("#kls_commitcheck").click();
                              		            	}, //确定按钮的回调函数 
                              		            okValue: '确定',  //确定按钮的文本
                              		            cancel: function(){console.log('点击了取消按钮')},  //取消按钮的回调函数
                              		            cancelDisplay:false, //是否显示取消按钮 默认true显示|false不显示
                              		            width:1000,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
                              		            height:400, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
                              		            skin:'dialogSkin',  //设置对话框额外的className参数
                              		            fixed:false, //是否开启固定定位 默认false不开启|true开启
                              		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
                              		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
                              		        }
                              		        var dialog = new Dialog(config)
                              		  });
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
                    list = new List(config);
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
			}
			return initialize();
		// 最外层require
		})