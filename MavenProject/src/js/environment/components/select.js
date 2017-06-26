/**
 * select 业务组件
 */
define(['Util','select'],
    function(Util,Select){

    var fieldsSetting = {
        'SR.USER.LEVEL.SUBS_LEVEL':{ name:'subsLevel', label:'用户级别' },//用户级别
        'SR.USER.BRAND.SUBS.BRAND':{ name:'subsBrand', label:'用户品牌' },//用户品牌'
        'SR.THE.USER.BELONGS':{ name:'customerAttr', label:'用户归属地' },//用户归属地
        'SR.NODE.TYPE.CURR.NODE.TYPE':{ name:'currNodeType', label:'节点类型' },//节点类型
        'SR.WORK.ORDER.OPERATION.TYPE':{ name:'lastOperateType', label:'工单操作类型' },//工单操作类型
        'SR.DEGREE.EMERGENCY.URGENT_ID':{ name:'urgentId', label:'紧急程度' },//紧急程度
        'SR.OPER.STATUS':{ name:'operactionStatus', label:'操作状态' },//操作状态
        'SR.CONTACT.CHANNEL':{ name:'contactChannel', label:'受理渠道' },//受理渠道
        'SR.RESPONSIBILITY.RESPONSE.MODE':{ name:'dutyCause', label:'责任定性' },//责任定性
        'SR.REVISIT.SATISFY.ID':{ name:'revisitSatisfyId', label:'客户满意度' },//客户满意度
        'SR.TIMEOUT.TYPE.TMLMT.STATE':{ name:'tmlmtState', label:'超时类型' },//超时类型(时限状态)
        'SR.TYPES.QUERIES.QUERY.WORK.TYPE':{ name:'', label:'工单类型' },//工单类型
        'SR.MODE.OPERATION.OPERATE.WAY':{ name:'operateWay', label:'操作方式' },//操作方式
        'SR.DEAL.COMPETITION.COMPETITION':{ name:'processRating', label:'处理评比' },//处理评比
        'SR.REPLY.WAY.FEEDBACK.MODE':{ name:'revisitContactMode', label:'回复方式' },//回复方式
        'SR.RESPONSIBILITY.DUTY.CAUSE':{ name:'dutyCause', label:'责任原因' },//责任原因
        'SR.REASON.DUTY.CAUSE.GRADE':{ name:'dutyCauseGrade', label:'责任原因级别' },//责任原因级别
        'SR.DEGREE.RESOLVED.DEGREE':{ name:'solveStatus', label:'解决程度' },//解决程度
        'SR.IMPORTANT.LEVEL':{ name:'importantLevel', label:'重要程度' },//重要程度
        'SR.COMPLAINT.TMLMT.TYPE':{ name:'tmlmtType', label:'时限类型' },//时限类型
        'SR.COMPLAIN.TYPE':{ name:'complainType', label:'投诉类型' },//投诉类型
        'SR.DISSATISFY.REASON':{ name:'dissatisfyReason', label:'不满意原因' },//不满意原因
        'SR.YES.OR.NO':{ name:'', label:'是否' },//是,否
        'SR.PROCESS.STATE':{ name:'processState', label:'工单状态' },//工单状态
        'SR.ASSIGN.WAY':{ name:'assignWay', label:'分单方式' },//分单方式
        'SR.IS.WORK.ITEM':{ name:'queryIsAccept', label:'是否接单 ' },//是否接单
        'SR.TASKS.SORTED':{ name:'taskDateSortWay', label:'任务排序方式' },//任务排序方式
        'SR.ASSIGN.OBJECT':{ name:'assignObject', label:'分单对象' },//分单对象
        'SR.ASSIGN.STATE':{ name:'assignState', label:'分单状态' },//分单状态
        'SR.GLOBAL.ABILITY.QUERY':{ name:'busiType', label:'业务类别' },//全网能力开放查询业务类别
        'SR.GLOBAL.ABILITY.HANDLE':{ name:'busiType', label:'业务类别' },//全网能力开放办理业务类别
        
        'SR.GLOBAL.STOP.BUSINESS.TYPES':{ name:'busiType', label:'停机业务类型' },//全网能力办理停机业务类型
        'SR.GLOBAL.BOOT.BUSINESS.TYPES':{ name:'busiType', label:'开机业务类型' },//全网能力办理开机业务类型
        'SR.GLOBAL.FOR.EFFECTIVE.WAY':{ name:'busiType', label:'生效方式' },//全网能力办理生效方式
        'SR.GLOBAL.ROAMING.TYPE':{ name:'busiType', label:'漫游类型' },//全网能力漫游类型
        'SR.PASSWORD.CHANGE':{ name:'passwordChange', label:'密码修改 ' },//密码修改方式
        'SR.WORKITEM.ACCEPT_TYPE':{ name:'acceptWay', label:'接单方式 ' },
        'SR.CFG.WORK.ITEM.ASSIGN.EFFECTIVE.MODE':{ name:'effectiveMode', label:'生效模式 ' },//自动派单生效模式
        
        //公告
        'CS.MSG.AFFICHE.GRADE':{ name:'grade', label:'紧急程度' },//紧急程度
        'CS.MSG.AFFICHE.METHOD':{name:'method', label:'发布方式'},//发布方式
        'CS.MSG.AFFICHE.PUBLISH_STATE':{name:'afficheState', label:'发布状态'},//发布状态
        'CS.MSG.AFFICHE.STATE':{name:'state', label:'有效状态'},//有效状态
        'SR.FLOW.TEMPLATEID':{name:'flowTemplateId', label:'流程模版'}//有效状态
    }
    var objClass = function(options){
        var prependConfig = {}
        if (options.codeType){
            var field = fieldsSetting[options.codeType] || {
                label:'字段',
                name:'name'
            };						
            prependConfig.url = 'front/sh/popUp!execute?uid=datadict001&typeId=' + options.codeType;
            prependConfig.label = field.label;
            prependConfig.name = field.name;
        }
        var config = $.extend(prependConfig, options);
        return new Select(config);

    };

    return objClass;
});