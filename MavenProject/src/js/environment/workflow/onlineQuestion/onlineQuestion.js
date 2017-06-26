define(['Util','list','crossAPI'],   
        function(Util,List,CrossAPI){
			var $el;
			var _index;
			var _options;
			var list1;
			var num;
			var handlingorgacode;
			var currentUser;
			var staffName;
			var smsContent;
			//得到员工ID
			var staffIdInit = function()
			{
				CrossAPI.getIndexInfo(function(info){
					currentUser=info.userInfo.staffId;
		        	staffName=info.userInfo.staffName;
		        })
			}
		var initialize = function(index, options){
			staffIdInit();
			historyworkList({});
			evenInit();
			
		};
		var evenInit = function(){
			$('#addOnlineQuestion').on('click',addOnlineQuestions);
			$('#deleteOnlineQuestion').on('click',deleteOnlineQuestion);
			$('#controlOnlineQuestion').on('click',controlOnlineQuestion);
			$('#modify_Btn').on('click',updateOnlineQuestion);
			$('#online_Btn').on('click',addOnlineQuestion);
		}
		//监控
		var  controlOnlineQuestion = function(){
			var rows=list1.getCheckedRows();
			if(rows.length!=1){
				CrossAPI.tips("只能选择一条！",3000);
				return;
			}else{
				var issuedesc = rows[0].issuedesc;
				var smscontent = rows[0].smscontent;
				var triggersendsmslimit = rows[0].triggersendsmslimit;
				var replylimit = rows[0].replylimit;
				var wrkfmShowSwftno = "1111111";
				var data = {
						"wrkfmShowSwftno":wrkfmShowSwftno
				}
				Util.ajax.postJson("/ngwf_he/front/sh/workflow!execute?uid=onlineQuestion005",data,function(result){
					if (result.returnCode=='0') {
						var createTime = result.beans[0].createTime;
						var sdTime = createTime+triggersendsmslimit*3600000;
						setTimeout(function(){
							var data = {
									"sdStaffId":currentUser,
									"sdStaffName":staffName,	
									"sdTime":sdTime,	
									"sdNum":"13871958912",	
									"sdCntt":smscontent	
							};
							smsContent = data;
							addRecordInfo(smsContent);
						},triggersendsmslimit*5000);
					}else{
						CrossAPI.tips("监控错误！",3000);
					}
				})
			}
			
		};
		
		var addRecordInfo = function(param){
			if (smsContent!=null&smsContent != undefined&smsContent !='') {
				Util.ajax.postJson("/ngwf_he/front/sh/workflow!execute?uid=smsSendRecord01",smsContent,function(result){
					if(result.returnCode=="0"){
						CrossAPI.tips("短信发送成功！",3000);
					}
				});
			}
		};
		
		//获取当前系统时间
		var opTime = function(){
			var myData = new Date(); 
			var times = myData.getTime();//当前时间的毫秒数
		};
		
		//显示弹窗
		var addOnlineQuestions =function(){
			resetInfo();
			$('#popuplayer').addClass('show').removeClass('hide');
			$('#modify_Btn').addClass("hide");
        	$('#online_Btn').removeClass("hide");
		}
		
		//清空
		var resetInfo = function(){
			$('.resetInfo').val('');
		}
		//判断是否为正整数
		function isPositiveNum(s){//是否为正整数  
		    var re = /^[0-9]*[1-9][0-9]*$/ ;  
		    return re.test(s)  
		} 
		//保存数据
		var addOnlineQuestion = function(){
			var issuedesc = $('#issuedesc1').val().trim();
			var smscontent = $('#smscontent1').val().trim();
			var triggersendsmslimit = $('#triggersendsmslimit1').val();
			var replylimit = $('#replylimit1').val();
			if (isPositiveNum(triggersendsmslimit)&&isPositiveNum(replylimit)) {
				var data = {
						"issuedesc":issuedesc,
						"smscontent":smscontent,
						"triggersendsmslimit":triggersendsmslimit,
						"replylimit":replylimit
				};
			}else{
				CrossAPI.tips("触发时限和回复时限只能填入正整数!",3000);
			}
			Util.ajax.postJson("/ngwf_he/front/sh/workflow!execute?uid=onlineQuestion001",data,function(result){
				if (result.returnCode=='0') {
					$('#popuplayer').addClass("hide");
					if (result.bean.count=="0") {
						CrossAPI.tips("不能添加重复配置！",3000);
						return;
					}
					CrossAPI.tips("添加成功",3000);
					historyworkList();
				}else{
					CrossAPI.tips("添加失败！",3000);
				}
				
			})
			
		};
		
		//删除
		var deleteOnlineQuestion = function(){
			var rows=list1.getCheckedRows();
			if(rows.length=='0'){
				CrossAPI.tips('请选择一条数据!',3000);
				return;
			}
			var flag = confirm("确认删除选中的派单关系吗？");
			if (flag) {
			var ids="";
			for(var i=0;i<rows.length;i++){
				ids+=rows[i].id+",";
			}
			var url='/ngwf_he/front/sh/workflow!execute?uid=onlineQuestion003';
			var data={'ids':ids};
			Util.ajax.postJson(url,data,function(result){
				if(result.returnCode=='0'){
					CrossAPI.tips('删除成功!',3000);
					historyworkList({});
				}else{
					CrossAPI.tips("删除失败!",3000)
				}
			});
		}
	}
		
		var historyworkList=function(data){
            var config = {
                el:$('.listContainer',$el),
                className:'listContainer',
                field:{
                    boxType:'checkbox',
                    key:'id',                           
                    items:[
                           { text:'索引',
                               name:'id',
                               className:'hide'
                             },
                       
                        { 
                            text:'编号',
                            name:'issueid',
                            className:'w120'
                        },
                        { text:'跟进问题',
                          name:'issuedesc'                              
                        },
                        { text:'触发时限',name:'triggersendsmslimit' },
                        { text:'回复时限',name:'replylimit'},
                        { text:'短信内容',name:'smscontent' }
                                                     
                    ]
                },
                page:{
                	 perPage:10,
                     align:'right'
                },
              
                data:{
                    url:'/ngwf_he/front/sh/workflow!execute?uid=onlineQuestion002'
                }
            };
            
            list1 = new List(config);
            list1.search({});
          //修改
    		list1.on('rowClick',function(e,item){
    			secondShowInfo(item);
    		});
		}
		//回显
		var secondShowInfo = function (item){
			$('#popuplayer').addClass('show').removeClass('hide');
			$('#online_Btn').addClass("hide");
        	$('#modify_Btn').removeClass("hide");
			resetInfo();
			$('#issuedesc1').val(item.issuedesc);
			$('#smscontent1').val(item.smscontent);
			$('#triggersendsmslimit1').val(item.triggersendsmslimit);
			$('#replylimit1').val(item.replylimit);
			$('#issueid').val(item.issueid);
		}
		//保存修改
		var updateOnlineQuestion = function(){
			var issuedesc = $('#issuedesc1').val();
			var smscontent = $('#smscontent1').val();
			var triggersendsmslimit = $('#triggersendsmslimit1').val();
			var replylimit = $('#replylimit1').val();
			var issueid = $('#issueid').val();
			if (isPositiveNum(triggersendsmslimit)&&isPositiveNum(replylimit)) {
			var data = {
					"issuedesc":issuedesc,
					"smscontent":smscontent,
					"triggersendsmslimit":triggersendsmslimit,
					"replylimit":replylimit,
					"issueid":issueid
			}
			}else{
				CrossAPI.tips("触发时限和回复时限只能填入正整数!",3000);
			}
			Util.ajax.postJson("/ngwf_he/front/sh/workflow!execute?uid=onlineQuestion004",data,function(result){
				if (result.returnCode=='0') {
					if (result.bean.count=="0") {
						CrossAPI.tips("不能添加重复配置！",3000);
						return;
					}
					CrossAPI.tips("修改成功！",3000);
					historyworkList();
				}else{
					CrossAPI.tips("修改失败！",3000);
				}
			});
		}

	return initialize();
});