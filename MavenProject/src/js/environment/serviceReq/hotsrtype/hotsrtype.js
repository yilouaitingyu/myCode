define(function(require){
	require(['Util', 'list' ,'ajax','form','dialog','validator','zTree','tab','indexLoad',
	         'selectTree','simpleTree'],
		function(Util, List ,ajax, Form, Dialog,Validator,zTree,Tab,IndexLoad){
		var _index;
		var _options;
		var prefixBiz = 'all';//默认进来选项卡为全部热点
		var ztree;
		var parentArray=['010@'];//父级节点请求id;
		var nameArray=["%%%"];
		var page;
		var allfullname = '';//服务全名称
		var _subsCity;//用户地市
		var dialogConfig = {
	            id:'comfirm',
	            mode:'normal', 
	            // delayRmove:3, 
	            title:'标题',  
	            content:'这里是对话框的内容', 
	            ok:function(){},
	            okValue: '保存', 
	            cancel: function(){}, 
	            cancelValue: '取消', 
	            cancelDisplay:true,
	            width:600,  
	            height:360,
	            skin:'dialogSkin', 
	            fixed:false,
	            quickClose:false ,
	            modal:false 
	        }
		
		var dialogConfig1 = {
	            id:'comfirm',
	            mode:'normal', 
	            // delayRmove:3,
	            title:'标题',  
	            content:'这里是对话框的内容',
	            ok:function(){},
	            okValue: '确定',
	            cancel: function(){}, 
	            cancelValue: '取消', 
	            cancelDisplay:true, 
	            width:800, 
	            height:450, 
	            skin:'dialogSkin', 
	            fixed:false, 
	            quickClose:false , 
	            modal:false  
	        }
		
		/**===================全部热点      start==============*/
		var allList = function (listContainer,List){
			var config = {
					el:$('#' + listContainer),
					highlight: false,
	                className:'listContainer',
	                field:{
	                	boxType:'',
	                	key:'id',
	                	items:[
								{ text:'热点名称',name:'hotsrtypename',
									render:function(item,val){
			                        	 var title = item.hotsrtypename;
			                        	 if(title==undefined)
		                        			   return "";
			                        	 if(title.length > 10) {
		                      			   var desc = title.substring(0,10)+"..";
		                      			   val = "<span title='"+ title +"'> " + desc +"</span>"
		                      		   }else {
		                      			   val = title;
		                      		   }
			                        return val;
		                              }	
								},
								{ text:'热点描述',name:'hotsrtypedesc',
									 render:function(item,val){
										   var title="";
										   if(item.hotsrtypedesc!=undefined && item.hotsrtypedesc!=null){
											   title = item.hotsrtypedesc;
										   }else{
											   title="";
										   }
		                        		   if(title.length > 18) {
		                        			   var desc = title.substring(0,18)+"..";
		                        			   val = "<span title='"+ title +"'> " + desc +"</span>"
		                        		   }else {
		                        			   val = title;
		                        		   }
		                        		   return val;
		                        	   }	
								},
								{ text:'服务类别名称',name:'fullname',
									render:function(item,val){
										allfullname = '';
										var id = item.id;
									    Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=cxqbrd002',{"id":id},function(data){
			                        		if(data.beans.length >1) {
			                        			val = data.beans[0].fullname+"..";
			                        			for(var i = 0;i < data.beans.length;i++) {
			                        				allfullname +="," + data.beans[i].fullname;
			                        			}
			                        			allfullname = allfullname.substring(1);
			                        		}else if(data.beans.length ==1){
			                        			val = data.beans[0].fullname;
			                        		}else{
			                        			val="";
			                        		}
			                        	},true);
									val = "<span title='"+ allfullname +"'> " + val +"</span>"
									return val;
									}
								}
	                	]
	                },
	                page:{
	                	customPages:[5,10,15,20,30,50], 
	                	perPage:10,
	                    total:true,
	                    align:'right'
	                },
	                data:{
	                    url:'/ngwf_he/front/sh/hotServiceType!execute?uid=cxqbrd001',
	                }
			}
			var list = new List(config);
			list.search({});
			return list;
		}
		/**===================全部热点 end==============*/
		
		/**===================自动热点   start==============*/
		var autoList = function (listContainer,List){
			var config = {
					el:$('#' + listContainer),
					highlight: false,
	                className:'listContainer',
	                field:{ 
	                	boxType:'',
	                	key:'id',
	                	items:[
								{ text:'热点名称',name:'hotsrtypename',
									render:function(item,val){
			                        	 var title = item.hotsrtypename;
			                        	 if(title==undefined)
		                        			   return "";
			                        	 if(title.length > 10) {
		                      			   var desc = title.substring(0,10)+"..";
		                      			   val = "<span title='"+ title +"'> " + desc +"</span>"
		                      		   }else {
		                      			   val = title;
		                      		   }
			                          
			                        return val;
		                              }	
								},
								{ text:'热点描述',name:'hotsrtypedesc',
									 render:function(item,val){
										   var title="";
										   if(item.hotsrtypedesc!=undefined && item.hotsrtypedesc!=null){
											   title = item.hotsrtypedesc;
										   }else{
											   title="";
										   }
		                        		   if(title.length > 18) {
		                        			   var desc = title.substring(0,18)+"..";
		                        			   val = "<span title='"+ title +"'> " + desc +"</span>"
		                        		   }else {
		                        			   val = title;
		                        		   }
		                        		   return val;
		                        	   }	
								},
								{ text:'服务类别名称',name:'fullname',
									render:function(item,val){
										allfullname = '';
										var id = item.id;
									    Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=cxqbrd002',{"id":id,"typeid":"1"},function(data){
			                        		if(data.beans.length >1) {
			                        			val = data.beans[0].fullname+"..";
			                        			for(var i = 0;i < data.beans.length;i++) {
			                        				allfullname +="," + data.beans[i].fullname;
			                        			}
			                        			allfullname = allfullname.substring(1);
			                        		}else if(data.beans.length ==1){
			                        			val = data.beans[0].fullname;
			                        		}else{
			                        			val="";
			                        		}
									    },true);
									    val = "<span title='"+ allfullname +"'> " + val +"</span>"
										return val;
									}
								}
									
	                	]
	                	
	                },
	                page:{
	                	customPages:[5,10,15,20,30,50], 
	                	perPage:10,
	                    total:true,
	                    align:'right'
	                },
	                data:{
	                    url:'/ngwf_he/front/sh/hotServiceType!execute?uid=cxqbrd001&hottype=1',
	                }
			}
			var list = new List(config);
			list.search({});
			return list;
		}
		/**===================自动热点   end==============*/
		
		/**===================手动热点   start==============*/
		var manualList = function (listContainer,List){
			var config = {
					el:$('#' + listContainer),
					highlight: false,
	                className:'listContainer',
	                field:{
	                	boxType:'checkbox',
	                	key:'id',
	                	items:[
								
								{ text:'热点名称',
		                        name:'hotsrtypename',
	/*	                        className:"hotName",*/
		                        render:function(item,val){
		                        	 var title = item.hotsrtypename;
		                        	 if(title==undefined)
	                      			   return "";
		                        	 if(title.length > 10) {
	                      			   var desc = title.substring(0,10)+"..";
	                      			   val = "<span title='"+ title +"'> " + desc +"</span>"
	                      		   }else {
	                      			   val = title;
	                      		   }
		                          val = '<a  class="hotsrtypename" val="'+item.id+'">'+val+'</a>';
		                        return val;
	                              }
	                           },	
								{ text:'热点描述',name:'hotsrtypedesc',
	                        	   render:function(item,val){
	                        		   var title="";
									   if(item.hotsrtypedesc!=undefined && item.hotsrtypedesc!=null){
										   title = item.hotsrtypedesc;
									   }else{
										   title="";
									   }
	                        		   if(title.length > 18) {
	                        			   var desc = title.substring(0,18)+"..";
	                        			   val = "<span title='"+ title +"'> " + desc +"</span>"
	                        		   }else {
	                        			   val = title;
	                        		   }
	                        		   return val;
	                        	   }
								},
								{ text:'服务类别名称',name:'fullname',className:"hotFindName",
									render:function(item,val){
										allfullname = '';
										var id = item.id;
										Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=cxqbrd002',{"id":id,"typeid":"0"},function(data){
			                        		if(data.beans.length >1) {
			                        			val = data.beans[0].fullname+"..";
			                        			for(var i = 0;i < data.beans.length;i++) {
			                        				allfullname +="," + data.beans[i].fullname;
			                        			}
			                        			allfullname = allfullname.substring(1);
			                        		}else if(data.beans.length ==1){
			                        			val = data.beans[0].fullname;
			                        		}else{
			                        			val="";
			                        		}
			                        	},true);
										val = "<span title='"+ allfullname +"'> " + val +"</span>"
										return val;
									}
								}
	                	]
	                	
	                },
	                page:{
	                	customPages:[5,10,15,20,30,50], 
	                	perPage:10,
	                    total:true,
	                    align:'right'
	                },
	                data:{
	                    url:'/ngwf_he/front/sh/hotServiceType!execute?uid=cxqbrd001&hottype=0',
	                }
			}
			var list = new List(config);
			list.search({});
			
			list.on('success',function(result){
				$('.manualHotspotBtn span').html(0);//manualHotspotList
				//$(".checkAllWraper > input").prop('checked',false);
				$("#manualHotspotAdjustment").removeClass('disable-manualHotBtn').attr('disabled',false);
	    	    var len = $("#manualHotspotList tbody").find("tr").length;
	    	    if(len<2){
	    	    	$("#manualHotspotAdjustment").addClass('disable-manualHotBtn').attr('disabled',true)
	    	    }
	    	    
	    	    $(".checkAllWraper > input").click(function(){
	    	    	var lengths = $(".sn-list-table > tbody input[type='checkbox']").length
					if(this.checked==true){
						$('.manualHotspotBtn span').html(lengths);
						if(lengths > 0){
							$('#manualHotspotDel').removeClass('editorCancle');
						}else {
							$('#manualHotspotDel').addClass('editorCancle');
						}
					}else{
						$('.manualHotspotBtn span').html(0);
						$('#manualHotspotDel').addClass('editorCancle');
					}
				});
	
	      });
	
	     if($('.checkAllWraper input').prop("checked")){
	    	 $('.manualHotspotBtn span').text(list.getCheckedRows().length);//10
	     } 
	      list.on('checkboxChange',function(e, item, checkedStatus){
	    	//$(".checkAllWraper > input").attr('checked',false);  
	    	$('.manualHotspotBtn span').text(list.getCheckedRows().length);
	    	if(list.getCheckedRows().length > 0){
	       		$('#manualHotspotDel').removeClass('editorCancle')
	    	}else{
	    		$('#manualHotspotDel').addClass('editorCancle')
	    	}
		})
			return list;
		}
		/**===================手动热点   end==============*/
		
		/**===================调整顺序   start==============*/
		var adjustList = function (listContainer,List){
			var config = {
					el:$('#' + listContainer),
					highlight: false,
	                field:{
	                	boxType:'checkbox',
	                	key:'id',
	                	items:[
								{ text:'热点名称',
								    name:'hotsrtypename',
								    className:"hotName",
								    render:function(item,val){
								    	 var title = item.hotsrtypename;
								    	 if(title.length > 10) {
											   var desc = title.substring(0,10)+"..";
											   val = "<span val='"+item.id+"' serno='"+item.orderid+"' > " + desc +"</span>"
										   }else {
											   val = "<span val='"+item.id+"' serno='"+item.orderid+"' > " + title +"</span>";
										   }
								      val = '<a  class="hotsrtypename" >'+val+'</a>';
								    return val;
								      }
								   },	
									{ text:'热点描述',name:'hotsrtypedesc',className:"hotNames",},
								{ text:'服务类别名称',name:'fullname',
									render:function(item,val){
										allfullname = '';
										var id = item.id;
										Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=cxqbrd002',{"id":id,"typeid":"0"},function(data){
		                        		if(data.beans.length >1) {
		                        			val = data.beans[0].fullname+"..";
		                        			for(var i = 0;i < data.beans.length;i++) {
		                        				allfullname +="," + data.beans[i].fullname;
		                        			}
		                        			allfullname = allfullname.substring(1);
		                        		}else if(data.beans.length ==1){
		                        			val = data.beans[0].fullname;
		                        		}else{
		                        			val="";
		                        		}
		                        	},true);
									return val;
									}
								},
								{ text:'排序ID',name:'orderid',className:"tdds"}
	                	]
	                	
	                },
	                data:{
	                    url:'/ngwf_he/front/sh/hotServiceType!execute?uid=cxqbrd0001&hottype=0'
	                }
			}
			  
		    var adjustlist = new List(config);
			adjustlist.on('success',function(result){
				$('#manualHotspotAdjustmentList table thead tr th:last-child').hide();
			});
	
			/*adjustlist.on('checkboxChange',function(e, item, checkedStatus){
			    $(".checkAllWraper > input").attr('checked',false);
			})*/
			adjustlist.search({});
			return adjustlist;
			
		}
		/**===================调整顺序   end==============*/
		
		
		var relevanceBiz = function(Util,Dialog,List,ajax,prefix){//,routeContent,relevanceContent
			if(prefix=='all'){
				page = allList('allHotspotList',List);//全部
			}else if(prefix=='auto'){
				page = autoList('autoHotspotList',List);//自动热点
			}else if(prefix=='manual'){
				page = manualList('manualHotspotList',List);
			}
		}
		
		/***初始化三个选项卡 strat**/			
		var eventTabsInit = function(){
			$(function(){
				var config = {
						el:$('#tabContainer'),
						highlight: false,
		                direction:'horizontal',//布局方向 horizontal默认横向|vertical纵向 
		                tabs:[
		                    {
		                        title:'全部热点',
		                        closeable:0,
		                        click:function(e, tabData){
		                        	prefixBiz = "all";
		                        	var html = require("text!html/serviceReq/hotsrtype/allHotspot.html")
		                            tab.content(html);
		                        	relevanceBiz(Util, Dialog, List,ajax,prefixBiz);
		                        }
		                    },
		                    {
		                        title:'自动热点',
		                        closeable:0,
		                        click:function(e,tabData){
		                        	prefixBiz = "auto";
		                        	tab.content(require("text!html/serviceReq/hotsrtype/autoHotspot.html"));
		                        	relevanceBiz(Util, Dialog, List, ajax,prefixBiz);
		                        }
		                    },
		                    {
		                        title:'手动热点',
		                        closeable:0,
		                        click:function(e,tabData){
		                        	prefixBiz = "manual";
		                        	tab.content(require("text!html/serviceReq/hotsrtype/manualHotspot.html"));
		                        	$("#manualHotspotSync").on("click",manualHotspotSync);//获取服务请求类别（同步）
		                        	$("#manualHotspotInsert").on("click",openDialogManualHotspotInsert);//新增
		                        	$("#manualHotspotList").on("click",".hotsrtypename",openDialogManualHotspotInsert);//修改
		                        	$("#manualHotspotDel").on("click",manualHotspotDel);//删除
		                        	$("#manualHotspotAdjustment").on("click",manualHotspotAdjustment);//调整顺序
		                        	$("#testAutoHotTask").on("click",testAutoHotTask);//获取服务请求类别（同步）
		                        	$("#manualHotspotRefresh").on("click",manualHotspotRefresh);//刷新
		                        	$('#manualHotspotAdjustmentList table tbody tr td:last-child').hide();
		                			$('#manualHotspotAdjustmentList table thead tr th:last-child').hide();
		                        	relevanceBiz(Util, Dialog, List, ajax,prefixBiz);//
		                        }
		                    }
		                ]	
				};
				var tab = new Tab(config);
			})
		};
		/**初始化选项卡 end***/
		
		
		var clock = false;
		// 获取服务请求类别
		var manualHotspotSync=function(e) {
			if(clock) {
				crossAPI.tips('服务请求类别正在获取中，请稍后！',1500);
				return;
			}
			var params = {};
			Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=manualHotspotSync',params,function(result) {
				if(result.returnCode == 0) {
					crossAPI.tips(result.returnMessage,1500);
				} else {
					crossAPI.tips("获取服务请求类别异常，请联系管理员！",1500);
				}
				clock = false;
			});
			clock = true;
		}
		

		// 测试自动热点定时任务
		var testAutoHotTask=function(e) {
			var params = {};
			Util.ajax.postJson('/ngwf_he/front/sh/autoHotTask!execute?uid=autoHotTask001',params,function(result) {
				if(result.returnMessage=="success"){
					crossAPI.tips('任务执行成功',1500);
				}
			});
		}
		
		
		//河北地市字典
		var creartSelect =  function(typeId,label,elID){
			var params = {method:'staticDictionary_get',paramDatas:'{typeId:"'+typeId+'"}'};
			var option = "<option value=''>请选择</option>";
			Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=getDic01',params,function(result){
				$.each(result.beans,function(index,bean){
					option += "<option value='"+bean.value+"'>"+bean.name+"</option>";
				});
				$(".necessary").text(label);
				$("#dishi").append(option);
				$("#dishi").attr('name',elID);
			},true);
		}
		
		/**打开新增或修改手动热点页面*/
		var openDialogManualHotspotInsert=function(e){
			//var zhujianid=$($($($(e.currentTarget).parent().parent().get(0)).context.innerHTML)[0].innerHTML)[0].defaultValue
			var zhujianid = $(this).attr('val');
			var titles;
			var huixianData;
			if(zhujianid!=undefined){
				titles="修改手动热点";
				var dialog =  new Dialog($.extend(dialogConfig,{
	                mode:'normal',
	                id:'modifyHotspot',
	                title:titles,
	                content:require("text!html/serviceReq/hotsrtype/addHotspot.html"),
	                ok:function(){
	                	if($("#dishi").val().trim()==""||$("#hotsrtypename").val().trim()==""||$("#hotsrtypedesc").val().trim()==""||$("#srtype").find("option").length==0){
	                		return false;
	                	}
	                },
	                okValue: '保存',
	                button:[
	                        {
	                          value: '重置',
	                          callback: function () { //自定义按钮回调函数
	          					$("#dishi").val(huixianData[0].cityid);
	          					$("#hotsrtypename").val(huixianData[0].hotsrtypename);
	          					$("#hotsrtypedesc").val(huixianData[0].hotsrtypedesc);
	          					$("#srtype").empty();
	          					var id = huixianData[0].id;
	        					Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=cxqbrd002',{"id":id,"typeid":"0"},function(data){
                        			for(var i = 0;i < data.beans.length;i++) {
                        				$("#srtype").append("<option value='"+data.beans[i].srtypeid+"'>"+data.beans[i].fullname+"</option>");
                        			}
	                        	},true);
	                                return false; //阻止对话框关闭
	                          },
	                          autofocus: true //是否自动获取焦点
	                        }
	                      ],
	                width:880, 
	                height:450, 
	                modal:true
	            }))
				if( dialog.origin().open){
					creartSelect("HEBEI.HEYTCK.CITYCODE","地市","hebeidishi"); //地市下拉框信息
					//详情页数据回显
					Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=cxqbrd001',{"id":zhujianid,"hottype":"0"},function(data){
						huixianData=data.beans;
						$("#id").val(data.beans[0].id);
						$("#hotsrtypeid").val(data.beans[0].hotsrtypeid);
						$("#dishi").val(data.beans[0].cityid);
						$("#hotsrtypename").val(data.beans[0].hotsrtypename);
						$("#hotsrtypedesc").val(data.beans[0].hotsrtypedesc);
						$("#srtype").empty();
						var id = data.beans[0].id;
						Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=cxqbrd002',{"id":id,"typeid":"0"},function(data){
	            			for(var i = 0;i < data.beans.length;i++) {
	            				$("#srtype").append("<option value='"+data.beans[i].srtypeid+"'>"+data.beans[i].fullname+"</option>");
	            			}
	                	},true);
					})
				}
			}else{
				titles="新增手动热点";
				var dialog =  new Dialog($.extend(dialogConfig,{
	                mode:'normal',
	                id:'addHotspot',
	                title:titles,
	                content:require("text!html/serviceReq/hotsrtype/addHotspot.html"),//text!html/remind/peopleInformation.html
	                ok:function(){
	                	if($("#dishi").val().trim()==""||$("#hotsrtypename").val().trim()==""||$("#hotsrtypedesc").val().trim()==""||$("#srtype").find("option").length==0){
	                		return false;
	                	}
	                },
	                okValue: '保存',
	                button:[
	                        {
	                          value: '重置',
	                          callback: function () {
	                        	  $("#dishi").val("");
	                        	  $("#hotsrtypename").val("");
	                        	  $("#hotsrtypedesc").val("");
	                        	  $("#srtype").empty();
	                              return false; //阻止对话框关闭
	                          },
	                          autofocus: true //是否自动获取焦点
	                        }
	                      ],
	                width:800,
	                height:450,
	                modal:true
	                
	            }))
				if( dialog.origin().open){
					creartSelect("NGCS.HEYTCK.CITYCODE","地市","hebeidishi"); //地市下拉框信息
				}
			}
			
			/**新增页面---选择服务类别界面（点击选择按钮）*/
			$('#selectServiceDialog').on('click',selectServiceDialog);//服务请求类别页面
				dialog.on('confirm',function(){
					if($("#dishi").val()==""){
						crossAPI.tips('地市不能为空',1500);
                		return false;
                	}else if($.trim($("#hotsrtypename").val())==""){
                		crossAPI.tips('热点名称不能为空',1500);
                		return false;
                	}else if($.trim($("#hotsrtypedesc").val())==""){
                		crossAPI.tips('热点描述不能为空',1500);
                		return false;
                	}else if($("#hotsrtypename").val().length>255){
                		crossAPI.tips('热点名称长度太长请修改',1500);
                		return false;
                	}else if($("#hotsrtypedesc").val().length>512){
                		crossAPI.tips('热点描述长度太长请修改',1500);
                		return false;
                	}else if($("#srtype").find("option").length==0){
                		crossAPI.tips('关联服务类别不能为空',1500);
                		return false;
                	}
					
					 if($('#id').val()==''){//新增
							var cityid=$("#dishi").val().trim();
							var hotsrtypename=$("#hotsrtypename").val().trim();
							var hotsrtypedesc=$("#hotsrtypedesc").val().trim();
							var srtypeid2ids=$("#srtype").find("option");
							var srtypeidsstr="";
							var srtypenfullamesstr="";
							for(var i=0;i<srtypeid2ids.length;i++){
								srtypeidsstr+=",'"+srtypeid2ids[i].value+"'";
								srtypenfullamesstr+=","+srtypeid2ids[i].text;
							}
							srtypeidsstr=srtypeidsstr.substring(1).trim();
							srtypenfullamesstr=srtypenfullamesstr.substring(1).trim();
							var lastupdateby=_index.getUserInfo().staffName.trim();
							var addData = {       
									              "cityid":cityid,
										   "hotsrtypedesc":hotsrtypedesc,
										   "hotsrtypename":hotsrtypename,
										    "lastupdateby":lastupdateby,
										        "srtypeid":srtypeidsstr,
										        "fullname":srtypenfullamesstr,
										         "hottype":"0"
			                }
							Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=addHotspot001',addData,function(data){
								if(data.returnMessage=="addTrue"){
									crossAPI.tips('添加成功',1500);
									manualHotspotRefresh();
								}else if(data.returnMessage=="tongming1"){
									crossAPI.tips(data.bean.fullname+"已经是热点类别!",1500);
								}else if(data.returnMessage=="tongming2"){
									crossAPI.tips("【"+data.bean.hotsrtypename+"】已经是热点类别",1500);
								}else if(data.returnMessage=="RDCF"){
									crossAPI.tips(data.bean.tipstr,1500);
								}else{
									crossAPI.tips('热点添加失败',1500);
								}
							})
						}else{//修改
							var zhujian1=$("#id").val().trim();
							var hotsrtypeid1=$("#hotsrtypeid").val().trim();
							var cityid1=$("#dishi").val().trim();
							var hotsrtypename1=$("#hotsrtypename").val().trim();
							var hotsrtypedesc1=$("#hotsrtypedesc").val().trim();
							var srtypeid2ids=$("#srtype").find("option");
						    var lastupdateby1=_index.getUserInfo().staffName.trim();
						    var srtypeidsstr="";
							var srtypenfullamesstr="";
							for(var i=0;i<srtypeid2ids.length;i++){
								srtypeidsstr+=",'"+srtypeid2ids[i].value+"'";
								srtypenfullamesstr+=","+srtypeid2ids[i].text;
							}
							srtypeidsstr=srtypeidsstr.substring(1).trim();
							srtypenfullamesstr=srtypenfullamesstr.substring(1).trim();
							var updateData = {       
									                  "id":zhujian1,
									         "hotsrtypeid":hotsrtypeid1,
									              "cityid":cityid1,
										   "hotsrtypedesc":hotsrtypedesc1,
										   "hotsrtypename":hotsrtypename1,
										    "lastupdateby":lastupdateby1,
										        "srtypeid":srtypeidsstr,
										        "fullname":srtypenfullamesstr,
										         "hottype":"0"
			                }
							Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=updateHotspot001',updateData,function(data){
								if(data.returnMessage=="updateSuccess"){
									crossAPI.tips('修改成功',1500);
									manualHotspotRefresh();
								}else if(data.returnMessage=="tongming"){
									crossAPI.tips("【"+srtypenfullamesstr+"】已经是热点类别",1500);
								}else if(data.returnMessage=="RDCF"){
									crossAPI.tips(data.bean.tipstr,1500);
								}else{
									crossAPI.tips('修改失败',1500);
								}
							})
						}
		            })
			
		}
		var manualHotspotDel=function(selectRows){//删除 热点
			var zids="";
			selectRows=page.getCheckedRows();
			console.log(selectRows);
			if(selectRows.length>=1){
				for(var i=0;i<selectRows.length;i++){
					zids+=",'"+selectRows[i].id+"'";
				}
				zids=zids.substr(1);
				Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=delHotspot02',{"zids":zids},function(data){
					if(data.returnMessage=="delTrue"){
						crossAPI.tips('删除成功',1500)
						manualHotspotRefresh();
					}else{
						crossAPI.tips('删除失败',1500);
						return false;
					}
				})
			}else{
				crossAPI.tips('请至少选择一条记录进行删除',1500);
			}
		}
	var contentList;
	var manualHotspotAdjustment=function(){//调整顺序
		var len = $("#manualHotspotList tbody").find("tr").length;
	    if(len<2){
	    	crossAPI.tips('最少两条记录才能进行排序',1500);
	    	return;
	    } 
		var dialogAdjustment =  new Dialog($.extend(dialogConfig1,{
            mode:'normal',
            id:'adjustment',
            title:"调整顺序",
            width:800,
            height:440,
            modal:true,
            content:require("text!html/serviceReq/hotsrtype/adjustmentHotspot.html")
            
        }))
		contentList = adjustList('manualHotspotAdjustmentList',List);
		$('#moveUP').on('click',moveUP);//上移
		$('#moveDown').on('click',moveDown);//下移
		$('#moveTop').on('click',moveTop);//置顶
		dialogAdjustment.on('confirm',function(){
			var span = $("#manualHotspotAdjustmentList .sn-list-content .hotsrtypename>span");
			var id = [];
			var did = [];
        	for (var i = 0; i < span.length; i++) {
        		console.log(span[i])
        		var j = span[i];
        		id[i] = ($(j).attr('val'));
        		did[i] = ($(j).attr('serno'));
			}
        	var ids = id.join(",");
        	
        	did.sort(function (x,y) {
                return y-x;
            })
        	var dids = did.join(",");
        	var data = {
        		'ids':ids,
        		'did':dids
        	}
        	Util.ajax.postJson('/ngwf_he/front/sh/hotServiceType!execute?uid=updateAdjustHotspot001',data,function(result,status){
        		if(status){
        			manualHotspotRefresh();//成功后刷新页面
        		}
        	})
		})
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
	
	/**刷新*/
    var manualHotspotRefresh=function(){
    	prefixBiz = "manual";
    	relevanceBiz(Util, Dialog, List, ajax,prefixBiz);
    	$('.manualHotspotBtn span').text(0);
    	//删除按钮变灰色
    	$('#manualHotspotDel').addClass('editorCancle');
	}
    
    /**搜索请求类别*/
	var searchOK=function(){
		var name=$('#searchType').val();
		if(name==null || name==""){
			crossAPI.popcrossAPI.tips("请输入服务类型","提示",function(){},1500);
			return;
		}
		name=encodeURI(name);
		var optionDic = "";
    	ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByNamereqType',{name:name},function(result){
    		$.each(result.beans,function(index,bean){
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
	/**enter事件*/
    var EnterPress=function EnterPress(){ 
		if(event.keyCode == 13){ 
			searchOK();
	    } 
	}
    /**服务列别树弹窗初始化事件加载*/
	var dialogInitEvent=function(){
		Tree();
		$('.element li').on('click',element);	
		$('#clearBtn').on('click',clearBtn);//删除
		$('.showContent').on('click','input[type="checkbox"]',add);//去重
		$("#ztreeT ul li").on('click',activeColor);
		$('#treeDemo').on('click', 'li span.switch.level0', treeDemoColor);
	    $('#treeDemo').on('click', 'ul li.level1 ', treeDemoLiColor);
		$('#searchType').on('propertychange input',onpropertychange);//监听字母搜索
		$('#searchType').bind('keypress',EnterPress);
	}
		
		/***********到选择服务类别    start ********/
		var _ids="";
		var content="";
		var _number=0;
		var treeNodeOption="";
		var selectServiceDialog=function(){
			var treeNodeId;
			var treeNodeFullName;
			$("#srtype").empty();
			var dialog1 =  new Dialog($.extend(dialogConfig1,{
                mode:'normal',
                id:'selectServiceDialog',
                title:'选择服务类别',
                ok:function(){
                	var str="";//给父页面<input>srtypeId赋值
    				var val="";//自定义属性,给父页面srtypeId
    				$('#selectContents').find('li').each(function(){
    					str+=$(this).text()+",";
    				})
    				str=str.substring(0,str.length-1);
    				$('#selectContents').find('input').each(function(){
    					val+=$(this).prop("name")+",";//该内容为ztree子节点选中后追加元素的name
    				})
    				val=val.substring(0,val.length-1);
    			    $("#srtype").val(str);
    				$("#srtype").attr("val",val);
    				_ids="";
    				_number=0;
                },
                okValue: '确定', 
                cancel: function(){
	                treeNodeOption="";
					_ids='';
					_number=0;
				}, 
                cancelValue: '取消', 
                cancelDisplay:true,
                width:820,
                height:450,
                modal:true,
                content:require("text!html/serviceReq/hotsrtype/selectServiceReqType.html")
            }));
			dialogInitEvent();
			dialog1.on('confirm',function(){
				$("#srtype").empty();
			    $("#srtype").append(treeNodeOption);
				$("#srtype option:first").prop("selected", 'selected');
				treeNodeOption="";
				_ids='';
				_number=0;
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
		var searchClear=function(){
		    $('#searchType').val("");  
			
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
		
		/**字母搜索*/
		var onpropertychange = function(e){
			var searchKey=$(e.currentTarget).context.value;
			var optionDic = "";
        	ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=selectByZMreqType&searchKey='+searchKey+'',function(result){
        		$.each(result.beans,function(index,bean){
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
                    })
        		$("#txtIds").html(optionDic);
        	})
        	 addSelNode();
		}
		/**去除重复*/
		var add=function(){
			var ids=$(this).attr("name");
			console.log($(this).parent('li'));
			 if($('.showContent').find('input[name^='+ids+']').is(":checked")){	
				 if(_ids.indexOf(ids) >= 0){
						crossAPI.tips("类别已选过，请勿重复选取",1500);
						$(this).checked=false;
					}else{
						var content=$("#selectContents").html();
						content+="<li><input type='checkbox' name='"+ids+"'/><label>"+$(this).parent('li')[0].innerText+"</label></li>";
						$("#selectContents").html(content);
						_number+=1;
						_ids+=ids+",";
						treeNodeOption += "<option value='"+ids+"'>"+$(this).parent('li')[0].innerText+"</option>";
						 $("#GS").html(_number);
					}
			 }else{
				 $("#selectContents").find("input[name^="+ids+"]").parent('li').remove();
	     			_number=_number-1;
	     			_ids=_ids.replace(ids+",",'');
	     			treeNodeOption=treeNodeOption.replace("<option value='"+ids+"'>"+$(this).parent('li')[0].innerText+"</option>","");
	     			$("#GS").html(_number);
			 }
		}
		
		/**删除选择路径*/
		 var clearBtn = function(){	
			 if($('#selectContents').find('input[type="checkbox"]').is(":checked")){
				 $($('#selectContents').find('input[type="checkbox"]:checked').each(function(){ 
					 $('#selectContents').find('input[type="checkbox"]:checked').parent('li').remove();
					 var ids=$(this).attr("name");
					 var dellabelname=$(this)[0].nextSibling.innerText;
					 _ids= _ids.replace(ids+",",'');
					 treeNodeOption = treeNodeOption.replace("<option value='"+ids+"'>"+dellabelname+"</option>","");
					 _number=_number-1;
					 var treeDel= false;
					  if(ztree!=null && ztree!=""){
				         var nodes = ztree.transformToArray(ztree.getNodes());
				         if(nodes.length>0){
				            for(var i=0;i<nodes.length;i++){
				                if(nodes[i].id==$(this).attr("name")){
				                	nodes[i].checked=false;
				                	if(!treeDel)//判断是否删除树节点
	                                	treeDel=true;
				                }
				            }
				        }
				       //如果删除树节点，树刷新
		               if(treeDel)
		                  ztree.refresh(); 
					 }
						 $('.showContent').find('input[name^='+ids+']').prop('checked',false); 
						 $('.showContent').find('input[name^=' + ids + ']').siblings('label').css('background','none');
			           
				 })
			 )
			 	 $("#GS").html(_number);
			 }else{
				 crossAPI.tips("请选择删除的服务类别",1500);
			 }
        }
		/***********到选择服务类别    end **********/
		//点击显示路径
		var element = function(){ 
			//点击input选框选择此条时，显示在页面上
			if($(this).find('input').is(":checked")){

			}
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
		 var activeColor = function(){
			 $("#treeDemo_1_ul li").removeClass('activeColor');
			 $(this).addClass("activeColor").siblings().removeClass('activeColor');
		 }
		/* var tabsActive = function(){
			 var $t = $(this).index();
			 $(this).addClass('active').siblings().removeClass('active');
			 $('.t-tabs-wrap li').eq($t).addClass('selected').siblings().removeClass('selected');
			 
			var str=$(this)[0].innerText;
			 if(str.indexOf("短信")>-1){
				 ajax.getJson('/ngwf_he/front/sh/serviceReq!execute?uid=correlationSMS&routekey='+_ids,function(result){
                		var optionDic="";
					 $.each(result.beans,function(index,bean){
						 optionDic+="<a href='#nogo'>"+bean.category+"</a>";
                		})
                		crossAPI.tips(optionDic,3000);
                		$("#correlationSMS").html(optionDic);
                		})
			 }
			 if(str.indexOf("知识")>-1){
			 }
			
		 }*/
		//去掉字符串的前后空格
		String.prototype.trim=function() {
			return this.replace(/(^\s*)|(\s*$)/g,'');
		}
		IndexLoad(function(IndexModule, options){
			_index = IndexModule;
			_options = options;
			eventTabsInit();
			var selectRows={};
			var adjustCheckedRows={};
			creartSelect("NGCS.HEYTCK.CITYCODE", "地市", "hebeidishi");
			/**屏蔽Backspace按键页面回退事件*/
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
		})
	})
})



