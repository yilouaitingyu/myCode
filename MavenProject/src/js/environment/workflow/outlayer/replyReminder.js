define(['Util','select','indexLoad',"detailPanel","jquery",'dialog','date',
        'text!module/workflow/outlayer/replyReminder.html',
        'style!css/workflow/outlayer/replyReminder.css'],   
	function(Util,Select,IndexLoad,DetailPanel,$,Dialog,myDate,Html_dealUrge){
		var $el;
		var _index;
		var _options;
		var content;
		var processinfo;
		var initialize = function(index, options){
			$el = $(Html_dealUrge);
			_index = index;
			_options=options;
			processinfo = options.processinfo;
			this.mydate();
			this.width=350;
			this.height=100;
			this.content = $el;
		};	
	$.extend(initialize.prototype, Util.eventTarget.prototype, {
		mydate : function(){
			 Date.prototype.Format = function(fmt) { // author: meizz
	                var o = {
	                    "M+": this.getMonth() + 1,
	                    // 月份
	                    "d+": this.getDate(),
	                    // 日
	                    "h+": this.getHours(),
	                    // 小时
	                    "m+": this.getMinutes(),
	                    // 分
	                    "s+": this.getSeconds(),
	                    // 秒
	                    "q+": Math.floor((this.getMonth() + 3) / 3),
	                    // 季度
	                    "S": this.getMilliseconds() // 毫秒
	                };
	                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	                for (var k in o)
	                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	                return fmt;
	            }

	            var reservationDate = new Date(new Date().getTime()+4*60*60*1000).Format("yyyy-MM-dd hh:mm:ss");
	            var dateagain=new myDate({
	    		el:$('#reservationDate', $el),
	    		label:'预约回复提醒：',
            	name:'datetime',    //开始日期文本框name
            	format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
            	defaultValue:reservationDate,     //默认日期值
				max : '2099-06-16 23:59:55',
				istime: true,    
            	istoday: false,
            	choose:function(){
            	}
			});
		},
		but_commit : function(){
			 
			var reservationDate=$("#reservationDate input").val();
			var inputData=new Date(reservationDate);
			var newDate=new Date();
			var result=inputData.getTime()-newDate.getTime();
			if(result<0){
				crossAPI.tips("提醒时间不可小于当前时间",3000);
				return;
			}
			var nodeData = {
					        "serialNo":processinfo.wrkfmShowSwftno,
					        "serviceTitle":"预约回复提醒时间",
					        "acceptNumber":processinfo.acptNum,
					        "createStaffid":_options.loginStaffId,
					        "createStaffName":_options.loginStaffName,
					        "reservationDate":$("#reservationDate input").val(),
					        "acceptStaffId":processinfo.acptStaffNum,
					        "acceptStaffName":_options.loginStaffName,
					        "handlingGroupId":"2017040700102",
					        "handlingGroupName":"工单复核组",
					        "reservationHandleFlag":"N"
					        }
			Util.ajax.postJson(
					          '/ngwf_he/front/sh/workflow!execute?uid=replyReminder',
					          nodeData, function(json, status) {
					        console.log(json);
					        if(json.returnCode=="0"){
					        	 crossAPI.tips("操作成功！",3000);
					        }else{
					        	 crossAPI.tips("操作失败,请联系管理员",3000);
					        }					
			})
		}
	});
	return initialize;
});