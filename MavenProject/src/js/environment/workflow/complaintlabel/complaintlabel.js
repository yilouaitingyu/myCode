require(
		[ 'date', "list", 'select','dialog','jquery','Util','crossAPI'],
		function(MyDate, List,Select,Dialog, $,Util,CrossAPI) {		   
			 
			var initialize = function(IndexLoad,option) {
			
			}              
		        var num = 0;
                $(function(){
                    var config = {
                        el:$('#historylist'),
                        className:'listContainer',
                        field:{
                            boxType:'checkbox',
                            key:'id',                           
                            items:[ 
                                { text:'编号',name:'ID' },   
                                { text:'标签名称',name:'LABELNAME' },
                                { text:'创建时间',name:'WF_CREATE'},
                                { text:'规则',name:'RULE'}
                                
                            ],
                            button:{ //操作区域按钮，不设置该项则没有操作区域
                                className:'w90',    //操作区域class属性设置                               
                                items:[ //操作区域按钮设置                                  
                                    { 
                                      text:'查看',
                                      name:'viewer',
                                      click:function(e,item){
                                    	  CrossAPI.createTab("查看标签库配置信息", getBaseUrl()+"/ngwf_he/src/module/workflow/complaintlabel/complaintlabel-detail.html",item.data);
                                      }
                                    	
                                    }
                                ]
                            },
                        },
                       
                        page:{
                            customPages:[2,3,5,10,15,20,30,50],
                            perPage:2,
                            total:true,
                            align:'right',
                            button:{
                                className:'btnStyle',
                                // url:'../js/list/autoRefresh',
                                items:[
                                    {
                                        text:'新增',
                                        name:'deleter',
                                        click:function(e,item){
                                            // 打印当前按钮的文本                                        	                                      	
                                        	CrossAPI.createTab("添加标签库配置信息", getBaseUrl()+"/ngwf_he/src/module/workflow/complaintlabel/complaintlabel_add.html",null);
                                        	
                                        }
                                    }, 
                                     {
                                        text:'修改',
                                        name:'deleter',
                                        click:function(e,item){
                                        	var rows=list.getCheckedRows();
                                        	if(rows.length>1 || rows.length==0){
                                        		CrossAPI.tips("只能选择一条数据进行修改",3000);
                                        		return;
                                        	}
                                        	var data = rows[0];
                                        	
                                        	CrossAPI.createTab("修改标签库配置信息", getBaseUrl()+"/ngwf_he/src/module/workflow/complaintlabel/complaintlabel-update.html",data);
                                        }
                                    },
                                    {
                                        text:'删除',
                                        name:'stopToggle',
                                        click:function(e,item){                                        	 
                                        	 confirm("确认删除投诉标签吗?",function(){
                                        		 var rows=list.getCheckedRows();
                                        		 var ids="";
                                            	 for(var i=0;i<rows.length;i++){                                        		 
                                            		 if(i==rows.length-1){
                                            			 ids+=rows[i].lblId;
                                            		 }else{
                                            			 ids+=rows[i].lblId+","; 
                                            		 }
                                            	 }
                                            	 
                                            	 Util.ajax.getJson('/ngwf_he/front/sh/workflow!execute?uid=deleteComplaintlabelById', { Ids:ids }, 
                                            			 function(result, isOk){
                                            		     if(result.bean.state=='0'){
                                            		    	 message("删除成功");
                                            		    	 list.search({});
                                            		     }else{
                                            		    	 message("删除失败");
                                            		     }
                                            	  })
                                        	 },function(){
                                        		 
                                        	 }
                                        	 )
                                        	 
                                        }
                                    }
                                ]
                            }
                        },
                        data:{
                            url:'/ngwf_he/front/sh/workflow!execute?uid=queryComplaintlabel',
                        }
                    };
                    //按上面的配置创建新的列表
                    var list = new List(config);
                    //
                    list.search({});               
                      //查询
                     $("#query").click(function(){
                	     var labelName=$("#labelName").val();
                	    list.search({
                	    	'labelName' : labelName
                	    })
                     })
                     //重置
                      $("#reset").click(function(){
                    	  $("#labelName").val("");
                      })
                })
              
             //查看详情
             function searchDetail(val){
                	console.log(val)
                	var data = {
                		complaintId : val.ID 
                	}
                	CrossAPI.createTab("查看标签库配置信息", getBaseUrl()+"/ngwf_he/src/module/workflow/complaintlabel/complaintlabel-detail.html",data);
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
             return initialize();  
		})