define( [ 'Util', 'list', 'indexLoad','date','selectTree'],
		function(Util, List,IndexLoad,MyDate,SelectTree) {
			var _index;
			var list;
			var ctiData;
			
			IndexLoad(function(IndexModule, options){
				_index = IndexModule;
				//事件初始化
				eventInit();
			 });

			var eventInit = function() {
				$('#btn-search').on('click', serviceSearch);
				
			};

			var serviceSearch = function() {
				listSearch();
			}

			var contactMain = function(e){
				console.log("click serialno");
				var ser = $(e.currentTarget).text();
				//创建选项卡
				var tab = _index.createTab({
				  title:' ',
				  url:'js/workflow/detail', 
				  closeable:true, //选项卡是否可以关闭，支持true|false，1|0  
				  width:90,  //选项卡宽度，单位px
				  businessOptions:{ businessID:15 }
				});
			}
			
			var date = function(){
				//开始日期组件
				var config = new MyDate({
			        el:$('#startTime'),
			        label:'开始日期',
			        name:'startTime',    //开始日期文本框name
			        format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
			        min: laydate.now(0),      //最小日期限制
			        istime: true,
			        istoday: true,
			        choose:function(){} //用户选中日期时执行的回调函数
			    });
				
				//结束日期组件
			    var date1 = new MyDate( {
			        el:$('#endTime'),
			        label:'结束日期',
			        name:'endTime',    //开始日期文本框name
			        format: 'YYYY-MM-DD hh:mm:ss',    //日期格式
			        min: laydate.now(0),         //最小日期限制
			        istime: true,
			        istoday: true,
			        choose:function(){} //用户选中日期时执行的回调函数
			    });
			    
			  //服务请求类别组件
			   var select =  new SelectTree({
			        el:$('.selectAsyncTree'),
			        title:'服务请求选择',
			        label:'服务请求类别',
			        check:true,
			        async:true,
			        name:'srtypeid',
			        url:''
			    });
			}
			
			var listSearch = function(data) {
				var config = { 
						el:$('#outterLinkForm'),
				        field:{
				            boxType:'checkbox',
				            key:'id',
				            popupLayer:
				            {
				                width:800,
				                height:250
				            },
				            items:[
				                { text:'链接编号',name:'id',render:function(item,val){
				                	val = '<a  class="serialnoId" >'+val+'</a>';
				                	return val;
				        		  }},
				                { text:'链接名称',name:'name'},
				                { text:'链接描述',name:'description' },
				                { text:'链接URL',name:'url' } 
				            ]
				        },
				        page:{
				            perPage:10,
				            align:'right'
				        },
				        data:{
				            url:'/ngwf_he/front/sh/sReqOutLink!execute?uid=sReqOutLink001'
				            	
				        }}
				list = new List(config);
				list.search(data);
			};
			//return initialize;
		});