/**
 * list 组件示例
 */
define(['Util',
        'Compts',
        'text!module/example/component/list/list.tpl'],
    function(Util,Compts,tpl){

        //系统变量-定义该模块的根节点
        var $el = $(tpl), _indexModule;
        //系统变量-构造函数
        var initialize = function(indexModule, options,tabItem){
            var config = {
                el:$('.listContainer',$el),
                field:{
                    boxType:'checkbox',
                    key:'id',
                    popupLayer:
                    {
                        width:800,
                        height:250,
                        groups:[
                            {
                                items:
                                    [
                                        [
                                            {text:'公告名称',name:'anoceTitleNm'},
                                            {text:'公告ID',name:'anoceId'}
                                        ]
                                    ]
                            },
                            {
                                items:
                                    [
                                        [
                                            {text:'公告类型',name:'typeNm'},
                                            {text:'公告类别ID',name:'anoceTypeId'}
                                        ],

                                        [
                                            {text:'发布状态',name:'anoceIssueStsCdShow'},
                                            {text:'有效状态',name:'anoceRecStsCdShow'}
                                        ],
                                        [
                                            {text:'生效时间',name:'bgnEffTime'},
                                            {text:'失效时间',name:'endEffTime'}
                                        ]
                                    ]
                            },
                            {
                                items:
                                    [
                                        [
                                            {text:'接收组织',name:'rcvOrgBrnchNm'}
                                        ]
                                    ]
                            }
                        ]
                    },
                    items:[
                        { text:'公告标题',name:'anoceTitleNm',className:'w120'},
                        { text:'公告类别',name:'typeNm'},
                        { text:'紧急程度',name:'urgntExtentTypeCdShow' },
                        { text:'发布状态',name:'anoceIssueStsCdShow' },
                        { text:'有效状态',name:'anoceRecStsCdShow' },
                        { text:'创建时间',name:'crtTime' },
                        { text:'操作日期',name:'odrOpTime' }
                    ]
                },

                page:{
                    perPage:6,
                    align:'right',
                    button:{
                        items:[
                            {
                                text:'删除',
                                name:'deleter',
                                click:function(e){
                                    console.log('点击了删除按钮'+'+'+this.text)
                                }
                            },
                            {
                                text:'暂停',
                                name:'stopToggle',
                                click:function(e){
                                    console.log('点击了暂停按钮'+'+'+this.text)
                                }
                            }
                        ]
                    }
                },
                data:{
                    url:'data/list_notice.json',
                }
            };
            this.list = new Compts.List(config);
            this.list.search();
            //将根节点赋值给接口
            this.content = $el;
        };


        return initialize;
    });