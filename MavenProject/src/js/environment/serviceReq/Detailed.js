define(
		[ 'Util', 'list','validator','indexLoad'],
		function(Util, List,Validator,IndexLoad) {
			var _index;
			var _subslevel;
			var _subsbrand;
			var _languageid;
			var _acceptmode;
			var _contactchannel;
			var _subscity;
			var _urgentid;
			var _importance;
			var _priorityid;
			var _faultlocation;
			var _servicelevel;
			var _contactmode;
			var _mobiletype;
			var _id;
            var beanLen=0;
            var _options;
			var eventInit = function() {
				$('.jf-right-outer').on('mouseover','.textDiv-span',textDivs);
				//$('#moreNews').on("click",moreNews);
				$('#clickUrl').on("click",selectadd);
				creartSelect("NGCS.HEYTCK.GRADE", "用户级别","subslevel");
				creartSelect("HEBEI.DIC.SUBSBRAND", "用户品牌", "subsbrand");
				/*creartSelect("CSP.PUB.LANGUAGE", "语种","languageid");*/
				creartSelect("HEBEI.DIC.ACCEPTMODE", "受理方式","acceptmode");
				creartSelect("HEBEI.DIC.CONTACTCHANNEL", "受理渠道","contactchannel");/*
				creartSelect("CSP.CI.CUSTCITYCODE", "用户归属地","subscity");*/
				creartSelect("NGCS.HEYTCK.CITYCODE", "用户归属地", "subscity");
				creartSelect("HEBEI.EDUCATION.TYPE", "紧急程度","urgentid");
				creartSelect("CSP.PUB.IMPACT", "重要程度","importance");
				creartSelect("HEBEI.DIC.PRIORITYID", "优先级","priorityid");
				creartSelect("NGCS.HEYTCK.CITYCODE", "业务地市","faultlocation");
				creartSelect("HEBEI.DIC.SERVICELEVEL", "服务等级","servicelevel");
				creartSelect("HEBEI.TEL.TYPE", "联系方式","contactmode");
				creartSelect("HEBEI.DIC.MOBILETYPE", "手机型号","mobiletype");
				/*creartSelect("CSP.CI.CUSTCITYCODE", "用户归属局","acceptcity");*/
				
			};
			
			/**工作部门*/
			/**工作部门*/
			var dept = function(deptId){
				//console.log(deptId)
				var params = {
					 deptId:deptId
		  		}
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getOrgaInfoAccordOrgaId01',params,function(data){
					//console.log(data)
					//console.log(data.bean)
					if(data.bean.deptName!=null && data.bean.deptName!=undefined && data.bean.deptName!=""){
						val= data.bean.deptName;
					}else{
						val= "";
					}
				},true)
				return val;
			}
			
			
			var XQhtml=function(options){
				_id=options.custBean[0].id;
				beanLen=options.custBean.length;
				 var html ="";
					for(var i=0;i<options.custBean.length;i++){
						var fullname=options.custBean[i].fullname;
						options.custBean[i].index= i;
						if(typeof(fullname)=="undefined"){
							fullname='';
						}
						if(i==(options.custBean.length-1)){
							 var div=document.createElement("div");
							 div.id = ''+i+'';
							 div.setAttribute('class','baseInfoT baseInfoOpen'); 
							 div.innerHTML = '<a class="fl">原始记录&nbsp;&nbsp;&nbsp;&nbsp;</a>'
									+'<a class="customerInfo fl">修改工号<span id="dealstaff">'+options.dealstaff+'</span></a>'
									+'<span class="textDiv'+i+'  textDiv-span">'+fullname+'</span>'
									+'<i class="fr openTop" id="moreNews'+i+'" val="'+i+'"></i>';
							 var div2=document.createElement("div");
							 div2.setAttribute('class',"box-detial"+i+"  hide"); 
							 var doc = document.getElementById("XQhtml");
							 doc.appendChild(div);
							 doc.appendChild(div2);
						}else{
							 var div=document.createElement("div");
							 div.id = ''+i+'';
							 div.setAttribute('class','baseInfoT baseInfoOpen'); 
							 div.innerHTML = '<a class="fl">第&nbsp;<span id="recordNumber">'+eval(options.custBean.length-i-1)+'</span>&nbsp;条记录&nbsp;&nbsp;&nbsp;</a>'
						        +'<a class="customerInfo fl">修改工号<span id="dealstaff">'+options.dealstaff+'</span></a>'
						        +'<span class="textDiv'+i+' textDiv-span">'+fullname+'</span>'
						        +'<i class="fr openTop" id="moreNews'+i+'" val="'+i+'"></i>'	;
							 var div2=document.createElement("div");
							 div2.setAttribute('class',"box-detial"+i+"  hide"); 
							 var doc = document.getElementById("XQhtml");
							 doc.appendChild(div);
							 doc.appendChild(div2);
						}
					};
					for(var i = 0;i < beanLen;i++){
						
					$('#'+i+'').on("click",".openTop",function(){
						moreNews($(this).attr("val"),options)
					});
					}
			}
			var textDivs = function(){
				$(this).attr('title',$(this).text());
			}
			
			//点击打开展示异动详情
			 var moreNews = function(i,_options){
					$("#moreNews"+i+"").toggleClass('closeBottom');
					$('.box-detial'+i+'').toggleClass('hide');
					$('.textDiv'+i+'').toggleClass('hide');
					var html = $.ajax({
						  url: "Detailed2.html",
						  async: false
						 }).responseText;
					$('.box-detial'+i).html(html)

            		if(i!=(beanLen-1)){
            			adjunctionType(_options,i);
            		}else{
            			adjunction(_options,i);
            		}
			}
			var creartSelect = function(typeId, label, elID) {
				var params = {
					method : 'staticDictionary_get',
					paramDatas : '{typeId:"' + typeId + '"}'
				};
				Util.ajax.postJson(
						'/ngwf_he/front/sh/common!execute?uid=getDic01',
						params, function(result) {
							if(label=="用户品牌"){
								_subsbrand=result.beans;
							}else if(label=="语种"){
								_languageid=result.beans;
							}else if(label=="用户级别"){
								_subslevel=result.beans;
							}else if(label=="受理方式"){
								_acceptmode=result.beans;
							}else if(label=="受理渠道"){
								_contactchannel=result.beans;
							}else if(label=="用户归属地"){
								_subscity=result.beans;
							}else if(label=="紧急程度"){
								_urgentid=result.beans;
							}else if(label=="重要程度"){
								_importance=result.beans;
							}else if(label=="优先级"){
								_priorityid=result.beans;
							}else if(label=="业务地市"){
								_faultlocation=result.beans;
							}else if(label=="服务等级"){
								_servicelevel=result.beans;
							}else if(label=="联系方式"){
								_contactmode=result.beans;
							}else if(label=="手机型号"){
								_mobiletype=result.beans;
							}/*else if(label=="用户归属局"){
								_acceptcity=result.beans;
							}*/
						}, true);
			}
			//服务请求详情
			var selectadd=function(){
				var numberId =_id;
				Util.ajax.postJson('/ngwf_he/front/sh/serviceReqDetail!execute?uid=selectNumber',{"numberId":numberId},function(data){
					_index.createTab({
						 title:'服务请求详情',
						 url:''+getBaseUrl() + '/ngwf_he/src/html/serviceReq/serviceDetail.html', 
						 closeable:true, //选项卡是否可以关闭，支持true|fal或者1|0  addNumber
						 width:90,//选项卡宽度，单位px
						 option:{
							 "custBean":data.beans
						 }
					 });
				});
			}
			//路径
			var getBaseUrl = function () {
				var ishttps = 'https:' == document.location.protocol ? true: false;
				var url = window.location.host;
				if(ishttps){
					url = 'https://' + url;
				}else{
					url = 'http://' + url;
				}
				return url;
			}
			var adjunctionType=function(options,i){
				
				var len = options.custBean.length ;
				crossAPI.getIndexInfo(function(info){
					$('.box-detial'+i+' #dealstaff').html(info.staffId);
				});
				
					$('.box-detial'+i+' #fullname').html(options.custBean[i].fullname);
					
					var j= parseInt(i) + 1;
					
					var brand1 = "";
					var brand2 = "";
					if(options.custBean[j].subsbrand){
						brand1 = options.custBean[j].subsbrand;
					}
					if(options.custBean[i].subsbrand){
						brand2 = options.custBean[i].subsbrand;
					}
					
					if(brand1==brand2){
						$.each(_subsbrand,function(index,bean){//用户品牌
							if(bean.value==brand2){
								$('.box-detial'+i+' #subsbrand').val(bean.name);
							}
						});
					}else{
						$.each(_subsbrand,function(index,bean){//用户品牌
							if(bean.value==brand2){
								$('.box-detial'+i+' #subsbrand').val(bean.name);
							}
						});
						$('.box-detial'+i+' #subsbrandCope').css('color','red');
					}
					
					var level1 = "";
					var level2 = "";
					if(options.custBean[j].subslevel){
						level1 = options.custBean[j].subslevel;
					}
					if(options.custBean[i].subslevel){
						level2 = options.custBean[i].subslevel;
					}
					if(level1==level2){
						$.each(_subslevel,function(index,bean){//用户级别
							if(bean.value==level2){
								$('.box-detial'+i+' #subslevel').val(bean.name);
							}
						});
						$('.box-detial'+i+' #subslevelCope').css('color','black');
					}else{
						//debugger;
						$.each(_subslevel,function(index,bean){//用户级别
							if(bean.value==level2){
								$('.box-detial'+i+' #subslevel').val(bean.name);
							}
						});
						$('.box-detial'+i+' #subslevelCope').css('color','red');
					}
					
					var mobile1 = "";
					var mobile2 = "";
					if(options.custBean[j].mobiletype){
						mobile1 = options.custBean[j].mobiletype;
					}
					if(options.custBean[i].mobiletype){
						mobile2 = options.custBean[i].mobiletype;
					}
					if(mobile1==mobile2){
						$.each(_mobiletype,function(index,bean){//手机型号
							if(bean.value==mobile2){
								$('.box-detial'+i+' #mobiletype').val(bean.name);
							}
						});
					}else{
						$.each(_mobiletype,function(index,bean){//手机型号
							if(bean.value==mobile2){
								$('.box-detial'+i+' #mobiletype').val(bean.name);
							}
						});
						$('.box-detial'+i+' #mobiletypeCope').css('color','red');
					}
					
					var cmode1 = "";
					var cmode2 = "";
					if(options.custBean[j].contactmode){
						cmode1 = options.custBean[j].contactmode;
					}
					if(options.custBean[i].contactmode){
						cmode2 = options.custBean[i].contactmode;
					}
					if(cmode1==cmode2){
						$.each(_contactmode,function(index,bean){//联系方式
							if(bean.value==cmode2){
								$('.box-detial'+i+' #contactmode').val(bean.name);
							}
						});
					}else{
						$.each(_contactmode,function(index,bean){//联系方式
							if(bean.value==cmode2){
								$('.box-detial'+i+' #contactmode').val(bean.name);
							}
						});
						$('.box-detial'+i+' #contactmodeCope').css('color','red');
					}
					
					var slevel1 = "";
					var slevel2 = "";
					if(options.custBean[j].servicelevel){
						slevel1 = options.custBean[j].servicelevel;
					}
					if(options.custBean[i].servicelevel){
						slevel2 = options.custBean[i].servicelevel;
					}
					if(slevel1==slevel2){
						$.each(_servicelevel,function(index,bean){//服务等级
							if(bean.value==slevel2){
								$('.box-detial'+i+' #servicelevel').val(bean.name);
							}
						});
					}else{
						$.each(_servicelevel,function(index,bean){//服务等级
							if(bean.value==slevel2){
								$('.box-detial'+i+' #servicelevel').val(bean.name);
							}
						});
						$('.box-detial'+i+' #servicelevelCope').css('color','red');
						
					}
					
					var sub1;
					var sub2;
					if(!options.custBean[j].subscity ){
						sub1 = "";
					}else {
						sub1 = options.custBean[j].subscity;
					}
					if(!options.custBean[i].subscity ){
						sub2 = "";
					}else {
						sub2 = options.custBean[i].subscity;
					}
					if(sub1 == sub2){
						$.each(_subscity,function(index,bean){//用户归属地
							if(bean.value==sub2){
								$('.box-detial'+i+' #subscity').val(bean.name);
							}
						});
					}else{
						$.each(_subscity,function(index,bean){//用户归属地
							if(bean.value==sub2){
								$('.box-detial'+i+' #subscity').val(bean.name);
							}
						});
						$('.box-detial'+i+' #subscityCope').css('color','red');
					}
					//用户归属局
					var city1;
					var city2;
					if(!options.custBean[j].acceptcity ){
						city1 = "";
					}else {
						city1 = options.custBean[j].acceptcity;
					}
					if(!options.custBean[i].acceptcity){
						city2 = "";
					}else {
						city2 = options.custBean[i].acceptcity;
					}
					if(city1 == city2){
						$('.box-detial'+i+' #acceptcity').val(city2);
						
					}else{
						$('.box-detial'+i+' #acceptcity').val(city2);
						$('.box-detial'+i+' #acceptcityCope').css('color','red');
					}
					
					//用户姓名
					var name1 = "";
					var name2 = "";
					if(options.custBean[j].subsname ){
						name1 = options.custBean[j].subsname;
					}
					if(options.custBean[i].subsname ){
						name2 = options.custBean[i].subsname;
					}
					if(name1 == name2){
						$('.box-detial'+i+' #subsname').val(name2);
					}else{
						$('.box-detial'+i+' #subsname').val(name2);
						$('.box-detial'+i+' #subsnameCope').css('color','red');
					}
					
					//受理号码
					var snum1 = "";
					var snum2 = "";
					if(options.custBean[j].subsnumber){
						snum1 = options.custBean[j].subsnumber;
					}
					if(options.custBean[i].subsnumber){
						snum2 = options.custBean[i].subsnumber;
					}
					if(snum1==snum2){
						$('.box-detial'+i+' #subsnumber').val(snum2);
					}else{
						$('.box-detial'+i+' #subsnumber').val(snum2);
						$('.box-detial'+i+' #subsnumberCope').css('color','red');
					}
					//主叫号码
					var callerno1 = "";
					var callerno2 = "";
					if(options.custBean[j].callerno){
						callerno1 = options.custBean[j].callerno;
					}
					if(options.custBean[i].callerno){
						callerno2 = options.custBean[i].callerno;
					}
					if(callerno1==callerno2){
						$('.box-detial'+i+' #callerno').val(callerno2);
					}else{
						$('.box-detial'+i+' #callerno').val(callerno2);
						$('.box-detial'+i+' #callernoCope').css('color','red');
					}
					//联系电话1
					var cphone1 = "";
					var cphone2 = "";
					if(options.custBean[j].contactphone1){
						cphone1 = options.custBean[j].contactphone1;
					}
					if(options.custBean[i].contactphone1){
						cphone2 = options.custBean[i].contactphone1;
					}
					if(cphone1==cphone2){
						$('.box-detial'+i+' #contactphone1').val(cphone2);
					}else{
						$('.box-detial'+i+' #contactphone1').val(cphone2);
						$('.box-detial'+i+' #contactphone1Cope').css('color','red');
					}
					//联系人
					var cperson1 = "";
					var cperson2 = "";
					if(options.custBean[j].contactperson){
						cperson1 = options.custBean[j].contactperson;
					}
					if(options.custBean[i].contactperson){
						cperson2 = options.custBean[i].contactperson;
					}
					if(cperson1==cperson2){
						$('.box-detial'+i+' #contactperson').val(cperson2);
					}else{
						$('.box-detial'+i+' #contactperson').val(cperson2);
						$('.box-detial'+i+' #contactpersonCope').css('color','red');
					}
					//联系电话2
					var cphone21 = "";
					var cphone22 = "";
					if(options.custBean[j].contactphone2){
						cphone21 = options.custBean[j].contactphone2;
					}
					if(options.custBean[i].contactphone2){
						cphone22 = options.custBean[i].contactphone2;
					}
					if(cphone21==cphone22){
						$('.box-detial'+i+' #contactphone2').val(cphone22);
					}else{
						$('.box-detial'+i+' #contactphone2').val(cphone22);
						$('.box-detial'+i+' #contactphone2Cope').css('color','red');
					}
					//电子邮件
					var email1 = "";
					var email2 = "";
					if(options.custBean[j].email){
						email1 = options.custBean[j].email;
					}
					if(options.custBean[i].email){
						email2 = options.custBean[i].email;
					}
					if(email1==email2){
						$('.box-detial'+i+' #email').val(email2);
					}else{
						$('.box-detial'+i+' #email').val(email2);
						$('.box-detial'+i+' #emailCope').css('color','red');
					}
					//联系地址
					var address1 = "";
					var address2 = "";
					if(options.custBean[j].address){
						address1 = options.custBean[j].address;
					}
					if(options.custBean[i].address){
						address2 = options.custBean[i].address;
					}
					if(address1==address2){
						$('.box-detial'+i+' #address').val(address2);
					}else{
						$('.box-detial'+i+' #address').val(address2);
						$('.box-detial'+i+' #addressCope').css('color','red');
					}
					//受理基本信息
						
						//服务标题
						var stitle1 = "";
						var stitle2 = "";
						if(options.custBean[j].servicetitle){
							stitle1 = options.custBean[j].servicetitle;
						}
						if(options.custBean[i].servicetitle){
							stitle2 = options.custBean[i].servicetitle;
						}
						if(stitle1==stitle2){
							$('.box-detial'+i+' #servicetitle').val(stitle2);
						}else{
							$('.box-detial'+i+' #servicetitle').val(stitle2);
							$('.box-detial'+i+' #servicetitleCope').css('color','red');
						}
						//请求编码
						var id1 = "";
						var id2 = "";
						if(options.custBean[j].id){
							id1 = options.custBean[j].id;
						}
						if(options.custBean[i].id){
							id2 = options.custBean[i].id;
						}
						if(id1==id2){
							$('.box-detial'+i+' #id').val(id2);
						}else{
							$('.box-detial'+i+' #id').val(id2);
						}
						//受理工号
						var astaff1 = "";
						var astaff2 = "";
						if(options.custBean[j].acceptstaffno){
							astaff1 = options.custBean[j].acceptstaffno;
						}
						if(options.custBean[i].acceptstaffno){
							astaff2 = options.custBean[i].acceptstaffno;
						}
						if(astaff1==astaff2){
							$('.box-detial'+i+' #acceptstaffno').val(astaff2);
						}else{
							$('.box-detial'+i+' #acceptstaffno').val(astaff2);
							$('.box-detial'+i+' #acceptstaffnoCope').css('color','red');
						}
						//受理部门
						var asdept = "";
						if(options.custBean[i].acceptstaffdept){
							asdept = options.custBean[i].acceptstaffdept;
						}
						$('.box-detial'+i+' #acceptstaffdept').val(dept(asdept));
						//受理时间
						var atime1 = "";
						var atime2 = "";
						if(options.custBean[j].accepttime){
							atime1 = options.custBean[j].accepttime;
						}
						if(options.custBean[i].accepttime){
							atime2 = options.custBean[i].accepttime;
						}
						if(atime1==atime2){
							$('.box-detial'+i+' #accepttime').val(atime2);
						}else{
							$('.box-detial'+i+' #accepttime').val(atime2);
							$('.box-detial'+i+' #accepttimeCope').css('color','red');
						}
						//受理方式
						var amode1 = "";
						var amode2 = "";
						if(options.custBean[j].acceptmode){
							amode1 = options.custBean[j].acceptmode;
						}
						if(options.custBean[i].acceptmode){
							amode2 = options.custBean[i].acceptmode;
						}
						if(amode1==amode2){
							$.each(_acceptmode,function(index,bean){
								if(bean.value==amode2){
									$('.box-detial'+i+' #acceptmode').val(bean.name);
								}
							});
						}else{
							$.each(_acceptmode,function(index,bean){
								if(bean.value==amode2){
									$('.box-detial'+i+' #acceptmode').val(bean.name);
								}
							});
							$('.box-detial'+i+' #acceptmodeCope').css('color','red');
						}
						//受理渠道
						var cchannel1 = "";
						var cchannel2 = "";
						if(options.custBean[j].contactchannel){
							cchannel1 = options.custBean[j].contactchannel;
						}
						if(options.custBean[i].contactchannel){
							cchannel2 = options.custBean[i].contactchannel;
						}
						if(cchannel1==cchannel2){
							$.each(_contactchannel,function(index,bean){
								if(bean.value==cchannel2){
									$('.box-detial'+i+' #contactchannel').val(bean.name);
								}
							});
						}else{
							$.each(_contactchannel,function(index,bean){
								if(bean.value==cchannel2){
									$('.box-detial'+i+' #contactchannel').val(bean.name);
								}
							});
							$('.box-detial'+i+' #contactchannelCope').css('color','red');
						}
						//业务地市
						var fction1 = "";
						var fction2 = "";
						if(options.custBean[j].faultlocation){
							fction1 = options.custBean[j].faultlocation;
						}
						if(options.custBean[i].faultlocation){
							fction2 = options.custBean[i].faultlocation;
						}
						if(fction1==fction2){
							$.each(_faultlocation,function(index,bean){
								if(bean.value==fction2){
									$('.box-detial'+i+' #faultlocation').val(bean.name);
								}
							});
						}else{
							$.each(_faultlocation,function(index,bean){
								if(bean.value==fction2){
									$('.box-detial'+i+' #faultlocation').val(bean.name);
								}
							});
							$('.box-detial'+i+' #faultlocationCope').css('color','red');
						}
						//紧急程度
						var uid1 = "";
						var uid2 = "";
						if(options.custBean[j].urgentid){
							uid1 = options.custBean[j].urgentid;
						}
						if(options.custBean[i].urgentid){
							uid2 = options.custBean[i].urgentid;
						}
						if(uid1==uid2){
							$.each(_urgentid,function(index,bean){
								if(bean.value==uid2){
									$('.box-detial'+i+' #urgentid').val(bean.name);
								}
							});
						}else{
							$.each(_urgentid,function(index,bean){
								if(bean.value==uid2){
									$('.box-detial'+i+' #urgentid').val(bean.name);
								}
							});
							$('.box-detial'+i+' #urgentidCope').css('color','red');
						}
						//重要程度
						var importance1 = "";
						var importance2 = "";
						if(options.custBean[j].importance){
							importance1 = options.custBean[j].importance;
						}
						if(options.custBean[i].importance){
							importance2 = options.custBean[i].importance;
						}
						if(importance1==importance2){
							$.each(_importance,function(index,bean){
								if(bean.value==importance2){
									$('.box-detial'+i+' #importance').val(bean.name);
								}
							});
						}else{
							$.each(_importance,function(index,bean){
								if(bean.value==importance2){
									$('.box-detial'+i+' #importance').val(bean.name);
								}
							});
							$('.box-detial'+i+' #importanceCope').css('color','red');
						}
						//优先级
						var pid1 = "";
						var pid2 = "";
						if(options.custBean[j].priorityid){
							pid1 = options.custBean[j].priorityid;
						}
						if(options.custBean[i].priorityid){
							pid2 = options.custBean[i].priorityid;
						}
						if(pid1==pid2){
							$.each(_priorityid,function(index,bean){
								if(bean.value==pid2){
									$('.box-detial'+i+' #priorityid').val(bean.name);
								}
							});
						}else{
							$.each(_priorityid,function(index,bean){
								if(bean.value==pid2){
									$('.box-detial'+i+' #priorityid').val(bean.name);
								}
							});
							$('.box-detial'+i+' #priorityidCope').css('color','red');
						}
						//反馈时间
						var ftime1 = "";
						var ftime2 = "";
						if(options.custBean[j].factfeedbacktime){
							ftime1 = options.custBean[j].factfeedbacktime;
						}
						if(options.custBean[i].factfeedbacktime){
							ftime2 = options.custBean[i].factfeedbacktime;
						}
						if(ftime1==ftime2){
							$('.box-detial'+i+' #factfeedbacktime').val(ftime2);
						}else{
							$('.box-detial'+i+' #factfeedbacktime').val(ftime2);
							$('.box-detial'+i+' #factfeedbacktimeCope').css('color','red');
						}
						//重复标记
						var rflag1 = "";
						var rflag2 = "";
						if(options.custBean[j].repeatflag){
							rflag1 = options.custBean[j].repeatflag;
						}
						if(options.custBean[i].repeatflag){
							rflag2 = options.custBean[i].repeatflag;
						}
						if(rflag1==rflag2){
							if(rflag2=="Y"){
								$('.box-detial'+i+' #repeatflag').attr("checked","checked");
							}
							
						}else{
							if(rflag2=="Y"){
								$('.box-detial'+i+' #repeatflag').attr("checked","checked");
							}
							$('.box-detial'+i+' #repeatflagCope').css('color','red');
						}
						//特殊要求
						var clanguage1 = "";
						var clanguage2 = "";
						if(options.custBean[j].commonlanguage){
							clanguage1 = options.custBean[j].commonlanguage;
						}
						if(options.custBean[i].commonlanguage){
							clanguage2 = options.custBean[i].commonlanguage;
						}
						if(clanguage1==clanguage2){
							$('.box-detial'+i+' #commonlanguage').val(clanguage2);
						}else{
							$('.box-detial'+i+' #commonlanguage').val(clanguage2);
							$('.box-detial'+i+' #commonlanguageCope').css('color','red');
						}
						
					
						//业务内容
						var content1;
						var content2;
						if(!options.custBean[j].servicecontent){
							content1 = "";
						}else {
							content1 = options.custBean[j].servicecontent;
						}
						if(!options.custBean[i].servicecontent ){
							content2 = "";
						}else {
							content2 = options.custBean[i].servicecontent;
						}
						//console.log(content2);
						if(content1==content2){
							$('.box-detial'+i+' #servicecontent').val(content2);
						}else{
							//debugger;
							$('.box-detial'+i+' #servicecontent').val(content2);
							$('.box-detial'+i+' #servicecontentCope').css('color','red');
							//$('.box-detial'+i+' .serveContents').css('color','red');
						}
					
				
				}
			
			var adjunction=function(options,i){
					crossAPI.getIndexInfo(function(info){
						$(".box-detial"+i+" #dealstaff").html(info.staffId);
					});
					var fullname = "";//类别
					if(options.custBean[i].fullname){
						fullname = options.custBean[i].fullname;
					}
					$('.box-detial'+i+' #fullname').html(fullname);
					
					var servicetitle = "";//服务标题
					if(options.custBean[i].servicetitle){
						servicetitle = options.custBean[i].servicetitle;
					}
					$('.box-detial'+i+' #servicetitle').html(servicetitle);
					
					var subsname = "";//用户姓名
					if(options.custBean[i].subsname){
						subsname = options.custBean[i].subsname;
					}
					$('.box-detial'+i+' #subsname').val(subsname);
					
					var subsnumber = "";//受理号码
					if(options.custBean[i].subsnumber){
						subsnumber = options.custBean[i].subsnumber;
					}
					$('.box-detial'+i+' #subsnumber').val(subsnumber);
					
					var callerno = "";//主叫号码
					if(options.custBean[i].callerno){
						callerno = options.custBean[i].callerno;
					}
					$('.box-detial'+i+' #callerno').val(callerno);
					
					var contactphone1 = "";//联系电话1
					if(options.custBean[i].contactphone1){
						contactphone1 = options.custBean[i].contactphone1;
					}
					$('.box-detial'+i+' #contactphone1').val(contactphone1);
					
					var contactperson = "";//联系人
					if(options.custBean[i].contactperson){
						contactperson = options.custBean[i].contactperson;
					}
					$('.box-detial'+i+' #contactperson').val(contactperson);
					
					var subslevel = "";
					if(options.custBean[i].subslevel){
						subslevel = options.custBean[i].subslevel;
					}
					$.each(_subslevel,function(index,bean){//用户级别
						if(bean.value==subslevel){
							$('.box-detial'+i+' #subslevel').val(bean.name);
						}
					});
					
					var brand = "";//用户品牌
					if(options.custBean[i].subsbrand){
						brand = options.custBean[i].subsbrand;
					}
					$.each(_subsbrand,function(index,bean){
						if(bean.value==brand){
							$('.box-detial'+i+' #subsbrand').val(bean.name);
						}
					});
					

					var contactphone2 = "";//联系电话2
					if(options.custBean[i].contactphone2){
						contactphone2 = options.custBean[i].contactphone2;
					}
					$('.box-detial'+i+' #contactphone2').val(contactphone2);
					
					
					var mobiletype = "";
					if(options.custBean[i].mobiletype){
						mobiletype = options.custBean[i].mobiletype;
					}
					$.each(_mobiletype,function(index,bean){//手机型号
						if(bean.value==mobiletype){
							$('.box-detial'+i+' #mobiletype').val(bean.name);
						}
					});
					
					$.each(_contactmode,function(index,bean){//联系方式
						if(bean.value==options.custBean[i].contactmode){
							$('.box-detial'+i+' #contactmode').val(bean.name);
						}
					});
					
					var servicelevel = "";
					if(options.custBean[i].servicelevel){
						servicelevel = options.custBean[i].servicelevel;
					}
					$.each(_servicelevel,function(index,bean){//服务等级
						if(bean.value==servicelevel){
							$('.box-detial'+i+' #servicelevel').val(bean.name);
						}
					});
					
					var subscity = "";//用户归属地
					if(options.custBean[i].subscity){
						subscity = options.custBean[i].subscity;
					}
					$.each(_subscity,function(index,bean){
						if(bean.value==subscity){
							$('.box-detial'+i+' #subscity').val(bean.name);
						}
					});
					
					var acceptcity = "";//用户归属局
					if(options.custBean[i].acceptcity){
						acceptcity = options.custBean[i].acceptcity;
					}
					$('.box-detial'+i+' #acceptcity').val(acceptcity);
					
					var email = "";//电子邮件
					if(options.custBean[i].email){
						acceptcity = options.custBean[i].email;
					}
					$('.box-detial'+i+' #email').val(email);
					
					var address = "";//联系地址
					if(options.custBean[i].address){
						address = options.custBean[i].address;
					}
					$('.box-detial'+i+' #address').val(address);
					
					var id = "";//请求编码
					if(options.custBean[i].id){
						id = options.custBean[i].id;
					}
					$('.box-detial'+i+' #id').val(id);
					
					var acceptstaffno = "";//受理工号
					if(options.custBean[i].acceptstaffno){
						acceptstaffno = options.custBean[i].acceptstaffno;
					}
					$('.box-detial'+i+' #acceptstaffno').val(acceptstaffno);
					
					var acceptstaffdept = "";//受理部门
					if(options.custBean[i].acceptstaffdept){
						acceptstaffdept = options.custBean[i].acceptstaffdept;
					}
					$('.box-detial'+i+' #acceptstaffdept').val(dept(acceptstaffdept));
					
					var accepttime = "";//受理时间
					if(options.custBean[i].accepttime){
						accepttime = options.custBean[i].accepttime;
					}
					
					var acceptmode = "";//受理方式
					if(options.custBean[i].acceptmode){
						acceptmode = options.custBean[i].acceptmode;
					}
					$.each(_acceptmode,function(index,bean){
						if(bean.value==acceptmode){
							$('.box-detial'+i+' #acceptmode').val(bean.name);
						}
					});
					
					var contactchannel = "";//受理渠道
					if(options.custBean[i].contactchannel){
						contactchannel = options.custBean[i].contactchannel;
					}
					$.each(_contactchannel,function(index,bean){
						if(bean.value==contactchannel){
							$('.box-detial'+i+' #contactchannel').val(bean.name);
						}
					});
					var faultlocation = "";//业务地市
					if(options.custBean[i].faultlocation){
						faultlocation = options.custBean[i].faultlocation;
					}
					$.each(_faultlocation,function(index,bean){
						if(bean.value==faultlocation){
							$('.box-detial'+i+' #faultlocation').val(bean.name);
						}
					});
					
					var urgentid = "";//紧急程度
					if(options.custBean[i].urgentid){
						urgentid = options.custBean[i].urgentid;
					}
					$.each(_urgentid,function(index,bean){
						if(bean.value==urgentid){
							$('.box-detial'+i+' #urgentid').val(bean.name);
						}
					});
					
					var importance = "";//重要程度
					if(options.custBean[i].importance){
						importance = options.custBean[i].importance;
					}
					$.each(_importance,function(index,bean){
						if(bean.value==importance){
							$('.box-detial'+i+' #importance').val(bean.name);
						}
					});
					var priorityid = "";//优先级
					if(options.custBean[i].priorityid){
						priorityid = options.custBean[i].priorityid;
					}
					$.each(_priorityid,function(index,bean){
						if(bean.value==priorityid){
							$('.box-detial'+i+' #priorityid').val(bean.name);
						}
					});
					$('.box-detial'+i+' #accepttime').val(accepttime);
					
					var factfeedbacktime = "";//反馈时间
					if(options.custBean[i].factfeedbacktime){
						factfeedbacktime = options.custBean[i].factfeedbacktime;
					}
					$('.box-detial'+i+' #factfeedbacktime').val(factfeedbacktime);
					
					
					var repeatflag = "";//重复标记
					if(options.custBean[i].repeatflag){
						repeatflag = options.custBean[i].repeatflag;
					}
					if(repeatflag=="Y"){
						$('.box-detial'+i+' #repeatflag').attr("checked","checked");
					}
					
					var commonlanguage = "";//特殊要求
					if(options.custBean[i].commonlanguage){
						commonlanguage = options.custBean[i].commonlanguage;
					}
					$('.box-detial'+i+' #commonlanguage').val(commonlanguage);
					
					//业务内容
					var content = "";
					if(options.custBean[i].servicecontent){
						content = options.custBean[i].servicecontent;
					}
					$('.box-detial'+i+' #servicecontent').val(content);
					
				}
			
			IndexLoad(function(IndexModule, options){
				_options = options;
				_index = IndexModule;
				//事件初始化
				eventInit();
				XQhtml(_options);
			 });
		});
