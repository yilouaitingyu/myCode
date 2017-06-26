define(['Util', 'indexLoad', 'selectTree', 'simpleTree', 'ajax', 'tab','validator'],
function(Util, IndexLoad, SelectTree, simpleTree, ajax, Tab,Validator) {
    var _index;
    var list;
    var _ids = "";
    var _number = 0;
    var ztree;
    var _serialNo = "";
    var _options;
    //获取服务请求内容
    var servicecontent = "";
    //获取流水号
    var serialNo1 = "";
    var str = "";
    //获取员工基本资料
    var acceptstaffno = ""; //员工编号
    var staffName="";//员工姓名
    var origStaffId="";//新员工对应的老员工编号
    var acceptcity = ""; //受理员工所属城市编码
    var acceptstaffdept = ""; //受理部门ID
    var userName = ""; //客户姓名
    var telNumStarCode = ""; //号码星级
    var customerAssignment = ""; //用户归属地
    var custBrandId="";//用户品牌
    var callType="";//受理方式
    var userSatisfy="";//满意度
    //获取受理号码
    var subsnumber = "";
    var callerNo ="";//主叫号码
    var _subsNumber="";
    var parentArray=['010@'];//父级节点请求id;
    var nameArray=["%%%"];
    
    var Tree = function() {
        ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypess', function(result) {
            var zNode = result.bean.resultParent;
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
                            ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&srtypeId=' + selectedNode.id + '', function(result) {
                                var Node = result.beans;
                                var setting1 = {
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
                                            enable: true
                                        }
                                    },
                                    callback: {
                                    	onClick: zTreeOnClick,
                                        onCheck: zTreeOnCheck
                                    },
                                }
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
                                        correlationSMS();
                                        correlationKno();
                                    } else {
                                        $("input[name^=" + treeNode.id + "]").parent('li').remove();
                                        _number = _number - 1;
                                        _ids = _ids.replace(treeNode.id+",", '');
                                        correlationSMS();
                                        correlationKno();
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
                                };
                                
                              //节点单击事件
                    			function zTreeOnClick(event, treeId, treeNode) {
                    				if(nameArray.join("-").indexOf(treeNode.name)==(-1))
                    				     nameArray.push(treeNode.name);
                    				if(treeNode.isLoad=="N"){
                    					return ;
                    				}
                    				if(treeNode.isLoad==""||treeNode.isLoad==null||treeNode.isLoad == undefined){
                    					console.log("isLoad")
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
                                                               nodes[i].nocheck = true; //nocheck为true表示没有选择框
                                                               nodes[i].isParent =true;
                                   							//展开此节点
                                   							ztree.expandNode(nodes, true, false, true);
                                                           } else {
                                                               nodes[i].nocheck = false;
                                                               //放开所有选中节点
                                                               nodes[i].checked = false;
                                                               //var hidden = $("#hiddenSelectContents").val();
                                                               var hidden =_ids;
                                                              /* var arrayIds=_ids.split(",")
                                                               for(var i=0;i<arrayIds.length;i++){
                                                            	   if(arrayIds[i]==nodes[i].id){
                                                            		   nodes[i].checked = true;
                                                            		   break;
                                                            	   }
                                                               }*/
                                                               if (hidden.indexOf(nodes[i].id) != -1) {
                                                                   nodes[i].checked = true;
                                                               }
                                                           }
                                                       }
                                                   }
                      							   ztree.expandNode(treeNode, true, false, true); //展开此节点
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
                                
                                ztree = $.fn.zTree.init($("#txtIds"), setting1, Node);
                                var allNodes = ztree.getNodes();
                                var nodes = ztree.transformToArray(allNodes);
                                if (nodes.length > 0) {
                                    for (var i = 0; i < nodes.length; i++) {
                                        if (nodes[i].isLeaf=="0") { //找到父节点
                                            nodes[i].isParent =true;
                                            nodes[i].nocheck = true; //nocheck为true表示没有选择框
                                        } else {
                                            nodes[i].nocheck = false;
                                           // var hidden = $("#hiddenSelectContents").val();
                                            var hidden =_ids;
                                            if (hidden.indexOf(nodes[i].id) != -1) {
                                                nodes[i].checked = true;
                                            }
                                        }
                                    }
                                }
                                ztree.refresh();
                                $('#txtIds').on("click",".switch",function(event){
                            		if(nameArray.join("-").indexOf($(event.target).siblings('a').attr('title'))==(-1))
                            			$(event.target).siblings('a').trigger('click');
                            		if(nameArray.join("-").indexOf($(event.target).siblings('a').attr('title'))==(-1))
                        				nameArray.push($(event.target).siblings('a').attr('title'));
                                });
                            });
                        }
                    },
                }
            };
            var treeDemo = $.fn.zTree.init($("#treeDemo"), setting, zNode);
        });

    }
    var eventInit = function(options) {
    	 /**屏蔽鼠标右键*/
    	$('.showContent').bind("contextmenu", function(){
		    return false;
    	});
    	$(".showContent").on('mousedown','ul.i-ul-collect li',mouseRight);//鼠标右键事件
    	$('#deleted').on('click',deleted);
    	$('#txtIds').on('click','ul.i-ul-collect li',changeColor);
        Tree();
        //searchMOK(options);
        //电话挂断后弹出的受理请求页面获取初始信息
        crossAPI.getIndexInfo(function(data) {
        	//员工编号
            if (data.userInfo.staffId != null && data.userInfo.staffId!=undefined && data.userInfo.staffId != "") {
            	acceptstaffno = data.userInfo.staffId;
            }
            //员工姓名
            if (data.userInfo.staffName != null && data.userInfo.staffName!=undefined && data.userInfo.staffName != "") {
            	staffName = data.userInfo.staffName;
            }
            //员工部门
            if (data.userInfo.deptId != null && data.userInfo.deptId!=undefined && data.userInfo.deptId != "") {
            	acceptstaffdept = data.userInfo.deptId;
            }
            _options = data.iframe.businessOptions;
            if (typeof(_options) != "undefined") {
                //流水号
                if (_options.serialNo != undefined && _options.serialNo != null && _options.serialNo != "") {
                    _serialNo = _options.serialNo;
                }
                //受理号码
                if (_options.subsNumber != undefined && _options.subsNumber != null && _options.subsNumber != "") {
                    $('#searchNumber').val(_options.subsNumber);
                    _subsNumber=_options.subsNumber;
                }
            }
        });
        //获取受理号码
        crossAPI.getContact('getCheckedPhoneNum',function(businInfo){
        	if(businInfo!=null && businInfo!="" && (_subsNumber==null || _subsNumber=="")){
        		$('#searchNumber').val(businInfo);
        	}
		});
        //受理号变更事件
        crossAPI.on('acceptNumberChange', function(data) {
        	if(data!=null && data!="" && (_subsNumber==null || _subsNumber=="")){
        		$('#searchNumber').val(data);
        	}
        });
        //获取流水号
        crossAPI.getContact('getSerialNo', function(serialNo) {
        	if(_serialNo ==null || _serialNo==""){
        		if (serialNo != null && serialNo != "") {
                    _serialNo = serialNo;
                    crossAPI.set("reqSerialNo",serialNo);
                    crossAPI.getContact('setAcceptCall',{ serialNo:_serialNo},function(){
                     	 
                    });
                }
        	}
        })

        $('.element li').on('click', element);
        $('#serchClear').on('click', serchClear);
        $('#clearBtn').on('click', clearBtn);
        $('#shoucang').on('click', shoucang);
        //业务查询
        $('#ywcx').on('click', selectAdd);
        $('#ywzx').on('click', selectAdd);
        $('#ywqx').on('click', selectAdd);
        $('#yxl').on('click', selectAdd);
        $('#khts').on('click', selectAdd);

       // $('.showContent').on('click', 'input[type="checkbox"]', add);
        $('#Hot').on('click', Hot);
        $("#ztreeT ul li").on('click', activeColor);
        $('#ztree_One').on('click', '#ztree_One_1_switch', treeDemoColors);
        $('#ztree_One').on('click', '#ztree_One_1_ul a.level1 ', treeDemoLiColors);
        $('#treeDemo').on('click', 'li span.switch.level0', treeDemoColor);
        $('#treeDemo').on('click', 'ul li.level1 ', treeDemoLiColor);
        $('.t-tabs-items li').on('click', tabsActive); //关联事件
        $('#tianDan').on('click', tianDan); //填单
        $('#myCollection').on('click', myCollection);//我的收藏
        $('#searchType').on('propertychange input', onpropertychange); //监听字母搜索
        $('#directResponse').on('click', directResponse); //直接答复
        $('#correlationSMS').on('click', 'a', correlation); //关联短信
        $('#searchType').bind('keypress', EnterPress);
       
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
    /**删除我的收藏*/
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
            },true);
        	for(var i=0;i<arr.length;i++){
        		_ids = _ids.replace(arr[i]+",", '');
        		$('#selectContents li').find('input[name="'+arr[i]+'"]').parent('li').remove();
        	}
        	myCollection();
        	$("#GS").html(_number);
        	correlationSMS();
        	correlationKno();
		}
    	$('#deleted').hide();
    }

    /**鼠标右击事件删除收藏   end*/
    
    
    /**enter键事件*/
    var EnterPress = function EnterPress() {
        if (event.keyCode == 13) {
            searchOK();
        }
    }
    
    /**点击确定搜索*/
    var searchOK = function() {
        var name = $('#searchType').val();
        if (name == null || name == "") {
            crossAPI.popAlert("请输入服务类型", "提示", function() {});
            return;
        }
        name = encodeURI(name);
        var optionDic = "";
        ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByNamereqType', {name: name},
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
                correlationSMS();
                correlationKno();
            } else {
            	if($("input[name^=" + id + "][checkFlag='check']").parent('li').length>0){
            		$("input[name^=" + id + "][checkFlag='check']").parent('li').remove();
            		_number = _number - 1;
            		_ids = _ids.replace(id, '');
            		correlationSMS();
            		correlationKno();
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
    
    /**监听字母搜索*/
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
        })
    }
    
    /**去除重复*/
    var add = function() {
        var ids = $(this).attr("name");
        var content = $("#selectContents").html();
        if ($('.showContent').find('input[name^=' + ids + ']').is(":checked")) {
            if (_ids.indexOf(ids) >= 0) {
                crossAPI.popAlert("类别已选过，请勿重复选取", "提示", function() {});
                $(this).checked = false;
            } else {
                content += "<li><input type='checkbox' name='" + ids + "'/><label>" + $(this).parent('li')[0].innerText + "</label></li>";
                $("#selectContents").html(content);
                _number += 1;
                _ids +=  ids+",";
                $("#GS").html(_number);
                correlationSMS();
                correlationKno();
            }
        } else {
            $("#selectContents").find("input[name$=" + ids + "]").parent('li').remove();
            _number = _number - 1;
            _ids = _ids.replace(ids+",", '');
            $("#GS").html(_number);
            correlationSMS();
            correlationKno();
        }
    }
    
    /****填单 start***/
    var tianDan = function(options) {
    	 //获取受理号码
        subsnumber = $('#searchNumber').val();
        if (subsnumber == '') {
            crossAPI.tips('受理号码不可为空！', 3000);
            return;
        }
        var regx =/^[0-9]+$/;
        if(!regx.test(subsnumber)){
        	crossAPI.tips('受理号码格式不正确！', 3000);
        	return;
        }
        if (_number == 0) {
            crossAPI.popAlert("填单_请选取服务请求内容", "提示", function() {});
            return;
        } else if (_number != 1) {
            crossAPI.popAlert("填单时只能选择一个服务请求", "提示", function() {});
            return;
        }
       
        //获取服务请求内容
        servicecontent = $.trim($("#noMustInput").val());//encodeURI($("#noMustInput").val());
        var length = $("#noMustInput").val().length;
        if (length > 100) {
            crossAPI.tips('服务请求内容不能超过100字', 3000);
            return;
        }
        var arr = _ids.split(","); //获取选取的服务类型id
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null && arr[i] != "") {
                str += arr[i] + ",";
            }
        }
        str = str.substring(0, str.length - 1);
        //根据流水号获取接触信息
        crossAPI.getContact('getSerialNo', function(serialNo) {
        	if(_serialNo ==null || _serialNo==""){
        		if (serialNo != null && serialNo != "") {
        			_serialNo = serialNo;
        			crossAPI.set("reqSerialNo",serialNo);
        			crossAPI.getContact('setAcceptCall',{ serialNo:_serialNo},function(){
                      	 
                    });
        		}else{
        			crossAPI.get("reqSerialNo",function(result){
			    		if(result!=undefined && result!=null){
			    			crossAPI.set("reqSerialNo",result);
			    			_serialNo=result;
			    		}
			    	},true);
        		}
        	}
        	
        	setTimeout(function(){
        		var params={method:'NGCCT_QUERYCONTACTINFO_GET',paramDatas:'{serialNo:"'+_serialNo+'"}'};
        		Util.ajax.postJson("/ngwf_he/front/sh/common!execute?uid=callCSF",params,function(result){
        			if(result.beans.length>0){
        				if(result.beans[0].custName!=undefined){
        					userName=result.beans[0].custName;//客户姓名
        				}
                        if(result.beans[0].custStarId!=undefined){
                        	telNumStarCode=result.beans[0].custStarId;//用户星级
        				}
                        if(result.beans[0].custCityId2!=undefined){
                        	customerAssignment=result.beans[0].custCityId2; //用户归属地
        				}
                        if(result.beans[0].custBrandId!=undefined){
                        	custBrandId=result.beans[0].custBrandId;//用户品牌
        				}
                        if(result.beans[0].userSatisfy!=undefined){
                        	userSatisfy=result.beans[0].userSatisfy;//用户满意度
        				}
                        if(result.beans[0].callType!=undefined){
                        	callType=result.beans[0].callType;//呼叫方式
        				}
                        if(result.beans[0].staffCityId!=undefined){
                        	acceptcity=result.beans[0].staffCityId;//员工地市
        				}
                        if(result.beans[0].callerNo!=undefined){
                        	callerNo=result.beans[0].callerNo;//主叫号码
        				}
        			}
        			
        			if(telNumStarCode=="" && customerAssignment=="" && userName==""){
                     	crossAPI.getContact('getClientBusiInfo', function(businInfo) {
                         	if (businInfo != undefined && businInfo.bean != undefined) {
                                 if (businInfo.bean.userName != null && businInfo.bean.userName != undefined && businInfo.bean.userName != "") {
                                     userName = businInfo.bean.userName; 
                                 }
                                 if (businInfo.bean.telNumStarCode != null && businInfo.bean.telNumStarCode != undefined && businInfo.bean.telNumStarCode != "") {
                                     telNumStarCode = businInfo.bean.telNumStarCode; 
                                 }
                                 if (businInfo.bean.numAssignmentCode != null && businInfo.bean.numAssignmentCode != undefined && businInfo.bean.numAssignmentCode != "") {
                                     customerAssignment = businInfo.bean.numAssignmentCode; 
                                 }
                                 if (businInfo.bean.brandId != null && businInfo.bean.brandId != undefined && businInfo.bean.brandId != "") {
                                	 custBrandId = businInfo.bean.brandId; 
                                 }
                             }
                         	var data ={
                             		"subsNumber":subsnumber,
                             		"subsName":userName,
                             		"subsLevel":telNumStarCode,
                             		"subsCity":customerAssignment,
                             		"acceptStaffNo":acceptstaffno,
                             		"acceptCity":acceptcity,
                             		"acceptStaffDept":acceptstaffdept,
                             		"serviceContent":servicecontent,
                             		"serialNo":_serialNo,
                             		"operationStatus":1,
                             		"serviceId":str,
                             		"custBrand":custBrandId,
                             		"userSatisfy":userSatisfy,
                             		//"custBrand":"1",//用户品牌
                             		//"userSatisfy":"0",//满意度(未评价)
                             		"mobileType":"0",//手机型号
                             		"contactMode":"1",//联系方式(人工)
                             		"urgentId":"00006003",//紧急度(一般)
                             		"impactId":"00007003",//重要程度(中)
                             		"priorityId":"00008003",//优先级(中)
                             		"languageId":"1",//语种(普通话)
                             		"acceptMode":"1",//受理方式(人工)
                             		"contactChannel":"1",//受理渠道(人工受理)
                             		"faultLocation":acceptcity,//业务地市(省中心)
                             		"callerNo":callerNo  //主叫号码
                             }
                             //保存数据库
                             Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=acceptanceReques004',data, function(result) {
                 				if(result.bean.start==null){
                 					crossAPI.popAlert ("填单失败","提示",function(){});
                 				}else{
                 					crossAPI.popAlert(result.bean.start,"提示",function(){});
                 				}
                 			},true)
                        })
                     }else{
                     	var data ={
                         		"subsNumber":subsnumber,
                         		"subsName":userName,
                         		"subsLevel":telNumStarCode,
                         		"subsCity":customerAssignment,
                         		"acceptStaffNo":acceptstaffno,
                         		"acceptCity":acceptcity,
                         		"acceptStaffDept":acceptstaffdept,
                         		"serviceContent":servicecontent,
                         		"serialNo":_serialNo,
                         		"operationStatus":1,
                         		"serviceId":str,
                         		"custBrand":custBrandId,
                         		"userSatisfy":userSatisfy,
                         		//"custBrand":"1",//用户品牌
                         		//"userSatisfy":"0",//满意度(未评价)
                         		"mobileType":"0",//手机型号
                         		"contactMode":"1",//联系方式(人工)
                         		"urgentId":"00006003",//紧急度(一般)
                         		"impactId":"00007003",//重要程度(中)
                         		"priorityId":"00008003",//优先级(中)
                         		"languageId":"1",//语种(普通话)
                         		"acceptMode":"1",//受理方式(人工)
                         		"contactChannel":"1",//受理渠道(人工受理)
                         		"faultLocation":acceptcity,//业务地市(省中心)
                         		"callerNo":callerNo  //主叫号码
                         }
                         //保存数据库
                         Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=acceptanceReques004',data, function(result) {
             				if(result.bean.start==null){
             					crossAPI.popAlert("填单失败","提示",function(){});
             				}else{
             					crossAPI.popAlert(result.bean.start,"提示",function(){});
             				}
             			},true)
                     }
            		
            		
            		
            		
            		 //跳转老客服填单页面
                    Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getPropertiesIP',
            				{},function(result,isOK){
            				if(isOK){
            			 		Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=favoritMSG004',{"staffId":acceptstaffno,"provinceId":"00030004","systermNo":"CSP"},function(result){
            						if(result ==null||result ==undefined ||result =="undefined"){
            							origStaffId=""; 
            						}
            						else
            						{
            							if(result.beans ==null||result.beans ==undefined ||result.beans =="undefined")
            							{
            								origStaffId="";
            							}
            							else
            							{ 
            								if(result.beans[0] ==null||result.beans[0] ==undefined ||result.beans[0] =="undefined"){
            									origStaffId="";
            								}else{
            									if(result.beans[0].origStaffId ==null||result.beans[0].origStaffId ==undefined ||result.beans[0].origStaffId =="undefined")
            									{
            										origStaffId="";
            									}
            									else
            									{
            										origStaffId = result.beans[0].origStaffId;
            									}									
            								}
            							}
            							
            						} 
            					},true);
            			 		if(origStaffId==""){
            						crossAPI.popAlert("获取老工号失败,不能跳转到填单页面!", "提示", function() {});
            					}else{
            						crossAPI.createTab.apply(crossAPI, ['填单详情', result.bean.oldWorkSheetIpPort+'/arsys/queryManager/sheetmessage/UsdInCrmPage.jsp?LOGINNAME=' + origStaffId + '&telnum=' + subsnumber + '&sourceid=&flag=1&srtypeid=' + str + '&ApplyMaster='+staffName, {}]);
            						/*for (var i = 0; i < arr.length; i++) {
            				            if (arr[i] != null && arr[i] != "") {
            				            }
            				        }*/
            					}
            					_index.destroyTab('受理请求');
            					//关闭追加来单原因页签
            					if(_serialNo!="" && _serialNo.length>10){
            						_index.destroyTab('追加来电原因_'+_serialNo.substring(_serialNo.length-5,_serialNo.length));
            					}
            					_index.destroyDialog("callEndPopupDialog");
            				}
            		});
        		})
        		 
			},100);
        });
        
    }
    /****填单 end***/
    
    /**直接答复 start*/
    var directResponse = function() {
		 //获取受理号码
        subsnumber = $('#searchNumber').val();
        if (subsnumber == '') {
            crossAPI.tips('受理号码不可为空！', 3000);
            return;
        }
        var regx =/^[0-9]+$/;
        if(!regx.test(subsnumber)){
        	crossAPI.tips('受理号码格式不正确！', 3000);
        	return;
        }
        if (_number == 0) {
            crossAPI.popAlert("直接答复_请选取服务请求内容", "提示", function() {});
            return;
        }/* else if (_number != 1) {
            crossAPI.popAlert("只能选取一条服务请求，请删除多余选项", "提示", function() {});
            return;
        }*/
       
        //获取服务请求内容
        servicecontent = $.trim($("#noMustInput").val());//encodeURI($("#noMustInput").val());
        var length = $("#noMustInput").val().length;
        if (length > 100) {
            crossAPI.tips('服务请求内容不能超过100字', 3000);
            return;
        }
        var arr = _ids.split(","); //获取选取的服务类型id
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null && arr[i] != "") {
                str += arr[i] + ",";
            }
        }
        str = str.substring(0, str.length - 1);
        
      //根据流水号获取接触信息
        crossAPI.getContact('getSerialNo', function(serialNo) {
        	if(_serialNo ==null || _serialNo==""){
        		if (serialNo != null && serialNo != "") {
        			_serialNo = serialNo;
        			crossAPI.set("reqSerialNo",serialNo);
        			crossAPI.getContact('setAcceptCall',{ serialNo:_serialNo},function(){
                      	 
                    });
        		}else{
        			crossAPI.get("reqSerialNo",function(result){
			    		if(result!=undefined && result!=null){
			    			crossAPI.set("reqSerialNo",result);
			    			_serialNo=result;
			    		}
			    	},true);
        		}
        	}
            
        	setTimeout(function(){
        		var params={method:'NGCCT_QUERYCONTACTINFO_GET',paramDatas:'{serialNo:"'+_serialNo+'"}'};
    			Util.ajax.postJson("/ngwf_he/front/sh/common!execute?uid=callCSF",params,function(result){
    				if(result.beans.length>0){
    					if(result.beans[0].custName!=undefined){
    						userName=result.beans[0].custName;//客户姓名
    					}
                        if(result.beans[0].custStarId!=undefined){
                        	telNumStarCode=result.beans[0].custStarId;//用户星级
    					}
                        if(result.beans[0].custCityId2!=undefined){
                        	customerAssignment=result.beans[0].custCityId2; //用户归属地
    					}
                        if(result.beans[0].custBrandId!=undefined){
                        	custBrandId=result.beans[0].custBrandId;//用户品牌
    					}
                        if(result.beans[0].userSatisfy!=undefined){
                        	userSatisfy=result.beans[0].userSatisfy;//用户满意度
    					}
                        if(result.beans[0].callType!=undefined){
                        	callType=result.beans[0].callType;//呼叫方式
    					}
                        if(result.beans[0].staffCityId!=undefined){
                        	acceptcity=result.beans[0].staffCityId;//员工地市
        				}
                        if(result.beans[0].callerNo!=undefined){
                        	callerNo=result.beans[0].callerNo;//主叫号码
        				}
    				}
    				

                    if(telNumStarCode=="" && customerAssignment=="" && userName==""){
                    	crossAPI.getContact('getClientBusiInfo', function(businInfo) {
                        	if (businInfo != undefined && businInfo.bean != undefined) {
                                if (businInfo.bean.userName != null && businInfo.bean.userName != undefined && businInfo.bean.userName != "") {
                                    userName = businInfo.bean.userName; 
                                }
                                if (businInfo.bean.telNumStarCode != null && businInfo.bean.telNumStarCode != undefined && businInfo.bean.telNumStarCode != "") {
                                    telNumStarCode = businInfo.bean.telNumStarCode; 
                                }
                                if (businInfo.bean.numAssignmentCode != null && businInfo.bean.numAssignmentCode != undefined && businInfo.bean.numAssignmentCode != "") {
                                    customerAssignment = businInfo.bean.numAssignmentCode; 
                                }
                                if (businInfo.bean.brandId != null && businInfo.bean.brandId != undefined && businInfo.bean.brandId != "") {
                               	 custBrandId = businInfo.bean.brandId; 
                                }
                            }
        					var data ={
                            		"subsNumber":subsnumber,
                            		"subsName":userName,
                            		"subsLevel":telNumStarCode,
                            		"subsCity":customerAssignment,
                            		"acceptStaffNo":acceptstaffno,
                            		"acceptCity":acceptcity,
                            		"acceptStaffDept":acceptstaffdept,
                            		"serviceContent":servicecontent,
                            		"serialNo":_serialNo,
                            		"operationStatus":4,
                            		"serviceId":str,
                            		"custBrand":custBrandId,
                            		"userSatisfy":userSatisfy,
                            		//"custBrand":"1",//用户品牌
                            		//"userSatisfy":"0",//满意度(未评价)
                            		"mobileType":"0",//手机型号
                            		"contactMode":"1",//联系方式(人工)
                            		"urgentId":"00006003",//紧急度(一般)
                            		"impactId":"00007003",//重要程度(中)
                            		"priorityId":"00008003",//优先级(中)
                            		"languageId":"1",//语种(普通话)
                            		"acceptMode":"1",//受理方式(人工)
                            		"contactChannel":"1",//受理渠道(人工受理)
                            		"faultLocation":acceptcity,//业务地市(省中心)
                            		"callerNo":callerNo  //主叫号码
                            }
                            //保存数据库
                            Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=acceptanceReques004',data, function(result) {
            					if(result.bean.start==null){
            						crossAPI.popAlert("直接答复失败","提示",function(){});
            					}else{
            						crossAPI.popAlert(result.bean.start,"提示",function(){});
            					}
            					 _index.destroyDialog("callEndPopupDialog");
                                 _index.destroyTab('受理请求');
                                //关闭追加来单原因页签
             					if(_serialNo!="" && _serialNo.length>10){
             						_index.destroyTab('追加来电原因_'+_serialNo.substring(_serialNo.length-5,_serialNo.length));
             					}
            				})
                        });
                    }else{
    					var data ={
                        		"subsNumber":subsnumber,
                        		"subsName":userName,
                        		"subsLevel":telNumStarCode,
                        		"subsCity":customerAssignment,
                        		"acceptStaffNo":acceptstaffno,
                        		"acceptCity":acceptcity,
                        		"acceptStaffDept":acceptstaffdept,
                        		"serviceContent":servicecontent,
                        		"serialNo":_serialNo,
                        		"operationStatus":4,
                        		"serviceId":str,
                        		"custBrand":custBrandId,
                        		"userSatisfy":userSatisfy,
                        		//"custBrand":"1",//用户品牌
                        		//"userSatisfy":"0",//满意度(未评价)
                        		"mobileType":"0",//手机型号
                        		"contactMode":"1",//联系方式(人工)
                        		"urgentId":"00006003",//紧急度(一般)
                        		"impactId":"00007003",//重要程度(中)
                        		"priorityId":"00008003",//优先级(中)
                        		"languageId":"1",//语种(普通话)
                        		"acceptMode":"1",//受理方式(人工)
                        		"contactChannel":"1",//受理渠道(人工受理)
                        		"faultLocation":acceptcity,//业务地市(省中心)
                        		"callerNo":callerNo  //主叫号码
                        }
                        //保存数据库
                        Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=acceptanceReques004',data, function(result) {
        					if(result.bean.start==null){
        						crossAPI.popAlert("直接答复失败","提示",function(){});
        					}else{
        						crossAPI.popAlert(result.bean.start,"提示",function(){});
        					}
        					 _index.destroyDialog("callEndPopupDialog");
                             _index.destroyTab('受理请求');
                            //关闭追加来单原因页签
         					if(_serialNo!="" && _serialNo.length>10){
         						_index.destroyTab('追加来电原因_'+_serialNo.substring(_serialNo.length-5,_serialNo.length));
         					}
        				})
                    }
    			})
			},100);
        });
    }
    /***********直接答复 end**********/
    
    /**获取路径*/
    var getBaseUrl = function() {
        var ishttps = 'https:' == document.location.protocol ? true: false;
        var url = window.location.host;
        if (ishttps) {
            url = 'https://' + url;
        } else {
            url = 'http://' + url;
        }
        return url;
    }
    
    /**我的收藏*/
    var myCollection = function(e) {
    	$('.showContent input[type="checkbox"]').off('click');   	
        $("#treeDemo .ztree ul li.level1").removeClass('activeColor');
        $("#ztreeT ul li").removeClass('activeColor');
        $("#ztree_One_1_ul li").removeClass('activeColor');
        $("#treeDemo_1_ul li").removeClass('activeColor');
        var staffId = _index.getUserInfo().staffId;
        var optionDic = "";
        Util.ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectCollection',{"creator":staffId}, function(result) {
            $.each(result.beans, function(index, bean) {
                if (_ids.indexOf(bean.id) >= 0) {
                    optionDic += "<ul class='i-ul-collect'><li><input type='checkbox' val='scflag' checked name=" + bean.srtypeid + "><label>" + bean.fullname + "</label></li></ul>";
                } else {
                    optionDic += "<ul class='i-ul-collect'><li><input type='checkbox' val='scflag' name=" + bean.srtypeid + "><label>" + bean.fullname + "</label></li></ul>";
                }
            })
        },true)
        $("#txtIds").html(optionDic);
        //添加底色
        var kkk = $("#txtIds").find('label');
    	if($("#txtIds").find('input[type="checkbox"]').is(':checked')){
    		$("#txtIds").find('input[type="checkbox"]:checked').siblings("label").css('background','#ccc');
    	}
        
        $('#txtIds').off('change'); 
        $('.showContent').unbind(); 
        $('.showContent').on('click', 'input[type="checkbox"]', add); 
        $('.showContent').bind("contextmenu", function(){
		    return false;
    	});
    	$(".showContent").on('mousedown','ul.i-ul-collect li',mouseRight);//鼠标右键事件
    }
    /**我的收藏选中底色*/
    var changeColor = function(){
    	var kkk = $(this).find('label');
    	if($(this).find('input[type="checkbox"]').is(':checked')){
    		kkk.css('background','#ccc');
    	}else{
    		kkk.css('background','none');
    	}
    }
    /**固定类别查询*/
    var selectAdd = function(e) {

    	$('#txtIds').off('change'); 
    	//$(".showContent").unbind();
    	//$(".showContent ul li").off();
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
    
    /**清空搜索框*/
    var serchClear = function() {
        $('#searchInput').val('');
    }

    /**收藏*/
    var shoucang = function() {
    	var arr = _ids.split(",");
    	var id = arr.join("");
        if (id == "" || _ids == null || _ids == "") {
            crossAPI.popAlert("请选择服务类别", "提示",function(){});
            return;
        }
        var staffId = _index.getUserInfo().staffId;
        ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=insertCollection&srtypeid=' + _ids + '&creator=' + staffId + '', function(result) {
            $("#ztreeT ul li").removeClass('activeColor');
            $("#treeDemo_1_ul li").removeClass('activeColor');
            crossAPI.popAlert(result.bean.start, "提示", function() {});
        })
    }
    
    /**点击显示路径*/
    var element = function() {
        //点击input选框选择此条时，显示在页面上
        if ($(this).find('input').is(":checked")) {

        }
    }
    
    /**删除选择路径*/
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
                console.log(ids);
                _ids = _ids.replace(ids+",", '');
                _number = _number - 1;
                var treeDel= false;
                if (ztree != null && ztree != "") {
                    var nodes = ztree.transformToArray(ztree.getNodes());
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
            correlationSMS();
            correlationKno();
        } else {
            crossAPI.popAlert("请选择删除的服务类别", "提示", function() {});
        }
    }
    var Hot = function() {
        $("#treeDemo ul li.level1").removeClass('activeColor');
        $('#ztreeT .rightTri').toggleClass("lowerTri");
        $("#ztreeT").toggleClass("ztreetColor");
        $("#ztreeT ul li").toggleClass("ztreetFont");
        $("#ztreeT ul li").removeClass('activeColor');
        $("#ztreeT ul").finish().toggle(100);
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

    
    /**关联事件*/
    var tabsActive = function() {
        var $t = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.t-tabs-wrap li').eq($t).addClass('selected').siblings().removeClass('selected');
        var str = $(this)[0].innerText;
        if (str.indexOf("短信") > -1) {
            correlationSMS();
        }
        if (str.indexOf("知识") > -1) {
        	correlationKno();
        }
    }
    
    /**查询关联短信*/
    var correlationSMS = function() {
        var arr = _ids.split(",");
        var str = "";
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null && arr[i] != "") {
                str += arr[i] + ",";
            }
        }
        str = str.substring(0, str.length - 1);
        ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=correlationSMS&routekey=' + str, function(result) {
            var optionDic = "<br/>";
            $.each(result.beans, function(index, bean) {
                optionDic += "<a href='javascript:void(0)' id='correlationSMS' name='" + bean.demensionid + "'>" + bean.targetdesc + "</a><br/>";
            })
            $("#correlationSMS").html(optionDic);
        })
    }
    
    /**查询关联知识*/
    var correlationKno = function() {
        var html = "";
        var str = "";
        var acceptstaffno = ""; //工号
        var arr = _ids.split(",");//获取选取的服务类型id
        crossAPI.getIndexInfo(function(info) {
        	acceptstaffno = info.userInfo.staffId;
        	for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null && arr[i] != "") {
                	var params = {
                            method: 'qryKbsBySrTypeId_post',
                            paramDatas: '{requestId:"' + arr[i] + '"}'
                        }
                	 Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=qryKbsBySrTypeId', params, function(result) {
                         $.each(result.beans, function(index, bean) {
                             html += "<a target='_blank' href='http://133.96.81.28:80/ngmttsso/hebeicrm.action?thirdSys=http://133.96.81.28:8080/icsp/kbs/showKng.action?kngShowType=pre%26searchRank=%26openType=1%26coluKngType=4%26kngTblFlag=0%26kngId=" + bean.knowledgeId + "%26dispId=%26buttonFlag=true%26articleFlag=true%26relativeKngFlag=true%26showType=1%26staffId=" + acceptstaffno + "%26channelId=0%26kngPointId=%26moduleId=' id=" + bean.knowledgeId + "'>" + bean.knowledgeName + "</a><br/>";
                         });
                     },true);
                }
            }
        	$('#correlationZS').html(html);
    	})
    }
    
    /**跳转关联短信*/
    var correlation = function() {
    	var msgId = $(this).attr("name");
    	var messageDetail="";
        var data={
				 ids:msgId
		} 
		Util.ajax.postJson('/ngwf_he/front/sh/sendMSG!execute?uid=commonUseMSG003',data,function(result){
			if(result.beans[0]!=undefined && result.beans[0]!=null){
				messageDetail = result.beans[0].content;
			}	
		},true);
        if(messageDetail===undefined || messageDetail=='undefined'){
        	crossAPI.tips('服务器繁忙', 3000);
        	messageDetail="";
        }
        if(messageDetail ==''){
        	crossAPI.tips('根据短信Id未查询到对应短信内容!', 3000);
        	messageDetail="";
        	return;
        }
        _index.showDialog({
        	id:"ngwfheSendMsg",
            title: "短信发送",
            modal: false,
            url: 'html/serviceReq/sendShortMsg.html',
            param: {
                data: messageDetail
            },
            width: 850,
            height: 600,
        });
    }
    //实现textarea中获取动态剩余字数的实现
    $(function() {
        $('#noMustInput').on('keyup', function() {
            var txtval = $('#noMustInput').val().length;
            var str = parseInt(100 - txtval);
            if (str > 0) {
                $('#num_txt').html('剩余可输入' + str + '字');
                $("#num_txt").css("color", "black");
            } else {
                $('#num_txt').html('已经达到限定字数！');
                $("#num_txt").css("color", "red");
                $('#noMustInput').val($('#noMustInput').val().substring(0, 100)); //这里意思是当里面的文字小于等于0的时候，那么字数不能再增加，只能是100个字
            }
        });
    })
    
    IndexLoad(function(IndexModule, options) {
        _index = IndexModule;
        eventInit(options);
    })

})