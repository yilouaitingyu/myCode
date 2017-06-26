define(['Util','jquery',
	'text!module/workflow/common/exportExcelAlert.html',
	'style!css/workflow/common/exportExcelAlert.css'],function(Util,$,excel){
	var $el = $(excel);
	var _options;
	var url="/ngwf_he/front/sh/workflow!execute?uid=exportConfig";
		var initialize = function(){
		};	
	$.extend(initialize.prototype,{
		eventInit:function(queryType){
			var init=this;
			Util.ajax.postJson(url,{queryType:queryType},function(result){
				$("#dialouge").html($el);
				var  uls ="<ul>";
				var html ="";
				var  uld ="</ul>";
				$("#popContent",$el).empty();
				console.log(result.beans);
				$.each(result.beans,function(index,obj){
					html+="<li><span class='tit'>"+obj.loutColmNm+"</span><input type='checkbox' class='checkoption' id='"+obj.seqingColmNm+"' value='' /></li>"
				});
				var htmls = $(uls+html+uld);
				$("#popContent",$el).append(htmls);
				$("input",$el).prop("checked","true");
				
				$('#popuplayer').show();
				
				$(".closeExcel").click(function(){
					
					$('#popuplayer').hide();
				});
				$("#aor_submit").click(function(){
					var arr=init.clickQuery();
					$('#popuplayer').hide();
					init.confirm(arr);
				});
			});
			
		},
		clickQuery:function(){
			var checkarr = [];
			$("input:checkbox",$el).each(function(){
				if($(this).prop("checked")){
					var _id=$(this).attr("id");
					checkarr.push(_id);
				}else{
					return;
				}
			});
			return checkarr;
		},
		confirm:function(arr){
			console.log(arr);
		}
		});
	return initialize;	
})