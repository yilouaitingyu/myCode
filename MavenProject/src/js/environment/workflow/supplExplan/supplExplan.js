define(['Util', 'indexLoad', 'tab', 'validator', 'dialog', 'crossAPI', 'simpleTree', 'js/workflow/processinfoDetail/varsOfWorkflow'],
function(Util, IndexLoad, Tab, Validator, Dialog, CrossAPI, SimpleTree, vars) {
    // 对于全局参数，命名请带下划线
    var _list;
    
    var createList = function(){
    	var listConfig = {
				el : $('#listContainer'),
				className : 'listContainer',
				field : {
					key : 'id',
					items : [
						{
							text : '开始时间', // 按钮文本
							name : 'wrkfmTypeCd' // 按钮名称
						},
						{
							text : '受理时间', // 按钮文本
							name : 'wrkfmShowSwftno' // 按钮名称
						},

						{
							text : '执行人',
							name : 'srvReqstTypeId'
						},
						{
							text : '动作',
							name : 'custStargrdCd'
						},
						{
							text : '负责组/人',
							name : 'acptChnlId'
						},
						{
							text : '完成时间',
							name : 'acptNum'
						},
						{
							text : '操作内容',
							name : 'acptStaffNum'
						},
                     ]
				},	
                data:{
                    url:'data.json'
                }
    	};
    	//列表配置结束
    	_list = new List(listConfig);
    	list.search({});
    };
    // 页面初始化方法，（如初始化参数，复杂的逻辑，请另开方法，并在里面执行）
    IndexLoad(function(indexModule, options) {

    });
});