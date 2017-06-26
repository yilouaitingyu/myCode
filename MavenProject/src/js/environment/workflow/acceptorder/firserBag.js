define(['Util','list','timer','jquery.fileuploader',
        'text!module/workflow/acceptorder/firserBag.html',
        'style!css/workflow/acceptorder/firserBag.css'],
    function(Util,list,Timer,Jquery,Html_firserBag) {
        //系统变量-定义该模块的根节点
//      var $el = $("body");
		var $el;
		var _index;
		var _options;
        var files = [];
        
        // 系统变量-构造函数
        var initialize = function(index, options) {
        	$el = $(Html_firserBag);
			_index = index;
			_options=options;
			bagList.call(this,$el);
			
			this.eventInit(this);
			this.getValue();
            var $fileupload = $("#attachment", $el);
            $fileupload.fileupload({
                url: '/ngwf_he/front/sh/upload!execute?uid=attachmentupload', //上传路径
                formData: { data: "attachment" }, // 传递的参数
                add: function(e, data) {
                	console.log('文件已添加');
                    // 文件大小处理
                    var sizeNumber = '';
                    if ((data.files[0].size) < 100) {
                        sizeNumber = data.files[0].size + 'B';
                    } else {
                        sizeNumber = ((data.files[0].size) / 1024).toFixed(2);
                        if (sizeNumber > 1000) {
                            sizeNumber = (sizeNumber / 1024).toFixed(2) + 'MB';
                        } else {
                            sizeNumber = sizeNumber + 'KB'
                        }
                    }
                    var goUpload = true;
                    if (data.files[0].name.length > 20) {
                        console.log('文件名长度不能大于20');
                        goUpload = false;
                    } else if (data.files[0].size > 200000*1024) {
                        console.log(sizeNumber);
                        console.log('文件大小不能大于20M');
                        goUpload = false;
                    } else if(new RegExp(".(vox|wav|wme)$").test(data.files[0].name)){
                    	//录音文件
                    	$("#attachmenttype",$el).attr("value",'1')
                        files.push(data)
                    } else if(new RegExp(".(txt|docx|xlsx|jpg|png|gif)$").test(data.files[0].name)){
                    	//普通文件
                    	$("#attachmenttype",$el).attr("value",'0')
                        files.push(data)
                    }else{
                    	console.log('文件格式不对');
                    	goUpload = false;
                    }
                    if (goUpload) {
                        // 添加文件名和文件大小
                        $('#load', $el).html(data.files[0].name);
                    }
                },
                //设置上传进度事件的回调函数  
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 5, 10);  
                    $('.bag-jindu', $el).addClass('show').removeClass('hide');
                    $('#bag_hand', $el).html('上传中');
                    $('#filename', $el).html(files[0].files[0].name);
                    $('.t-progress-bar', $el).css(  
                        'width',  
                        progress + '%'  
                    );  
                    $('.t-progress-bar', $el).html(progress + '%');
                    $('#bag_stauts', $el).html('<a href="#" class="btn btn-blue">取消</a>');
                    console.log('上传中');
                },
                done: function(e, data, el) {
                	var count=data.result.bean.count;
                	if(count==0){
                		$('#bag_stauts', $el).html('上传失败');
                		console.log('上传失败');
                	}else{
                		$('#bag_stauts', $el).html('上传成功');
                		console.log('上传成功');
                	}
                },
                fail: function() {
                	$('#bag_stauts').html('文件上传失败');
                    console.log("文件上传失败");
                }
            });
            this.content = $el;
        };
        $.extend(initialize.prototype, Util.eventTarget.prototype, {
        	eventInit:function(){
        		/*$el.on('click','#bag_commitb',$.proxy(this.bagUpload,this));//上传附件
        		$el.on('click','#bag_commitvoice',$.proxy(this.bagCommitvoice,this));//上传录音事件
        		$el.on('click','#bag_stauts',$.proxy(this.removeupload,this));//取消上传*/
        		
        		$el.on('click','#bag_commitb',initialize.prototype.bagUpload);//上传附件
        		$el.on('click','#bag_commitvoice',initialize.prototype.bagCommitvoice);//上传录音事件
        		$el.on('click','#bag_stauts',initialize.prototype.removeupload);//取消上传
        	},
        	 //赋值
            getValue:function(){
         	    var data=$(".requestForm").data("mydata")
         	    $(".bagForm").data("mydata",data);
         	    console.log($(".bagForm").data("mydata"));
            },
           //上传附件
	       bagUpload:function(event){
	        	console.log("shangc")
	        	files[0].submit();
	        	bagList();
	        },
	        //上传录音事件
	        bagCommitvoice:function(event){
	        	$('.bag-jindu').addClass('show').removeClass('hide');
	        	files[0].submit();
	        	bagList();
	        },
	        //取消上传
	       removeupload:function(event){
	        	$('.bag-jindu', $el).addClass('hide').removeClass('show');
	        },
	        //删除附件
	        deleteAttachment:function(){
	        	var params={"id":id};
	        	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=attachmentDelete',params,function(result){
	        		bagList();
	        	},true);
	        }
        })
	        var bagList = function(){
        	var serviceid = $(".bagForm").data("mydata").serviceid;
	    	   	var data={
	    	   			"serviceid":serviceid
	    	   	};
		        var config = {
						el:$('#bagList',$el),
					    field:{ 
					        key:'id',         		        	
					        items: [{text: '附件',name:'attachmentname'},		                       
		                            {text: '上传人', name: 'uploadstaff'},
		                            {text:'上传时间',name:'uploadtime'},
		                            {text:'附件类型',name:'attachmenttype'}
		                    ],
		                    button:{ 
		                    	 items:[ //操作区域按钮设置
	                                 { 
	                                     text:'删除',  //按钮文本
	                                     name:'delete',  //按钮名称
	                                     click:function(e,item){//按钮点击时处理函数
	                                    	 console.log("delete attachment...");
	                                         deleteAttachment(item.data.id);
	                                     } 
	                                 }
	                             ]
		                    }
					        
					    },
					    page:{
					    	customPages:[5,10,15,20,30,50],
					        perPage:5,    
					        align:'right',
					        total:true
					    },
					    data:{
					        url:'/ngwf_he/front/sh/workflow!execute?uid=queryAttachment'
					    }
					}
		        this.list = new list(config);
				this.list.search(data);
	        }
        return initialize;
    });

