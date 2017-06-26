require(
		[ 'Util','date', "list", 'select','dialog','selectTree','jquery','indexLoad' ],
		function(Util,MyDate, List,Select,Dialog,SelectTree,$) {
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
			var currentNodeType="01";
			
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
			
			
			$(timeInit = function() {
				var nowDate=new Date();
				var time2 = nowDate.Format("yyyy/MM/dd hh:mm:ss");
				console.log(time2)
				//当前时间减去5天为起始时间
				var t=nowDate.getTime()-5*24*60*60*1000;
				var time1=new Date(t).Format("yyyy/MM/dd hh:mm:ss");
				console.log(time1);
			     var date1 = new MyDate( {
                     el:$('#createTime'),
                     label:'建单时间',
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
		

			//validation 页面校验,同时查询
			var validation = function(list)
			{
				var acceptStaffNo = $("#acceptStaffNo").val();
				if(acceptStaffNo.length > 10)
				{
					crossAPI.tips("建单人长度过长",3000);
					return "";
				}
				//得到开始时间
				var acceptTimeStart = $("input[name='acceptTimeStart']")[0].value ;
				//得到结束时间
				var acceptTimeEnd = $("input[name='acceptTimeEnd']")[0].value ;
				var starTime = new Date(acceptTimeStart.replace(/-/g,"/"));
				var endTime = new Date(acceptTimeEnd.replace(/-/g,"/"));
				var m = (endTime.getTime()-starTime.getTime())/(1000*60*60*24);
				
				if(m<0)
				{
					crossAPI.tips("结束时间需要大于开始时间",3000);
					return "";
				}
				if(m>30)
				{
					crossAPI.tips("请查30天内消息",3000);
					return "";
				}
				list.search(getParam());
			}
			//入参
			function getParam()
			{
				var acceptStaffNo = $("#acceptStaffNo").val();
				var coluKngCategory = $("#coluKngCategory").val();
				var state = $("#state").val();
				var acceptTimeStart = $("input[name='acceptTimeStart']")[0].value ;
				var acceptTimeEnd = $("input[name='acceptTimeEnd']")[0].value ;
				
				var returnParam ={
					"id":"",
					"acceptStaffNo":acceptStaffNo,
					"coluKngCategory":coluKngCategory,
					"state":state,
					"acceptTimeStart":acceptTimeStart,
					"acceptTimeEnd":acceptTimeEnd
				};
				return returnParam;
			};
			
	
             //工单处理满意度查询结果展示：
             var config = {
                     el:$('#listContainer'),
                     className:'listContainer',
                     field:{
                    	 boxType:'checkbox',
                         key:'id',
                         items:[
                             { 
                                 text:'关联投诉工单',  //按钮文本
                                 name:'serialno',  //按钮名称
                                  click:function(e,val)
                                  {
                                	//弹出窗口显示
                      				$(".t-popup").css("display","block");
                      				queryApprovalById(val.data.id);
                                  }
                             },
                             { 
                                 text:'建单时间',
                                 name:'createTime'
                             },
                             { 
                                 text:'建单人',
                                 name:'acceptStaffNo',
                                 className:'w120'
                             },
                             { text:'知识分类',name:'coluKngCategory',
                            	 render:function(item,val)
                            	 {
                            		 return loadDictionaryForList('staticDictionary_get','KBS.COLUKNG.COLUKNGTYPE',val);
                            	 }},
                         ]
                     },
                     page:{
                         customPages:[2,3,5,10,15,20,30,50],
                         perPage:10,
                         total:true,
                         align:'right'
                     },
                     data:{
                         url:'/ngwf_he/front/sh/workflow!execute?uid=queryApprovalKng',
                     }
                 };
             
             var list = new List(config);
             validation(list);
             
			//queryStaticDatadictRest
		    var loadDictionary=function(mothedName,dicName,seleId){
						var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
						var seleOptions="";
						Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
							$.each(result.beans,function(index,bean){
								seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
							});
							$('#'+seleId).append(seleOptions);
							console.log(result);
						},true);
		};
		//为list集合加载数据字典
		var loadDictionaryForList=function(mothedName,dicName,val){
			var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
			var seleOptions="";
			Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
				$.each(result.beans,function(index,bean){
					if(val == bean.value)
					{
						seleOptions =  bean.name;
					}
				});
				console.log(result);
			},true);
			
			return seleOptions;
		};
			//给select初始化数据字典
			var init = function(){
				loadDictionary('staticDictionary_get','KBS.COLUKNG.COLUKNGTYPE','coluKngCategory');//知识分类
				
				loadDictionary('staticDictionary_get','HEBEI.KONWLEDGE.STATE','state');//知识状态
				
				loadDictionary('staticDictionary_get','KBS.COLUKNG.COLUKNGTYPE','coluKngCategoryDetail');//知识分类
				//弹出窗口隐藏
				$(".t-popup").css("display","none");
				
			};
			init();
			
			//查找一条数据的方法
			var queryApprovalById = function(id)
			{
				var params = {
							"id" :id
						}
				//调用ajax批量审核数据
				Util.ajax.postJson("/ngwf_he/front/sh/workflow!execute?uid=queryApprovalKngBySelectId",params,function(result){
							var bean = result.beans[0];
							$("#coluKngIdDetail").val(bean.coluKngId);
							$("#serialnoDetail").val(bean.serialno);
							$("#cityDetail").val(bean.receiveCity);
							$("#stateDetail").val(bean.state);
							$("#acceptStaffNoDetail").val(bean.acceptStaffNo);
							$("#approverDetail").val(bean.approver);
							$("#deletePersonDetail").val(bean.deletePerson);
							$("#lastModifiedPersonDetail").val(bean.lastModifiedPerson);
							$("#acceptTimeDetail").val(bean.acceptTime);
							$("#approveTimeDetail").val(bean.approveTime);
							$("#deleteTimeDetail").val(bean.deleteTime);
							$("#lastModifiedTimeDetail").val(bean.lastModifiedTime);
							$("#coluKngNameDetail").val(bean.coluKngName);
							$("#coluKngCategoryDetail").val(bean.coluKngCategory);
							
							$("#complainContentDetail").val(bean.complaintContenet);
							$("#handleDetailsDetail").val(bean.handleDetails);
							$("#coluKngDescDetail").val(bean.coluKngDesc);
							$("#idDetail").val(bean.id);
							
							//得到keyWords
							var keyWord = bean.keyWords;
							if(keyWord != null && keyWords != "")
							{
								 
								var keyWords = keyWord.split(",");
								if(keyWords.length == 1)
								{
									$("input[name='client']")[0].value = keyWords[0]; 
								}
								else
								{
									$("input[name='client']")[0].value = keyWords[0];
									for(var i=1;i<keyWords.length;i++)
									{
										var addagain='<div class=klscommon>'+
										'<input type="text" value="'+keyWords[i]+'"/>'+
											'<span class="klsDelete">——</span>'+
										'</div>'
										$(addagain).insertBefore($('#klsAddcon'));
										$('.klsDelete').on('click',klsDelete);
									}
								}
							}	
							
						});
			}
			
			
			var singleApproval = function(state)
			{
				var id = $("#idDetail").val();
				var params = 
				{
						"id":id,
						//03为已发布状态，04为已作废状态
						"state":state
				}
				//调用ajax批量审核数据
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=batchApprovalKng',params,function(result){
						var returnMessage = result.returnMessage;
    					if(state == "03")
    					{
    						crossAPI.tips("审核通过成功",3000);
    					}
    					if(state == "04")
    					{
    						crossAPI.tips("审核不通过成功",3000);
    					}
			});
			}
			//批量审批方法//03为已发布状态，04为已作废状态
			var batchApproval = function(state)
			{ 
				var id = "";
				var uid = "";
    			//得到所有的checkBox
    			var $checkBoxs = $("input[type='checkBox']");
    			//去掉第一个checkBox，全选checkBox i=1
    			for(var i=1;i<$checkBoxs.length;i++)
    			{
    				//如果被选中
    				if($checkBoxs[i].checked)
    				{
    					id += ","+$checkBoxs[i].value;
    				}
    			}
    			if(id == "")
    			{
    				return "请选择至少一条数据";
    			}
    			else
    			{
    				//去掉id前面的逗号
    				id = id.substring(1);
    				
    				var params = 
    				{
    						"id":id,
    						//03为已发布状态，04为已作废状态
    						"state":state
    				}
    				//调用ajax批量审核数据
    				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=batchApprovalKng',params,function(result){
	    						if(state == "03"){
	    							crossAPI.tips("审批通过成功",3000);
	    						}
	    						if(state == "04")
	    						{
	    							crossAPI.tips("审批不通过成功",3000);
	    						}
    							
    						});
    			}
    			}
			
		//列表详情开始 start
            $(function(){
                var num = 0; // 选择的条数
                
                    $("#searchButton").on("click",function()
                    		{
                    				validation(list);
                    		});
                    $("#resetButton").on("click",function()
                    		{
		                    	 $("#acceptStaffNo").val("");
		        				 $("#coluKngCategory").val("");
		        				 $("#state").val("");
		        				 timeInit();
                    		});
                    $("#approvalYes").on("click",function()
                    		{
                    			batchApproval("03");
                    			validation(list);
                    		});
                    $("#approvalNo").on("click",function()
                    		{
                    			batchApproval("04");
                    			validation(list);
                    		});
                   $("#singleApprovalYes").on("click",function()
                   {
                	   singleApproval("03");
                	   $(".t-popup").css("display","none");
                	   validation(list);
                   });
                   $("#singleApprovalNo").on("click",function()
                    {
                	   singleApproval("04");
                	   $(".t-popup").css("display","none");
                	   validation(list);
                   });
                   $('.klsDelete').on('click',klsDelete);
   				  $('.klsAdd').on('click',klsAdd);
           });
})