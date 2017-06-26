define(['Util','list','dialog','date','text!module/workflow/shockorder/adddiv_complaintype.html'],   
	function(Util,list,Dialog,Date,add_div){
		var list;
		var initialize = function(){
		    	eventInit();
		    	ctiList({});
		    	};		
		
		 var eventInit=function(){
			 loadDictionary('staticDictionary_get','ECP.PUB.USERBRAND','subsbrand');//加载客户品牌信息
			 loadDictionary('staticDictionary_get','HEBEI.ACCEPT.CITY','acceptcity');//受理地市
			 loadDictionary('staticDictionary_get','HEBEI.EDUCATION.TYPE','urgentid');//加载紧急程度信息
			 loadDictionary('staticDictionary_get','HEBEI.OR.COMMON','isaccept');//是否受理
			 loadDictionary('staticDictionary_get','HEBEI.CUSTOM.LEVEL','custlevel');//加载客级别信息
		    	
			 $('#shockOrder_Search').on('click',shockOrderInfo);
			 $('#shockOrder_Reset').on('click',resetInfo);
			 $('#complaintype').on('click',dialog_complaint);
			 $('#sendCC').on('click',dialog_sendCC);
			 
		 };
		 //抄送
		 var dialog_sendCC =function (){
			 var handlingstaff="1001"//操作员工编号
			 var serialno ="201703161410598168545601599587"//工单编号
			 var workitemid ="201703161410598168545601599587"//工作项编号
			 var params={		//"sendccid":sendccid,  //抄送日志编号
								"handlingstaff":handlingstaff,
								"serialno":serialno,
				 				"workitemid":workitemid,
				 				"sendccstaffdatas":'[{"sendccstaff":"001001","sendccstaffname":"小强"},{"sendccstaff":"001002","sendccstaffname":"小李子"}]',//被抄送人为list
				 				"sendccgroupdatas":'[{"sendccgroupid":"001","sendccgroupname":"1组"},{"sendccgroupid":"002","sendccgroupname":"2组"}]'//被抄组为list
						};
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=sendCC001',params,function(result){
				},true);
		 }
		 
		 
		 
		 //投诉类型查询
		 var dialog_complaint = function(){
			 var config = {
      	            mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
      	            title:'投诉类型查询',    //对话框标题
      	            content:add_div, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
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
						$("input[name='complainid_hidden']")[0].value=thiss.attr('name');
						var t = thiss.text();
						$("input[name='complaintype_hidden']")[0].value=t;
					});
				},true);	 
			 
		 };
		//字典
		var loadDictionary=function(mothedName,dicName,seleId){
				var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
				var seleOptions="";
				Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
					$.each(result.beans,function(index,bean){
						//品牌工单中保存的是品牌名{
						if("subsbrand"==seleId){
							seleOptions+="<option  value='"+bean.name+"'>"+bean.name+"</option>";
						}
							else
								seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"	
					});
					$('#'+seleId).append(seleOptions);
					console.log(seleOptions);
				},true);
			};		 
		 //重置按钮
		 var resetInfo = function (){		 	
			 $("input[name='serialno']")[0].value='';
			 $("input[name='acceptstaffname']")[0].value='';
			 $("input[name='starttime']")[0].value='';
			 $("input[name='endtime']")[0].value='';
			 $("input[name='contactphone1']")[0].value='';
			 $("input[name='subsnumber']")[0].value='';
			 $("input[name='callerno']")[0].value='' ;
			 $("input[name='complaintype']")[0].value='' ;
			 $("input[name='conplainid']")[0].value=''
			 //select取值 
			 $("select[name='subsbrand']")[0].value ='' ;
			 $("select[name='acceptcity']")[0].value ='' ;
			 $("select[name='urgentid']")[0].value ='';
			 $("select[name='custlevel']")[0].value =''    ;
			 $("select[name='isaccept']")[0].value  =''  ;
		 };
		 //查询按钮事件
		 var shockOrderInfo = function (){
			 var serialno = $("input[name='serialno']")[0].value;
			 var acceptstaffname = $("input[name='acceptstaffname']")[0].value;
			 var starttime = $("input[name='starttime']")[0].value;
			 var endtime = $("input[name='endtime']")[0].value;
			 var contactphone1 = $("input[name='contactphone1']")[0].value;
			 var subsnumber = $("input[name='subsnumber']")[0].value;
			 var callerno =$("input[name='callerno']")[0].value ;
			 var complaintype =$("input[name='complaintype']")[0].value ;
			 var conplainid =$("input[name='conplainid']")[0].value ;
			 
			 //select取值
			 var subsbrand =$("select[name='subsbrand']")[0].value  ;
			 var acceptcity =$("select[name='acceptcity']")[0].value  ;
			 var urgentid =$("select[name='urgentid']")[0].value ;
			 var custlevel =$("select[name='custlevel']")[0].value  ;   
			 var isaccept =$("select[name='isaccept']")[0].value  ; 
			 var data = {
					"serialno":serialno,
					"starttime": starttime,
					"endtime":endtime,
					"contactphone1":contactphone1,
					"subsnumber":subsnumber,
					"subsbrand":subsbrand,
					"acceptcity":acceptcity,
					"urgentid":urgentid,
					"callerno":callerno,
					"custlevel":custlevel,
					"complaintype":complaintype,
					"isaccept":isaccept,
					"acceptstaffname":acceptstaffname,
					"complainid" : conplainid
			 };
			 ctiList(data);
		 };
		
		 
		var startdate=new Date({
			el:$('#starttime'),
            label:'',
            name:'starttime',    //开始日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
		var enddate=new Date({
			el:$('#endtime'),
            label:'',
            name:'endtime',    //结束日期文本框name
            format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            defaultValue:'',     //默认日期值
			max : '2099-06-16 23:59:55',
            istime: true,    
            istoday: false,
            choose:function(){
            }
		});
		//加载历史预警信息列表
			var ctiList = function(data){
				var config = {
						el:$('#historylist'),
					    field:{ 
					        key:'id',         		        	
					        items: [{text: '工单类别',name:'workordertype'},		                       
		                            {text: '工单流水号', name: 'serialno'
		                            },
		                            {text:'星级信息',name:'starlevelinfo'},
		                            {text:'受理号码',name:'subsnumber'},
		                            {text: '建单时间', name: 'createtime'
		                            	,sorting: 1},
		                            {
		                            	text:'紧急程度',
		                            	name:'urgentid',
		                            	render:function(item){
		    									console.log(item.urgentid);
		    									var text=""
		    									$("#urgentid option").each(function () {
		    							             var txt = $(this).text(); //获取单个text
		    							             var val = $(this).val(); //获取单个value
		    							             if(val==item.urgentid){
		    							            	 text =txt;
		    							            	 return text;
		    							             }
		    							            	
		    							         });
		    									return text;
		    	                        },
		                            
		                            },
		                            {text:'完成时间',name:'archivedate'},
		                            {text:'处理组/人',name:'handling'},
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
					        url:'/ngwf_he/front/sh/workflow!execute?uid=shockOrder001'
					    }
					}
				this.list = new list(config);
				this.list.search(data);
			}
			return initialize();
});