require(
		[ 'Util','date', "list", 'select','dialog','selectTree','jquery' ],
		function(Util,MyDate, List,Select,Dialog,SelectTree,$) {
			
			var currentNodeType="01";
			//queryStaticDatadictRest
		    var loadDictionary=function(mothedName,dicName,seleId){
			var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
			var seleOptions="";
			// 
			Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
				$.each(result.beans,function(index,bean){
					seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
				});
				$('#'+seleId).append(seleOptions);
				console.log(result);
			},true);
		};
			var init = function(){
				loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','whetherAccept');//加载客户品牌
				loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','clientBrand');//加载客户品牌
				loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','customerLevel');//加载客户级别
				loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','acceptArea');//加载受理地区
				loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','urgentDegree');//加载紧急程度
				loadDictionary('staticDictionary_get','HEBEI.SERVICETYPE','serviceType');//加载业务类型
				loadDictionary('staticDictionary_get','HEBEI.OR.COMPLAIN','whetherRepeat');//是否重复投诉
				loadDictionary('staticDictionary_get','HEBEI.COMPLAIN.CONTENT','complainContent');//投诉内容
				loadDictionary('staticDictionary_get','HEBEI.COMPLAIN.METHOD','complaintWay');//投诉途径
			};
			init();
			 //queryStaticDatadictRest
			//选项卡效果设置
			$(function(){
                  $('.t-tabs-items li').click(function(){
                   var $t = $(this).index();
                   $(this).addClass('active').siblings().removeClass('active');
                   $('.t-tabs-wrap li').eq($t).addClass('selected').siblings().removeClass('selected');
               });
            });
           // 选择框 隐藏 显示按钮点击事件;
          
        $('.t-list-search-more').click(function(){
          if($('.t-columns-group li').hasClass('hide')) {
            $('.t-columns-group li.hide').addClass('show').removeClass('hide');
            $(this).children('i').addClass('icon-iconfontjiantou-copy').removeClass('icon-iconfontjiantou-copy-copy');
            $(".searchBtnRight").attr("id","searchBtnRight");
          } else if($('.t-columns-group li').hasClass('show')) {
            $('.t-columns-group li.show').addClass('hide').removeClass('show');
            $(this).children('i').addClass('icon-iconfontjiantou-copy-copy').removeClass('icon-iconfontjiantou-copy');
            $(".searchBtnRight").removeAttr("id");
          }
        });
      

           // 添加时间对象原形.设置时间格式;
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
                             name:'acceptTimeStart',
                             format: 'YYYY/MM/DD hh:mm:ss',
                             defaultValue:time1,      //默认日期值
//                           min: laydate.now(-1),
                             max: '2099/06/16 23:59:59',
                             istime: true,
                             istoday: false
                         },
                         end:{
                             name:'acceptTimeEnd',
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
		//列表详情开始 start
                $(function(){
                var num = 0; // 选择的条数
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
                                height:250
                            },
                            items:[
                                { 
                                    text:'详情',  //按钮文本
                                    name:'serialno',  //按钮名称
                                    click:function(e,item){     //按钮点击时处理函数
                                    	console.log(item);
                                    	crossAPI.set("serialno",item.data.serialno);
                                    	crossAPI.set("nodeid",item.data.nodeid);
                                    	crossAPI.set("workitemid",item.data.workitemid);
                                    	crossAPI.createTab('工单详情', 'http://localhost:8080/ngwf_he/src/module/workflow/firaccForm/firaccForm.html');
                                    } 
                                },
                                { 
                                    text:'服务类型',
                                    name:'srtypeid'
                                },
                                { 
                                    text:'工单类别',
                                    name:'csvcprocesstype',
                                    className:'w120'
                                },
                                { text:'工单流水号',
                                  name:'serialno'
                                },
                                { text:'星级信息',name:'ans' },
                                { text:'受理电话',name:'handlingstaff'},
                                { text:'建单人',name:'anoceRecStsCdShow' },
                                { text:'紧急程度',name:'urgentid' },
                                { text:'处理人',name:'handlingorgacode' },
                                { text:'处理组',name:'handlingstaffitem' },
                                { text:'上一环节处理人',name:'prehandlingstaff' },
                                { text:'分配时间',name:'anoceRecStsCdShow' },
                                { text:'剩余处理时间',name:'od' },
                                { text:'剩余派单时间',name:'odr' },
                                { text:'整体时限',name:'odrOp' },
                                { text:'操作状态',name:'odrOpTe' },
                                { text:'是否受理',name:'odrOpe' },
                                { text:'受理人',name:'handlingstaff' },
//                              { text:'标记',name:'odrOpme' },
                                { text:'是否潜在升级',name:'upgradeflag' },
                                { text:'工作项id',
                                  name:'workitemid',
                                  className:'workHidden' 
                                },
                                { text:'节点',
                                  name:'nodeid',
                                  className:'workHidden'  
                                },
                                { text:'流程编号',
                                  name:'templateid',
                                  className:'workHidden'
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
                                items:[
                                    {   
                                        text:"已选择0条工单",
                                        name:'deleter',
                                        click:function(e){
                                        }
                                    }, 
                                     {
                                        text:'受理',
                                        name:'deleter',
                                        click:function(e){ //参数e是当前点击的dom元素.使用currentTarget 来获得点击的元素;
                                            // 打印当前按钮的文本
                                           console.log(JSON.stringify(list.getCheckedRows()))
                                        }
                                    },
                                    {
                                        text:'释放',
                                        name:'stopToggle',
                                        click:function(e){
                                            // 打印当前按钮的文本
                                            console.log(e)
                                        }
                                    },
                                    {
                                        text:'指派',
                                        name:'deleter',
                                        click:function(e){
                                            // 指派
                                           console.log('点击了删除按钮'+'+'+this.text)
                                           $('.t-popup').addClass('show').removeClass('hide');
                               			var config2 = {
                                                   el:$('#selectAgentPer'),
                                                   label:'',
                                                   check:false,
                                                   // async:true,         //是否启用异步树
                                                   name:'agentPer',
                                                   textField:'name',
                                                   valueFiled:'id',
                                                   expandAll:true,
                                                   childNodeOnly:true,
                                                   checkAllNodes:false,     //是否显示复选框“全选”
                                                   url:'../../../../data/selectTree.json',
                                               };
                               			var selectTree2 = new SelectTree(config2);
                               			$("#selectedAgentPer").click(function(){
                               			 var dates=list.getCheckedRows();
                               			 var workitemid =dates[0].workitemid;   
                               				var data ={
                               				        "taskId":workitemid,
                               				        "loginStaffId":"109",
                               				        "paramKey":"cl",
                               				        "paramValue":"123"
                               				        
                               				};
                               				Util.ajax.postJson(
                           	 						'/ngwf_he/front/sh/workflow!execute?uid=assignData',
                           	 					    data, function(json, status) {
                           	 						
                           	 				})
                               			})
                                        }
                                    }
                                ]
                            }
                        },
                        data:{
                            url:'/ngwf_he/front/sh/workflow!execute?uid=queryOrderList&nodetype=01',
                        }
                    };
                    //按上面的配置创建新的列表
                    var list = new List(config);
                    list.search({});
                    list.on('checkboxChange',function(e, item, checkedStatus){//事件处理代码
                        
                         console.log(checkedStatus)
                         if(checkedStatus==1){
                        	 num++; 
                         	 $(".btnCustom0").val("已选择"+num+"条工单");
                        	 $("div.buttons").find(".operbtn").remove();
                        	 var templateid = item.templateid;
                        	 var nodeid = item.nodeid;
                        	 var nodeData={
                        			 "templateId":templateid,
                        			 "activityId":nodeid
                        	 };
                        	 Util.ajax.postJson(
            	 						'/ngwf_he/front/sh/workflow!execute?uid=nodeData002',
            	 						nodeData, function(json, status) {
            	 						var beans = json.beans;
            	 						for(var item in beans){
            	 							$("div.buttons").append("<input type='button' value='"+beans[item].linename+"' class='btn operbtn'>")
            	 						}
            	 				})
                         }else{
                         	num--;
                         	$(".btnCustom0").val("已选择"+num+"条工单");
                         	$("div.buttons").find(".operbtn").remove();
                         }
                           })
                    //点击查询按钮时的事件
                    $("#checkResult").click(function(){
                    	var serialNo=$("#serialNo").val();//流水号
                    	var acceptTimeStart =$(".bg-date").eq(0).val();//开始时间
                    	var acceptTimeEnd = $(".bg-date").eq(1).val();//结束时间
                    	var telephone =$("#telephone").val() ;//联系电话
                    	var callNumber=$("#callNumber input").val();//主叫号码
                    	var acceptNumber = $("#acceptNumber input").val();//受理号码
                    	var whetherAccept =$("#whetherAccept input").val();//是否受理
                    	var clientBrand =$("#clientBrand input").val();//客户品牌
                    	var customerLevel =$("#customerLevel input").val();//客户级别
                    	var acceptArea = $("#acceptArea input").val();//受理地区
                    	var urgentDegree =$("#urgentDegree input").val();// 紧急程度
                    	var newOldWork = $("#newOldWork input").val();//新旧业务
                    	var serviceType =$("#serviceType input").val();//业务类型
                    	var complainType =$("#complainType input").val();//投诉类型
                    	var orderNext = $("#orderNext input").val();//工单类型
                    	var whetherRepeat = $("#whetherRepeat input").val();//是否重复投诉
                    	var complaintWay =$("#complaintWay").val();//投诉途径
                    	
                    })
                    list.on('success',function(result){
                        console.log(result)
                    })
//                 
                    $('#btn').on('click',function(){
                        list.load(arr);
                    })
            //列表详情最外层
                })

})