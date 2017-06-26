define(['Util','list','date','select','dialog'],   
	function(Util,list,Date,Select,Dialog){
		var list;
		var initialize = function(){
		    	eventInit();
		    	wrList({});
		    	loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','acceptcity');//受理地市
		    	loadDictionary('staticDictionary_get','ECP.PUB.USERBRAND','subsbrand');//加载客户品牌信息
		    	loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','subslevel');//加载客级别信息
		    	loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','urgentid');//加载紧急程度信息
		    	loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','isaccept');//是否受理
		};		
		
		 var eventInit=function(){
			 $('#wr_Search').on('click',searchWR);
			 $('#wr_Reset').on('click',resetWR);
			 $('#complaintype').on('click',dialog_complaint);
		 };
		 
		 //投诉类型查询
		 var dialog_complaint = function(){
			 var config = {
      	            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
      	            title:'投诉类型查询',    //对话框标题
      	            content:"	<div class=\"t-popup-content\">"+
					"		<label class=\"coms\" for=\"comClass\">投诉类型:</label>"+
					"		<input type=\"text\" id=\"comClass\" name=\"comClass\" style=\"width:390px;height:25px;\">"+
					"		<a class=\"btn btn-dark bttn\"  id =\"complant_Search\">搜索</a>"+
					"		<div id=\"modal_b2\" class=\"modals\">"+
					"		</div>"+
					"<input id=\"complainid_hidden\" name=\"complainid_hidden\" type=\"hidden\" />"+
					"<input id=\"complaintype_hidden\" name=\"complaintype_hidden\" type=\"hidden\" />"+
					"	</div>", //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
      	            ok:function(){
      	            	$("input[name='comClass']")[0].value='';
	      	  			var complaintype_hidden= $("input[name='complaintype_hidden']")[0].value;
	      	  		    var complainid_hidden= $("input[name='complainid_hidden']")[0].value;
	      	  			$("input[name='complaintype']")[0].value=complaintype_hidden;
	      	  		    $("input[name='conplainid']")[0].value=complainid_hidden; 
      	            }, //确定按钮的回调函数 
      	            okValue: '确定',  //确定按钮的文本
      	            cancel: function(){
      	            },  //取消按钮的回调函数
      	            cancelValue: '取消',  //取消按钮的文本
      	            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示
      	            width:600,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
      	            height:280, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
      	            skin:'dialogSkin',  //设置对话框额外的className参数
      	            fixed:false, //是否开启固定定位 默认false不开启|true开启
      	            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
      	            modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
      	        }
      	 var dialog = new Dialog(config);
			 $('#complant_Search').on('click',modal_box);
			 modal_box();
		 }
		 //投诉类型，请求后台数据；
		 var modal_box =function (){
			 var fullname = $("input[name='comClass']")[0].value;
			 var params={method:"queryComplanitInfo",paramDatas:'{fullname:"'+fullname+'"}'};
			 $('#modal_b2').empty();
			 var searchOptions="";
			 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=complaintData001',params,function(result){
				 $('#modal_b2').empty();
				 $.each(result.beans,function(index,bean){
					 searchOptions+="<p name='"+bean.complaintid+"'>"+bean.fullname+"</p>"
				 });
					$('#modal_b2').append(searchOptions);
					$("#modal_b2 p").click(function(){
						var thiss = $(this);
						$(this).css("background","#cccccc").siblings().css('background','white');
						$("input[name='complainid_hidden']")[0].value=thiss.attr("name");
						var t = thiss.text();
						$("input[name='complaintype_hidden']")[0].value=t;
					});
				},true);	 
			 
		 };
		 
		 var searchWR = function(){
			 var staffId="";
			 Util.ajax.postJson('../../../../data/userInfo.json',{},function(result){
				 staffId=result.bean.staffId;
				},true);
			 var serialno = $("#serialno").val();
			 var acceptstaffname = $("#acceptstaffname").val();
			 var starttime = $("#starttime").val();
			 var endtime = $("#endtime").val();
			 var subsbrand = $("#subsbrand").val();
			 var subslevel = $("#subslevel").val();
			 var acceptcity = $("#acceptcity").val();
			 var urgentid = $("#urgentid").val();
			 //预留新旧业务
			 var businesstype =$("#businesstype").val();
			 var complaintype =$("#complaintype").val();
			 var subsnumber = $("#subsnumber").val().tr;
			 var isaccept = $("#isaccept").val();
			 var contactphone1 = $("#contactphone1").val();
			 var callerno =$("#callerno").val();
			 var conplainid =$("#conplainid").val() ;
			 var data = {
					"serialno":serialno,
					"acceptstaffname": acceptstaffname,
					"starttime": starttime,
					"endtime":endtime,
					"subsbrand":subsbrand,
					"subslevel":subslevel,
					"acceptcity":acceptcity,
					"urgentid":urgentid,
					//预留新旧业务
					"businesstype":businesstype,
					"complaintype":complaintype,
					"subsnumber":subsnumber,
					"isaccept":isaccept,
					"contactphone1":contactphone1,
					"callerno":callerno,
					"staffId":staffId,
					"conplainid":conplainid
					
			 };
			 wrList(data);
			 
		 };
		 var resetWR = function(){
			 $("#serialno").val('');
			 $("#acceptstaffname").val('');
			 $("#starttime").val('');
			 $("#endtime").val('');
			 $("#subsbrand").val('');
			 $("#subslevel").val('');
			 $("#acceptcity").val('');
			 $("#urgentid").val('');
			 //预留新旧业务
			 $("#businesstype").val('');
			 $("#complaintype").val('');
			 $("#subsnumber").val('');
			 $("#isaccept").val('');
			 $("#contactphone1").val('');
			 $("#callerno").val('');
			 $("#conplainid").val('');
		 };
		var date=new Date({
			el:$('.datetime'),
            label:'',
            name:'datetime',    //开始日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
		var enddate=new Date({
			el:$('.datetime'),
            label:'',
            name:'datetime',    //结束日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
//		加载select里内容
		var loadDictionary=function(mothedName,dicName,seleId){
			var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
			var seleOptions="";
			// 
			Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
				$.each(result.beans,function(index,bean){
					seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
				});
				$('#'+seleId).append(seleOptions);
				console.log(seleOptions);
			},true);
		};
			
			
			
		
		//加载待阅工单列表
			var wrList = function(data){
				var config = {
						el:$('#wr_List'),
					    field:{ 
					        key:'id',         		        	
					        items: [{text: '工单类别',name:'workordertype'},		                       
		                            {text: '工单流水号', name: 'serialno'},
		                            {text:'星级信息',name:'starlevelinfo'},
		                            {text:'受理号码',name:'subsnumber'},
		                            {text: '建单时间', name: 'createtime'},
		                            {text:'紧急程度',name:'urgentid'},
		                            {text:'完成时间',name:'completetime'},
		                            {text:'处理组/人',name:'handlingdept'},
		                            {text:'操作状态',name:'operstatus'},
		                            {text: '是否受理',name:'isaccept'},
		                            {text: '受理人',name:'acceptstaffno'}
		                    ]
					        
					    },
					    page:{
					        perPage:10,    
					        align:'right'  
					    },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=waitReadOrder001'
					    }
					}
				this.list = new list(config);
				this.list.search(data);
			}
			

			return initialize();
});