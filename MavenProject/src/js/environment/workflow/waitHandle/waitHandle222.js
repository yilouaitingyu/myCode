require(
		['Util', 'date', "list", 'select','dialog','jquery','js/btnAuthority2' ],
		function(Util,MyDate, List,Select,Dialog, $,Authority) {
			
			var list;
			var _index;
			var _options;
			var initialize = function(index, options){
				_index = index;
				_options = options;
			//隐藏
				tabClick();
				authorReg($(".t-tabs-items"));
		   //列表详情结束位置
			}
		   var tabClick = function(){
			   $(".t-tabs-items li").on("click",function(event){
				   $(".t-tabs-items li").removeClass("active");
				   $(this).addClass("active");
			   })
		   }
		   var authorReg = function($el){
			    new Authority($el); 
		   }
			return initialize();
		// 最外层require
		})