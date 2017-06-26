define(
		[ 'Util','date', "list", 'select','dialog','selectTree','jquery','crossAPI' ],
		function(Util,MyDate, List,Select,Dialog,SelectTree,$,CrossAPI) {
			
			var list;//表格对象
			var currentUser;
			var staffName;
			var pageArr =[2,10,15,20,30,50];
			var num = 0;//已选择条数
			//所有方法入口处
			var initialize = function() {
				//配置grid
				defineList();
				//配置"查询","清空","新增","保存"等按钮
				defineBtns();
				//获取登陆信息
				staffIdInit();
			};
			
			//得到员工ID
			var staffIdInit = function()
			{
				CrossAPI.getIndexInfo(function(info){
					if(!currentUser){
						currentUser=info.userInfo.staffId;
			        	staffName=info.userInfo.staffName;
					}
		        })
			}
			
			//配置grid
			var defineList=function(){
				var listConfig = {
	                    el:$('#listContainer'),
	                    className:'listContainer',
	                    field:{
	                    	boxType:'checkbox',
	                    	key:'ID',
	                        items:[
	                            { 
	                                text:'服务请求类别id',
	                                name:'SRV_REQST_TYPE_ID'
	                            },
	                            { 
	                                text:'服务请求类别名称',
	                                name:'SRV_REQST_TYPE_FULL_NM'
	                            }
	                        ]
	                    },
	                    page:{
	                        customPages:pageArr,
	                        perPage:10,
	                        total:true,
	                        align:'right',
	                        button:{
                                className:'btnStyle',
                                items:[
									{
									    text:'已选择0条',
									    name:'checkedNum'
									},

                                    {
                                        text:'修改',
                                        name:'edit',
                                        click:edit
                                    },
                                    {
                                        text:'删除',
                                        name:'del',
                                        click:del
                                    }
                                ]
                            }
	                    },
	                    data:{
	                        url:'/ngwf_he/front/sh/workflow!execute?uid=queryNotAllocateTypeList'
	                    }
	                };
	            list = new List(listConfig);
	            list.search({});
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
				});
	            $('.checkAllWraper>input').change(function(){
	                if($('.checkAllWraper>input').prop("checked")){
	                	$('.boxWraper > input').each(function(){
	                		$(this).prop("checked",true);
	                	});
	                	console.log(123)
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


			};
			
			//修改
            var edit=function(){
            	var checkedRows=list.getCheckedRows();
            	if(checkedRows.length!=1){
            		CrossAPI.tips("请选择一行进行修改操作",3000);
            		return;
            	}
            	$("#edit_type").val("edit");
            	$("#edit_title").text("修改自动分单过滤配置");
            	$("#id").val(checkedRows[0].ID);
            	$("#srv_reqst_type_id").val(checkedRows[0].SRV_REQST_TYPE_ID);
            	$("#srv_reqst_type_full_nm").val(checkedRows[0].SRV_REQST_TYPE_FULL_NM);
            	$(".t-popup").css("display","block");
            }

            //新增
            var add=function(){
            	$("#edit_type").val("add");
            	$("#edit_title").text("新增自动分单过滤配置");
            	$("#id").val("");
            	$("#srv_reqst_type_id").val("");
            	$("#srv_reqst_type_full_nm").val("");
            	$(".t-popup").css("display","block");
            }
            
            //删除
            var del=function(e){
            	var datas=list.getCheckedRows();
            	if (datas.length == 0) {
					CrossAPI.tips("请至少选择一条信息!",3000);
					return;
				}
            	var fltr_ids="";
            	var srv_reqst_type_ids="";
            	for( var i=0;i<datas.length;i++){
					if(fltr_ids==""){
						fltr_ids=datas[i].FLTR_ID;
						srv_reqst_type_ids=datas[i].SRV_REQST_TYPE_ID;
					}
					else{
						fltr_ids+=","+datas[i].FLTR_ID;
						srv_reqst_type_ids+=","+datas[i].SRV_REQST_TYPE_ID;
					}
				}
				var params={
						"fltr_ids":fltr_ids,
						"srv_reqst_type_ids":srv_reqst_type_ids,
 						"op_staff_id":currentUser,
 						"op_staff_name":staffName
				}
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=deleteNotAllocateType',params,function(result){
					if(result.bean.status=="0"){
						CrossAPI.tips("删除成功！",3000);
					}
					else{
						CrossAPI.tips("删除失败，请稍后再试！",3000);
					}
				},true);
				$("#searchButton").click();
            }
            
            //定义按钮
            var defineBtns=function(){
            	 //查询
                $("#searchButton").click(function(){
           	     	var search_srv_reqst_type_id=$("#search_srv_reqst_type_id").val();
           	     	var search_srv_reqst_type_full_nm=$("#search_srv_reqst_type_full_nm").val();
	           	     list.search({
	           	    	'srv_reqst_type_id' : search_srv_reqst_type_id,
	           	    	'srv_reqst_type_full_nm' : search_srv_reqst_type_full_nm
	           	    })
                });
                //清空
                 $("#resetButton").click(function(){
               	  	$("#search_srv_reqst_type_full_nm").val("");
               	  	$("#search_srv_reqst_type_id").val("");
                 });
                 
                 //新增
                 $("#add").click(add);
                 
                 //保存
                 $("#btn_edit_save").click(function(){
                	 var type=$("#edit_type").val();
                	 var id=$("#id").val();
                	 var srv_reqst_type_id=$("#srv_reqst_type_id").val();
                	 var srv_reqst_type_full_nm=$("#srv_reqst_type_full_nm").val();
                	 if(srv_reqst_type_id==null||srv_reqst_type_id==""){
                		 CrossAPI.tips("服务请求id不能为空",3000);
                		 $("#srv_reqst_type_id").focus();
                		 return;
                	 }
                	 if(srv_reqst_type_full_nm==null||srv_reqst_type_full_nm==""){
                		 $("#srv_reqst_type_full_nm").focus();
                		 CrossAPI.tips("服务请求全名不能为空",3000);
                		 return;
                	 }
                	 if(type=="add"){
                		 var params={
         						"srv_reqst_type_id":srv_reqst_type_id,
         						"srv_reqst_type_full_nm":srv_reqst_type_full_nm,
         						"op_staff_id":currentUser,
         						"op_staff_name":staffName
         				}
         				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=saveNotAllocateType',params,function(result){
         					if(result.bean.status=="0"){
         						CrossAPI.tips("新增成功！",3000);
         					}
         					else{
         						CrossAPI.tips("新增失败，请稍后再试！",3000);
         					}
         				},true);
                	 }else if(type=="edit"){
                		 var fltr_id=list.getCheckedRows()[0].FLTR_ID;
                		 var params={
         						"id":id,
         						"fltr_id":fltr_id,
         						"srv_reqst_type_id":srv_reqst_type_id,
         						"srv_reqst_type_full_nm":srv_reqst_type_full_nm,
         						"op_staff_id":currentUser,
         						"op_staff_name":staffName
         				}
         				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=updateNotAllocateType',params,function(result){
         					if(result.bean.status=="0"){
         						CrossAPI.tips("修改成功！",3000);
         					}
         					else{
         						CrossAPI.tips("修改失败，请稍后再试！",3000);
         					}
         				},true);
                	 }
                	 $(".t-popup").css("display","none");
                	 $("#searchButton").click();
                 });
                 //取消
                 $("#btn_edit_cancel").click(function(){
                	 $(".t-popup").css("display","none");
                 });
                 
            }
			
			return initialize();
});





