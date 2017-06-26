define(["jquery","hdb"],function($,Hdb){
	var initialize=function(){
		hand();
	};
//  handbar 的使用;
var hand = function (){
		
		//注册索引+1的helper
		var handleHelper = Hdb.registerHelper("addOne",function(index){
			//返回+1之后的结果
			return index+1;
		});
		
		$.ajax({
			type: "GET",
			url: "/ngwf_he/front/sh/workflow!execute?uid=print",
			data: {showSerialNo:"201704091913532888245735757880"},						
			success: function(param){ 
				console.log("-------------");
				console.log(param);
				var data={};
				data.main=param.beans[0];
				data.attach=param.bean;
				data.beans=param.beans;
				var myTemplate = Hdb.compile($("#table-template").html()); 
				
				$('#tableList').html(myTemplate(data));
			},
			error:function(data){
				console.log("错误");
			}  
		});

	}
	return initialize();
//	define 最外层
})