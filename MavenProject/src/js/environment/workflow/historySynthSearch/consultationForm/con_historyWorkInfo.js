define(['Util','list','indexLoad',
        'text!module/workflow/oneservicecomplain/one_historyWorkInfo.html'],   
        function(Util,List,IndexLoad,Html_historyWorkInfo){
			var $el;
			var _index;
			var _options;
	
	
		var initialize = function(index, options){
				$el = $(Html_historyWorkInfo);
				_index = index;
				_options=options;
				historyworkList.call(this,$el);
				this.content = $el;
		};
		var historyworkList=function(){
	        var subsnumber = $("#aor_Basapltel").val();
	        console.log(subsnumber);
            var config = {
                el:$('.listContainer',$el),
                className:'listContainer',
                field:{
                    boxType:'checkbox',
                    key:'id',                           
                    items:[
                       
                        { 
                            text:'工单类别',
                            name:'WORKORDERTYPE',
                            className:'w120'                               
                        },
                        { text:'工单流水号',
                          name:'SERIALNO'                               
                        },
                        { text:'受理号码',name:'SUBSNUMBER' },
                        { text:'建单人',name:'ACCEPTSTAFFNAME'},
                        { text:'建单时间',name:'CREATETIME' },
                        { text:'紧急程度',name:'URGENTID' },
                        { text:'完成时间',name:'CREATETIME' },
                        { text:'操作状态',name:'OPERSTATUS' }
                                                     
                    ]
                },
                page:{
                    customPages:[2,3,5,10,15,20,30,50],
                    perPage:2,
                    total:true,
                    align:'right',
                    button:{
                        className:'btnStyle',
                        items:[
                            {
                                text:'已选择几条工单',
                                name:'deleter',
                                click:function(e){
                                    // 打印当前按钮的文本
                                   console.log('点击了删除按钮'+'+'+this.text)
                                }
                            }, 
                             {
                                text:'受理',
                                name:'deleter',
                                click:function(e){
                                    // 打印当前按钮的文本
                                   console.log('点击了删除按钮'+'+'+this.text)
                                }
                            },
                            {
                                text:'释放',
                                name:'stopToggle',
                                click:function(e){
                                    // 打印当前按钮的文本
                                    console.log('点击了暂停按钮'+'+'+this.text)
                                }
                            },
                             {
                                text:'导出',
                                name:'deleter',
                                click:function(e){
                                    // 打印当前按钮的文本
                                   console.log('点击了删除按钮'+'+'+this.text)
                                }
                            }
                        ]
                    }
                },
                data:{
                    url:'/ngwf_he/front/sh/workflow!execute?uid=queryHistoryOrderList'
                }
            };
            console.log(subsnumber+"32");
            //按上面的配置创建新的列表
            var list1 = new List(config);
            //
            list1.search({});
            list1.on('success',function(result){
                console.log(result)
            });
		}

	return initialize;
});