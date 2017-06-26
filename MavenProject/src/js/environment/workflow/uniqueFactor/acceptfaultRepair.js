define(['Util', 'timer', 'validator', 'select', 'selectTree', 'date', 'indexLoad', "detailPanel", "hdb", 'text!module/workflow/uniqueFactor/acceptfaultRepair.html', 'style!css/workflow/oneservicecompain/basicMessage.css'],
function(Util, Timer, Validator, Select, SelectTree, Mydate, IndexLoad, DetailPanel, Hdb, Html_basicMessage) {
    var $el;
    var _index;
    var _options;
    var _result;
    var initialize = function(index, options) {
        $el = $(Html_basicMessage);
        _index = index;
        _options = options;
        this.pageInit();
        this.content = $el;
    };
    $.extend(initialize.prototype, Util.eventTarget.prototype, {
        pageInit: function() {
        	//表单数据填充
            this.formDataInit();
            Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryCityToGroup', {}, function(result) {
            	 
            	var seleOptions = "<option value=''>请选择</option>";
            	$.each(result.beans, function(index, bean) {
                    seleOptions += "<option value='" + bean.cityCode + "'>" + bean.cityName + "</option>";
                });
                $('#aor_Bastellocal', $el).append(seleOptions);
            },
            true);
        	//数据字典加载
            this.dictionaryInit();
            //字段显示和隐藏点击事件
            this.chairput();
            //时间组件初始化
            this.dateInit();
            //默认值选中(省份和城市、下拉框、时间数据)
            this.setDefaultVal();
        },
        formDataInit: function() {
            var params = {
                srvReqstId: _options.serviceId
            };
            Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=detailData004', params, function(result) {
            	_result = result;
                // 注册一个Handlebars模版，通过id找到某一个模版，获取模版的html框架
                var myTemplate = Hdb.compile($("#aor_template", $el).html());
                // 将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
                if (result.beans.length != 0) {
                    $('#aor_form', $el).html(myTemplate(result.beans[0]));
                } else {
                    $('#aor_form', $el).html(myTemplate({}));
                }
            },
            true);
        },
        dateInit: function() {
            //获取当前时间并把当前时间显示在页面  暂时使用  start
            Date.prototype.Format = function(fmt) { // author: meizz
                var o = {
                    "M+": this.getMonth() + 1,
                    // 月份
                    "d+": this.getDate(),
                    // 日
                    "h+": this.getHours(),
                    // 小时
                    "m+": this.getMinutes(),
                    // 分
                    "s+": this.getSeconds(),
                    // 秒
                    "q+": Math.floor((this.getMonth() + 3) / 3),
                    // 季度
                    "S": this.getMilliseconds() // 毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }

            var nowDate = new Date();
            var time2 = nowDate.Format("yyyy-MM-dd hh:mm:ss"); //当前时间的格式;
            var t = nowDate.getTime() + 2 * 24 * 60 * 60 * 1000; //当前时间往后推迟七天
            var expctFdbkTime = new Date(t).Format("yyyy-MM-dd hh:mm:ss");
            //获取当前时间并把当前时间显示在页面  暂时使用  end
            var dateagain = new Mydate({
                el: $('#aor_Basbacktime', $el),
                label: '期待反馈时间：',
                name: 'expctFdbkTime',
                labelClassName: "necessary",
                //开始日期文本框name
                format: 'YYYY-MM-DD hh:mm:ss',
                //日期格式
                defaultValue:expctFdbkTime,
                //默认日期值
                max: '2099-06-16 23:59:55',
                istime: true,
                istoday: false,
                choose: function() {}
            });
            //受理时间    暂时改为打开页面的时间;
            var acceptdate = new Mydate({
                el: $('#aor_BoracceptTime', $el),
                label: '受理时间：',
                name: 'acptTime',
                //开始日期文本框name
                format: 'YYYY-MM-DD hh:mm:ss',
                //日期格式
                defaultValue: time2,
                //默认日期值
                max: '2099-06-16 23:59:55',
                istime: true,
                istoday: false,
                choose: function() {}
            });
            //期待反馈时间添加class:necessary;
            $('#aor_Basbacktime label', $el).addClass("necessary");
        },
        // 动态获取下拉框
        loadDictionary: function(mothedName, dicName, seleId) {
            var params = {
                method: mothedName,
                paramDatas: '{typeId:"' + dicName + '"}'
            };
            var seleOptions = "<option value=''>请选择</option>";
            // 
            Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF', params, function(result) {
                $.each(result.beans, function(index, bean) {
                    seleOptions += "<option  value='" + bean.value + "'>" + bean.name + "</option>"
                });
                $('#' + seleId, $el).append(seleOptions);
            },
            true);
        },
        dictionaryInit: function() {            
        	this.loadDictionary('staticDictionary_get', 'CSP.PUB.PROVINCE', 'aor_Basserpri'); //加载省份信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.CITY', 'aor_Bassercity'); //加载客户地市信息
            this.loadDictionary('staticDictionary_get', 'CSP.PUB.ACCEPTMODE', 'aor_Basaccway'); //加载受理方式信息
            this.loadDictionary('staticDictionary_get', 'ECP.PUB.USERBRAND', 'aor_Basbrand'); //加载客户品牌信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.LEVEL', 'aor_Basrange'); //加载客级别信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.SEND.TYPE', 'aor_Seccommit'); //加载提交方式信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.TEL.TYPE', 'aor_Secconcattel'); //加载联系方式信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.EDUCATION.TYPE', 'aor_Bassosrange'); //加载紧急程度信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.FOLLOW.HANDLE', 'aor_Basfollow'); //加载跟进处理信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.COMPLAIN.METHOD', 'aor_Basaskway'); //加载投诉途径信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.NET.TYPE', 'aor_Basnetclass'); //加载投诉途径信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.ACCEPT.CITY', 'aor_Basacccity'); //加载投诉途径信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.QUESTION.TYPE', 'aor_Basallques'); //加载集中问题分类信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'aor_Basdif');
            this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'aor_Secisrep');
            this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'aor_Basemotion');
            this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'aor_Bashidename');
            this.loadDictionary('staticDictionary_get', 'HEBEI.ORDER.MODEL', 'aor_Basmodule');
            this.loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.TYPE', 'wrkfmTypeCd');//加载业务类型信息
        },
        //设置省份和市区的默认字段
        setDefaultVal: function() {
        	//工单编号
            if(_options.serialno!=null){
            	$("#wrkfmShowSwftno", $el).val(_options.serialno);
            }
        	if (_result.beans.length == 0) {
        		//获取来电号码
                _index.getContact("getPhoneNum", function(callerNo) {
                	$("#aor_Basapltel", $el).val(callerNo);
        		});
        		$("#aor_Basserpri", $el).val("00030004");
                $("#aor_Bassercity", $el).val("01");
        		//受理工号
                $("#aor_Basacctel", $el).val(_options.userInfo.staffId);
                //受理部门名称
                $("#aor_Baseaccedoor", $el).val(_options.userInfo.deptName);
                //受理部门id
                $("#acptDeptId", $el).val(_options.userInfo.deptId);
        	}else{
        		var params = {
            		deptId: $("#acptDeptId", $el).val()
                };
                Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryDeptInfoByDeptId', params, function(result) {
                    $("#aor_Baseaccedoor", $el).val(result.bean.deptName);
                });
        		//下拉框选中
            	if ($.trim(_result.beans[0].userBrandCode) != '') {
                    $('#aor_Basbrand', $el).val(_result.beans[0].userBrandCode);
                }
                if ($.trim(_result.beans[0].userLvlCd) != '') {
                    $('#aor_Basrange', $el).val(_result.beans[0].userLvlCd);
                }
                if ($.trim(_result.beans[0].acptModeCd) != '') {
                    $('#aor_Basaccway', $el).val(_result.beans[0].acptModeCd);
                }
                if ($.trim(_result.beans[0].custProvCode) != '') {
                    $('#aor_Basserpri', $el).val(_result.beans[0].custProvCode);
                }
                if ($.trim(_result.beans[0].userBelgCityCode) != '') {
                    $('#aor_Bassercity', $el).val(_result.beans[0].userBelgCityCode);
                }
                if ($.trim(_result.beans[0].cntwayCd) != '') {
                    $('#aor_Secconcattel', $el).val(_result.beans[0].cntwayCd);
                }
                if ($.trim(_result.beans[0].surfnetmode) != '') {
                    $('#aor_Secgonetway', $el).val(_result.beans[0].surfnetmode);
                }
                if ($.trim(_result.beans[0].sbmtModeCd) != '') {
                    $('#aor_Seccommit', $el).val(_result.beans[0].sbmtModeCd);
                }
                if ($.trim(_result.beans[0].sameCmplntsFlag) != '') {
                    $('#aor_Secisrep', $el).val(_result.beans[0].sameCmplntsFlag);
                }
                if ($.trim(_result.beans[0].urgntExtentId) != '') {
                    $('#aor_Bassosrange', $el).val(_result.beans[0].urgntExtentId);
                }
                if ($.trim(_result.beans[0].trancehandle) != '') {
                    $('#aor_Basfollow', $el).val(_result.beans[0].trancehandle);
                }
                if ($.trim(_result.beans[0].cmplntsChnlCode) != '') {
                    $('#aor_Basaskway', $el).val(_result.beans[0].cmplntsChnlCode);
                }
                if ($.trim(_result.beans[0].webTypeCd) != '') {
                    $('#aor_Basnetclass', $el).val(_result.beans[0].webTypeCd);
                }
                if ($.trim(_result.beans[0].acptStaffBelgCityCode) != '') {
                    $('#aor_Basacccity', $el).val(_result.beans[0].acptStaffBelgCityCode);
                }
                if ($.trim(_result.beans[0].difcltFlag) != '') {
                    $('#aor_Basdif', $el).val(_result.beans[0].difcltFlag);
                }
                if ($.trim(_result.beans[0].upgdFlag) != '') {
                    $('#aor_Basemotion', $el).val(_result.beans[0].upgdFlag);
                }
                if ($.trim(_result.beans[0].cnctQuTypeCd) != '') {
                    $('#aor_Basallques', $el).val(_result.beans[0].cnctQuTypeCd);
                }
                if ($.trim(_result.beans[0].seqprcTmpltId) != '') {
                    $('#aor_Basmodule', $el).val(_result.beans[0].seqprcTmpltId);
                }
                if ($.trim(_result.beans[0].anonymorderflag) != '') {
                    $('#aor_Bashidename', $el).val(_result.beans[0].anonymorderflag);
                }
                //时间数据
                if ($.trim(_result.beans[0].joinNetTime) != '') {
                    $('input[name=joinNetTime]', $el).val(_result.beans[0].joinNetTime);
                }
                if ($.trim(_result.beans[0].expctFdbkTime) != '') {
                    $('input[name=expctFdbkTime]', $el).val(_result.beans[0].expctFdbkTime);
                }
                if ($.trim(_result.beans[0].acptTime) != '') {
                    $('input[name=acptTime]', $el).val(_result.beans[0].acptTime);
                }
                
              //受理号码归属地下拉框选中(后期可能删除)
                if ($.trim(_result.beans[0].numBelgCityCode) != '') {
                    $('#aor_Bastellocal', $el).val(_result.beans[0].numBelgCityCode);
                }
        	}
        },
        chairput: function() {
            $('#chairput', $el).on('click', function() {
                if ($('#basic_topchair li').hasClass('hide')) {
                    $('#basic_topchair .hide').removeClass('hide').addClass('show');
                } else {
                    $('#basic_topchair .show').removeClass('show').addClass('hide');
                }
            })
        },
        // 校验form表单数据有效性
        validateForm : function() {
            var config = {
                el: $('#aor_complainInfo'),
                dialog: true,
                // 是否弹出验证结果对话框
                rules: {
                	// 客户名字
                    userName: "required",
                    // 主叫号码
                    callingNum: "required|mobile",
                    // 受理号码
                    acptTelnum: "required|mobile",
                    // 受理号码归属地
                    numBelgCityCode: "required",
                    // 联系电话1
                    fstConcTelnum: 'required|mobile',
                    // 客户级别
                    userLvlCd: "required",
                    // 客户省份
                    custProvCode: "required",
                    // 客户地市
                    userBelgCityCode: "required",
                    
                    // 受理工号
                    acptStaffNum: "required",
                    // 受理方式
                    acptModeCd: "required",
                    // 受理渠道
                    cmplntsChnlCode: "required",
                    // 是否潜在升级
                    upgdFlag: "required",
                    // 受理部门
                    acptDeptId: "required",
                    // 跟进处理
                    trancehandle: "required",
                    // 网络类别
                    webTypeCd: "required",
                    // 受理地市
                    acptStaffBelgCityCode: "required",
                    // 下级县区
                    distrtCode: "required",
                    // 集中问题分类
                    cnctQuTypeCd: "required",
                    // 营业厅相关
                    busihllInfoDesc: "required",
                    // 投诉内容
                    srvReqstCntt: "required",
                    // 期望反馈时间
                    expctFdbkTime: "required",
                    //重复投诉次数
                    dplctCmplntsTmsCnt:"number" 
                },
                messages:{
                	userName:{
                        required:"客户姓名不能为空，请填写"
                    },
                    callingNum:{
                    	required:"来电号码不能为空，请填写"
                    },
                    acptTelnum:{
                    	required:"受理号码不能为空，请填写"
                    },
                    numBelgCityCode:{
                    	required:"受理号码归属地不能为空，请填写"
                    },
                    fstConcTelnum:{
                    	required:"联系电话1不能为空，请填写"
                    },
                    userLvlCd:{
                    	required:"客户级别不能为空，请填写"
                    },
                    custProvCode:{
                    	required:"客户省份不能为空，请填写"
                    },
                    userBelgCityCode:{
                    	required:"客户地市不能为空，请填写"
                    },
                    
                    acptStaffNum:{
                    	required:"受理工号不能为空，请填写"
                    },
                    acptModeCd:{
                    	required:"受理方式不能为空，请填写"
                    },
                    cmplntsChnlCode:{
                    	required:"受理渠道不能为空，请填写"
                    },
                    upgdFlag:{
                    	required:"是否潜在升级不能为空，请填写"
                    },
                    acptDeptId:{
                    	required:"受理部门不能为空，请填写"
                    },
                    trancehandle:{
                    	required:"跟进处理不能为空，请填写"
                    },
                    webTypeCd:{
                    	required:"网络类别不能为空，请填写"
                    },
                    acptStaffBelgCityCode:{
                    	required:"受理地市不能为空，请填写"
                    },
                    distrtCode:{
                    	required:"下级县区不能为空，请填写"
                    },
                    cnctQuTypeCd:{
                    	required:"集中问题分类不能为空，请填写"
                    },
                    busihllInfoDesc:{
                    	required:"营业厅相关不能为空，请填写"
                    },
                    srvReqstCntt:{
                    	required:"投诉内容不能为空，请填写"
                    },
                    expctFdbkTime:{
                    	required:"期望反馈时间不能为空，请填写"
                    }
                }
            };
            return new Validator(config);
        },
        getOrderInfo : function() {
        	if (_result.beans.length != 0) {
        		return _result.beans[0];
        	}else{
        		return null;
        	}
        }
    });
    return initialize;
});