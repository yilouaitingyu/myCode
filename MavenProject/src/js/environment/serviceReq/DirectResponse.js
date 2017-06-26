define(
		[ 'Util', 'list','validator','indexLoad','style!css/customerCon/addCustoCon.css'],
		function(Util, List,Validator,IndexLoad) {
			var _index;
			var list;
			var ctiData;
			IndexLoad(function(IndexModule, options){
				// 
				_index = IndexModule;
				//事件初始化
				kkk(options);
				console.log(options);
			 });
			var kkk=function(options){ 
				$("#srtypeid").html(options.srtypeid);
			}
				
				
		});