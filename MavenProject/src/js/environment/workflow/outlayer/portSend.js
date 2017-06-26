define(['Util','select','indexLoad',"detailPanel",
        'text!module/workflow/outlayer/portSend.html',
        'style!css/workflow/outlayer/portSend.css'],   
	function(Util,Select,IndexLoad,DetailPanel,Html_basicMessage){
	var $el;
	var _index;
	var _options;
	var clickNum=1;
		var initialize = function(index, options){
			$el = $(Html_basicMessage);
			_index = index;
			_options=options;
			this.addSelect();
			this.deleteSelect();
			this.takeBottom();
			this.chooseTab();
			this.dictionaryInit();
			this.content = $el;
			this.width = 800;
			this.height = 400;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		//下拉框加载数据字典方法
	    loadDictionary:function(mothedName,dicName,seleId){
					var params={method:mothedName,paramDatas:'{typeId:"'+dicName+'"}'};
					var seleOptions="";
					Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF',params,function(result){
						$.each(result.beans,function(index,bean){
							seleOptions+="<option  value='"+bean.value+"'>"+bean.name+"</option>"
						});
						$('#'+seleId,$el).append(seleOptions);
					},true);
	    },
	    dictionaryInit: function(){
	    	//报一级客服
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.FLOW_PATH_TYPE', 'slf_procedure'); //流程类别
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.TARGET_PROVINCE', 'slf_target'); //目标省
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.COMMON_ISORNO', 'slf_operation'); //>统一运营
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.COMMON_NEED', 'slf_intervention'); //需要总部干预
	    	this.loadDictionary('staticDictionary_get', 'HEBEI.WF.COMMON_ISORNO', 'slf_deduction'); //是否不明扣费
	    	//报BOMC
	    	this.loadDictionary('staticDictionary_get','HEBEI.WF.OUTSYSTEM.UNIT','outSystem_unit');//加载省份信息
	    },
//		增加按钮
		addSelect : function(){
			
			$('#addSelect',$el).on('click',function(){
				var addSelect='<div>'+
				'<select id="moreSelect'+clickNum+'">'+
				'<option>请选择</option>'+
				'<option value="01">EOMS(省网管中心)</option>'+
				'<option value="02">BOMC(省业务支撑中心)</option>'+
				'<option value="03">CSVC(一级客服)</option>'+
				'</select>'+
				'<span>'+
				'<i class="icon iconfont icon-ddl-arr"></i>'+
				'</span>'+
			'</div>'
				
				if(clickNum>4){
					//$("#addSelect",$el).off("click");
					crossAPI.tips('最多派发5个接口',3000);
				}else{
					$('#thecontentLi').append(addSelect);
					clickNum++;
				}
				initialize.prototype.takeBottom();
			});
		},
//		删除按钮
		deleteSelect : function(){
			$('#deleteSelect',$el).on('click',function(){
				if(clickNum>1){
					$('#thecontentLi div').last().remove();
					clickNum--;
					//$('#deleteSelect',$el).off('click');
				}else{
					crossAPI.tips('已经不能再删除',3000);
				}
				initialize.prototype.refreshTab();
			})
		},
//		选择下拉框中的内容出现下方东西
		takeBottom : function(){
			console.log($('#thecontentLi div select',$el));
			$('#thecontentLi div select',$el).change(function(){
				initialize.prototype.refreshTab();
			})
		},
//		选项卡切换
		chooseTab : function(){
			$('.t-tabs-items li',$el).on('click',function(){
				var index=$(this).index();
				$(this).addClass('active').siblings().removeClass('active');
				$('.t-tabs-wrap>li').eq(index).addClass('selected').removeClass('unselected').siblings().addClass('unselected').removeClass('selected');
			});
		},
		refreshTab : function(){
			$('.t-tabs .t-tabs-items li').css('display','none')
			$('.t-tabs-wrap>li').removeClass('added');
			$('#thecontentLi div select :selected').each(function() {
				if($(this).val()=='01'||$(this).val()=='02'||$(this).val()=='03'){
					var index=$(this).val().substring(1)-1;
//					console.log(index);
					$('.t-tabs .t-tabs-items li').eq(index).css('display','block');
					$('.t-tabs .t-tabs-items li').eq(index).addClass('active').siblings().removeClass('active');
					$('.t-tabs-wrap>li').eq(index).addClass('added');
					$('.t-tabs-wrap>li').eq(index).addClass('selected').removeClass('unselected').siblings().addClass('unselected').removeClass('selected');
				}
			});
		},
		but_commit:function(){
			var outDispatch = []; //所有选择的外派接口的表单 序列化
			$('.t-tabs-wrap .added').each(function(){
				var outType = $(this).find('form').attr("id");
				var outjson = {};
				outjson.sysId = outType;
				outjson.outFrom = initialize.prototype.serializeObject($(this).find('form'))
				outDispatch.push(outjson);
			});
			var outDispStr = JSON.stringify(outDispatch);
			console.log(JSON.stringify(outDispatch));
			var outParams = {
					"outDispStr": outDispStr
			}
		},
		serializeObject : function(thisDiv) {
	        var json = {};
	        var arrObj = thisDiv.serializeArray();
	        $.each(arrObj,function() {
	            if (json[this.name]) {
	                if (!json[this.name].push) {
	                    json[this.name] = [json[this.name]];
	                }
	                json[this.name].push(this.value || '');
	            } else {
	                json[this.name] = this.value || '';
	            }
	        });
	        return json;
	    }
		});
	return initialize;
	// 序列化 输入框的值;
    
});