define(['Util','detailPanel'],   
	function(Util,DetailPanel){
	var _index
	var _options;
	var _orderInfo;
	var initialize = function(index, options){
		_index=index;
		_options=options;
		 
		if(_options.srInfo == '' || typeof(_options.srInfo) == 'undefined'){
			_orderInfo=null;
		}else{
			_orderInfo=options.srInfo;
		}
		this.detailPanelInit();
		this.editStyle();
		this.chairputbuibot();
	}
	$.extend(initialize.prototype, {
		detailPanelInit : function(){
			//工单状态
			var orderStateName;
			//建单人
        	var acptStaffName;
        	//建单部门
        	var acptDeptName;
			if(_orderInfo==null){
				orderStateName='草稿';
				acptStaffName=_options.userInfo.staffName;
				acptDeptName=_options.userInfo.deptName;
				acptTime=$("input[name='acptTime']").val();
			}else{
				orderStateName=this.getDictionaryName('staticDictionary_get', 'HEBEI.WF.ORDER.STATE',_orderInfo.wrkfmStsCd);
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryByStaffId', {'handStaffId':_orderInfo.acptStaffNum}, function(result) {
					if(result.beans.length>0){
						acptStaffName=result.beans[0].staffName;
					}else{
						acptStaffName='';
					}
		     	},
		      	true);
				Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryDeptInfoByDeptId', {'deptId':_orderInfo.acptDeptId}, function(result) {
					acptDeptName=result.bean.deptName;
                });
				acptTime=_orderInfo.acptTime;
			}
	        var json = {
	        	//建单人
	        	staffName: acptStaffName,
	        	//建单部门
	        	deptName : acptDeptName,
	        	//工单状态
	        	orderState : orderStateName,
	        	//受理时间
	        	acptTime : acptTime
	        };
	        var starConfig = {
	            el: $("#foundOrderinfo"),
	            // 组件绑定的容器
	            className: 'formContent',
	            // 组件外围的className
	            // title:'', //组件的标题
	            column: 4,
	            // 组件的总列数,默认为1
	            items: [ // 组件的数据配置项
	            {
	                label: '编号',
	                // 数据的label
	                key: ''
	                // 对应json数据的key
	            },
	            {
	                label: '来源序号',
	                key: ''
	            },
	            {
	                label: '一级客户流水号',
	                key: ''
	            },
	            {
	                label: '整体时限',
	                key: ''
	            },
	            {
	                label: '流水号',
	                key: ''
	            },
	            {
	                label: '建单人',
	                key: 'staffName'
	            },
	            {
	                label: '建单部门',
	                key: 'deptName'
	            },
	            {
	                label: '工单状态',
	                key: 'orderState'
	            },
	            {
	                label: '建单时间',
	                key: 'acptTime'
	            },
	            {
	                label: '派发时间',
	                key: ''
	            },
	            {
	                label: '完成时间',
	                key: ''
	            },
	            {
	                label: '关闭时间',
	                key: ''
	            },
	            {
	                label: '本工单，南区派发走的派发次数',
	                key: ''
	            },
	            {
	                label: '震荡工单',
	                key: ''
	            }
	            ]
	            data: json
	        }
	        var detailPanel = new DetailPanel(starConfig);
		},
		getDictionaryName : function(mothedName, dicName, dicValue) {
			var dictionaryName;
	    	var params = {
	                method: mothedName,
	                paramDatas: '{typeId:"' + dicName + '"}'
	        };
	        Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF', params, function(result) {
	            $.each(result.beans, function(index, bean) {
	            	if(bean.value == dicValue){
	            		dictionaryName = bean.name;
	            		return false;
	            	}
	           	});
	     	},
	      	true);
	        return dictionaryName;
	    },
	    // 建单人基本信息列表修改样式 start
	   editStyle :function($el) {
	    	$("#foundOrderinfo",$el).css("background-color","white");
	        $("#foundOrderinfo .sn-detailPanel .detailList li label", $el).css("width", "35%");
	        $("#foundOrderinfo .sn-detailPanel .detailList .theOrderNum span", $el).css({
	            "display": "inline-block",
	            "vertical-align": "middle",
	            "padding-bottom": "25px"
	        });
	    },
	    chairputbuibot:function(){
	    	 $('#chairputbuibot').on('click',
	 	    	    function() {
	 	    	        if ($('#foundOrderinfo').hasClass('hide')) {
	 	    	            $('#foundOrderinfo').removeClass('hide').addClass('show');
	 	    	            $('#chairputbuibot .icon-212102').addClass('icon-2121021').removeClass('icon-212102');
	 	    	        } else {
	 	    	            $('#foundOrderinfo').removeClass('show').addClass('hide');
	 	    	            $('#chairputbuibot .icon-2121021').addClass('icon-212102').removeClass('icon-2121021');
	 	    	        }
	 	    	    });
	    }
	   
	});
	return initialize;
})