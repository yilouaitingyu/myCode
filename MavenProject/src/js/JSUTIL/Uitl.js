/**屏蔽IE8下backspace键对页面回退的操作
 * */



document.onkeydown =function (e) {  
		                 var code,type;     
		                 if (!e){ var e = window.event;}     
		                 if (e.keyCode){ code = e.keyCode;}  
		                 else if (e.which){ code = e.which;}  
		                 type = event.srcElement.type;  
		                 if ((code == 8)  
		                   && ((type != "text" && type != "textarea"   
		                   &&type != "password") ||  event.srcElement.readOnly == true)) {  
		                       event.keyCode = 0;  
		                       event.returnValue = false;  
		                 }  
		                 return true;  
		            }  




/**格式化日期*/
Date.prototype.format = function(format){ 
	var o = { 
			"M+" : this.getMonth()+1, //month 
			"d+" : this.getDate(), //day 
			"h+" : this.getHours(), //hour 
			"m+" : this.getMinutes(), //minute 
			"s+" : this.getSeconds(), //second 
			"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
			"S" : this.getMilliseconds() //millisecond 
	} 

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 
	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
}


/**获取当前时间*/
var getNowFormatDate=function() {
    var date = new Date();
    date.setDate(date.getDate());
    var seperator1 = "-";
    var seperator2 = ":";
    var month = (date.getMonth() + 1) <=9 ? '0' +(date.getMonth() + 1) : (date.getMonth() + 1);
    var strDate = date.getDate() <=9 ? '0'+date.getDate() : date.getDate();
    var hours = date.getHours() <=9 ? '0'+date.getHours() : date.getHours();
    var minutes = date.getMinutes() <=9 ? '0'+date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() <=9 ? '0'+date.getSeconds() : date.getSeconds();
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + minutes + seperator2 + seconds;
    return currentdate;
}



/**上移*/
var moveUP=function(){
	adjustCheckedRows=contentList.getCheckedRows();
	if(adjustCheckedRows.length!=1){
		crossAPI.tips('请选择一条记录进行调整',1500);
	}else{
		//上一行
		var	szid=$($($('input[type="checkbox"]:checked').parent().parent().prev()).get(0)).find("input").val();
		var	sorid=$($($('input[type="checkbox"]:checked').parent().parent().prev()).get(0)).find("td:last").text();
			
		if(szid!=undefined&&sorid!=undefined){
			var a = $('#manualHotspotAdjustmentList').find('input[type="checkbox"]:checked').parents('.selected');
			if(a.index() != 0){
				var selectedTr=$('#manualHotspotAdjustmentList').find('.sn-list-also tr').eq(a.index());
				var selectedTr1=$('#manualHotspotAdjustmentList').find('.sn-list-content-locker tbody').eq(a.index());
				a.prev().before(a);
				selectedTr.prev().before(selectedTr);
				selectedTr1.prev().before(selectedTr1);
			}
		}else{
			crossAPI.tips('已是首行不可上移',1500);
		}
	}
}
/**下移*/
var moveDown=function(){
	adjustCheckedRows=contentList.getCheckedRows();
	if(adjustCheckedRows.length!=1){
		crossAPI.tips('请选择一条记录进行调整',1500);
	}else{
		var	xzid=$($($('input[type="checkbox"]:checked').parent().parent().next()).get(0)).find("input").val();
		var	xorid=$($($('input[type="checkbox"]:checked').parent().parent().next()).get(0)).find("td:last").text();
		if(xzid!=undefined&&xorid!=undefined){
			var b = $('#manualHotspotAdjustmentList').find('input[type="checkbox"]:checked').parents('.selected');
			if(b.index() != length - 1){
				var selectedTr=$('#manualHotspotAdjustmentList').find('.sn-list-also tr').eq(b.index());
				var selectedTr1=$('#manualHotspotAdjustmentList').find('.sn-list-content-locker tbody').eq(b.index());
				b.next().after(b);
				selectedTr.next().after(selectedTr);
				selectedTr1.next().after(selectedTr1);
			}
		}else{
			crossAPI.tips('已是尾行不可下移',1500);
		}
    }
}

/**置顶*/
var moveTop=function(){
	adjustCheckedRows=contentList.getCheckedRows();
	if(adjustCheckedRows.length!=1){
		crossAPI.tips('请选择一条记录进行调整',1500);
	}else{
		var	szid=$($($('input[type="checkbox"]:checked').parent().parent().prev()).get(0)).find("input").val();
		var	sorid=$($($('input[type="checkbox"]:checked').parent().parent().prev()).get(0)).find("td:last").text();
		if(szid!=undefined&&sorid!=undefined){
			/*var c = $('#manualHotspotAdjustmentList').find('input[type="checkbox"]:checked').parents('.selected');
			$('#manualHotspotAdjustmentList').find('tbody').prepend(c);
		}else{
			crossAPI.tips('已是首行无法置顶',1500);*/
			var a = $('#manualHotspotAdjustmentList').find('input[type="checkbox"]:checked').parents('.selected');
			if(a.index() != 0){
				var selectedTr=$('#manualHotspotAdjustmentList').find('.sn-list-also tr').eq(a.index());
				var selectedTr1=$('#manualHotspotAdjustmentList').find('.sn-list-content-locker tr.selected');
				var first =$('#manualHotspotAdjustmentList').find('.sn-list-also tr').eq(0);
				
				$('#manualHotspotAdjustmentList').find('.sn-list-also tbody').prepend(selectedTr);
				$('#manualHotspotAdjustmentList').find('.sn-list-content-locker tbody').prepend(selectedTr1);
				
				/*a.prev().before(a);
				selectedTr.prev().before(selectedTr);*/
			}
		}else{
			crossAPI.tips('已是首行不可上移',1500);
		}	
   }
}




/**enter事件*/
var EnterPress=function EnterPress(){ 
	if(event.keyCode == 13){ 
		searchOK();
    } 
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

            } else {
                content += "<li><input type='checkbox' checkFlag='check' name='" + id + "'/><label>" + fullName + "</label></li>";
                _ids += id + ",";
                _number += 1;
            }
            $("#selectContents").html(content);
        } else {
        	if($("input[name^=" + id + "][checkFlag='check']").parent('li').length>0){
        		$("input[name^=" + id + "][checkFlag='check']").parent('li').remove();
        		_number = _number - 1;
        		_ids = _ids.replace(id, '');
        		
        	}
        }
        $("#GS").html(_number);
    
	}); 
}






/**服务请求类别树**/
var Tree = function(){
	ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypess',function(result){
	var zNode =result.bean.resultParent;
 	var setting = {  
 			 view: {  
 				 selectedMulti: false,     //禁止多点选中  
 				 showIcon:false
 			 },
	        check: {  
	            enable: false//是否启用 复选框
	        },  
	        data: {  
	            simpleData: {  
	                enable: true ,
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
                    if(selectedNode.level == 1){
                    	ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=reqTypesAdd&srtypeId='+selectedNode.id+'',function(result){
	    			     	var Node =result.beans;
	    			     	var setting1 = {  
	   					        check: {  
	   					            enable: true  //是否启用 复选框  
	   					        },  
	   					        data: {  
	   					            simpleData: {  
	   					                enable: true 
	   					            } 
	   					        },
	   					     callback: {  
	   					    	onClick: zTreeOnClick_new,
	   				            onCheck: zTreeOnCheck  
	   				        },  
	    			     	}
	    			     	function zTreeOnCheck(event, treeId, treeNode) { 
	    			     		var content=$("#selectContents").html();
	    			     		
	    			     		if(treeNode.checked == true){
	    			     			if(content=="" || content==null){
		    			     			content="<li><input type='checkbox' name='"+treeNode.id+"'/><label>"+treeNode.fullName+"</label></li>";
		    			     			_ids+=treeNode.id+",";
		    			     			_number+=1;
		    			     			treeNodeOption = "<option value='"+treeNode.id+"'>"+treeNode.fullName+"</option>";
		    			     		}else{
		    			     			content+="<li><input type='checkbox' name='"+treeNode.id+"'/><label>"+treeNode.fullName+"</label></li>";
		    			     			_ids+=treeNode.id+",";
		    			     			_number+=1;
		    			     			treeNodeOption += "<option value='"+treeNode.id+"'>"+treeNode.fullName+"</option>";
		    			     		}
	    			     			
	    			     			$("#selectContents").html(content);
	    			     			
	    			     		}else{
	    			     			$("input[name^="+treeNode.id+"]").parent('li').remove();
	    			     			_number=_number-1;
	    			     			_ids=_ids.replace(treeNode.id+",",'');
	    			     			treeNodeOption=treeNodeOption.replace("<option value='"+treeNode.id+"'>"+treeNode.fullName+"</option>","");
	    			     		}
	    			     			$("#GS").html(_number);
	    				        }
	    			     	
	    			     	
	    			     	  //节点单击事件
                			function zTreeOnClick_new(event, treeId, treeNode) {
                				if(nameArray.join("-").indexOf(treeNode.name)==(-1))
                    				nameArray.push(treeNode.name);
                				if(treeNode.isLoad=="N"){
                					return ;
                				}
                				if(treeNode.isLoad==""||treeNode.isLoad==null||treeNode.isLoad == undefined){
                					console.log("isLoad")
                					if(treeNode.isLeaf=="0"){//父节点继续查
                						treeNode.nocheck = true;
                						treeNode.isParent =true;
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
                                                          nodes[i].isParent = true;
                              							//展开此节点
                              							ztree.expandNode(nodes, true, false, true);
                                                      } else {
                                                          nodes[i].nocheck = false;
                                                          /*var hidden = $("#hiddenSelectContents").val();
                                                          if (hidden.indexOf(nodes[i].id) != -1) {
                                                              nodes[i].checked = true;
                                                          }*/
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
	    			     		
	    				        ztree=$.fn.zTree.init($("#txtIds"), setting1, Node);
	    				        var allNodes=ztree.getNodes();
	    				        var nodes = ztree.transformToArray(allNodes);
	    				        if(nodes.length>0){
	    				            for(var i=0;i<nodes.length;i++){
	    				                if(nodes[i].isLeaf=="0"){//找到父节点
	    				                	nodes[i].isParent =true;
	    				                	nodes[i].nocheck=true;//nocheck为true表示没有选择框
	    				                }else{
	    				                	nodes[i].nocheck=false;
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
	    				        /*var arr=_ids.split(",");
	    				        for(var a=0;a<arr.length;a++){
	    				        	if(arr[a]!=null && arr[a]!=""){
	    				        		var note = ztree.getNodeByParam("id", arr[a], null);
	    				        		note.nocheck=true;
	    				        	}
	    				        	
	    				        }
	    				        ztree.refresh();*/
	                    });
                    }
                },
            }  
	    }
 	 	var treeDemo=$.fn.zTree.init($("#treeDemo"), setting, zNode);
     })
}





/**兼容IE8的页面拼接元素*/

var XQhtml=function(options){
	_id=options.custBean[0].id;
	beanLen=options.custBean.length;
	 var html ="";
		for(var i=0;i<options.custBean.length;i++){
			var fullname=options.custBean[i].fullname;
			options.custBean[i].index= i;
			if(typeof(fullname)=="undefined"){
				fullname='';
			}
			if(i==(options.custBean.length-1)){
				 var div=document.createElement("div");
				 div.id = ''+i+'';
				 div.setAttribute('class','baseInfoT baseInfoOpen'); 
				 div.innerHTML = '<a class="fl">原始记录&nbsp;&nbsp;&nbsp;&nbsp;</a>'
						+'<a class="customerInfo fl">修改工号<span id="dealstaff">'+options.dealstaff+'</span></a>'
						+'<span class="textDiv'+i+'  textDiv-span">'+fullname+'</span>'
						+'<i class="fr openTop" id="moreNews'+i+'" val="'+i+'"></i>';
				 var div2=document.createElement("div");
				 div2.setAttribute('class',"box-detial"+i+"  hide"); 
				 var doc = document.getElementById("XQhtml");
				 doc.appendChild(div);
				 doc.appendChild(div2);
			}else{
				 var div=document.createElement("div");
				 div.id = ''+i+'';
				 div.setAttribute('class','baseInfoT baseInfoOpen'); 
				 div.innerHTML = '<a class="fl">第&nbsp;<span id="recordNumber">'+eval(options.custBean.length-i-1)+'</span>&nbsp;条记录&nbsp;&nbsp;&nbsp;</a>'
			        +'<a class="customerInfo fl">修改工号<span id="dealstaff">'+options.dealstaff+'</span></a>'
			        +'<span class="textDiv'+i+' textDiv-span">'+fullname+'</span>'
			        +'<i class="fr openTop" id="moreNews'+i+'" val="'+i+'"></i>'	;
				 var div2=document.createElement("div");
				 div2.setAttribute('class',"box-detial"+i+"  hide"); 
				 var doc = document.getElementById("XQhtml");
				 doc.appendChild(div);
				 doc.appendChild(div2);
			}
		};
		for(var i = 0;i < beanLen;i++){
			
		$('#'+i+'').on("click",".openTop",function(){
			moreNews($(this).attr("val"),options)
		});
		}
}
var textDivs = function(){
	$(this).attr('title',$(this).text());
}
//点击打开展示异动详情
var moreNews = function(i,_options){
		$("#moreNews"+i+"").toggleClass('closeBottom');
		$('.box-detial'+i+'').toggleClass('hide');
		$('.textDiv'+i+'').toggleClass('hide');
		var html = $.ajax({
			  url: "Detailed2.html",
			  async: false
			 }).responseText;
		$('.box-detial'+i).html(html)

		if(i!=(beanLen-1)){
			adjunctionType(_options,i);
		}else{
			adjunction(_options,i);
		}
}



/**表单验证*/
var validator = new Validator({
	 el: $("form"),
     dialog:true, 
     rules:{
    	 startTime:"required",
    	 endtime:"required",
    	 subsNumber:"number2",
    	 idNumber:"number1",
    	 callerNo:"number2",//主叫号码
    	 contactPhone1:"number2",//联系电话1
    	 contactPhone2:"number2",//联系电话2
    	 contactSerialno:"number"
     },
     messages:{
         idNumber:{
        	 number1:"此项必须是大于0的数字"
         },
         callerNo:{
        	 number2:"只能输入数字，长度20位以内"
         },
         subsNumber:{
        	 number2:"只能输入数字，长度20位以内"
         },
         contactPhone1:{
        	 number2:"只能输入数字，长度20位以内"
         },
         contactPhone2:{
        	 number2:"只能输入数字，长度20位以内"
         }
     }
})
validator.addMethod("number1", function(str) { return new RegExp("^[0-9]*[1-9][0-9]*$").test(str); });
validator.addMethod("number2", function(str) { return new RegExp("^[0-9]{0,20}$").test(str); });


