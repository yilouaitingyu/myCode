require(
		['Util', 'date', "list", 'select','dialog','selectTree','simpleTree','validator','crossAPI','jquery','js/workflow/commonTip/commonTip'],
		function(Util,MyDate, List,Select,Dialog,SelectTree,SimpleTree,Validator,CrossAPI,$,commonTip) {
			var list;
			var num=0;
			var personList;
			var totalCount;
			var staffId;
			var staffName;
			var day;
			//表单验证
			var form;
			var sortField="tb1.crt_time";
			var sorting="desc";
			//弹出框对象
			var pop = new commonTip();
			var pageArr=[5,10, 15, 20, 30, 50 ];
			$.ajax({
				url:'/ngwf_he/front/sh/workflow!execute?uid=getSystemParams',
				data:{'itemId':'221002001'},
				dataType:"json",
				async:false,
				success:function(result){
					day=result.beans[0].value;
				}
			});
			
			//组装数据字典对象
			var wrapDictionray=function(dicName){
				var params = {
						method : "staticDictionary_get",
						paramDatas : '{typeId:"' + dicName + '"}'
					};
				var obj={};
				$.ajax({
					url:"/ngwf_he/front/sh/common!execute?uid=callCSF",
					dataType:"json",
					data:params,
					async:false,
					success:function(result){
						$.each(result.beans, function(index, bean) {
							obj[bean.value]=bean.name;
						});
					}
				});
				return obj;
			}
			var initialize = function() {
				staffIdInit();
				Init();
				
			};
			var staffIdInit = function()
			{
				CrossAPI.getIndexInfo(function(info){
		        	staffId=info.userInfo.staffId;
					staffName=info.userInfo.staffName;
		        	loadDataList();
		        })
			}
			//选项卡效果设置
			$(function(){
                  $('.t-tabs-items li').click(function(){
                   var $t = $(this).index();
                   $(this).addClass('active').siblings().removeClass('active');
                   $('.t-tabs-wrap li').eq($t).addClass('selected').siblings().removeClass('selected');
               });
            });
			var loadDictionary = function(mothedName, dicName, seleId) {
				var params = {
					method : mothedName,
					paramDatas : '{typeId:"' + dicName + '"}'
				};
				var seleOptions = "";
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',
						params, function(result) {
							$.each(result.beans, function(index, bean) {
								seleOptions += "<option  value='" + bean.value
										+ "'>" + bean.name + "</option>"
							});
							$('#' + seleId).append(seleOptions);
							console.log(result);
						}, true);
			};
           // 选择框 隐藏 显示按钮点击事件;
			var Init = function() {
				loadDictionary('staticDictionary_get', 'ECP.PUB.USERBRAND',
						'clientBrand');// 加载客户品牌
				loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.LEVEL',
						'customerLevel');// 加载客户级别
				loadDictionary('staticDictionary_get', 'HEBEI.ACCEPT.CITY',
						'acceptArea');// 加载受理地区
				loadDictionary('staticDictionary_get', 'HEBEI.OR.COMPLAIN',
						'whetherAccept');// 是否受理
				loadDictionary('staticDictionary_get', 'HEBEI.EDUCATION.TYPE',
						'urgentDegree');//紧急程度
				loadDictionary('staticDictionary_get','WFE.CORE.PROCESSSTATE',
						'wrkfmStsCd');//工单状态HEBEI.DIC.PROCESSTYPE
				loadDictionary('staticDictionary_get','HEBEI.WF.ORDER.TYPE',
				'casetypeCode');//工单类型
				
				//
				  var config = {
                          el:$('#assignmentOrderForm'),
                          dialog:true,    //是否弹出验证结果对话框
                          focusNoChecked:true,
                          rules:{
                        	  contactPhone1:'num',
                        	  callerNumber:'cellPhone',    
	                          subsNumber:'cellPhone',  
	                          acceptTimeStart:"required|dateTime",        
	                          acceptTimeEnd:"required|dateTime"         //设置name=content 的元素为必填项，并且字数不能小于10
                          },
                          messages:{
                        	  contactPhone1:{
                        		  num:"联系电话格式不正确"
                        	  },
                          	 acceptTimeStart:{ //设置name=startTime 元素的消息
                                   required:"开始日期必填",            //用户未填写该字段时提示
                                   dateTime:"开始日期格式不正确"    //日期格式验证失败时提示
                              },
                              acceptTimeEnd:{ //设置name=startTime 元素的消息
	                              	required:"结束日期必填",            //用户未填写该字段时提示
	                              	dateTime:"结束日期格式不正确"    //日期格式验证失败时提示
                              },
                              callerNumber:{
                            	  cellPhone:"来电号码必需为手机号"                           	
							  },
							 subsNumber:{
								 	cellPhone:"受理号码必需为手机号" 
                              }
                          }
                      };
                      form = new Validator(config);
                      //添加手机去除两端空格正则
                      form.addMethod('cellPhone', function(str){
                    	  var newStr=str.replace(/(^\s*)|(\s*$)/g, "");
                      	return new RegExp("^0?(13|15|17|18|14)[0-9]{9}$").test(newStr); 
                      });
                      form.addMethod('num', function(str){
                    	  var newStr=str.replace(/(^\s*)|(\s*$)/g, "");
                    	  return new RegExp("^([+-]?)\\d*\\.?\\d+$").test(newStr); 
                      });
                      
                      //添加日期时间正则
                      form.addMethod('dateTime', function(str){
                      	return new RegExp("^\\d{4}(\\-|\\/|\\.)\\d{1,2}\\1\\d{1,2} (([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$").test(str); 
                      });
                //点击查询按钮时的事件
	              $("#queryButton").click(function(){
	                	if(form.form()){
	                		loadDataList();
	                	};
	                });
			}
			
        $('.t-list-search-more').click(function(){
          if($('.t-columns-group li').hasClass('hide')) {
            $('.t-columns-group li.hide').addClass('show').removeClass('hide');
            //$(this).children('i').addClass('icon-iconfontjiantou-copy').removeClass('icon-iconfontjiantou-copy-copy');
            $('#chairputbuibot .icon-212102').addClass('icon-2121021').removeClass('icon-212102');
            $(".searchBtnRight").attr("id","searchBtnRight");
          } else if($('.t-columns-group li').hasClass('show')) {
            $('.t-columns-group li.show').addClass('hide').removeClass('show');
           // $(this).children('i').addClass('icon-iconfontjiantou-copy-copy').removeClass('icon-iconfontjiantou-copy');
            $('#chairputbuibot .icon-2121021').addClass('icon-212102').removeClass('icon-2121021');
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
				console.log(day+"--------")
				if(day==null||day==""||day==undefined){
					day='31';
				}
				var t=nowDate.getTime()-day*24*60*60*1000;
				console.log(t+"------"+day)
				var time1=new Date(t).Format("yyyy/MM/dd hh:mm:ss");
				console.log(time1)
				//当前时间减去30天为起始时间
			     var date1 = new MyDate( {
                     el:$('#startTime'),
                     label:'起止时间：',
                     double:{    //支持一个字段里显示两个日期选择框
                         start:{
                             name:'acceptTimeStart',
                             format: 'YYYY/MM/DD hh:mm:ss',
                             defaultValue:time1,      //默认日期值
                             max: '2099/06/16 23:59:59',
                             istime: true,
                             istoday: false
                         },
                         end:{
                             name:'acceptTimeEnd',
                             format: 'YYYY/MM/DD hh:mm:ss',
                             defaultValue:time2,     //默认日期值
                             max: '2099/06/16 23:59:59',
                             istime: true,
                             istoday: true
                         }
                     }
                 });
                 //自定义事件测试
		 
		})//  时间设置结束标签
		
//		// 请选择指派对象的树形结构  start;

        var setting = {
                treeId: "#treeContainer", //zTree 的唯一标识，初始化后，等于 用户定义的容器的 id 属性值
                treeObj:"treeObj",
                async:{
                    enable: false,        //是否开启异步加载模式
                    //以下配置,async.enable=true时生效
                    url: '/ngwf_he/front/sh/workflow!execute?uid=queryStaffByGroupId',      //Ajax获取数据的地址
                    type: "post",      //Ajax的http请求模式
                    autoParam: ["id"]     //异步加载时需要自动提交父节点属性的参数
                    
                },
                callback:{
//                    beforeClick: beforeClick,
                    onClick: zTreeOnClick,
                    onCheck: zTreeOnCheck
                },
                check:{
                    enable: true,        //设置节点上是否显示 checkbox / radio
                    chkboxType : {"Y": "", "N": "ps"},        //勾选 checkbox 对于父子节点的关联关系。
                    chkStyle : "checkbox"    //勾选框类型(checkbox 或 radio）[setting.check.enable = true 时生效],默认值："checkbox"
                },
                view:{
                    showIcon: true,     //是否显示节点图标，默认值为true
                    showLine: true,     //是否显示节点之间的连线，默认值为true
                    showTitle: true,    //是否显示节点的 title 提示信息(即节点DOM的title属性)，与 setting.data.key.title 同时使用
                    fontCss: {},        //自定义字体
                    nameIsHTML: false  // name 属性是否支持HTML脚本,默认值为false
                },
                data:{
                    keep:{
                        leaf: false,
                        parent: false
                    },
                    key:{
                        checked: "checked",
                        children: "children",
                        name: "name",
                        title: "",
                        url: ""
                    },
                    simpleData:{
                        enable: true,
                        idKey: "staffId",
                        pIdKey: "groupId",
                        rootPId: null
                    }
                }
            }
			
			var simpleTree = new SimpleTree.tierTree($('#treeContainer'),'/ngwf_he/front/sh/workflow!execute?uid=queryAllWorkGroup',setting);     //$el 表示组件的容器，datas 表示数据，setting 表示配置 
			 
			//节点勾选事件
			function zTreeOnCheck(event, treeId, treeNode){
				var nodes=simpleTree.getCheckedNodes();
				//将隐藏清空
				$('#dspsWorkGrpId').val("");
        		$('#dspsStaffNum').val("");
				if("N"==treeNode.isLoad){
					$('#orderInput').val(treeNode.getParentNode().name+" "+treeNode.name);
					$('#orderInput').data("abc",treeNode.id);
					console.log($('#orderInput').data("abc"))
					$('#dspsWorkGrpId').val(treeNode.getParentNode().id);
					$('#dspsWorkGrpName').val(treeNode.getParentNode().name);
	        		$('#dspsStaffNum').val(treeNode.id);
	        		$('#dspsStaffName').val(treeNode.name);
					
				}else{
					//子节点
					$('#orderInput').val(treeNode.name);
					$('#orderInput').data("abc",treeNode.id);
					//$('#orderInput').attr("value",treeNode.id);
					$('#dspsWorkGrpId').val(treeNode.id);
					$('#dspsWorkGrpName').val(treeNode.name);
				}
				if(nodes.length>1){
					pop.text({text:"请选择一个处理对象"});
					simpleTree.cancelSelectedNode();
					return;
				}
			}
			//节点单击事件
			function zTreeOnClick(event, treeId, treeNode) {
				if(treeNode.isLoad=="N"){
					return ;
				}
				if(treeNode.isLoad==""||treeNode.isLoad==null||treeNode.isLoad == undefined){
					console.log("isLoad")
					//父节点不加载
					if(treeNode.isParent){
						
					}else{
						//子节点
						//请求人员方法
						Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryStaffByGroupId',{'id':treeNode.id},function(result,isOk){
							console.log(result.beans)
							if(result.beans.length==0){
								pop.text({text:"该工作组 下没有员工"});
								return;
							}
							simpleTree.addNodes(treeNode,result.beans,true);
							//展开此节点
							simpleTree.expandNode(treeNode, true, true, true);
						})
					}
					//beforeClick();
				}
			};
//        给关闭  确定 取消 按钮添加点击事件 关闭弹窗
        $(".closeDialouge1").on("click",function(){
        	$("#handstaff").css("display","none");
        })
        $(".closeDialouge").on("click",function(){
        	$("#popUp").css("display","none");
        })
        $("#cancleChecked").on("click",function(){
        	$('#orderInput').data("abc","");
//        	$('#orderInput').val("");
        	$('#handStaffId').val("");
        	$('#assignOrderNum').val("");
        	$("#popUp").css("display","none");
        	$("#handstaff").css("display","none");
        	simpleTree.cancelSelectedNode();
        })
		//列表详情开始位置
        /////////////////////////////
        var listConfig = {
				el : $('#listContainer'),
				className : 'listContainer',
				field : {
					boxType : 'checkbox',
					className : "listCheckBox",
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
									text : '工单编号', // 按钮文本
									name : 'wrkfmShowSwftno', // 按钮名称
									click : function(e, item) { // 按钮点击时处理函数
										console.log(item);
										openDetails(item);
									}
								},
								{
									text : '客户星级',
									name : 'custStargrdCd'
								},

								{
									text : '服务请求类型',
									name : 'srvReqstTypeId',
								},
								{
									text : '受理号码',
									name : 'acptNum'
								},
								{
									text : '建单时间',//待改正
									name : 'crtTime',
									render:function(item,val,$src){
										return val.substring(0,val.length-2)
									}
								},
								{
									text : '紧急程度',
									name : 'urgntExtentCd',
									render:function(item,val,$src){
										var obj=wrapDictionray("HEBEI.EDUCATION.TYPE");
										return obj[val];
									}
								},
								{
									text : '完成时间',
									name : 'finishTime'
								},
								{
									text : '处理组/人',
									name : 'currentLinkGroup'
								},
								
								{
									text : '操作状态',
									name : 'WRKFM_STS_CD'
								},
							{
								text : '是否受理',
								name : 'workItemStsCd',
								render : function(item, val) {
									if (val == "30050004") {
										return "<div class='t-tag-done'>已受理</div>";
									} else {
										return "<div class='t-tag-todo'>未受理</div>"
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
									return val=="true"?"是":"否";
								}
							},
							{
								text : '',
								name : 'workItemId',//工作项id
								className:'hide'
//								render : function(item, val) {
//									return "<p style='display:none;'>" + val
//											+ "</p>";
//								}
							},
							{
								text : '',//工作项状态
								name : 'workItemStsCd',
								className:'hide'
							},
							{
								text : '',
								name : 'prstNodeId',//当前节点id
								className:'hide'
							},
							{
								text : '',
								name : 'workItemIstncId',//工作项实例id
								className:'hide'
							},
							// 模板id
							{
								text : '',
								name : 'seqprcTmpltId',
								className:'hide'
							} ]
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
									text : "已选择0条工单",
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
									text : '批量指派',
									name : 'stopToggle',
									click : function(e) {
										var node=simpleTree.getNodeByParam('id',0);
										simpleTree.expandNode(node, true, false, true);
										batchAssign();
						            	 
									}
								},
								{
									text : '加入白班工单池',
									name : 'deleter',
									click : function(e) {
										var poolState='0'
										joinOrderPool(poolState);
									}
								},
								{
									text : "加入夜班工单池",
									name : 'reminder',
									click : function(e) {
										var poolState='1'
											joinOrderPool(poolState);
									}
								}, 
								]
					}
				},
				data : {
					url : '/ngwf_he/front/sh/workflow!execute?uid=queryOrderByGroup',
				}
			};
		//============定义加载数据方法配置结束
		
		//============定义加载数据方法开始
		list = new List(listConfig);
		
		list.on('success',function(result){
            totalCount=result.bean.total-0;
          //解决条数选择框下面数字重复的问题
			//var index = pageArr.indexOf($(".selectPerPage").val()-0);
            var index =$.inArray(($(".selectPerPage").val()-0),pageArr);
			$(".selectPerPage option").eq(index+1).remove();
			//解决切换条数和点击上下页 已选择条数不置0,复选框不清除已选择的问题;
			$(".checkAllWraper>input").prop("checked",false);
			// 下面这个有些页面不需要 
			$(".allChecked").prop("checked",false);
			num = 0;
			//下面使用html  因为使用text()在  ie8下会报错;
			$(".btnCustom0").val("已选择"+num+"条工单");
			$(".btnCustom0").prop("disabled",true);
            
        })
		var loadDataList=function(){
			var serialNo = $("#serialNo").val().replace(/(^\s*)|(\s*$)/g, "");// 流水号
			var acceptstaffName = $("#acceptstaffName").val().replace(/(^\s*)|(\s*$)/g, "");// 建单人
			var acceptTimeStart = $(".bg-date").eq(0).val();// 开始时间
			var acceptTimeEnd = $(".bg-date").eq(1).val();// 结束时间
			var contactPhone1 = $("#contactPhone1").val().replace(/(^\s*)|(\s*$)/g, "");// 联系电话
			var callerNo = $("#callerNumber").val().replace(/(^\s*)|(\s*$)/g, "");// 主叫号码
			var subsNumber = $("#subsNumber").val().replace(/(^\s*)|(\s*$)/g, "");// 受理号码
			var whetherAccept =$("#whetherAccept").val();//是否受理
			if(whetherAccept=="01"){
				whetherAccept="30050004";
			}
			if(whetherAccept=="02"){
				whetherAccept="30050002";
			}
			if(whetherAccept==""){
				whetherAccept="30050002,30050004";
			}
			var subsBrand = $("#clientBrand").val();// 客户品牌
			var custLvlCd = $("#customerLevel").val();// 客户级别
			var acceptCity = $("#acceptArea").val();// 受理地区
			var urgentId = $("#urgentDegree").val();// 紧急程度
			 var srTypeId =$("#srtypeId").val();//业务类型
			 var casetypeCode =$("#casetypeCode").val();//业务类型
			var wrkfmStsCd = $("#wrkfmStsCd").val();//工单类型
			if(wrkfmStsCd.length==0){
				wrkfmStsCd='30010001';
			}
			var handlingStaff =$("#handlingStaff").val().replace(/(^\s*)|(\s*$)/g, "");//受理人
			var searchData = {
				"showSerialNo" : serialNo,
				"acceptStaffNo" : acceptstaffName,
				"subsNumber" : subsNumber,
				"acceptTimeStart" : acceptTimeStart,
				"acceptTimeEnd" : acceptTimeEnd,
				"contactPhone1" : contactPhone1,
				"callerNo" : callerNo,
				"subsBrand" : subsBrand,
				"custLvlCd" : custLvlCd,
				"acceptCity" : acceptCity,
				"urgentId" : urgentId,
				"workItemStsCd" : whetherAccept,
				"srTypeId" : srTypeId,
				"casetypeCode" : casetypeCode,
				"processState":wrkfmStsCd,
				"sorting":sorting,
				"sortField":sortField,
				"handlingStaff":handlingStaff,
				"dspsStaffNum":staffId
				//
			};
			console.log(searchData);
			num==0;
			list.search(searchData);
		}
		
            
   

                //重置表单
                $("#restForm").click(function(){
                	$('#assignmentOrderForm')[0].reset();
                });
                //处理人查询
                $('#queryPerson').click(function(){
                	$("#popUp").css("display","none");
                	$("#handstaff").css("display","block");
                });
                list.on('checkboxChange', function(e, item, checkedStatus) {// 事件处理代码
                	//选中的元素
                	num=$(".boxWraper input[type='checkbox']:checkbox:checked").length;
                	console.log(num)
                	$(".btnCustom0").val("已选择" + num + "条工单")
    			})
    			
                //查询取消
                $('#cancel').click(function(){
                	$("#handstaff").css("display","none");
                });
               
              //复选框条数
                $(".checkAllWraper input").change(function(){
                	var length=$(".checkAllWraper input[type='checkbox']:checked").length;
                	console.log(length)
                	if(1==length){
                		$(".boxWraper input[type='checkbox']").prop('checked',true);
                		var number=$(".boxWraper input[type='checkbox']:checkbox:checked").length;;
                		console.log(number)
                		$(".btnCustom0").val("已选择" + number + "条工单");
                	}else{
                		number=0
                		$(".btnCustom0").val("已选择" + number + "条工单");
                	}
                });
               //受理
                var claim=function(){
                	 var str = "";
 					var dates = list.getCheckedRows();
 					//条件查询参数序列化
 					var $form = $('#queryForm');
 					var result = Util.form.serialize($form);
 					if(dates.length=='0'){
 						pop.text({text:"请选择工单"});
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
						"dspsStaffNum":staffId,
						"dspsStaffName":staffName
					}
					// console.log(str);
					var url = "/ngwf_he/front/sh/workflow!execute?uid=claim001";
					Util.ajax.postJson(url,date,function(result, isOk) {
						if (result.returnCode=='0') {
							pop.text({text:"选择"+dates.length+"条工单,成功受理"+result.bean.successNum+"条工单"});
							loadDataList();
							num = 0;
							$(".btnCustom0").val("已选择" + num + "条工单");
						} else {
							pop.text({text:"受理不成功"});
							loadDataList();
							num = 0;
						}
					});
                }
                //释放
             var release=function(){
            	 var dates = list.getCheckedRows();
					var str = "";
					if (dates.length == 0) {
						pop.text({text:"请选择工单"});
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
					console.log(str)
					var date = {
						"workItemIds" : str,
						"dspsStaffNum":staffId,
						"dspsStaffName":staffName
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
							pop.text({text:"释放工单不成功"});
							loadDataList();
							num = 0;
							$(".btnCustom0").val("已选择" + num + "条工单");
						}
					});
				}
            //加入工单池
             var joinOrderPool=function(poolState){
            	 console.log("点击加入")
            	 var dates = list.getCheckedRows();
					if (dates.length == 0) {
						pop.text({text:"请选择工单"});
						return;
					}
					var str="";
					$.each(dates,function(index,obj){
						str+= obj.wrkfmShowSwftno + "#"
						+ obj.workItemId + "#"
						+ obj.wrkfmTypeCd
						+ "#" + obj.seqprcTmpltId
						+ "#" + obj.prstNodeId
						+ ",";
					});
					var url='/ngwf_he/front/sh/workflow!execute?uid=joinWorkPool';
					var data={"workItemIds" : str,
							"dspsStaffNum":staffId,
							'poolState':poolState,
							"dspsStaffName":staffName
							}
					Util.ajax.postJson(url,data,function(result,isOk){
						console.log(result)
						if(result.returnCode=='0'){
							if(poolState=='0'){
								
								pop.text({text:result.bean.successNum+'条工单加入白班工单池成功'});
							}else{
								pop.text({text:result.bean.successNum+'条工单加入夜班工单池成功'});
								
							}
							loadDataList();
							num = 0;
							$(".btnCustom0").val("已选择" + num + "条工单");
						}else{
							pop.text({text:"加入工单池操作不成功"});
							loadDataList();
							num = 0;
							$(".btnCustom0").val("已选择" + num + "条工单");
						}
					});
             }
             
             var batchAssign=function(){
            	 $('#assignOp').trigger("click");
            	 
             }
             $('#assignOp').click(function(){
            	 $("#popUp").css("display","block");
            	 $('#assignNum').html("目前共有"+totalCount+"条待指派工单");
             });
             
             $('#batchAssignButton').click(function(){
            	 
            	
            	 
            	 //指派操作
            	 	//指派工作组id
                 	var handGroupId= $('#dspsWorkGrpId').val();
                 	var hangGroupName= $('#dspsWorkGrpName').val();
                 	//指派人id
             		var handStaffId=$('#dspsStaffNum').val();
             		//指派人姓名
             		var handStaffName=$('#dspsStaffName').val();
 	               	var $queryForm=$('#assignmentOrderForm');
 	               	var queryParams = Util.form.serialize($queryForm);
 	               	var rows=list.getCheckedRows();
                 	//获取指派对象
                 	//var orderInput=$('#orderInput').attr("value");
 	               	var orderInput=$('#orderInput').data("abc");
                 	console.log(orderInput);
                 	//z指派数量的值
                 	var number=$('#assignOrderNum').val();
                 	console.log(number);
                 	if(orderInput== "" || orderInput == undefined || orderInput == null){
                 		pop.text({text:"请选择指派对象"});
                 		return;
                 	}
                 	if(rows.length==0&&(number== "" || number == undefined || number == null )){
                 		pop.text({text:"请选择一种工单指派方式"});
                 		return;
                 	}
                 	if(rows.length>0&&number!= 0){
                 		pop.text({text:"请选择一种工单指派方式"});
                 		return;
                 	}
                 	//将处理人框值清空
                 	$('#handStaffId').val("");
                 	//取消勾选状态
                 	simpleTree.checkAllNodes(false);
                 	$("#popUp").css("display","none");
                 	var url=""
                 	//指派数量大于查询总数,将查询总数指派给某人
                 	if(number>=totalCount&&rows.length==0){
                 		var url="/ngwf_he/front/sh/workflow!execute?uid=queryOrderByGroup&processState=30010001&workItemStsCd=30050004,30050002&start=0&limit="+totalCount
                 		+"&dspsStaffNum="+staffId+"&sortField="+sortField+"&sorting="+sorting;
                 		var data=queryParams;
                 		//重新查询
                 		Util.ajax.postJson(url,data,function(result,isOk){
                 			var dates=result.beans;
                 			var str="";
                 			if(isOk){
                 				$.each(dates,function(index,obj){
     								str+= obj.wrkfmShowSwftno + "#"
     								+ obj.workItemId + "#"
     								+ obj.wrkfmTypeCd
     								+ "#" + obj.seqprcTmpltId
     								+ "#" + obj.prstNodeId
     								+ ",";
     							});
                 				//将制定数量工单指派给某人HANDLINGORGACODE

                 				var url='/ngwf_he/front/sh/workflow!execute?uid=appoint';
                 				var data={'dspsStaffNum':staffId,'handlingOrgaCode':handGroupId,'workItemIds':str,
                 						"dspsStaffName":staffName,'handlingOrgaName':hangGroupName,'handStaffName':handStaffName,'handStaffId':handStaffId};

                 				Util.ajax.postJson(url,data,function(result,isOk){
                 					if(result.returnCode=='0'){
                 						pop.text({text:"选择"+number+"条工单,成功指派"+result.bean.successNum+"条工单"});
                 						loadDataList();
//                 						num = 0;
//            							$(".btnCustom0").val("已选择" + num + "条工单");
                 					}else{
                 						pop.text({text:"指派不成功"});
                 						loadDataList();
                 						num = 0;
            							$(".btnCustom0").val("已选择" + num + "条工单");
                 					}
                 				});
                 			}
                 		});
                 		$('#orderInput').attr("value","");
                 		//$('#orderInput').val("")
                 		$('#orderInput').data("abc","");
                 		$('#assignOrderNum').val("");
                 		$('#dspsWorkGrpId').val("");
                 		$('#dspsStaffNum').val("");
                 		$('#dspsStaffName').val("");
                 		$('#dspsWorkGrpName').val("");
                 		return;
                 	}
                 	if(number<totalCount&&rows.length==0){
                 		var url="/ngwf_he/front/sh/workflow!execute?uid=queryOrderByGroup&processState=30010001&workItemStsCd=30050004,30050002&start=0&limit="
                 			+number+"&dspsStaffNum="+staffId+"&sortField="+sortField+"&sorting="+sorting;
                 		var data=queryParams;
                 		//重新查询
                 		Util.ajax.postJson(url,data,function(result,isOk){
                 			var dates=result.beans;
                 			console.log(dates)
                 			var str="";
                 			if(isOk){
                 				console.log(result.beans)
                 				$.each(dates,function(index,obj){
 								str+= obj.wrkfmShowSwftno + "#"
 								+ obj.workItemId + "#"
 								+ obj.wrkfmTypeCd
 								+ "#" + obj.seqprcTmpltId
 								+ "#" + obj.prstNodeId
 								+ ",";
 							});
                 				//将制定数量工单指派给某人HANDLINGORGACODE

                 				var url='/ngwf_he/front/sh/workflow!execute?uid=appoint';
                 				var data={'dspsStaffNum':staffId,'handlingOrgaCode':handGroupId,'workItemIds':str,
                 						"dspsStaffName":staffName,'handlingOrgaName':hangGroupName,'handStaffName':handStaffName,'handStaffId':handStaffId};
                 				

                 				Util.ajax.postJson(url,data,function(result,isOk){
                 					if(isOk){
                 						pop.text({text:"选择"+number+"条工单,成功指派"+result.bean.successNum+"条工单"});
                 						loadDataList();
//                 						num = 0;
//            							$(".btnCustom0").val("已选择" + num + "条工单");
                 					}else{
                 						pop.text({text:"指派不成功"});
                 						loadDataList();
                 						num = 0;
            							$(".btnCustom0").val("已选择" + num + "条工单");
                 					}
                 				});
                 			}
                 		});
                 		$('#orderInput').attr("value","");
                 		$('#orderInput').val("")
                 		
                 		$('#assignOrderNum').val("");
                 		$('#dspsWorkGrpId').val("");
                 		$('#dspsStaffNum').val("");
                 		$('#dspsStaffName').val("");
                 		$('#dspsWorkGrpName').val("");
                 		return;
                 	}
                 	if(rows.length>0&&number== 0){
                 		var dates = list.getCheckedRows();
 						var str = "";
 						$.each(dates,function(index,obj){
 							str+= obj.wrkfmShowSwftno + "#"
 							+ obj.workItemId + "#"
 							+ obj.wrkfmTypeCd
 							+ "#" + obj.seqprcTmpltId
 							+ "#" + obj.prstNodeId
 							+ ",";
 						});

 						var url='/ngwf_he/front/sh/workflow!execute?uid=appoint';
 						var data={'dspsStaffNum':staffId,'handlingOrgaCode':handGroupId,'workItemIds':str,
         						"dspsStaffName":staffName,'handlingOrgaName':hangGroupName,'handStaffName':handStaffName,'handStaffId':handStaffId};

 						Util.ajax.postJson(url,data,function(result,isOk){
         					if(result.returnCode=='0'){
         						pop.text({text:"选择"+rows.length+"条工单,成功指派"+result.bean.successNum+"条工单"});
         						loadDataList();
//         						num = 0;
//    							$(".btnCustom0").val("已选择" + num + "条工单");
         					}else{
         						pop.text({text:"指派不成功"});
         						loadDataList();
         						num = 0;
    							$(".btnCustom0").val("已选择" + num + "条工单");
         					}
         				});
 						$('#orderInput').attr("value","");
                 		$('#orderInput').val("")
                 		$('#assignOrderNum').val("");
                 		$('#dspsWorkGrpId').val("");
                 		$('#dspsStaffNum').val("");
                 		$('#dspsStaffName').val("");
                 		$('#dspsWorkGrpName').val("");
 						return;
                 	}
                 	
             });
             //处理人查询
             $('#queyrHandStaff').click(function(){
            	 var handStaffId=$('#handStaffId').val();
            	 personList.search({"handStaffId":handStaffId});
            	 $("#handstaff").css("display","block");
             });
             

 			//处理人查询列表
 			$(function(){
                 var config = {
                     el:$('#personContainer'),
                     field:{
                         boxType:'checkbox',
                         key:'id',
                         items:[
                            {
                         	   text : '',
                         	   name : 'groupId',
                         	  className:'hide'   
                            },
								{
									text : '处理人工号',
									name : 'staffId'
								},
								{
									text : '处理人姓名',
									name : 'staffName'
								},
								{
									text : '处理组',
									name : 'groupName'
								}
                         ]                       
                     },
                     data:{
                         url:'/ngwf_he/front/sh/workflow!execute?uid=queryByStaffId',
                     }
                 };
                 personList = new List(config);
                
 			});
             //确定
             $('#confirmPerson').click(function(){
            	 
            	 var rows=personList.getCheckedRows();
            	 if(rows.length=='0'){
            		 pop.text({text:"请选择一个处理人"});
            		 return;
            	 }
            	 if(rows.length>1){
            		 pop.text({text:"请选择一个处理人"});
            		 return;
            	 }
             	var staffName=rows[0].staffName;
             	$('#orderInput').val(rows[0].groupName+" "+staffName);
         		//$('#orderInput').attr("value",rows[0].staffId);
         		$('#orderInput').data("abc",rows[0].staffId)
         		$('#dspsWorkGrpId').val(rows[0].groupId);
         		$('#dspsWorkGrpName').val(rows[0].groupName);
         		$('#dspsStaffNum').val(rows[0].staffId);
         		$('#dspsStaffName').val(rows[0].staffName);
         		$("#handstaff").css("display","none")
             })
              return initialize();
             
           //组装数据字典对象
             var wrapDictionray=function(dicName){
             	var params = {
             			method : "staticDictionary_get",
             			paramDatas : '{typeId:"' + dicName + '"}'
             		};
             	var obj={};
             	$.ajax({
             		url:"/ngwf_he/front/sh/common!execute?uid=callCSF",
             		dataType:"json",
             		data:params,
             		async:false,
             		success:function(result){
             			$.each(result.beans, function(index, bean) {
             				obj[bean.value]=bean.name;
             			});
             		}
             	});
             	return obj;
             } 
             
		})
