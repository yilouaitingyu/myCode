require(
		[ 'date', "list", 'select','dialog','jquery','Util','indexLoad','jquery.fileuploader'],
		function(MyDate, List,Select,Dialog, $,Util,IndexLoad) {
			var complaintId;		    
			IndexLoad(function(indexModule, options) {				
				
				$("#labelName").val(options.LABELNAME);
				$("#rule").val(options.RULE);								
				complaintId = options.lblId
				$("#complaintId").val(complaintId);
				initTable();
			});
			var initialize = function(IndexLoad) {
				_index=IndexLoad;				
			}
               var list;  
		       var num = 0;
               var  initTable = function (){
            	   var config = {
                           el:$('#listContainer'),
                           className:'listContainer',
                           field:{
                               boxType:'checkbox',
                               key:'id',                           
                               items:[                                    
                                   { text:'号码',name:'SUBSNUMBER' }                               
                               ],                       
                           },
                           page:{
                               customPages:[2,3,5,10,15,20,30,50],
                               perPage:2,
                               total:true,
                               align:'right'                                                 
                           },
                           data:{
                               url:'/ngwf_he/front/sh/workflow!execute?uid=queryComplaintNumber'
                           }
                       };
                       //按上面的配置创建新的列表
                       list = new List(config);                      
                       list.search({
                       	complaintId : complaintId                    	
                       });
               }
                    
                    
                     
              
              
              
             //确认框  
             var  confirm = function (content,sure,cancel){
                	var config = {
                            mode:'confirm',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
                            title:"消息提示",    //对话框标题
                            content:content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）
                            ok: sure, //确定按钮的回调函数 
                            okValue: '确定',  //确定按钮的文本
                            cancel: cancel,  //取消按钮的回调函数
                            cancelValue: '取消',  //取消按钮的文本
                            cancelDisplay:true, //是否显示取消按钮 默认true显示|false不显示                            
                            width:300,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
                            height:200, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
                            skin:'dialogSkin',  //设置对话框额外的className参数
                            fixed:false, //是否开启固定定位 默认false不开启|true开启
                            quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
                            modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
                        }
                        var dialog = new Dialog(config)	
             }
             //信息框
             var message = function(content){
            	 var config = {
                         mode:'normal',  //对话框模式，默认normal标准|tips浮动层|confirm确认对话框
                         title:"消息提示",    //对话框标题
                         content:content, //对话框内容，可以是字符串、html片段、或dom对象,默认为loading状态（点组成的圈）                         
                         okValue: '确定',  //确定按钮的文本                                                                      
                         width:300,  //对话框宽度，normal默认值为600，confirm默认值为300，tips默认值为240
                         height:200, //对话框高度，normal默认值为400，confirm默认值为180，tips默认值为80
                         skin:'dialogSkin',  //设置对话框额外的className参数
                         fixed:false, //是否开启固定定位 默认false不开启|true开启
                         quickClose:false , //点击空白处快速关闭 默认false不关闭|true关闭
                         modal:false   //是否开启模态框状态  默认false不开启|true开启,confirm默认状态为true
                     }
                     var dialog = new Dialog(config)	
             }              
             //添加投诉标签库配置
             $("#save").click(function(){
            	 var labelName=$("#labelName").val();
            	 var rule=$("#rule").val();
           	     var Id = $("#complaintId").val();
            	 if(!labelName || !rule ){
            		 crossAPI.tips("标签名称和规则表达式不能为空",3000);
            		 return;
            	 }
            	 Util.ajax.getJson('/ngwf_he/front/sh/workflow!execute?uid=updateComplaintlabelById', { labelName:labelName,rule:rule,Id:Id }, 
            			 function(result, isOk){
            		     if(result.bean.state=='0'){
            		    	 message("更新成功");
            		     }else{
            		    	 message("更新失败");
            		     }
            	  })
             })
             //删除标签号码
             $("#deleteBtn").click(function(){            	 
            	 var rows=list.getCheckedRows();
            	 if(rows.length==0){
            		 return;
            	 }
            	 var Ids="";
            	 for(var i=0;i<rows.length;i++){                                        		 
            		 if(i==rows.length-1){
            			 Ids+=rows[i].ID;
            		 }else{
            			 Ids+=rows[i].ID+","; 
            		 }
            	 }
            	 Util.ajax.getJson('/ngwf_he/front/sh/workflow!execute?uid=deleteComplaintNumberById', { Ids:Ids }, 
            			 function(result, isOk){
            		     if(result.bean.state=='0'){
            		    	 message("删除成功");
            		    	 list.search({});
            		     }else{
            		    	 message("删除失败失败");
            		     }
            	  })
             });
             //到入excel数据	            
            $('#fileupload').fileupload({ 
			url:'/ngwf_he/front/sh/importexcel!importexcel?uid=saveComplaintNumber',
			dataType: 'json', 			
			add: function (e, data) {
				 if(!new RegExp(".(xls|xlsx)$").test(data.files[0].name)){
                  	crossAPI.tips("文件格式只能为xls或者xlsx",3000);
                  	return;
                  }
                                        
                  $("#fileResult").html(data.files[0].name);
                $("#importBtn").click(function () {               	                    
                    data.submit();
                });
            },
		   	done: function (e, data) {
		   	    
		   	  if(data.result.bean.state=="0"){
				  message("导入数据成功") 
				  list.search({
		             	complaintId : complaintId                    	
		          });
			  }else{
				  message("导入数据失败") 
			  }     
			 },
			 
		   });
            
            $('#fileupload').bind('fileuploadsubmit', function (e, data) { 		    		    
         	        data.formData = {data: "excelFile",complaintId : complaintId};   		        		
         	        //如果需要额外添加参数可以在这里添加
         	 });
              
             return initialize();  
		})