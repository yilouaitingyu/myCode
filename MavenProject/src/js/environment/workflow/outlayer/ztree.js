define(['Util','select','indexLoad',"detailPanel","simpleTree","hdb",
        'text!module/workflow/outlayer/ztree.html',
        'style!css/workflow/outlayer/ztree.css'],   
	function(Util,Select,IndexLoad,DetailPanel,SimpleTree,Hdb,Html_ztree){
	var $el,  //本模板
	    _index, // 本页面的参数,可以和主页面进行数据交互;
	    _options, // 本页面参数,可以和主页面进行数据交互
	    simpleTree,//创建的树对象
		sendArr,//派发过去的人的id 数组用于防止重复派发
		copyArr;//抄送人的id 用于防止重复抄送;
		var initialize = function(index, options){
			$el = $(Html_ztree);
			_index = index;
			_options=options;
			sendArr = options.sendArr;
			copyArr = options.copyArr;
			this.height=450;
			this.width = 600;
			this.ztree();
			this.sendOrder(); // 添加派发按钮事件
			this.copyOrder(); //添加抄送事件按钮
			this.deletPer();  //添加删除事件按钮 
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype,{
          ztree:function(){
            var setting = {
            treeId:$("#ztree_contain",$el),      //zTree 的唯一标识，初始化后，等于 用户定义的容器的 id 属性值
            async:{
                enable: true,        //是否开启异步加载模式
                //以下配置,async.enable=true时生效
//                url: "",    //Ajax获取数据的地址
                type: "post",      //Ajax的http请求模式
                autoParam: []       //异步加载时需要自动提交父节点属性的参数
            },
            callback:{
                beforeAsync: null,       //捕获异步加载之前事件的回调函数，zTree 根据返回值确定是否允许进行异步加载，默认值为null
                beforeCheck: null,       //捕获 勾选 或 取消勾选 之前事件的回调函数，并且根据返回值确定是否允许 勾选 或 取消勾选，默认值为null
                beforeCollapse: null,     //捕获父节点折叠之前事件的回调函数，并且根据返回值确定是否允许折叠操作，默认值为null
                beforeRemove: null      //捕获节点被删除之前事件的回调函数，并且根据返回值确定是否允许删除操作，默认值为null
            },
            check:{
                enable: true,        
                chkboxType : {"Y":" ", "N":" "}, //父子节点之间是否关联;      
                 chkStyle : "checkbox",     
            },
            view:{
                showIcon: true,     //是否显示节点图标，默认值为true
                showLine: true,     //是否显示节点之间的连线，默认值为true
                showTitle: true,    //是否显示节点的 title 提示信息(即节点DOM的title属性)，与 setting.data.key.title 同时使用
                fontCss: {},        //自定义字体
                nameIsHTML: false ,
                dblClickExpand:true
            },
            data:{
                keep:{
                    leaf: false,
                    parent: false
                },
                key:{
                    checked: "checked",
                    children: "children",
                    name: "name",
                    title: "",
                    url: "url"
                },
                simpleData:{
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: null
                }
            }
        }
        	var  paramData = {};
                 paramData.fromNode = _options.nodeActionInfo.nodeId;
                 paramData.toNode = _options.nodeActionInfo.activityId;
                 if(typeof(_options.templateId) != 'undefined'){
                	 paramData.templateId = _options.templateId;
                 }
                 if(typeof(_options.srTypeId) != 'undefined'){
                	 paramData.srTypeId = _options.srTypeId;
                 }
                 if(typeof(_options.processinfo) != 'undefined'){
                	 paramData.templateId = _options.processinfo.seqprcTmpltId;
                	 paramData.srTypeId = _options.processinfo.srvReqstTypeId;
                 }
                 if(typeof(_options.workItem) != 'undefined'){
                	 paramData.fromParticipant = _options.workItem.dspsWorkGrpId;
                 }
                 console.log(paramData);
          	Util.ajax.postJson(
      		 		  '/ngwf_he/front/sh/workflow!execute?uid=workGroupTreeData01',
      		 		 paramData, function(json, status) {
      		 			 var datas = json.object;
      		 			 console.log(datas);	
              		simpleTree = new SimpleTree.tierTree($("#ztree_contain",$el),datas,setting);     //$el 表示组件的容器，datas 表示数据，setting 表示配
              });  
         
       },
       //    点击派发的时候执行的函数
       sendOrder:function(){
       	  $("#sendOrder",$el).on("click",function(){
    		var nodes = simpleTree.getCheckedNodes(true);
    		var html= "" ;
    	    $.each(nodes, function(index,item) {
    	    	if(sendArr.indexOf(item.id)==-1){//判断已经派发的人员中是否有将要派发的人员id;
    	    		sendArr.push(item.id);//把当前派单人的id存放在数组中;
      	    		if(item.isGroup=="Y"){
    			    html+='<dd class="distribute group"><input type="checkbox" name="order" value="'+item.id+'@'+item.name+'" /><span class="workgroup">'+item.name+'</span><span class="person"></span><span class="typeClass">派发</span><span class="description">派发给'+item.name+'</span></dd>';
    			    }else{    // 是人的话
    			         var parentNode = simpleTree.getNodeByParam("tId", item.parentTId, null);//获取当前节点父级的数据
    			        html+='<dd class="distribute staff"><input type="checkbox" name="order" value="'+item.id+'@'+parentNode.id+'@'+item.name+'@'+parentNode.name+'" /><span class="workgroup">'+parentNode.name+'</span><span class="person">'+item.name+'</span><span class="typeClass">派发</span><span class="description">派发给'+parentNode.name+"("+item.name+')</span></dd>';	

    			        }
    	    	}else{
    	    		return;
    	    	}
    	    });
    	    $("#orderDealPer",$el).append($(html));
    	    simpleTree.checkAllNodes(false);//清空选中
    	})
       },
         // 点击抄送按钮时触发的事件
       copyOrder:function(){
    	$("#copyTo",$el).on("click",function(){
    		var html = " ";
    		var nodes = simpleTree.getCheckedNodes(true);//获取当前被选择的节点
    		$.each(nodes, function(index,item) {
    		    if(copyArr.indexOf(item.id)==-1){
    		    	copyArr.push(item.id);//把当前抄送人的id存放在数组中;
    		    	//如果当前节点是组的话
    			   if(item.isGroup=="Y"){
    				html+="<dd class=\"sendCopy group\"><input type=\"checkbox\" name=\"sendCopyGroup\" value=\"{'sendccgroupid':'"+item.id+"','sendccgroupname':'"+item.name+"'}\" /><span class=\"workgroup\">"+item.name+"</span><span class=\"person\"></span><span class=\"typeClass\">抄送</span><span class=\"description\">抄送给"+item.name+"</span></dd>";
    			    }else{    // 是人的话
    				var parentNode = simpleTree.getNodeByParam("tId", item.parentTId, null);//获取当前节点父级的数据
    				//html+="<dd class=\"sendCopy staff\"><input type=\"checkbox\" name=\"sendCopyStaff\" value=\"{'sendccstaff':'"+item.id+"','sendccstaffname':'"+item.name+"'}\" />  <span class=\"workgroup\">"+parentNode.name+"</span><span class=\"person\">"+item.name+"</span><span class=\"typeClass\">抄送</span><span class=\"description\">抄送给"+parentNode.name+"("+item.name+")</span>  </dd>";
    				html+="<dd class=\"sendCopy staff\"><input type=\"checkbox\" name=\"sendCopyStaff\" value=\"{'sendccstaff':'"+item.id+"','sendccstaffname':'"+item.name+"','sendccgroupid':'"+parentNode.id+"','sendccgroupname':'"+parentNode.name+"'}\" />  <span class=\"workgroup\">"+parentNode.name+"</span><span class=\"person\">"+item.name+"</span><span class=\"typeClass\">抄送</span><span class=\"description\">抄送给"+parentNode.name+"("+item.name+")</span>  </dd>";
    				
    			    }
    		    }else{
    		    	return;
    		    }
    			
    		});
    	    $("#orderDealPer",$el).append($(html));
    	    simpleTree.checkAllNodes(false);//清空选中
    	})
    },
    //点击删除按钮的时候;
   deletPer : function(){
  	$("#deleteBtn",$el).on("click",function(){
  		$("#orderDealPer input[type=checkbox]",$el).each(function(){
  			if($(this).prop("checked")){
  			 var checkValue = $(this).val();
  			 if($(this).parent().hasClass("distribute")){ //选择的是派发的人
  				 // 对value字符串进行处理   格式为CS9901@2016052404802
  			  var arr = checkValue.split("@");
  			    //判断当前id在派发数组中的位置然后删除;
  			  var indexNum = sendArr.indexOf(arr[0]);
  			  //从原数组中删除当前id
  			    sendArr.splice(indexNum,1);
  			 }else{ //选择的是抄送的人;
  			  //对字符串进行处理  字符串格式为'{sendccstaff:C00115,sendccstaffname:亚信测试5}' 
  			   var arr = checkValue.split(",")[0].split(":");
  			   var indexNum = copyArr.indexOf(arr[1]);
  			   copyArr.splice(indexNum,1);
  			 }	
  			$(this).parent().addClass("deletList"); 	
  			}else{
  				return;
  			};
  		});
  		console.log($(".deletList"))
  		$(".deletList",$el).remove();
  	})
  }
		});
	return initialize;
});