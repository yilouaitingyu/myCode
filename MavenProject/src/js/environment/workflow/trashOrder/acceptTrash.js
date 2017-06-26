define(
		[ 'Util', 'date', 'list', 'select', 'dialog', 'crossAPI', 'hdb','../query/commonQuery' ],
		function(Util, MyDate, List, Select, Dialog, CrossAPI, hdb) {
			//定义全局变量
			var html="";
			//定义下拉框对象
			var json={};
			//当前操作人handlingstaff
			var currentUser;

			//初始化方法
			var initialize = function(){

				loadDictionary('staticDictionary_get', 'HEBEI.TRASH.QUESTIONTYPE',
				'compltTypeCd');// 加载问题分类
				loadDictionary('staticDictionary_get', 'HEBEI.TRASH.CONTENTTYPE',
				'compltCnttTypeNm');// 加载内容分类
				var source   = $("#itemTemplate").html();
				var template = hdb.compile(source);
				html=template(json);

				trashDate();
				deleteItem();
				addItem();
				addItemClick();
				crossAPI.getIndexInfo(function(info){
					currentUser=info.userInfo;
//					currentUser.staffId='zuohuijun';
//					currentUser.staffName='左慧君';
//					currentUser.deptId='2017040700102';
					console.log(currentUser);
					orderSubmit();
				});
				
				changeContentTemplate();
			};
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
					json[seleId]=seleOptions;
				}, true);
			};
			// 时间插件
			var trashDate = function(){
				var date=new Date();
				new MyDate({
					el:$('#acptTime'),
					label:'举报日期',
					name:'acptTime',    //开始日期文本框name
					format: 'YYYY/MM/DD hh:mm:ss',    //日期格式
					defaultValue:date.Format('yyyy/MM/dd hh:mm:ss'),     //默认日期值
					min: laydate.now(0),         //最小日期限制
					istime: true,    
					istoday: false,
					choose:function(){} //用户选中日期时执行的回调函数
				});
			}

			//删除被举报信息
			var deleteItem = function(){
				$(".deleteItem").click(function(){
					$(this).parent().parent().remove();
				});
			}
			//增加被举报信息
			var addItem = function (){
				$("#addItem").before(html);
				deleteItem();
				changeContentTemplate();
			}
			var addItemClick = function(){
				$("#addItem").click(function(){
					var length=$(".multul").length;
					if(length>=10){
						crossAPI.tips("最多添加10条被举报信息！",3000);
					}else{
						addItem();
					}
				});
			}

			//提交表单
			var orderSubmit = function(){
				$("#orderSubmit").click(function(){
					var acptTelnum=$("#acptNum").val();//举报号码
					var acptTime=$("#acptTime input").val();//举报日期
					var needRplFlag=$("#needRevstFlag").val();//是否要求电话回复

					var targets=[];
					$(".multul").each(function(){
						var target={};
						target.pubdynchar71=$(this).find(".byCompltTelnum > div > input").val();
						target.pubdynchar73=$(this).find(".compltTypeCd").val();
						target.pubdynchar74=$(this).find(".compltCnttTypeNm").val();
						target.srvReqstCntt=$(this).find(".bizCntt")[0].value;
						
						//举报途径：01,10086热线
						target.pubdynchar76='01';
						//紧急程度  ： 01，一般
						target.urgntExtentId='01';
						target.bizTypeId=getBizTypeId(target.pubdynchar73);
						targets.push(target);
					});

					// 号码有效性验证
					var checkNumber = false;
					for(var i = 0; i < targets.length; i++) {
						if(targets[i].pubdynchar71 == acptTelnum || targets[i].pubdynchar71.length < 5) {
							checkNumber = true;
							break;
						}
					}
					if(checkNumber) {
						crossAPI.tips("尊敬的客户，您举报的号码有误，请您核实后重新举报，感谢您的合作！",3000);
						return;
					}

					var params={
							"acptTelnum":acptTelnum,
							"acptTime":acptTime,
							"needRplFlag":needRplFlag,
							"targets":JSON.stringify(targets),
							"loginStaffId":currentUser.staffId,
							"acptStaffName":currentUser.staffName,
							"acptDeptId":currentUser.deptId,
							"acptStaffNum":currentUser.staffId
							
					};
					console.log(params);
					Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=acceptTrash',
							params, function(result) {
						var normalJson = result.bean.normalJson;
						var duplicateJson = result.bean.duplicateJson;
						var normalSize = JSON.parse(normalJson).length; // 成功量
						var duplicateSize = JSON.parse(duplicateJson).length; // 重复量
						var duplicateList = JSON.parse(duplicateJson); // 重复量
						var duplicateStr = "";
						for(var i = 0; i < duplicateSize; i++) {
							duplicateStr += duplicateList[i].byCompltTelnum + ",";
						}
						if(duplicateStr.length > 0) {
							duplicateStr = duplicateStr.substring(0, duplicateStr.length-1);
						}
						if(duplicateSize > 0) {
							crossAPI.tips("成功举报:" + normalSize + "个\r\n" + "重复举报号码：" + duplicateStr,3000);
						} else {
							crossAPI.tips("成功举报:" + normalSize + "个",3000);
						}
						console.log(result);
					});

				});
			}
			
			//获取服务请求类型代码(四级编码)
			var getBizTypeId = function(obj){
				var value;
				if(obj==01){
					value='01010204';
				}else if(obj==02){
					value='01010206';
				}
				else if(obj==03){
					value='01010205';
				}
				else if(obj==04){
					value='01010207';
				}
				return value;
			}

			var changeContentTemplate = function (){
				//短信举报内容模板
				var smsTemplate;
				//骚扰电话举报内容模板
				var phoneTemplate;
				//彩信举报内容模板
				var mmsTemplate;
				//不良网站举报内容模板
				var webTemplate;
				var params="";
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryReportContentTemplate',
						params, function(result) {
					var data ={};
					data=result.beans;	
					for(var a=0;a<data.length;a++){
						if(data[a].compltQuTypeId=='01'){
							smsTemplate = data[a].cnttTmpltCntt;
						}
						if(data[a].compltQuTypeId=='02'){
							phoneTemplate = data[a].cnttTmpltCntt;
						}
						if(data[a].compltQuTypeId=='03'){
							mmsTemplate = data[a].cnttTmpltCntt;
						}
						if(data[a].compltQuTypeId=='04'){
							webTemplate = data[a].cnttTmpltCntt;
						}
					}
				});
			
				$(".compltTypeCd").change(function(){
					var value=$(this).val();
					var textNode=$(this).parent().parent().next().next().children("div").children("textarea")[0];		
					if(value=='01'){
						textNode.value=smsTemplate.replace(/\\n/g,"\n");
					}
					if(value=='02'){
						textNode.value=phoneTemplate.replace(/\\n/g,"\n");
					}
					if(value=='03'){
						textNode.value=mmsTemplate.replace(/\\n/g,"\n");
					}
					if(value=='04'){
						textNode.value=webTemplate.replace(/\\n/g,"\n");
					}

				});
			}
			return initialize();
			// 最外层require
		})
