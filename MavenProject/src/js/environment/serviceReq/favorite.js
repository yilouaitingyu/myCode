define( [ 'Util','indexLoad','selectTree','date','dialog','js/components/ajaxfileupload'],
		function(Util,IndexLoad,SelectTree,MyDate,Dialog) {
			var _index;
			var staffId;
			var staffId_old;
			var _options;
			
			/**根据员工工号查询收藏夹短信*/
			var load=function(){
				staffId_old = _options.staffId;
				var html="";
				if(staffId_old == null || staffId_old ==""){
					crossAPI.tips("对不起没有对应的老工号！",1500);
					return;
				}
				Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=favoritMSG003',{"staffId":staffId_old},function(result){
					if(result.beans!="" || result.beans!=null){
						$.each(result.beans,function(i,bean){
							html +='<li><input type="checkbox" name="commonUse" val="'+ bean.messageID +'" value=" '+ bean.messageID +'" detail="'+bean.messageDetail+'"><a>'+bean.messageTitle+'</a></li>';
						})
					}
				},true)
				$('#favorite-div ul').append(html);
			}
			
			/**右侧节点选中后*/
			var nodeContent=function(){
				$(this).addClass('selectedli').siblings().removeClass('selectedli');
				var msgTitle= $(this).text();//名称
				var msgDetail = $(this).attr("detail");//内容
				$('#msgTitle').val(msgTitle);
				$('#msgContent').val(msgDetail);
			}
			
			/**左侧收藏夹节点选中事件*/
			var checkNode = function(){
				var html="";//追加元素
				var msgTitle="";//名称
				var msgId="";//短信模板id
				var msgDetail="";//内容
				if($(this).is(':checked')){
					msgId = $(this).val();
					msgTitle = $(this).parent('li').find('a').text();
					msgDetail = $(this).attr('detail');
					html += '<li id='+msgId+' detail='+msgDetail+'>'+msgTitle+'</li>';
					$('#msgName').append(html);
					$('#msgName li:last-child').addClass('selectedli').siblings().removeClass('selectedli');
				    msgTitle= $('#msgName li.selectedli').text();
					msgDetail = $('#msgName li.selectedli').attr("detail");
					$('#msgTitle').val(msgTitle);
					$('#msgContent').val(msgDetail);
				}else{
					val = $(this).val();
				    //$('#msgName').find('#'+ val).remove();
					$('#msgName li[id='+val+']').remove();
				    $('#msgTitle').val('');
					$('#msgContent').val('');
				}
			}
			
			/**删除节点事件*/
			var delTretNode=function(){
				var len=$('#favorite-div input[type="checkbox"]:checked').length;
				if(len<=0){
					crossAPI.tips("请选择要删除的短信",1500);
					return;
				}
				if(window.confirm("确定删除吗？")){
					var messageID="";
					$('#favorite-div input[type="checkbox"]:checked').each(function(){
						messageID +=$(this).attr('value')+",";
						$('#favorite-div input[type="checkbox"]:checked').parent('li').remove();
						//$('#msgName').find('#'+ $(this).attr('value')).remove();
						$('#msgName li[id='+$(this).attr('value')+']').remove();
					})
					messageID = messageID.substring(0,messageID.length-1);
				    //$('#msgName').html('');
					$('#msgTitle').val('');
					$('#msgContent').val('');
					var messageIdList = messageID.split(',');
					var data={
							"staffId":staffId_old,
							"messageIdList":messageIdList
					}
					Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=delFavoriteMSG001',data,function(data){
						crossAPI.popAlert(data.bean.delStatus,"删除收藏夹",function(){});
					},true);
				}
			}
			
			/**上移*/
			var moveUp=function(){
				var index = $('#msgName').find('.selectedli');
				if(index.index() != 0){
					index.prev().before(index);
				}
			}
			
			/**下移*/
			var moveDown=function(){
				var index = $('#msgName').find('.selectedli');
				if(index.index() != length-1){
					index.next().after(index);
				}
			}
			
			/**删除*/
			var delRow=function(){
				var msgId = $('#msgName li.selectedli').attr('id');
				$('#msgName').find('.selectedli').remove();
				$('#favorite-div input[type="checkbox"][val="'+msgId+'"]').attr("checked",false);
				$('#msgTitle').val('');
				$('#msgContent').val('');
			}
			/**清空*/
			var clearAll=function(){
				$('#msgName').html('');
				$('#msgTitle').val('');
				$('#msgContent').val('');
				$('#favorite-div input[type="checkbox"]').attr("checked",false);
			}
			/**立即发送*/
			/*var instantSend=function(){
				$('#chooseTime').hide();
			}*/
			/**定时发送*/
			/*var sendTiming=function(){
				$('#chooseTime').show();
				$('input[name="sendTime"]').val(getNowFormatDate());
			}*/
			/**导入联系人*/
            var importPersons=function(){
				var config = {
			            mode:'normal', 
			            delayRmove:300, 
			            title:'导入联系人',
			            content:
			            	'<div id="excel">'+
						    '<label>选择待读取的excel文件</label>'+
							'<input type="file" id="chooseExcel" name="chooseExcel">'+
						    '</div>'+
						    '<div class="excelA" id="excelA">'+
							'<ul>'+
							'<li>'+
							'<label>从第几行第几列读取Excel信息，默认为第一行第一列(最好是矩阵、整齐数据)</label>'+
							'</li>'+
							'<li>'+
							'<div>'+
							'<input type="text" value="1" id="rows" name="rows">行'+
							'<input type="text" value="1" id="cols" name="cols">列'+
							'</div>'+
							'</li>'+
							'</ul>'+
						    '</div>',
			            ok:function(){
							var file=$('input[type="file"]').val();
							var rows=$.trim($('#rows').val());
							var cols=$.trim($('#cols').val());
							if(file){
								$.ajaxFileUpload
					            ({
				                    url: '/ngwf_he/front/sh/sendMSG!importPhones?uid=importPhones001&rows='+rows+'&cols='+cols,
				                    secureuri: false, 
				                    fileElementId: "chooseExcel",
				                    dataType: 'JSON', 
				                    success: function (data)
				                    {
				                    	var phones =JSON.parse(data);
				                    	var dataBean={
				                    			"bean":phones.bean.phones
				                    	}
				                    	crossAPI.popAlert("解析成功！","导入结果",function(){});
				                    	$('#acceptMan option:first').text(phones.bean.phones)
				                    },
				                    error: function (data)
				                    {
				                    	alert("导入失败！");
				                    	dialog.remove();
				                    }
					            });
							}else{
								alert("请选择文件！");
							}
			            	
			            },
			            okValue: '确定', 
			            cancel: function(){
			            	dialog.remove();
			            },
			            cancelValue: '取消', 
			            cancelDisplay:true, 
			            width:600,
			            height:280,
			            skin:'dialogSkin',
			            fixed:false,
			            quickClose:false ,
			            modal:false 
			        }
				var dialog=new Dialog(config);
			}
			/**定时放送时间*/
			/*var date1 = new MyDate({
				el:$('#chooseTime'),
				label:'发送时间',
				name:'sendTime',    
				format: 'YYYY-MM-DD hh:mm:ss',  
				defaultValue:laydate.now(0)+' 00:00:00', 
				min: laydate.now(0),     
				istime: true,
				istoday: true,
				choose:function(){}
			});*/
			
			/**获取当前时间*/
			var getNowFormatDate=function() {
			    var date = new Date();
			    var seperator1 = "-";
			    var seperator2 = ":";
			    var month = date.getMonth() + 1;
			    var strDate = date.getDate();
			    var minutes = date.getMinutes();
			    var seconds = date.getSeconds();
			    if (month >= 1 && month <= 9) {
			        month = "0" + month;
			    }
			    if (strDate >= 0 && strDate <= 9) {
			        strDate = "0" + strDate;
			    }
			    if(minutes >=0 && minutes <=9){
			    	minutes ="0" + minutes;
			    }
			    if(seconds >=0 && seconds <=9) {
			    	seconds ="0" + seconds;
			    }
			    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			            + " " + date.getHours() + seperator2 + minutes
			            + seperator2 + seconds;
			    return currentdate;
			} 
			
			/**手机号验证*/
			var checkTelephone = function(num){
				if("," == num){
					return false;
				}
	            for(i=0;i< num.length;i++) {
	                if((num.charAt(i) >='0' &&(num.charAt(i) <='9')) || (num.charAt(i) == ',') )
	                {
	                    continue;
	                }
	                else
	                {
	                    return false;
	                }
	            }
            	return true;
            }
			
			/**发送短信*/
			var sendMSG = function(){
				var staffId=_index.getUserInfo().staffId;//工号
				var sender=$.trim($('#callerno option:selected').text());//发送者
				var receiver=$.trim($('#acceptMan').val());//接收者
				var arr2=[];//接受者数组
				var sendtime = getNowFormatDate();//发送时间
				var sendTemplateId="";//短信模板id
				var sendDetail="";//模板短信内容
				var sendStatus;//发送状态
				var sendFailRecord="";//发送失败条数记录
				var sendFlag=true;//发送成功标识
				var data={};//发送参数
				var data_contact={};//新增接触参数
				if(receiver==''){
					alert("接收人不可为空！");
					return;
				}
				var flag = checkTelephone(receiver);
				if(flag==false){
					crossAPI.tips("号码格式不正确！",1500);
					return;
				}
				/*if($('input[type="radio"]:checked').val()=='0'){
					sendtime = getNowFormatDate();
				}else{
					sendtime = $('input[name="sendTime"]').val();
				}*/
				var callcontent=$.trim($('#msgContent').val());//发送内容
				if(callcontent==''){
					alert("发送内容不可为空！");
					return;
				}
				if($('input[type="checkbox"][name="items"]').is(":checked")==true){//逐条发送
					$('#msgName li').each(function(){//循环发送
						sendTemplateId = $(this).attr('id');
						sendDetail =$(this).attr('detail');
						data ={
							"sender": sender,
						    "sendTemplateId": sendTemplateId,
						    "sendDetail": sendDetail,
							"beans":receiver
						}
						/**调发送接口*/
						Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=sendShortMsg001',data,function(status){
							sendStatus = status.returnCode;
						},true)
						
						/**发送成功后*/
						if(sendStatus=='0'){
							//crossAPI.popAlert("发送成功！","【短信发送结果】",function(){});
							arr2 = receiver.split(",");
							for(var i in arr2){
								data_contact={
										"channelId":"01",//接触渠道编号固定值
										"channelName":"人工",
										"mediaTypeId":"02",//02短信
										"mediaTypeName":"短信",
										"callType":"1",//0呼入1 呼出
										"callerNo":sender,
										"calledNo":arr2[i],
										"subsNumber":arr2[i],
										"staffId":staffId,
										"contactStartTime":sendtime,//接触开始时间
										"contactEndTime":sendtime,//接触结束时间
										"playRecordFlag":"0",//放音标识
										"surveyTypeId":"02",//满意度调查类型 0代表未调查
										"userSatisfy":"0",//未评价
										"hasRecordFile":"0",//是否有录音文件
										"msgType":"001",//文本
										"content":sendDetail,//消息内容
										"duration":"0",
										"srFlag":"0",//是否创建服务请求
										"serviceTypeId":"heytck",
										"originalCreateTime":sendtime
								}
								Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=afterSendMSG001',data_contact,function(data){
									/*if(data.returnCode=='0'){
										crossAPI.popAlert("添加接触记录成功！","【提示】",function(){});
									}else{
										crossAPI.popAlert("添加接触记录失败！","【提示】",function(){});
									}*/
								})
							}
						}else{
							sendFlag=false;
							sendFailRecord+=j+1+",";
							//crossAPI.popAlert("发送失败！请联系管理员！","短信发送结果",function(){});
						}
					})//end each循环
					if(sendFlag==true){
						crossAPI.popAlert("发送成功！","【短信发送结果】",function(){});
					}else{
						sendFailRecord=sendFailRecord.substring(0,sendFailRecord.length-1);
						crossAPI.popAlert("第"+sendFailRecord+"条发送失败！请联系管理员！","【短信发送结果】",function(){});
					}
				}else{//不是逐条发送，选中的发送
					sendTemplateId = $('#msgName').find('.selectedli').attr("id");
					sendDetail = $('#msgName').find('.selectedli').attr("detail");
					data={
							"sender": sender,
							"sendTemplateId": sendTemplateId,
							"sendDetail": sendDetail,
							"beans":receiver
					}
					Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=sendShortMsg001',data,function(status){
						sendStatus = status.returnCode;
					},true)
					
					/**发送成功后添加接触记录**/
					if(sendStatus=='0'){
						crossAPI.popAlert("发送成功！","【短信发送结果】",function(){});
						var arr2 = receiver.split(",");
						for(var i in arr2){
							data_contact = {
									"channelId":"01",//接触渠道编号固定值
									"channelName":"人工",
									"mediaTypeId":"02",//02短信
									"mediaTypeName":"短信",
									"callType":"1",//0呼入1 呼出
									"callerNo":sender,
									"calledNo":arr2[i],
									"subsNumber":arr2[i],
									"staffId":staffId,
									"contactStartTime":sendtime,//接触开始时间
									"contactEndTime":sendtime,//接触结束时间
									"playRecordFlag":"0",//放音标识
									"surveyTypeId":"02",//满意度调查类型 0代表未调查
									"userSatisfy":"0",//未评价
									"hasRecordFile":"0",//是否有录音文件
									"msgType":"001",//文本
									"content":sendDetail,//消息内容
									"duration":"0",
									"srFlag":"0",//是否创建服务请求
									"serviceTypeId":"heytck",
									"originalCreateTime":sendtime
							}
							Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=afterSendMSG001',data_contact,function(data){
								/*if(data.returnCode=='0'){
									crossAPI.popAlert("添加接触记录成功！","【提示】",function(){});
								}else{
									crossAPI.popAlert("添加接触记录失败！","【提示】",function(){});
								}*/
							})
						}
					}else{
						crossAPI.popAlert("发送失败！请联系管理员！","短信发送结果",function(){});
					}
				}
				crossAPI.destroyDialog();
			}
			
			/**初始化事件*/
			var eventInit = function() {
				load();
				/**获取受理号码*/
				crossAPI.getContact('getClientBusiInfo',function(businInfo){
					if(businInfo!=undefined && businInfo!="" && businInfo.bean!=undefined){
						$('#acceptMan').val( businInfo.bean.msisdn);
					}
				})
				/**受理号变更事件*/
				crossAPI.on('acceptNumberChange',function(data){
					$('#acceptMan').val(data);
				})
				$('#impoortPersons').on('click', importPersons);//导入联系人
				//$('#timingSend').on('click', sendTiming);//定时发送时间框显示
				//$('#instantSend').on('click', instantSend);//立即发送时间框隐藏
				$('#sendBtn').on('click', sendMSG);//发送信息按钮
				$('#moveUp').on('click',moveUp);//上移
				$('#moveDown').on('click',moveDown);//下移
				$('#delRow').on('click',delRow);//删除
				$('#clearAll').on('click',clearAll);//清空
				$('#delTretNode').on('click',delTretNode);//删除收藏的短信
				$('#favorite-div input[type="checkbox"]').on('click',checkNode);//左侧收藏夹节点选中事件
				$('#msgName').on('click','li',nodeContent);//右侧节点选中后
			}
			
			/**初始化加载*/
			IndexLoad(function(IndexModule, options){
				_index = IndexModule;
				_options = options;
				eventInit();
			})
			
})