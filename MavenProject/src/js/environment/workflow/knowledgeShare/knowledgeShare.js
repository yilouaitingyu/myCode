define(['Util','list','../query/commonQuery'],   
	function(Util,list){
		var list;
		var _options;
		var currentUser;
		var staffName;
		//得到员工ID
		var staffIdInit = function()
		{
			CrossAPI.getIndexInfo(function(info){
				currentUser=info.userInfo.staffId;
	        	staffName=info.userInfo.staffName;
	        })
		}
		var initialize = function(index,options){
			staffIdInit();
			_options = options;
			eventInit();
			dataShow();
		};		

		var eventInit=function(){
			$('.klsDelete').on('click',klsDelete);
			$('.klsAdd').on('click',klsAdd);
			$('#kls_commitcheck').on('click',saveKnowledge);
			$('#kls_shortsave').on('click',saveKnowledge);
		};
		/*保存数据*/
		var saveKnowledge = function(){
			var serialno = $('#kls_linkcomform').val();//工单号
			var receivecity =$('#kls_acceptlocal').val();//受理地市
			var operatorid = staffName;						//操作人
			var lastmodifiedperson =  staffName;                  //最后更新人
			//var acceptstaffname = $('#kls_buildpeople').val(); //建单人
			var acceptstaffname = "曾思逗"; //建单人
			var colukngname = $('#kls_knowtitle').val();//知识标题
			var colukngcategory =$('#kls_knowclass').val();//知识分类
			var keywordslength=$('#kls_impotletter div input').size();
			var str = '';
			for(var i=0;i<keywordslength;i++){
				var keyword =$('#kls_impotletter div input').eq(i).val();
				str += keyword+",";
			}
			var keywords = str.substring(0,str.length-1); 
			console.log(keywords);
//			var keywords =$('#kls_impotletter div input').val();//关键字
			
			var complaintcontenet = $('#kls_complainmain').val();//投诉内容
			var handledetails = $('#kls_todoisok').val();//处理详情
			var colukngdesc = $('#kls_talkanswer').val();//案例点评
			var state;
			if ($(this).attr('id')=="kls_commitcheck") { //判断点击的按钮以增加不同的状态
				state = "1";
			}
			if ($(this).attr('id')=="kls_shortsave") {
				state = "2";
			}
			var data = {
					"serialno":serialno,
					"receivecity":receivecity,
					"operatorid":operatorid,
					"lastmodifiedperson":lastmodifiedperson,
					//"acceptstaffname":acceptstaffname,
					"acceptstaffname":acceptstaffname,
					"colukngname":colukngname,
					"colukngcategory":colukngcategory,
					"keywords":keywords,
					"complaintcontenet":complaintcontenet,
					"handledetails":handledetails,
					"colukngdesc":colukngdesc,
					"state":state
			}
			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=knowledgeShare001',data,function(result){
				console.log(result);
			},true);
		}
		//提交数据后要清空当前数据
		
		/*数据回填*/
		var nowDate = new Date();
		var time2 = nowDate.Format("yyyy-MM-dd hh:mm:ss");
		var dataShow = function(){
			$('#kls_buildpeople').val(getUserInfo().name);//建单人
			$('#kls_acceptlocal').val("河南 郑州");//受理地市
			$('#kls_linkcomform').val("201704062001");//工单号
			$('#kls_buildtime').val(time2);//建单时间
		}
		var dateInit = function(){
		};
		/*删除关键字框*/
		var klsDelete = function(){
			$(this).parent().remove();
		};
		/*增加关键字框*/
		var klsAdd = function(){
			var addagain='<div class=klscommon>'+
				'<input type="text" />'+
					'<span class="klsDelete">——</span>'+
				'</div>'
				$(addagain).insertBefore($('#klsAddcon'));
			$('.klsDelete').on('click',klsDelete);
		}
//      动态获取下拉框
			var loadDictionary=function(mothedName,dicName,seleId){
				var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
				var seleOptions="";
				// 
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
					$.each(result.beans,function(index,bean){
						seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
					});
					$('#'+seleId).append(seleOptions);
				},true);
			};

		return initialize();
});