define( [ 'Util', 'indexLoad'],
		function(Util,IndexLoad) {
			var  _index;
			var _option;
			
			/**初始化事件*/
			var eventInit = function() {
				/**默认全选*/
				$("input[name='cloum']").each(function(){ 
					$(this).attr("checked", true); 
				});
				/**事件部分*/
				$('#confirmBtn').on('click', confirmExport);//确定导出
				$('#cancelBtn').on('click', cancelExport);//重置
			};
			
			/**获取当前时间*/
			var getNowFormatDate=function() {
			    var date = new Date();
			    var seperator1 = "-";
			    var seperator2 = ":";
			    var month = date.getMonth() + 1;
			    var strDate = date.getDate();
			    if (month >= 1 && month <= 9) {
			        month = "0" + month;
			    }
			    if (strDate >= 0 && strDate <= 9) {
			        strDate = "0" + strDate;
			    }
			    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			            + " " + date.getHours() + seperator2 + date.getMinutes()
			            + seperator2 + date.getSeconds();
			    return currentdate;
			} 
			
			/**确定导出*/
			var confirmExport=function(){
				var data = _option.data;
				var beans=_option.beans;
				var ids='';//选中的条数(请求编号)
				if(beans!='' || beans!=null){
					for(var i=0;i<beans.length;i++){
						ids=ids+beans[i].id+","
					}
					ids=ids.substring(0,ids.length-1);
				}
				var str='';//查询的条件参数
				for(var key in data){//将查询参数拼成字符串
					if(!data[key]==''){
						str = str+"&"+key+"="+data[key];
					}
				}
				var cols='';//选中的列
				$('input[type=checkbox]:checked').each(function(){
					cols+=$(this).val()+',';
				})
				if(cols==''){
					crossAPI.tips("请至少选择一列！",3000)
					return;
				}
				cols=cols.substring(0,cols.length-1);
				if(ids!=''){
					window.location.href=encodeURI('/ngwf_he/front/sh/exportServiceReq!exportDatas?uid=exportServiceReq001&ids='+ids+'&cols='+cols);
				}else{
					window.location.href=encodeURI('/ngwf_he/front/sh/exportServiceReq!exportDatas?uid=exportServiceReq001&cols='+cols+str);
				}
			
				/**导出后往日志表插入导出记录*/
				var recordtime=getNowFormatDate();
				var staffId=_index.getUserInfo().staffId;
				var staffName=_index.getUserInfo().staffName;
				var data={
	 					"recordtime":recordtime,
	 					"logtype":'2',
	 					"staffId":staffId,
	 					"staffname":staffName,
	 					"outputtype":'9',
	 					"outputname":"服务请求查询",
	 					"outputcontent":"导出"+data.startTime+"至"+data.endTime+"的数据"
		 		}
			     Util.ajax.postJson('/ngwf_he/front/sh/serviceReq!execute?uid=dialogRecord002',data);
			}
			
			/**重置*/
			var cancelExport=function(){
				$("input[name='cloum']").each(function() { 
					$(this).attr("checked", false); 
				})
			}
			
			/**初始化加载*/
			IndexLoad(function(IndexModule, options){
				 _index = IndexModule;
				_option = options;
				eventInit();
		    })
})