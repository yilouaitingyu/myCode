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
           
            	 
              
             return initialize();  
		})