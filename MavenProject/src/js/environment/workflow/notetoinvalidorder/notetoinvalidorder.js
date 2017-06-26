define(
		[ 'Util', 'date', 'list', 'select', 'dialog',  'jquery' ,'indexLoad'],
		function(Util, Date, List, Select, Dialog,  $) {
			var list;
			var state;
			var data ={};
			var initialize = function() {
				eventInit();
				ctiList({});
			};

			// queryStaticDatadictRest
			var eventInit=function(){
				loadDictionary('staticDictionary_get','ECP.PUB.USERBRAND','subsbrand');//加载客户品牌信息
				 loadDictionary('staticDictionary_get','CSP.PUB.PROVINCE','acceptcity');//加载省份信息
				 loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','urgentid');//加载紧急程度信息
				 loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','isaccept');//是否受理
				 loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','custlevel');//加载客级别信息
				 loadDictionary('staticDictionary_get','HEBEI.NET.TYPE','nettype');//网络类别
				 loadDictionary('staticDictionary_get','CSP.PUB.ACCEPTMODE','acceptmode');//加载受理方式信息
				 loadDictionary('staticDictionary_get','HEBEI.CUSTOM.CITY','subscity');//加载客户地市信息
			    	
				$('#node_Search').on('click',nodeInfo);
				$('#node_Reset').on('click',resetInfo);
				$('#trajectory_Search').on('click',add_trajectory);
			 };
			//轨迹图
			var add_trajectory=function (){
				//var processInstId =$("#processInstId").val();获取前端实例id;
				 var processInstId ="0919503917012721D18T01H170301";
				 var resourceType = "image";
				 var loginStaffId = "109";
	             // 打印当前按钮的文本
	         	 var config = {
	         	            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
	         	            title:'轨迹图',    //对话框标题
	         	            content:"<img id=\"modal_t2\"  src='/ngwf_he/front/sh/trajectory!trajectory?uid=trajectoryData001&processInstId="+processInstId+"" +
	         	            		"&resourceType="+resourceType+""+
	         	            		"&loginStaffId="+loginStaffId+""+
	         	            		"'>", //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
	         	            /*ok:function(){
	         	            	crossAPI.tips("确定",3000);
	         	            }, //确定按钮的回调函数 */
	         	            okValue: '关闭',  //确定按钮的文本	 
	         	            /*cancel: function(){
	         	            },  //取消按钮的回调函数
*/	         	            //cancelValue: '取消',  //取消按钮的文本
	         	            cancelDisplay:false, //是否显示取消按钮 默认true显示|false不显示
	         	            width:800,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
	         	            height:300, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
	         	            skin:'dialogSkin',  //设置对话框额外的className参数
	         	            fixed:false, //是否开启固定定位 默认false不开启|true开启
	         	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
	         	            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
	         	        }
	         	 var dialog = new Dialog(config);
	         
			 }
			 //重置按钮
			 var resetInfo = function (){	
				 $("input[name='serialno']")[0].value='';
				 $("input[name='subsnumber']")[0].value='';
				 $("input[name='acceptstaffname']")[0].value='';
				 $("input[name='complainbelongsite']")[0].value='';
				 $("input[name='contactphone1']")[0].value='';
				 $("input[name='callerno']")[0].value='';
				 $("select[name='acceptmode']")[0].value='';
				 $("select[name='acceptcity']")[0].value='';
				 $("select[name='nettype']")[0].value='';
				 $("select[name='subsbrand']")[0].value='';
				 $("select[name='custlevel']")[0].value='';
				 $("select[name='subscity']")[0].value='';
				 $("input[name='starttime']")[0].value='';
				 $("input[name='endtime']")[0].value='';
			 };
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
			 
					var startdate=new Date({
						el:$('#starttime'),
			            label:'',
			            name:'starttime',    //开始日期文本框name
			            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
			            defaultValue:'',     //默认日期值
						max : '2099-06-16 23:59:55',
			            istime: true,    
			            istoday: false,
			            choose:function(){
			            }
					});
					var enddate=new Date({
						el:$('#endtime'),
			            label:'',
			            name:'endtime',    //结束日期文本框name
			            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
			            defaultValue:'',     //默认日期值
						max : '2099-06-16 23:59:55',
			            istime: true,    
			            istoday: false,
			            choose:function(){
			            }
					});
					
			   
				//查询
				var nodeInfo = function (){
						 var serialno = $("input[name='serialno']")[0].value;
						 var subsnumber = $("input[name='subsnumber']")[0].value;
						 var acceptstaffname = $("input[name='acceptstaffname']")[0].value;
						 var complainbelongsite = $("input[name='complainbelongsite']")[0].value;
						 var contactphone1 = $("input[name='contactphone1']")[0].value;
						 var callerno =$("input[name='callerno']")[0].value ;
						 var acceptmode = $("select[name='acceptmode']")[0].value;
						 var acceptcity = $("select[name='acceptcity']")[0].value;
						 var nettype = $("select[name='nettype']")[0].value;
						 var subsbrand = $("select[name='subsbrand']")[0].value;
						 var custlevel = $("select[name='custlevel']")[0].value;
						 var subscity = $("select[name='subscity']")[0].value;
						 var starttime = $("input[name='starttime']")[0].value;
						 var endtime = $("input[name='endtime']")[0].value;
						 
						 var data = {
								"serialno":serialno,
								"subsnumber":subsnumber,
								"acceptstaffname":acceptstaffname,
								"complainbelongsite":complainbelongsite,
								"callerno":callerno,
								"acceptmode":acceptmode,
								"acceptcity":acceptcity,
								"contactphone1":contactphone1,
								"nettype":nettype,
								"subsbrand":subsbrand,
								"custlevel":custlevel,
								"subscity":subscity,
								"starttime": starttime,
								"endtime":endtime
						 };
						 ctiList(data);
					 };
					
			// 列表详情开始 start
			var num = 0; // 复选框选择工单条数
			var ctiList = function(data){
			var config = {
				el : $('#listContainer'),
				className : 'listContainer',
				field : {
					boxType : 'checkbox',
					key : 'id',
					items : [
							{
								className:'btnHandle',
								text : '投诉详情', // 按钮文本
								name : 'fullname', // 按钮名称
								render:function(item,val){
                          		   return  "<a href='#'>详情</a>";
								 },
								 click:function(e,item){ 
                                     console.log('editor is checked.');
                                     //查看投诉详情
                                     var config = {
             	         	            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
             	         	            title:'投诉详情',    //对话框标题
             	         	            content:""+item.data.fullname+"", //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
             	         	            ok:function(){
             	         	            	
             	         	            }, //确定按钮的回调函数 
             	         	            okValue: '确定',  //确定按钮的文本
             	         	            cancel: function(){
             	         	            },  //取消按钮的回调函数
             	         	            cancelValue: '取消',  //取消按钮的文本
             	         	            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
             	         	            width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
             	         	            height:180, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
             	         	            skin:'dialogSkin',  //设置对话框额外的className参数
             	         	            fixed:false, //是否开启固定定位 默认false不开启|true开启
             	         	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
             	         	            modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
             	         	        }
             	         	 var dialog = new Dialog(config);
                                     
                                     
								 }
							},
							{
								text : '工单流水号',
								name : 'serialno',
								sorting:-1
							},
							{
								text : '建单时间',
								name : 'createtime',
								className : 'w120',
								sorting:-1
							},
							{
								text : '受理号码',
								name : 'subsnumber'
							},
							{
								text : '建单人',
								name : 'acceptstaffname'
							}
							,
							{
								text : '完成时间',
								name : 'archivedate'
							}
							,
							{
								text : '紧急程度',
								name : 'urgentid',
								render:function(item){
									console.log(item.urgentid);
									var text=""
									$("#urgentid option").each(function () {
							             var txt = $(this).text(); //获取单个text
							             var val = $(this).val(); //获取单个value
							             if(val==item.urgentid){
							            	 text =txt;
							            	 return text;
							             }
							            	
							         });
									return text;
	                              },
							}
							],
				},
				page : {
					customPages : [  10, 15, 20, 30, 50 ],
					perPage : 10,
					total : true,
					align : 'right',
					button : {
						className : 'operateButtons',
						// url:'../js/list/autoRefresh',
						items : [
								{
									text : "已选择0条工单",
									name : '',
									click : function(e) {
										
									}
								}
								,
								{
									text : '导出',
									name : '',
									click : function(e) {
										// 导出
										var datas = list.getCheckedRows();
										if (datas.length == 0) {
											crossAPI.tips("请至少选择一条信息!",3000);
											return;
										}
										
									}
								},
								 ]
					}
				},
				data : {
					url : '/ngwf_he/front/sh/workflow!execute?uid=notetoinvalidorder001',
				}
			};
			// 按上面的配置创建新的列表
			var list = new List(config);
			list.search(data);
			//全选 统计条数；
			$(' th input[type=checkbox]',$el).on('click',function(e){
	            var checkedAll = $(e.currentTarget).prop(':checked');
	            if(checkedAll){
	            	$(".btnCustom0").val("已选择" + list.total + "条工单");
	            	num =list.total;
	            }
	            else{
	            	$(".btnCustom0").val("已选择0条工单");
	            	num=0;
	            }
	            	
	        });
			//创建节点放在受理后面
			list.on('checkboxChange', function(e, item, checkedStatus) {// 事件处理代码
				if (checkedStatus == 1) {
					num++
					$(".btnCustom0").val("已选择" + num + "条工单")
				} else {
					num--
					$(".btnCustom0").val("已选择" + num + "条工单")
				}
			})
			
		}

			return initialize();
			// 最外层require
		})