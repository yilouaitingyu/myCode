define(['Util', 'indexLoad', 'selectTree', 'simpleTree', 'ajax', 'tab'],
	function(Util, IndexLoad, SelectTree, SimpleTree, ajax, Tab) {
	    var _index;
	    var _options;
	    var _ids = "";
	    var _number = 0;//选中节点数
	    var ztree;
	    var parentArray=['010@'];//父级节点请求id;
	    var nameArray=["%%%"];
	    var eventInit = function(options) {
	    	$('#txtIds').on('click','ul.i-ul-collect li',changeColor);
	        Tree();
	        //获取受理号码
	        crossAPI.getContact('getClientBusiInfo', function(businInfo) {
	            if (businInfo != undefined && businInfo != "" && businInfo.bean != undefined) {
	                $('#searchNumber').val(businInfo.bean.msisdn);
	            }
	        })
	        //受理号变更事件
	        crossAPI.on('acceptNumberChange', function(data) {
	            $('#searchNumber').val(data);
	        })
	        $('#ok').on('click',openA);//确定
	        $('#nook').on('click',closeA);//取消
	        
	        $('.element li').on('click', element);
	        $('#serchClear').on('click', serchClear);
	        $('#clearBtn').on('click', clearBtn);
	
	        //$('.showContent').on('click', 'input[type="checkbox"]', add);
	        $("#ztreeT ul li").on('click', activeColor);
	        $('#ztree_One').on('click', '#ztree_One_1_switch', treeDemoColors);
	        $('#ztree_One').on('click', '#ztree_One_1_ul a.level1 ', treeDemoLiColors);
	        $('#treeDemo').on('click', 'li span.switch.level0', treeDemoColor);
	        $('#treeDemo').on('click', 'ul li.level1 ', treeDemoLiColor);
	        $('#searchType').on('propertychange input', onpropertychange); //监听字母搜索
	        $('#searchType').bind('keypress', EnterPress);//enter键
	        $('#myCollection').on('click', myCollection);//我的收藏
	        /**热点*/
	        $('#ywcx').on('click', selectAdd);
	        $('#ywzx').on('click', selectAdd);
	        $('#ywqx').on('click', selectAdd);
	        $('#yxl').on('click', selectAdd);
	        $('#khts').on('click', selectAdd);
	        $('#Hot').on('click',hot);//热点
	        
	        /**屏蔽鼠标右键*/
	        $('.showContent').bind("contextmenu", function(){
	            return false;
	        })
	        $(".showContent").on('mousedown','ul.i-ul-collect li',mouseRight);//鼠标右键事件
	        $('#deleted').on('click',deleted);//删除
	    };
	    
	    /**我的收藏选中底色*/
	    var changeColor = function(){
	    	var kkk = $(this).find('label');
	    	if($(this).find('input[type="checkbox"]').is(':checked')){
	    		kkk.css('background','#ccc');
	    	}else{
	    		kkk.css('background','none');
	    	}
	    }
	    
	    /**鼠标右击事件删除收藏   start*/
	    var mouseRight = function(e){
	    	var evt =e|| event;
	    	if($(this).find('input[type="checkbox"]').is(':checked')){
	    		var bbb =evt.clientX - $(this).offset().left;
	      		 if (3 == evt.which) {
	           			 var ccc = $(this).offset().top - 20;
	           			 var eee = $('.showContent').scrollTop(); 
	           			$('#deleted').css({'left':bbb,'top':ccc + eee + 'px'}).show();
	      		 } else{
	    	    	    $('#deleted').hide();
	    	         }
	  	       }else{
	  	    	   $('#deleted').hide();
	  	       }
	    } 
	    
	    var deleted = function(){
	    	if(window.confirm("确定删除吗？")){
	    		var staffId = _index.getUserInfo().staffId;
	    		var array = _ids.split(",");
	    		var sc_id="";
	    		$('input[type="checkbox"][val="scflag"]:checked').each(function(){
	    			sc_id+=$(this).attr('name')+",";
	    		});
	    		sc_id = sc_id.substring(0,sc_id.length-1);
	    		var arr = sc_id.split(",");
	    		console.log(sc_id);
	    		_number = _number - arr.length;
	        	var data={
	        			"creator":staffId,
	        			"ids":sc_id
	        	}
	            Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=delCollection01',data,function(status){
	            	crossAPI.tips(status.returnMessage,1500);
	            },true)
	        	for(var i=0;i<arr.length;i++){
	        		$('#selectContents li').find('input[name="'+arr[i]+'"]').parent('li').remove();
	        	}
	        	myCollection();
	        	$("#GS").html(_number);
			}
	    	$('#deleted').hide();
    	}
	    /**鼠标右击事件删除收藏   end*/
	    
	    
	    /**热点*/
	    var hot = function() {
	    	  $("#treeDemo ul li.level1").removeClass('activeColor');
	          $('#ztreeT .rightTri').toggleClass("lowerTri");
	          $("#ztreeT").toggleClass("ztreetColor");
	          $("#ztreeT ul li").toggleClass("ztreetFont");
	          $("#ztreeT ul li").removeClass('activeColor');
	          $("#ztreeT ul").finish().toggle(100);
	    }
	    /**固定类别查询*/
	    var selectAdd = function(e) {
	    	$('#txtIds').off('change'); 
	    	$('#deleted').hide();
	        var name = $(e.currentTarget).context.id;
	        var srtypeid = "";
	        if (name == "ywzx") {
	            srtypeid = "002114002";
	        } else if (name == "ywcx") {
	            srtypeid = "002114003";
	        } else if (name == "khts") {
	            srtypeid = "002114001";
	        } else if (name == "yxl") {
	            srtypeid = "002115";
	        } else if (name == "ywqx") {
	            srtypeid = "002114004";
	        }
	        ajax.getJson('/ngwf_he/front/sh/hotServiceType!execute?uid=queryServiceTypeById&srtypeid=' + srtypeid + '', function(result) {
	            var optionDic = "";
	            for (var i = 0; i < result.beans.length; i++) {
	                var fullName = result.beans[i].fullname
	                var srtypeId = result.beans[i].id
	                if (_ids.indexOf(srtypeId) >= 0) {
	                    optionDic += "<ul><li><input type='checkbox' checked name=" + srtypeId + "><label>" + fullName + "</label></li></ul>";
	                } else {
	                    optionDic += "<ul><li><input type='checkbox' name=" + srtypeId + "><label>" + fullName + "</label></li></ul>";
	                }
	            }
	            $("#txtIds").html(optionDic);
	            $(".showContent").unbind();
		        $('.showContent').on('click', 'input[type="checkbox"]', add);
	        })
	    }
	    
	    /**我的收藏*/
	    var myCollection = function(e) {
	        $("#treeDemo .ztree ul li.level1").removeClass('activeColor');
	        $("#ztreeT ul li").removeClass('activeColor');
	        $("#ztree_One_1_ul li").removeClass('activeColor');
	        $("#treeDemo_1_ul li").removeClass('activeColor');
	        var staffId = _index.getUserInfo().staffId;
	        var optionDic = "";
	        Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectCollection',{"creator":staffId}, function(result) {
	            $.each(result.beans, function(index, bean) {
	                if (_ids.indexOf(bean.id) >= 0) {
	                    optionDic += "<ul class='i-ul-collect'><li><input type='checkbox' val='scflag' checked name=" + bean.srtypeid + "><label>" + bean.fullname + "</label></li></ul>";
	                } else {
	                    optionDic += "<ul class='i-ul-collect'><li><input type='checkbox' val='scflag' name=" + bean.srtypeid + "><label>" + bean.fullname + "</label></li></ul>";
	                }
	            })
	        },true)
	        $("#txtIds").html(optionDic);
	        $('#txtIds').off('change'); 
	        $(".showContent").unbind();
	        $('.showContent').on('click', 'input[type="checkbox"]', add); 
	         /**屏蔽鼠标右键*/
	        $('.showContent').bind("contextmenu", function(){
	            return false;
	        });
	        //添加底色
	        var kkk = $("#txtIds").find('label');
	    	if($("#txtIds").find('input[type="checkbox"]').is(':checked')){
	    		$("#txtIds").find('input[type="checkbox"]:checked').siblings("label").css('background','#ccc');
	    	}
	        $(".showContent").on('mousedown','ul.i-ul-collect li',mouseRight);//鼠标右键事件
	    }
	    //确定
	    var openA = function(){
	    	var str="";//给父页面<input>srtypeId赋值
			var val="";//自定义属性,给父页面srtypeId
			$('#selectContents').find('li').each(function(){
				str+=$(this).text()+",";
			})
			str=str.substring(0,str.length-1);
			$('#selectContents').find('input').each(function(){
				val+=$(this).prop("name")+",";
			})
			val=val.substring(0,val.length-1);
			var callcontent =[str,val];
			if(_options.tabName=="请求查询"){
				crossAPI.trigger(['请求查询'],'serviceCategory',callcontent);
			}else if(_options.tabName=="查询"){
				crossAPI.trigger(['异动查询'],'servicechose',callcontent);
				
			}else{
				crossAPI.trigger(['未完请求'],'unfinished',callcontent);
			}
			_index.destroyDialog();
	    }
	    //取消
	    var closeA = function(){
			_index.destroyDialog();
		}
	    
	    /***服务类别树*/
	    var Tree = function() {
	        ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypess', function(result) {
                var setting = {
                    view: {
                        selectedMulti: false,
                        //禁止多点选中  
                        showIcon: false,
                        //是否显示节点图标，默认值为true	
                        dblClickExpand: false
                    },
                    check: {
                        enable: false //是否启用 复选框
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId",
                            rootPId: ""
                        }
                    },
                    callback: {
                        onClick: function(treeId, treeNode) {
                        	parentArray=['010@'];//父级节点请求id;
		            		nameArray=["%%%"];
                            var treeObj = $.fn.zTree.getZTreeObj(treeNode);
                            var selectedNode = treeObj.getSelectedNodes()[0];
                            if (selectedNode.level == 1) {
                            	$(".showContent").unbind();
                            	$('#deleted').hide();
                                   var setting1 = {
                                     treeId: $("#txtIds"),  //zTree 的唯一标识，初始化后，等于 用户定义的容器的 id 属性值
                                             treeObj:"ztree",
                                             async:{
                                                 enable: false,        //是否开启异步加载模式
                                                 //以下配置,async.enable=true时生效
                                                 url: '/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&srtypeId='+selectedNode.id ,      //Ajax获取数据的地址
                                                 type: "post",      //Ajax的http请求模式
                                                 autoParam: ["id"]     //异步加载时需要自动提交父节点属性的参数
                                                 
                                             },	
                                        view: {
                                            selectedMulti: false,
                                            //禁止多点选中  
                                            showIcon: true,
                                            //是否显示节点图标，默认值为true	     			     				
                                        },
                                        check: {
                                            enable: true //是否启用 复选框  
                                        },
                                        data: {
                                            simpleData: {
                                                enable: true,
                                                idKey: "id",
                                                pIdKey: "pId",
                                                rootPId: ""
                                            }
                                        },
                                        callback: {
                                        	onClick: zTreeOnClick,
                                            onCheck: zTreeOnCheck
                                        }
                                    };
                                   
                                    function zTreeOnCheck(event, treeId, treeNode) {
                                        var content = $("#selectContents").html();

                                        if (treeNode.checked == true) {
                                            if (content == "" || content == null) {
                                                content = "<li><input type='checkbox' name='" + treeNode.id + "'/><label>" + treeNode.fullName + "</label></li>";
                                                _ids += treeNode.id + ",";
                                                _number += 1;
                                                
                                                if ($("#hiddenSelectContents").val() == "") $("#hiddenSelectContents").val(treeNode.id);
                                                else $("#hiddenSelectContents").val($("#hiddenSelectContents").val() + "," + treeNode.id);
                                            } else {
                                                content += "<li><input type='checkbox' name='" + treeNode.id + "'/><label>" + treeNode.fullName + "</label></li>";
                                                _ids += treeNode.id + ",";
                                                _number += 1;

                                                if ($("#hiddenSelectContents").val() == "") $("#hiddenSelectContents").val(treeNode.id);
                                                else $("#hiddenSelectContents").val($("#hiddenSelectContents").val() + "," + treeNode.id);
                                            }
                                            $("#selectContents").html(content);
                                        } else {
                                            $("input[name^=" + treeNode.id + "]").parent('li').remove();
                                            _number = _number - 1;
                                            _ids = _ids.replace(treeNode.id+",", '');

                                            var array = $("#hiddenSelectContents").val().split(",");
                                            for (var i = 0; i < array.length; i++) {
                                                if (array[i] == treeNode.id) {
                                                    array.splice(i, 1);
                                                    break;
                                                }
                                            }
                                            $("#hiddenSelectContents").val(array.join(","));
                                        }
                                        $("#GS").html(_number);
                                    }
                                    
                                  //节点单击事件
                        			function zTreeOnClick(event, treeId, treeNode) {
                        				if(nameArray.join("-").indexOf(treeNode.name)==(-1))
	                        				nameArray.push(treeNode.name);
                        				if(treeNode.isLoad=="N"){
                        					return ;
                        				}
                        				if(treeNode.isLoad==""||treeNode.isLoad==null||treeNode.isLoad == undefined){
                        					if(treeNode.isLeaf=="0"){//父节点继续查
                        						treeNode.nocheck = true;
                        						if(parentArray.join("-").indexOf(treeNode.id)!=(-1)){
                        							treeNode.isParent =true;
                    								treeNode.nocheck = true;
                    								if(treeNode.open)
                    									ztree.expandNode(treeNode, false, false, true);
                    								else
                    									ztree.expandNode(treeNode, true, false, true);
                       							    ztree.refresh();
                    								return ;
                        						}
                        						else{
                        							treeNode.isParent =true;
                        							parentArray.push(treeNode.id);
	                        						ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&id='+treeNode.id, function(result) {
	                     							   //treeNode.nocheck = false;
	                     							   ztree.addNodes(treeNode,result.beans,true);
	                     							   //获取当前子节点，循环 去除checkbox
	                     							  var allNodes = ztree.getNodes();
	                                                  var nodes = ztree.transformToArray(allNodes);
	                                                  if (nodes.length > 0) {
	                                                      for (var i = 0; i < nodes.length; i++) {
	                                                          if (nodes[i].isLeaf=="0") { //找到父节点
	                                                        	  nodes[i].isParent =true;
	                                                              nodes[i].nocheck = true; //nocheck为true表示没有选择框
	                                                              ztree.refresh();
	                                  							//展开此节点
	                                                              ztree.expandNode(nodes, true, false, true);
	                                                          } else {
	                                                              nodes[i].nocheck = false;
	                                                              //var hidden = $("#hiddenSelectContents").val();
	                                                              var hidden =_ids;
	                                                              if (hidden.indexOf(nodes[i].id) != -1) {
	                                                                  nodes[i].checked = true;
	                                                              }
	                                                          }
	                                                      }
	                                                  }
	                                                  ztree.expandNode(treeNode, true, false, true);
	                     							   treeNode.nocheck = true;
	                     							   ztree.refresh();
	                        						});
                        						}
                        				
                        					}else{
                        						 treeNode.nocheck = false;
                        						 ztree.refresh();
                        					}
                        				}
                        				
                        				
                        			}
                                   ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&srtypeId=' + selectedNode.id + '', function(result) {
                                         var Node = result.beans;
                                         ztree = $.fn.zTree.init($("#txtIds"), setting1, Node);
                                         var allNodes = ztree.getNodes();
                                         var nodes = ztree.transformToArray(allNodes);
                                         if (nodes.length > 0) {
                                             for (var i = 0; i < nodes.length; i++) {
                                                 if (nodes[i].isLeaf=="0") { //找到父节点
                                                     nodes[i].nocheck = true; //nocheck为true表示没有选择框
                         							//展开此节点
                                                     nodes[i].isParent =true;
                         							ztree.expandNode(nodes, true, false, true);
                                                 } else {
                                                     nodes[i].nocheck = false;
                                                     //var hidden = $("#hiddenSelectContents").val();
                                                     var hidden =_ids;
                                                     if (hidden.indexOf(nodes[i].id) != -1) {
                                                         nodes[i].checked = true;
                                                     }
                                                 }
                                             }
                                         }
                                         
                                         ztree.refresh();
                                       //三角添加事件
                                         $('#txtIds').on("click",".switch",function(event){
                                     		if(nameArray.join("-").indexOf($(event.target).siblings('a').attr('title'))==(-1))
                                     			$(event.target).siblings('a').trigger('click');
                                     		if(nameArray.join("-").indexOf($(event.target).siblings('a').attr('title'))==(-1))
		                        				nameArray.push($(event.target).siblings('a').attr('title'));
                                         });
                        			 });
                        			
                                   /* var arr = _ids.split(",");
                                    for (var a = 0; a < arr.length; a++) {
                                        if (arr[a] != null && arr[a] != "") {
                                            var note = ztree.getNodeByParam("id", arr[a], null);
                                            if (!note && note != null) {
                                                note.checked = true;
                                            }
                                        }
                                    }*/
                            }
                        },
                    }
                }
                var treeDemo = $.fn.zTree.init($("#treeDemo"), setting, result.bean.resultParent);
	        })
	    }
	    
	    var EnterPress = function EnterPress() {
	        if (event.keyCode == 13) {
	            searchOK();
	        }
	    }
	    //点击确定搜索
	    var searchOK = function() {
	        var name = $('#searchType').val();
	        if (name == null || name == "") {
	            crossAPI.tips("请输入搜索内容", 3000);
	            return;
	        }
	        name = encodeURI(name);
	        var optionDic = "";
	        ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByNamereqType', {
	            name: name
	        },
	        function(result) {
	          	 $.each(result.beans, function(index, bean) {
	        		 //判断是否选中
	          		var arrayIds=_ids.split(",")
	           		var checkTree=""
	                for(var i=0;i<arrayIds.length;i++){
	             	   if(arrayIds[i]==bean.id){
	             		  checkTree= checked;
	             		   break;
	             	   }
	                }
	           		optionDic += "<ul><li><input type='checkbox' "+checkTree+"  name=" + bean.id + "><label>" + bean.fullName + "</label></li></ul>"
	               /*  if (_ids.indexOf(bean.id) >= 0) {
	                	 optionDic += "<ul><li><input type='checkbox' checked name=" + bean.id + "><label>" + bean.fullName + "</label></li></ul>"
	                 } else {
	                	 optionDic += "<ul><li><input type='checkbox' name=" + bean.id + "><label>" + bean.fullName + "</label></li></ul>"
	                        }*/
	             });
	            $("#txtIds").html(optionDic);
	            
	        });
	        addSelNode();
	        
	    }
	    
	    /***
	     * 搜索、enter往下面追加
	     */
	    var addSelNode =function(){
	    	 //去除事件
	        $(".showContent").unbind();
	        $('#txtIds').off('change'); 
	        //添加checked事件
	        $('#txtIds').on('change','input[type="checkbox"]',function(){
	            var content = $("#selectContents").html();
	            var id =$(this)[0].name;
	    		var fullName=$(this).next("label").text();
	            if ($(this).is(":checked")) {
	                if (content == "" || content == null) {
	                    content = "<li><input type='checkbox' checkFlag='check' name='" +id + "'/><label>" + fullName + "</label></li>";
	                    _ids += id + ",";
	                    _number += 1;

	                    if ($("#hiddenSelectContents").val() == "") $("#hiddenSelectContents").val(id);
	                    else $("#hiddenSelectContents").val($("#hiddenSelectContents").val() + "," + id);
	                } else {
	                    content += "<li><input type='checkbox' checkFlag='check' name='" + id + "'/><label>" + fullName + "</label></li>";
	                    _ids += id + ",";
	                    _number += 1;

	                    if ($("#hiddenSelectContents").val() == "") $("#hiddenSelectContents").val(id);
	                    else $("#hiddenSelectContents").val($("#hiddenSelectContents").val() + "," + id);
	                }
	                $("#selectContents").html(content);
	            } else {
	            	if($("input[name^=" + id + "][checkFlag='check']").parent('li').length>0){
	            		$("input[name^=" + id + "][checkFlag='check']").parent('li').remove();
	            		_number = _number - 1;
	            		_ids = _ids.replace(id, '');
	            		
	            		var array = $("#hiddenSelectContents").val().split(",");
	            		for (var i = 0; i < array.length; i++) {
	            			if (array[i] == id) {
	            				array.splice(i, 1);
	            				break;
	            			}
	            		}
	            		$("#hiddenSelectContents").val(array.join(","));
	            	}
	            }
	            $("#GS").html(_number);
	        
	    	}); 
	    }
	    
	    //监听字母搜索
	    var onpropertychange = function(e) {
	        var searchKey = $(e.currentTarget).context.value;
	        if (searchKey == null || searchKey == "") {
	            $("#txtIds").html("");
	            return;
	        }
	        var optionDic = "";
	        ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByZMreqType&searchKey=' + searchKey + '', function(result) {
	            $.each(result.beans, function(index, bean) {
	            	//判断是否选中
	           		var arrayIds=_ids.split(",")
	           		var checkTree=""
	                for(var i=0;i<arrayIds.length;i++){
	             	   if(arrayIds[i]==bean.id){
	             		  checkTree= checked;
	             		   break;
	             	   }
	                }
	           		optionDic += "<ul><li><input type='checkbox' "+checkTree+"  name=" + bean.id + "><label>" + bean.fullName + "</label></li></ul>"
	        	    });
	            $("#txtIds").html(optionDic);
	            addSelNode();
	        });
	    }
	    //去除重复
	    var add = function() {
	        var ids = $(this).attr("name");
	        if ($('.showContent').find('input[name^=' + ids + ']').is(":checked")) {
	            if (_ids.indexOf(ids) >= 0) {
	                crossAPI.tips("类别已选过，请勿重复选取", 3000);
	                $(this).checked = false;
	            } else {
	                var content = $("#selectContents").html();
	                content += "<li><input type='checkbox' name='" + ids + "'/><label>" + $(this).parent('li')[0].innerText + "</label></li>";
	                $("#selectContents").html(content);
	                _number += 1;
	                _ids +=  ids+",";
	                $("#GS").html(_number);
	            }
	        } else {
	            $("#selectContents").find("input[name$=" + ids + "]").parent('li').remove();
	            _number = _number - 1;
	            _ids = _ids.replace(ids+",", '');
	            $("#GS").html(_number);
	        }
	
	    }
	    //清空搜索框
	    var serchClear = function() {
	        $('#searchInput').val('');
	    }
	
	    //点击显示路径
	    var element = function() {
	        //点击input选框选择此条时，显示在页面上
	        if ($(this).find('input').is(":checked")) {
	
	        }
	    }
	    //删除选择路径
	    var clearBtn = function() {
	        if ($('#selectContents').find('input[type="checkbox"]').is(":checked")) {
	            $($('#selectContents').find('input[type="checkbox"]:checked').each(function() {
	                $('#selectContents').find('input[type="checkbox"]:checked').parent('li').remove();
	                var ids = $(this).attr("name");
	                var array = $("#hiddenSelectContents").val().split(",");
	                for (var i = 0; i < array.length; i++) {
	                    if (array[i] == ids) {
	                        array.splice(i, 1);
	                        break;
	                    }
	
	                }
	                $("#hiddenSelectContents").val(array.join(","));
	                _ids = _ids.replace(ids+",", '');
	                _number = _number - 1;
	                var treeDel= false;
	                if (ztree != null && ztree != "") {
	                    var allNodes = ztree.getNodes();
	
	                    var nodes = ztree.transformToArray(allNodes);
	                    if (nodes.length > 0) {
	                        for (var i = 0; i < nodes.length; i++) {
	                            if (nodes[i].id == $(this).attr("name")) {
	                                nodes[i].checked = false;
	                                if(!treeDel)//判断是否删除树节点
	                                	treeDel=true;
	                            }
	                        }
	                    }
	                  //如果删除树节点，树刷新
	                  if(treeDel)
	                    ztree.refresh();
	                }
	                $('.showContent').find('input[name^=' + ids + ']').prop('checked', false);
	                $('.showContent').find('input[name^=' + ids + ']').siblings('label').css('background','none');
	                
	
	            }))
	            $("#GS").html(_number);
	        } else {
	            crossAPI.popAlert("请选择删除的服务类别", "提示", function() {});
	        }
	    }
	    
	    var activeColor = function() {
	        $("#treeDemo_1_ul li").removeClass('activeColor');
	        $(this).addClass("activeColor").siblings().removeClass('activeColor');
	    }
	    var treeDemoColors = function() {
	        $('#ztree_One').toggleClass("ztreetColor");
	        $("ztree_One_1_ul li").removeClass('activeColor');
	    }
	    var treeDemoLiColors = function() {
	        $("#treeDemo_1_ul li").removeClass('activeColor');
	        $(this).parent('li').addClass("activeColor").siblings().removeClass('activeColor');
	    }
	    var treeDemoColor = function() {
	        /*$(this).parent().parent('.ztree').toggleClass("ztreetColor");*/
	        $(this).parent('li.level0').toggleClass("ztreetColor");
	        $("#treeDemo .ztree ul li.level1").removeClass('activeColor');
	    }
	    var treeDemoLiColor = function() {
	    	$("#ztreeT ul li").removeClass('activeColor');
	        $("#treeDemo ul li.level1").removeClass('activeColor');
	        $("#ztree_One_1_ul li").removeClass('activeColor');
	        $(this).addClass("activeColor").siblings().removeClass('activeColor');
	    }
	    
	    IndexLoad(function(IndexModule, options) {
	    	$('#searchType').focus();
	        _index = IndexModule;
	        _options = options
	        //事件初始化
	        eventInit(options);
	        
	    });
	
});