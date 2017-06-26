define(['Util','list','timer','jquery','jquery.fileuploader',
        'js/workflow/commonTip/commonTip',
        'text!module/workflow/oneservicecomplain/attachUpdate.html',
        'style!css/workflow/oneservicecompain/attachUpdate.css'],
    function(Util,list,Timer,$,Jquery,commonTip,Html_firserBag) {
        //系统变量-定义该模块的根节点
		var $el = $(Html_firserBag);
		var _index;
		var _options;
		var _uploadstaff;
		var _attchParams;
        var files = [];
        var pageArr=[5,10,15,20,30,50];
        var commonTip =new commonTip();
        var $fileupload = $(".bag-top", $el);
        // 系统变量-构造函数
        var initialize = function(index, options) {	
			_index = index;
			console.log(options);
			_options=options;
			this.eventInit(this);
			this.loadAttchParams(this);
			bagList.call(this,$el);
            $fileupload.fileupload({
                url: '/ngwf_he/front/sh/file!upload?uid=attachmentupload', //上传路径
                add: function(e, data) {
                	console.log('文件已添加');
                	files.splice(0,files.length);//清空数组
                    // 文件大小处理
                    var sizeNumber = '';
                    if ((data.files[0].size) < 100) {
                        sizeNumber = data.files[0].size + 'B';
                    } else {
                        sizeNumber = ((data.files[0].size) / 1024).toFixed(2);
                        if (sizeNumber > 1024) {
                            sizeNumber = (sizeNumber / 1024).toFixed(2) + 'MB';
                        } else {
                            sizeNumber = sizeNumber + 'KB'
                        }
                    }
                    var goUpload = true;
                    if (data.files[0].name.length> _attchParams.attchNameLength*0.5) {
                        console.log('文件名长度不能大于'+_attchParams.attchNameLength);
                        commonTip.text({text:"文件名长度不能大于"+_attchParams.attchNameLength});
                        goUpload = false;
                    } else if (data.files[0].size > _attchParams.attchSize*1024*1024) {
                        console.log(sizeNumber);
                        console.log('文件大小不能大于'+_attchParams.attchSize+'MB');
                        commonTip.text({text:"文件大小不能大于"+_attchParams.attchSize+"MB"});
                        goUpload = false;
                    } else if(!new RegExp(".("+_attchParams.attchFormat+"|"+_attchParams.musicFileFormat+")$").test(data.files[0].name)){
                    	console.log('文件格式不对');
                    	commonTip.text({text:"文件格式不支持"});
                    	goUpload = false;
                    }else{
                        files.push(data);
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
                        100 + '%'  
                    );  
                    $('.t-progress-bar', $el).html(100 + '%');
                    $('#bag_stauts', $el).html('<a href="#" class="btn btn-blue">取消</a>');
                    console.log('上传中');
                },
                done: function(e, data, el) {
                	files.splice(0,files.length);//清空数组
                	var count=data.result.bean.count;
                	if(count>=1){
                		$('#bag_stauts', $el).html('上传成功');
                		console.log('上传成功');
                		$('#load', $el).html('添加附件:上传附件需小于20M,录音文件格式为：vox.wav.wme');
                		bagList();
                		$(".bag-jindu").removeClass("show").delay(2000).hide(0);
                	}else{
                		$('#bag_stauts', $el).html('上传失败');
                		console.log('上传失败');
                		$(".bag-jindu").removeClass("show").delay(2000).hide(0);
                	}
                },
                fail: function() {
                	files.splice(0,files.length);//清空数组
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
        		
        		crossAPI.getIndexInfo(function(info){
        			_uploadstaff=info.userInfo.staffId;
                })
        	},
           //加载附件参数
        	loadAttchParams:function(){
        		Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=getAttachmentNorms',{},function(result){
        			var obj=new Object();
        			obj.attchFormat=result.bean.attchFormat;
        			obj.musicFileFormat=result.bean.musicFileFormat;
        			obj.attchSize=result.bean.attchSize;
        			obj.attchNameLength=result.bean.attchNameLength;
        			_attchParams=obj;
        		},true);
        	},
           //上传附件
	       bagUpload:function(event){
	        	console.log("shangc")
	        	if(files.length<=0){
	        		commonTip.text({text:"请选择上传文件！"});
	        		return;
	        	}
	        	//文件上传前触发事件
	        	if(new RegExp(".("+_attchParams.musicFileFormat+")$").test(files[0].files[0].name)){
	        		commonTip.text({text:"此附件为录音文件！"});
	        		return;
	        	}
	        	$fileupload.bind('fileuploadsubmit', function (e, data) {
	        		data.formData = {};
	        			data.formData.serviceid=_options.serviceId;
	        			data.formData.uploadstaff=_uploadstaff;
	        			data.formData.attachmenttype="0";
	        			if(typeof(_options.workItem)!='undefined'){
	        				data.formData.nodeId=_options.workItem.prstNodeId;
	        			}
	        			if(typeof(_options.workItem)!='undefined'){
	        				data.formData.nodeName=_options.workItem.nodeNm;
	        			}
	        	});
	        	files[0].submit();
	        },
	        //上传录音文件
	        bagCommitvoice:function(event){
	        	if(files.length<=0){
	        		commonTip.text({text:"请选择上传文件！"});
	        		return;
	        	}
	        	if(!new RegExp(".("+_attchParams.musicFileFormat+")$").test(files[0].files[0].name)){
	        		commonTip.text({text:"此附件非录音文件！"});
	        		return;
	        	}
	        	$fileupload.bind('fileuploadsubmit', function (e, data) {
	        		data.formData = {};
        			data.formData.serviceid=_options.serviceId;
        			data.formData.uploadstaff=_uploadstaff;
        			data.formData.attachmenttype="1";
        			if(typeof(_options.workItem)!='undefined'){
        				data.formData.nodeId=_options.workItem.prstNodeId;
        			}
        			if(typeof(_options.workItem)!='undefined'){
        				data.formData.nodeName=_options.workItem.nodeNm;
        			}
	        	});
	        	files[0].submit();
	        },
	       //取消上传
	       removeupload:function(event){
	        	$('.bag-jindu', $el).addClass('hide').removeClass('show');
	       },
        })
	        var bagList = function(){
	        	var serviceid = _options.serviceId;
	    	   	var data={
	    	   			"serviceid":serviceid
	    	   	};
		        var config = {
						el:$('#bagList',$el),
					    field:{ 
					        key:'attachmentid',         		        	
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
	                                    	 var flag=confirm("确定删除该附件？")
	                                    	 if(flag){
	                                    		 var params={"attachmentid":item.data.attachmentid};
	                                    		 Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=attachmentDelete',params,function(result){
	                                    			 bagList();
	                                    		 },true);
	                                    	 }
	                                     } 
	                                 },
	                                 { 
	                                     text:'下载',  //按钮文本
	                                     name:'download',  //按钮名称
	                                     click:function(e,item){//按钮点击时处理函数
	                                    	console.log("download attachment...");
 						        	 		var attachmentname=encodeURI(encodeURI(item.data.attachmentname));
 						        	 		window.location.href="/ngwf_he/front/sh/fileDownload!download?uid=download&attachmentname="+attachmentname;
	                                     } 
	                                 }
	                             ]
		                    }
					        
					    },
					    page:{
					    	customPages:pageArr,
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
		        //result 为url返回的json
		        this.list.on('success',function(result){
					//解决条数选择框下面数字重复的问题
					var index =$.inArray(($(".selectPerPage").val()-0),pageArr);
					$(".selectPerPage option").eq(index+1).remove();
					//解决切换条数和点击上下页 已选择条数不置0,复选框不清除已选择的问题;
					$(".checkAllWraper>input").prop("checked",false);
					// 下面这个有些页面不需要 
					$(".allChecked").prop("checked",false);
					//下面使用html  因为使用text()在  ie8下会报错;
					$(".btnCustom0").prop("disabled",true);
		        	
		        	var count=0;
		        	if(typeof(result.bean.total)!='undefined'){
		        		count=result.bean.total
	    			}
		        	$("#aor_tabContainer a:contains('附件(')").html("附件("+count+")");
		        	console.log($("#aor_tabContainer a:contains('附件(')").html());
		        });
        	}
        return initialize;
    });               	