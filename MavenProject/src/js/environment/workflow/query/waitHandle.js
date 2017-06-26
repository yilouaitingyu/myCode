define(
		[ 'Util','validator',  'date', 'list', 'select', 'dialog', 'crossAPI', 'jquery',
			'./commonQuery','js/workflow/commonTip/commonTip'],
		function(Util,Validator,MyDate, List, Select, Dialog, CrossAPI, $,commonQuery,commonTip) {
            var num = 0;//定义选择的条数;
			//========定义全局变量开始
			//当前nodetype，待复核，待处理，待反馈
			var currentNodeType = "01";
			//当前操作人handlingstaff
			var currentUser;
			//弹出框对象
			var pop = new commonTip();
			var _formValidator;
			//是否代办页面
			var wait="";
			var list;
			var state;
			var sortField="tb1.crt_time";
			var sorting="desc";
			var pageArr=[ 5, 10, 15, 20, 30, 50 ];//列表页码数
			//========定义全局变量结束
			//设置时间
			var nowDate = new Date();
			var time2 = nowDate.Format("yyyy/MM/dd 23:59:59");
			//console.log(time2)
			// 当前时间减去31天为起始时间
			var t = nowDate.getTime() - 30 * 24 * 60 * 60 * 1000;
			var time1 = new Date(t).Format("yyyy/MM/dd 00:00:00");
			var date1 = new MyDate({
				el : $('#startTime'),
				label : '起止时间',
				double : { // 支持一个字段里显示两个日期选择框
					start : {
						name : 'acceptTimeStart',
						format : 'YYYY/MM/DD hh:mm:ss',
						defaultValue:time1, //默认日期值
						// min: laydate.now(-1),
						max : '2099/06/16 23:59:59',
						istime : true,
						istoday : false,
						choose: function(datas){
					}
					},
					end : {
						name : 'acceptTimeEnd',
						format : 'YYYY/MM/DD hh:mm:ss',
						defaultValue:time2, //默认日期值
						// min: laydate.now(-1),
						max : '2099/06/16 23:59:59',
						istime : true,
						istoday : false,
						choose: function(datas){
						}
					}
				}
			});
			// 时间设置结束
			// 定义数据字典加载方法
			var loadDictionary = function(mothedName, dicName, seleId) {
				var params = {
					method : mothedName,
					paramDatas : '{typeId:"' + dicName + '"}'
				};
				var seleOptions = "";
				//  
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',
						params, function(result) {
							$.each(result.beans, function(index, bean) {
								seleOptions += "<option  value='" + bean.value
										+ "'>" + bean.name + "</option>"
							});
							$('#' + seleId).append(seleOptions);
							//console.log(result);
						}, true);
			};
			
			
			//定义初始化方法
			var Init = function() {
				arraySupportIndex();
				validateForm();
				loadDictionary('staticDictionary_get', 'ECP.PUB.USERBRAND',
						'clientBrand');// 加载客户品牌
				loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.LEVEL',
						'customerLevel');// 加载客户级别
				loadDictionary('staticDictionary_get', 'HEBEI.ACCEPT.CITY',
						'acceptArea');// 加载受理地区
				loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON',
						'whetherAccept');// 是否受理
				loadDictionary('staticDictionary_get', 'HEBEI.EDUCATION.TYPE',
						'urgentDegree');// 加载紧急程度
				loadDictionary('staticDictionary_get', 'HEBEI.SERVICETYPE',
						'serviceType');// 加载业务类型
				loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON',
						'whetherRepeat');// 是否重复投诉
				loadDictionary('staticDictionary_get',
						'HEBEI.COMPLAIN.CONTENT', 'complainContent');// 投诉内容
				loadDictionary('staticDictionary_get', 'HEBEI.COMPLAIN.METHOD',
						'complaintWay');// 投诉途径
				loadDictionary('staticDictionary_get', 'HEBEI.DIC.USERLEVEL',
				'custStargrdCd');// 客户星级
				loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.TYPE',
				'casetypeCode');// 工单类型
				loadDictionary('staticDictionary_get', 'HEBEI.DIC.CONTACTCHANNEL',
				'acptChnlId');// 受理渠道
				
				var href=location.href;
				var htmlPage=href.substring(href.lastIndexOf("/")+1);
				crossAPI.getIndexInfo(function(info){
					currentUser=info.userInfo;
					console.log(currentUser);
					if(htmlPage=="waitHandlePool.html"){
						//加载数据
						wait="Y";
						currentNodeType="";
						loadDataList();
						$(".btnCustom1").css("display","none");
						$("#selectbox").css("display","none");
						$(".btnCustom0").css("display","none");
					}else if(htmlPage=="waitHandle.html"){
						//加载数据
						wait="";
						$(".btnCustom2").css("display","inline-block");
						currentNodeType="01";
						loadDataList();
					}
				});
				
				//gotoPage();
			};
			
			//============定义加载数据方法配置开始
			var listConfig = {
					el : $('#listContainer'),
					className : 'listContainer',
					field : {
						boxType : 'checkbox',
						key : 'id',
						popupLayer : {
							text : "详情",
							width : 800,
							height : 250
						},
						items : [
							{
								text : '业务类型', // 按钮文本
								name : 'wrkfmTypeCd', // 按钮名称
								render:function(item,val,$src){
									var obj=wrapDictionray("HEBEI.WF.ORDER.TYPE");
									return obj[val];
								}
							},
							{
								text : '工单流水号', // 按钮文本
								name : 'wrkfmShowSwftno', // 按钮名称
								render:function(item,val,$src){
									return "<span style='color:#0085D0'>"+val+"</span>"
								},
								click : function(e, item) { // 按钮点击时处理函数
									console.log(item);
									openDetails(item);
								}
							},

							{
								text : '服务类型',
								name : 'srvReqstTypeId',
							},
							{
								text : '客户星级',
								name : 'custStargrdCd',
								render:function(item,val,$src){
									var obj=wrapDictionray("CCT_CUSTSTARLEVEL");
									return obj[val];
								}
							},
							{
								text : '受理渠道',
								name : 'acptChnlId'
							},
							{
								text : '受理号码',
								name : 'acptNum'
							},
							{
								text : '建单人',
								name : 'acptStaffNum'
							},
							{
								text : '紧急程度',
								name : 'urgntExtentCd'
							},
							{
								text : '处理组/人',
								name : 'currentLinkGroup'
							},
							{
								text : '上一环节处理人',
								name : 'lstoneDspsStaffNum'
							},
							{
								text : '分配时间',
								name : 'crtTimeItem'
//								}
							},
							{
								text : '剩余处理时间',
								name : 'od'
							},
							{
								text : '剩余派单时间',
								name : 'odr'
							},
							{
								text : '整体时限',
								name : 'odrOp'
							},
							{
								text : '操作状态',
								name : 'WRKFM_STS_CD'
							},
							{
								text : '是否受理',
								name : 'workItemStsCd',
								render : function(item, val) {
									if ( val == "30050004") {
										return "是";
									} else if(val == "30050002"){
										return "否"
									}
								}
							},
							{
								text : '受理人',
								name : 'currentLinkStaff',
								render : function(item, val) {
									return (val == "" || val == undefined || val == null) ? "无"
											: val;
								}
							},
							{
								text : '标记',
								name : ''
							},
							{
								text : '是否潜在升级',
								name : 'upgdCmplntsFlag',
								render:function(item,val,$src){
									console.log(val);
									return val=="true"?"是":"否";
								}
							},
							{
								text : '',
								className:'noborder',
								name : 'workItemId',//工作项id
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',//工作项状态
								className:'noborder',
								name : 'workItemStsCd',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',
								className:'noborder',
								name : 'prstNodeId',//当前节点id
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',
								className:'noborder',
								name : 'workItemIstncId',//工作项实例id
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							// 模板id
							{
								text : '',
								className:'noborder',
								name : 'seqprcTmpltId',
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							},
							{
								text : '',
								className:'noborder',
								name : 'wrkfmTypeCd',//工单类别
								render : function(item, val) {
									return "<p style='display:none;'>" + val
											+ "</p>";
								}
							} ],
					},
					page : {
						customPages : pageArr,
						perPage : 10,
						total : true,
						align : 'right',
						button : {
							className : 'operateButtons',
							// url:'../js/list/autoRefresh',
							items : [
									{
										text : "已选择0条工单",//不要改动这个.这个是为了撑开空间
										name : 'deleter',
										click : function(e) {
											// 打印当前按钮的文本
											console.log('点击了删除按钮' + e + this.text)
										}
									},
									{
										text : '受理',
										name : 'claim',
										click : function(e) {

											claim();

										}
									},
									{
										text : '释放',
										name : 'stopToggle',
										click : function(e) {
											release();
										}
									},
									{
										text : '导出',
										name : 'deleter',
										click : function(e) {
											excelExport();
										}
									},
									{
										text : "催单",
										name : 'reminder',
										click : function(e) {
											 
											var dates = list.getCheckedRows();
											if (dates.length == 0) {
												pop.text({text:"请选择一条工单"});
												return;
											}
											if (dates.length > 1) {
												pop.text({text:"请选择一条工单"});
												return;
											}
											var wrkfmShowSwftno = dates[0].wrkfmShowSwftno;
											var workItemId = dates[0].workItemId;
											var seqprcTmpltId = dates[0].seqprcTmpltId;
											var nodeId = dates[0].prstNodeId;
											var wrkfmId =dates[0].wrkfmId;
											var opStaffNum =currentUser.staffId;
											var opStaffName =currentUser.staffName;
											//获取当前登录人
											var opTypeCd ="0016";
											/*if(reminder=="")
												reminder="催办工单";*/
											var opRsnTypeCd ="催单";//操作原因类型代码 
											var wrkfmTypeCd =dates[0].wrkfmTypeCd;  //工单类型代码
											var data = {
													'wrkfmShowSwftno' : wrkfmShowSwftno,
													'workItemId' : workItemId,
													'seqprcTmpltId' : seqprcTmpltId,  //流程模板id
													'nodeId' : nodeId,
													'opCntt' :opStaffName+"【"+opStaffNum+"】",
													'wrkfmId':wrkfmId,
													'opStaffNum':opStaffNum,
													'opStaffName':opStaffName,
													'opRsnTypeCd':opRsnTypeCd,
													'wrkfmTypeCd':wrkfmTypeCd,
													'opTypeCd':opTypeCd
													
												}

											require(['js/workflow/outlayer/remaind'],function(remaind){
								     			  var remaind = new remaind(data);
								     			 
								     		      var config2 = {
								     		            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
//								     		            delayRmove:3,   //延迟关闭秒数设定，tips默认3秒关闭,其他模式不设置将不会关闭
								     		            title:"催办工单",    //对话框标题
								     		            content:remaind.content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
								     		            ok:function(){
								     		            	//console.log($("#sddasdasd").serializeObject());
								     		            	return remaind.remaind_submit();
								     		            	
								     		            	
								     		            	}, //确定按钮的回调函数 
								     		            okValue: "确定",  //确定按钮的文本
								     		            cancel: function(){
								     		            	
								     		            },  //取消按钮的回调函数
								     		            cancelValue: '取消',  //取消按钮的文本
								     		            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
								     		            button: [ 
								     		            ],
								     		            width:500,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
								     		            height:122, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
								     		            skin:'dialogSkin',  //设置对话框额外的className参数
								     		            fixed:false, //是否开启固定定位 默认false不开启|true开启
								     		            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
								     		            modal:true   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
								     		        }
								     		        var dialog = new Dialog(config2)

								   		    	
								   		    
								     		  });
										}
									}
									]
						}
					},
					data : {
						url : '/ngwf_he/front/sh/workflow!execute?uid=queryWaitHandleList',
					}
				};
			//============定义加载数据方法配置结束
			
			//ie8不支持indexOf解决方法如下;

			var arraySupportIndex = function(){
				if (!Array.prototype.indexOf)
				{
				  Array.prototype.indexOf = function(elt /*, from*/)
				  {
				    var len = this.length >>> 0;
				    var from = Number(arguments[1]) || 0;
				    from = (from < 0)
				         ? Math.ceil(from)
				         : Math.floor(from);
				    if (from < 0)
				      from += len;
				    for (; from < len; from++)
				    {
				      if (from in this &&
				          this[from] === elt)
				        return from;
				    }
				    return -1;
				  };
				}
			};
			//============定义加载数据方法开始
			var list = new List(listConfig);
			list.on('success', function(result) {
				//解决条数选择框下面数字重复的问题
				var index =$.inArray(($(".selectPerPage").val()-0),pageArr);
				$(".selectPerPage option").eq(index+1).remove();
				//解决切换条数和点击上下页 已选择条数不置0,复选框不清除已选择的问题;
				$(".checkAllWraper>input").prop("checked",false);
				// 下面这个有些页面不需要 
				$(".allChecked").prop("checked",false);
				num = 0;
				//下面使用html  因为使用text()在  ie8下会报错;
				$(".btnCustom0").val("已选择"+num+"条工单");
				$(".btnCustom0").removeClass("btn");
				$(".btnCustom0").prop("disabled",true);
			});
			var wrapParams=function(){
				var serialno = $("#workorderNumber").val();// 流水号
				var acceptStaffNo = $("#acceptStaffNo").val();// 建单人
				var acceptTimeStart = $(".bg-date").eq(0).val();// 开始时间
				var acceptTimeEnd = $(".bg-date").eq(1).val();// 结束时间
				var contactphone1 = $("#contactphone1").val();// 联系电话
				var callerno = $("#callerno").val();// 主叫号码
				var subsnumber = $("#subsnumber").val();// 受理号码
				var whetherAccept =$("#whetherAccept").val();//是否受理
				if(whetherAccept=="1"){
					whetherAccept="30050004";
				}
				if(whetherAccept=="0"){
					whetherAccept="30050002";
				}
				var subsbrand = $("#clientBrand").val();// 客户品牌
				var custLvlCd = $("#customerLevel").val();// 客户级别
				var custStargrdCd = $("#custStargrdCd").val();// 客户星级
				var acceptcity = $("#acceptArea").val();// 受理地区
				var urgentid = $("#urgentDegree").val();// 紧急程度
				// var newOldWork = $("#newOldWork").val();//新旧业务
				// var serviceType =$("#serviceType").val();//业务类型
				var complaincontent = $("#complaincontent").val();
				//var complainType =$("#complainType").val();//投诉类型
				var casetypeCode = $("#casetypeCode").val();// 工单类型
				var repeatflag = $("#whetherRepeat").val();// 是否重复投诉
				var complainway = $("#complaintWay").val();// 投诉途径
				var srTypeId=$("#srTypeId").val();//服务请求类别
				var acptChnlId=$("#acptChnlId").val();//受理渠道
				var searchData = {
					"showSerialNo" : serialno,
					"acceptStaffNo" : acceptStaffNo,
					"subsNumber" : subsnumber,
					"acceptTimeStart" : acceptTimeStart,
					"acceptTimeEnd" : acceptTimeEnd,
					"contactPhone1" : contactphone1,
					"callerNo" : callerno,
					"subsBrand" : subsbrand,
					"custLvlCd" : custLvlCd,
					"acceptCity" : acceptcity,
					"urgentId" : urgentid,
					"repeatFlag" : repeatflag,
					"serviceContent" : complaincontent,
					"cmplntsWayNm" : complainway,
					"workItemStsCd" : whetherAccept,
					"nodeTypeCd" : currentNodeType,
					"srTypeId" : srTypeId,
					"dspsStaffNum":currentUser.staffId,
					"casetypeCode":casetypeCode,
					"acptChnlId":acptChnlId,
					"custStargrdCd":custStargrdCd,
					"sorting":sorting,
					"sortField":sortField,
					"wait":wait
				};
				console.log(searchData);
				return searchData;
			}
			var loadDataList=function(){	
				list.search(wrapParams());
			}
			//============定义加载数据方法结束
			//清空按钮
			$('#restValue').click(function(){
				$('#queryForm')[0].reset();
			})
			//查询按钮
			$('#searchButton').click(function(){
				
				var acceptTimeStart = $(".bg-date[name=acceptTimeStart]").val();
				var acceptTimeEnd = $(".bg-date[name=acceptTimeEnd]").val();
				var acceptTimeStartDate = new Date(acceptTimeStart);
				var acceptTimeEndDate = new Date(acceptTimeEnd);
			    var times = acceptTimeEndDate.getTime()-acceptTimeStartDate.getTime();
				var allowTimes = 31*24*60*60*1000;
			 if(times>allowTimes){
				 pop.text({text:"请选择31天内进行查询"});
			 }else{
					loadDataList();
			 }
			})
			//刷新按钮
			$('#refreshButton').click(function(){
				loadDataList();
			})
			
			
			// 进来之后默认显示的是 待办事宜里面的待处理 需要先请求后台请求权限;
			var config = {
				url : "data2.json", // 接受请求的地址
				success : function(data) {
					if($("#waitWork a").length<1){
						return;
						}
					$("#waitWork a")[0].innerHTML = data[0].description;
					for (var i = 0; i < data.length; i++) {
						$("#waitWork a")[i].innerHTML = data[i].description;
						$("#waitWork a")[i].className = "showall";
						$("#waitWork a")[i].setAttribute("my-data",
								data[i].nodetype);
						$("#waitWork a")[i].setAttribute("id", data[i].id);
						$("#waitWork a")[i].onclick = function() {
							var id = $(this).attr("id");
						
							console.log(id)
							currentNodeType = $(this).attr("my-data");
							if ("waitDealWork" == id) {
								$('#selectbox').hide();
								wait="Y";
								$(".operateButtons > input").eq(1).hide();
								$(".operateButtons > input").eq(2).show();
								loadDataList();
							} else {
								$('#selectbox').show();
								wait="";
								loadDataList();
							}
						}
					}	
					$("#waitWork a").eq(0).addClass("activeButton");
				}, // url调用成功后执行的回调函数
				data : {}, // 要传递给url的数据
				dataType : 'json', // 返回值的数据类型
			}
			Util.ajax.ajax(config);

			$(".orderDefer>a").click(
					function(e) {
						$(this).addClass('activeButton').siblings()
								.removeClass('activeButton');
						
					});
			// 选项卡效果设
			$('.t-tabs-items li').click(
					function() {
						var $t = $(this).index();
						$(this).addClass('active').siblings().removeClass(
								'active');
						$('.t-tabs-wrap li').eq($t).addClass('selected')
								.siblings().removeClass('selected');
					});

			// 选择框 隐藏 显示按钮点击事件;

			$('.t-list-search-more').click(
					function() {
						if ($('.t-columns-group li').hasClass('hide')) {
							$('.t-columns-group li.hide').addClass('show').removeClass('hide');
							$('#chairputbuibot .icon-212102').addClass('icon-2121021').removeClass('icon-212102');
							$('#chairputbuibots .icon-212102').addClass('icon-2121021').removeClass('icon-212102');
							$(".searchBtnRight").attr("id", "searchBtnRight");
						} else if ($('.t-columns-group li').hasClass('show')) {
							$('.t-columns-group li.show').addClass('hide').removeClass('show');
							$('#chairputbuibot .icon-2121021').addClass('icon-212102').removeClass('icon-2121021');
							$('#chairputbuibots .icon-2121021').addClass('icon-212102').removeClass('icon-2121021');
							$(".searchBtnRight").removeAttr("id");
						}
					});

			//创建节点放在受理后面
			//复选框条数
            $('.checkAllWraper>input').change(function(){
                if($('.checkAllWraper>input').prop("checked")){
                	$('.boxWraper > input').each(function(){
                		$(this).prop("checked",true);
                	});
                	num = $('.boxWraper > input').length;
                	$(".btnCustom0").val("已选择"+num+"条工单");
                }else{
                	$('.boxWraper > input').each(function(){
                		$(this).prop("checked",false);
                	});
                	num = 0;
                	$(".btnCustom0").val("已选择"+num+"条工单");
                }
             });
			
			list.on('checkboxChange', function(e, item, checkedStatus) {// 事件处理代码
				if (checkedStatus == 1) {
					num++
					if(num==$(".boxWraper>input").length){
						$('.checkAllWraper>input').prop("checked",true);
					}
					$(".btnCustom0").val("已选择"+num+"条工单");
				} else {
					num--
					$('.checkAllWraper>input').prop("checked",false);
					$(".btnCustom0").val("已选择"+num+"条工单");
				}
			})
			// 列表详情最 end
			
			//添加下拉列表
			var selectbox="<div> <select id='selectbox'><option value='1'>1</option>" +
					"<option value='5'>5</option>" +
					"<option value='10'>10</option><option value='20'>20</option>" +
					"<option value='30'>30</option><option value='50'>50</option>" +
					"<option value='100'>100</option></select></div>";
		     $(".btnCustom1").after($(selectbox))
			 $(selectbox).find("div").addClass("btn");
		     
		     
		     //受理
		     var claim=function(){
		    	 console.log('认领')
		    	 var str = "";
					var dates = list.getCheckedRows();
					//条件查询参数序列化
					var $form = $('#queryForm');
					var result = Util.form.serialize($form);
					console.log("查询条件"+result);
					var selectNum=$('#selectbox').val()-0;
					var total=Number(list.total);
					if (dates.length == 0) {
						var url;
						if(selectNum>total){
							//选的数大于查询的数目,受理所有查询的
							url="/ngwf_he/front/sh/workflow!execute?uid=queryOrderByGroup&processState=30010001&workItemStsCd=30050002&start=0&limit="+total+"&dspsStaffNum="+currentUser.staffId+"&sortField="+sortField+"&sorting="+sorting+"&nodeTypeCd="+currentNodeType; 
							
						}else{
							//选的数小于查询的数目,受理前num条
							url="/ngwf_he/front/sh/workflow!execute?uid=queryOrderByGroup&processState=30010001&workItemStsCd=30050002&start=0&limit="+selectNum+"&dspsStaffNum="+currentUser.staffId+"&sortField="+sortField+"&sorting="+sorting+"&nodeTypeCd="+currentNodeType; 
						}
						Util.ajax.postJson(url, result, function(result, isOk) {
							console.log(result.bean.total)
							//结果数
							var resultNum=result.bean.total;
							if(resultNum==0){
								pop.text({text:"没有可受理工单"});
								return;
							}
							var dates=result.beans;
							var str;
							$.each(dates,function(index,obj){
								str+= obj.wrkfmShowSwftno + "#"
								+ obj.workItemId + "#"
								+ obj.wrkfmTypeCd
								+ "#" + obj.seqprcTmpltId
								+ "#" + obj.prstNodeId
								+ ",";
							});
							Util.ajax.postJson("/ngwf_he/front/sh/workflow!execute?uid=claim001",
									{"workItemIds" : str,"dspsStaffNum":currentUser.staffId,"dspsStaffName":currentUser.staffName},
									function(result,isOk){
										if(result.returnCode=='0'){
											pop.text({text:"选择"+selectNum+"条工单,成功受理"+result.bean.successNum+"条工单"});
											loadDataList();
										}else{
											pop.text({text:"受理不成功"});
											loadDataList();
										}
									})
						});
						return;
					}
					$.each(dates,function(index,obj){
						str+= obj.wrkfmShowSwftno + "#"
						+ obj.workItemId + "#"
						+ obj.wrkfmTypeCd
						+ "#" + obj.seqprcTmpltId
						+ "#" + obj.prstNodeId
						+ ",";
					});
					var date = {
						"workItemIds" : str,
						"dspsStaffNum":currentUser.staffId,
						"dspsStaffName":currentUser.staffName
					}
					// console.log(str);
					var url = "/ngwf_he/front/sh/workflow!execute?uid=claim001";
					Util.ajax.postJson(url,date,function(result, isOk) {
										if (result.returnCode=='0') {
											pop.text({text:"选择"+dates.length+"条工单,成功受理"+result.bean.successNum+"条工单"});
											loadDataList();
											num = 0;
											$(".btnCustom0").val("已选择"+ num+ "条工单");
										} else {
											pop.text({text:"受理不成功"});
											loadDataList();
										}
					});

		     };
		     
		     //释放
		     var release=function(){
		    	 var dates = list.getCheckedRows();
					var str = "";
					if (dates.length == 0) {
						pop.text({text:"请至少选择一条工单!"});
						return;
					}
					
						$.each(dates,function(index,obj){
							str+= obj.wrkfmShowSwftno + "#"
							+ obj.workItemId + "#"
							+ obj.wrkfmTypeCd
							+ "#" + obj.seqprcTmpltId
							+ "#" + obj.prstNodeId
							+ ",";
						});
					var date = {
						"workItemIds" : str,
						"dspsStaffNum":currentUser.staffId,
						"dspsStaffName":currentUser.staffName
					};
					// console.log(str);
					var url = "/ngwf_he/front/sh/workflow!execute?uid=release001";
					Util.ajax.postJson(url, date, function(
							result, isOk) {
						if (result.returnCode=='0') {
							pop.text({text:"选择"+dates.length+"条工单,成功释放"+result.bean.successNum+"条工单"});
							loadDataList();
							num = 0;
							$(".btnCustom0").val("已选择" + num + "条工单");
						} else {
							pop.text({text:"释放不成功"});
							loadDataList();
						}
					});
				};
				//打开详情
				 var openDetails = function (item){
			    	 if (item.data.workItemStsCd == "30050004") {
							var lockdata = {
									"serialno":item.data.wrkfmShowSwftno,
									"handingStaff":currentUser.staffId
							}
										crossAPI.createTab(
												'工单详情_'+item.data.acptNum,
												getBaseUrl()+'/ngwf_he/src/module/workflow/processinfoDetail/processinfoDetail.html',
												{"serialno":item.data.wrkfmShowSwftno,
												 "workItemId":item.data.workItemId
												});
//									})
					}else{
						pop.text({text:"该工单需先受理！"});
					}
			     }
			/**
			 * 使用步骤：
			 * 1.在html页面添加：<div id="dialouge"></div> 容器
			 * 2.定义导出excel方法例子如下
			 */
			var excelExport=function(){
					//定义导出excel查询类型（需要修改）
					var queryType="01";
					var uid="download";
					require(['js/workflow/common/exportExcelAlert'],function(ex){
		    			var excel = new ex();
		    			//定义点击确定 按钮执行的事件（应为带着arr参数以及页面参数去请求excel文件下载）
		    			excel.confirm=function(arr){
		    				var downloadUrl="/ngwf_he/front/sh/workorderexport!export?uid="+uid+"&columns="+arr+"&queryType="+queryType;
		    				//获取json格式的参数
		    				var pageParams=wrapParams();
		    				//将参数添加到请求地址之后
		    				for(key in pageParams){
		    					var value=pageParams[key];
		    					if(value!=null&&value!=undefined&&value.trim()!=''){
		    						downloadUrl+="&"+key+"="+value;
		    					}
		    				}
		    				//下载excel资源
		    				location.href=downloadUrl;
		    			}
						excel.eventInit(queryType);
		    		  });
			
			};
            var  validateForm =function() {
		    	 var config = {
		    	            el: $('#queryForm'),
		    	            dialog:true,    //是否弹出验证结果对话框
		    	            rules: {
		    	                // 主叫号码必须有,并且是手机号格式
		    	            	//reminder:"required|length-300",
		    	            	orderNum:"number",
		    	            	acceptTimeStart:"required",
		    	            	acceptTimeEnd:"required",
		    	            	subsnumber:'number',
		    	            	showSerialNo:"number"
		    	            },
		    	            messages:{
		    	            	orderNum:{
		                            required:"工单编号必须为数字"  
		                        },
		                        acceptTimeStart:{
		                        	required:"开始时间不能为空"
		                        },
		                        acceptTimeEnd:{
		                        	required:"结束时间不能为空"
		                        },
		                        subsnumber:{
		                        	required:"必须为手机号码"
		                        },
		                        showSerialNo:{
		                        	required:"必须是数字"
		                        }
		                    }
		    	 
			    	 };
			    _formValidator = new Validator(config);
            }
			
			return Init();
		})
