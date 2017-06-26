define(['crossAPI','Util', 'timer', 'validator', 'simpleTree', 'selectTree', 'date', 'indexLoad', "detailPanel", "hdb", 'text!module/workflow/oneservicecomplain/basicMessage.html', 'style!css/workflow/oneservicecompain/basicMessage.css'],
function(CrossAPI,Util, Timer, Validator, SimpleTree, SelectTree, Mydate, IndexLoad, DetailPanel, Hdb, Html_basicMessage) {
    var $el;
    var _index;
    var _options;
    var _result;
    var _orderInfo;
    //一级客服投诉
    var initialize = function(index, options) {
        $el = $(Html_basicMessage);
        _index = index;
        _options = options;
        this.pageInit();
        this.content =$el;
    };
    
    $.extend(initialize.prototype, {
        pageInit: function() {
            //加载顺序（时间组件初始化、数据字典记载、默认值选中、表单数据填充）
        	//表单数据填充
            this.formDataInit(); 
        	//数据字典加载
            this.dictionaryInit();
            //字段显示和隐藏点击事件
            this.chairput();
            //时间组件初始化
            this.dateInit();
            //默认值选中(省份和城市、下拉框、时间数据)
            this.setDefaultVal();
            
            this.checkSameComplainTms();
        },
        formDataInit: function() {
        	// 注册一个Handlebars模版，通过id找到某一个模版，获取模版的html框架
            var myTemplate = Hdb.compile($("#aor_template", $el).html());
        	if(_options.srInfo == '' || typeof(_options.srInfo) == 'undefined'){
        		$('#aor_form', $el).html(myTemplate({}));
        	}else{
        		$('#aor_form', $el).html(myTemplate(_options.srInfo));
        	}
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
            //入网时间
            var dateagain = new Mydate({
                el: $('#aor_Secgonettime', $el),
                label: '入网时间：',
                name: 'joinNetTime',
                //开始日期文本框name
                format: 'YYYY-MM-DD hh:mm:ss',
                //日期格式
                defaultValue: '',
                //默认日期值
                max: '2099-06-16 23:59:55',
                istime: true,
                istoday: false,
                choose: function() {}
            });
            //期待反馈时间添加class:necessary;
            $('#aor_Basbacktime label', $el).addClass("necessary");

        },
        //	      动态获取下拉框
        loadDictionary: function(mothedName, dicName, seleId) {
            var params = {
                method: mothedName,
                paramDatas: '{typeId:"' + dicName + '"}'
            };
            var seleOptions = "<option value=''>请选择</option>";
            Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF', params, function(result) {
                $.each(result.beans, function(index, bean) {
                    seleOptions += "<option value='" + bean.value + "'>" + bean.name + "</option>";
                });
                $('#' + seleId, $el).append(seleOptions);
            },
            true);
        },
        dictionaryInit: function() {
            this.loadDictionary('staticDictionary_get', 'CSP.PUB.PROVINCE', 'aor_Basserpri'); //省份信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.CITY', 'aor_Bassercity'); //客户地市信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.DIC.ACCEPTMODE', 'aor_Basaccway'); //受理方式信息
            this.loadDictionary('staticDictionary_get', 'ECP.PUB.USERBRAND', 'aor_Basbrand'); //客户品牌信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.LEVEL', 'aor_Basrange'); //客级别信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.SEND.TYPE', 'aor_Seccommit'); //提交方式信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.TEL.TYPE', 'aor_Secconcattel'); //联系方式信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.EDUCATION.TYPE', 'aor_Bassosrange'); //紧急程度信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.FOLLOW.HANDLE', 'aor_Basfollow'); //跟进处理信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.COMPLAIN.METHOD', 'aor_Basaskway'); //投诉途径信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.NET.TYPE', 'aor_Basnetclass'); //网络类型
            this.loadDictionary('staticDictionary_get', 'HEBEI.ACCEPT.CITY', 'aor_Basacccity'); //受理地址
            this.loadDictionary('staticDictionary_get', 'HEBEI.QUESTION.TYPE', 'aor_Basallques'); //集中问题分类信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'aor_Basdif');//是否疑难投诉
            this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'aor_Secisrep');//是否重复投诉
            this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'aor_Basemotion');//是否潜在升级
            this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'aor_Bashidename');//是否匿名
            this.loadDictionary('staticDictionary_get', 'HEBEI.ORDER.MODEL', 'aor_Basmodule');//工单套用模板
            this.loadDictionary('staticDictionary_get', 'HEBEI.WF.ORDER.TYPE', 'wrkfmTypeCd');//业务类型信息
            this.loadDictionary('staticDictionary_get', 'HEBEI.DIC.USERLEVEL', 'aor_Basstars');//客户星级
        },
        //设置省份和市区的默认字段
        setDefaultVal: function() {
        	//工单编号
            if(_options.serialno!=null){
            	$("#wrkfmShowSwftno", $el).val(_options.serialno);
            }
            if(_options.srInfo == '' || typeof(_options.srInfo) == 'undefined'){
        		//获取来电号码
                _index.getContact("getPhoneNum", function(callerNo) {
                	$("#aor_Basapltel", $el).val(callerNo);
                	//默认受理号码和来电号码一致
                	$("#aor_basaccepttelnum", $el).val(callerNo);
                	var params = {
                    	srvReqstTypeId: $("#bizTypeId").val(),
                    	acptTelnum: $("#aor_basaccepttelnum", $el).val()
                    };
                    Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=querySameComplainTms', params, function(result) {
                    	var bean=result.bean;
                    	$('#aor_Secrepcount').val(bean.dplctCmplntsTmsCnt);
                    	if(bean.dplctCmplntsTmsCnt > 0){
                    		$("#aor_Secisrep").val(1);
                    	}else{
                    		$("#aor_Secisrep").val(0);
                    	}
                    });
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
        		//受理部门名称
        		var deptId=$("#acptDeptId", $el).val();
        		if(deptId!=''){
        			Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryDeptInfoByDeptId', {'deptId':deptId}, function(result) {
                    	$("#aor_Baseaccedoor", $el).val(result.bean.deptName);
                    });
        		}
                //受理号码归属地名称
                var numBelgCityCode=$("#numBelgCityCode", $el).val();
                if(numBelgCityCode!=''){
                	Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryNumBelgCityBySId', {'sId':numBelgCityCode}, function(result) {
                		$("#aor_Bastellocal", $el).val(result.beans[0].fullName)
                    });
                }
                //问题发生地地址名称
                var quHapnAddr=$("#quHapnAddr", $el).val();
                if(quHapnAddr!=''){
                    Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryHappenPlace', {'id':quHapnAddr}, function(result) {
                    	$("#aor_Basqueshappend", $el).val(result.beans[0].fullName)
                    });
                }
        		//下拉框选中
                if ($.trim(_options.srInfo.custStargrdCd) != '') {
                	$('#aor_Basstars', $el).val(_options.srInfo.custStargrdCd);
                }
            	if ($.trim(_options.srInfo.userBrandCode) != '') {
                    $('#aor_Basbrand', $el).val(_options.srInfo.userBrandCode);
                }
                if ($.trim(_options.srInfo.userLvlCd) != '') {
                    $('#aor_Basrange', $el).val(_options.srInfo.userLvlCd);
                }
                if ($.trim(_options.srInfo.acptModeCd) != '') {
                    $('#aor_Basaccway', $el).val(_options.srInfo.acptModeCd);
                }
                if ($.trim(_options.srInfo.custProvCode) != '') {
                    $('#aor_Basserpri', $el).val(_options.srInfo.custProvCode);
                }
                if ($.trim(_options.srInfo.userBelgCityCode) != '') {
                    $('#aor_Bassercity', $el).val(_options.srInfo.userBelgCityCode);
                }
                if ($.trim(_options.srInfo.cntwayCd) != '') {
                    $('#aor_Secconcattel', $el).val(_options.srInfo.cntwayCd);
                }
                if ($.trim(_options.srInfo.surfnetmode) != '') {
                    $('#aor_Secgonetway', $el).val(_options.srInfo.surfnetmode);
                }
                if ($.trim(_options.srInfo.sbmtModeCd) != '') {
                    $('#aor_Seccommit', $el).val(_options.srInfo.sbmtModeCd);
                }
                if ($.trim(_options.srInfo.sameCmplntsFlag) != '') {
                    $('#aor_Secisrep', $el).val(_options.srInfo.sameCmplntsFlag);
                }
                if ($.trim(_options.srInfo.urgntExtentId) != '') {
                    $('#aor_Bassosrange', $el).val(_options.srInfo.urgntExtentId);
                }
                if ($.trim(_options.srInfo.trancehandle) != '') {
                    $('#aor_Basfollow', $el).val(_options.srInfo.trancehandle);
                }
                if ($.trim(_options.srInfo.cmplntsChnlCode) != '') {
                    $('#aor_Basaskway', $el).val(_options.srInfo.cmplntsChnlCode);
                }
                if ($.trim(_options.srInfo.webTypeCd) != '') {
                    $('#aor_Basnetclass', $el).val(_options.srInfo.webTypeCd);
                }
                if ($.trim(_options.srInfo.acptStaffBelgCityCode) != '') {
                    $('#aor_Basacccity', $el).val(_options.srInfo.acptStaffBelgCityCode);
                }
                if ($.trim(_options.srInfo.difcltFlag) != '') {
                    $('#aor_Basdif', $el).val(_options.srInfo.difcltFlag);
                }
                if ($.trim(_options.srInfo.upgdFlag) != '') {
                    $('#aor_Basemotion', $el).val(_options.srInfo.upgdFlag);
                }
                if ($.trim(_options.srInfo.cnctQuTypeCd) != '') {
                    $('#aor_Basallques', $el).val(_options.srInfo.cnctQuTypeCd);
                }
                if ($.trim(_options.srInfo.seqprcTmpltId) != '') {
                    $('#aor_Basmodule', $el).val(_options.srInfo.seqprcTmpltId);
                }
                if ($.trim(_options.srInfo.anonymorderflag) != '') {
                    $('#aor_Bashidename', $el).val(_options.srInfo.anonymorderflag);
                }
                //时间数据
                if ($.trim(_options.srInfo.joinNetTime) != '') {
                    $('input[name=joinNetTime]', $el).val(_options.srInfo.joinNetTime);
                }
                if ($.trim(_options.srInfo.expctFdbkTime) != '') {
                    $('input[name=expctFdbkTime]', $el).val(_options.srInfo.expctFdbkTime);
                }
                if ($.trim(_options.srInfo.acptTime) != '') {
                    $('input[name=acptTime]', $el).val(_options.srInfo.acptTime);
                }
        	}
        },
        chairput: function() {
            $('#chairput', $el).on('click', function() {
                if ($('#basic_topchair li').hasClass('hide')) {
                    $('#basic_topchair .hide').removeClass('hide').addClass('show');
                    $('#chairput .icon-212102').addClass('icon-2121021').removeClass('icon-212102');
                } else {
                    $('#basic_topchair .show').removeClass('show').addClass('hide');
                    $('#chairput .icon-2121021').addClass('icon-212102').removeClass('icon-2121021');
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
                    numBelgCityName: "required",
                    // 联系电话1
                    fstConcTelnum: 'required|mobile',
                    //联系电话2
                    secdConcTelnum: 'mobile',
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
                    numBelgCityName:{
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
        //查询重复投诉次数并刷新页面字段
        checkSameComplainTms : function(){
        	$("#aor_basaccepttelnum",$el).blur(function(){
        		//进行一次受理手机号码校验
        		if (!$("#aor_basaccepttelnum",$el).val().match(/^1[34578]\d{9}$/)) { 
        			CrossAPI.tips("受理号码格式不正确！请重新填写",3000);
        			return false;
        		}
        		var params = {
                	srvReqstTypeId: $("#bizTypeId").val(),
                	acptTelnum: $("#aor_basaccepttelnum", $el).val()
                };
                Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=querySameComplainTms', params, function(result) {
                	var bean=result.bean;
                	if(bean.dplctCmplntsTmsCnt > 0){
                		var flag=confirm("此受理号码重复投诉，是否标记为重复投诉？");
                		if(flag){
                			$('#aor_Secrepcount',$el).val(bean.dplctCmplntsTmsCnt);
                    		$('#aor_Secisrep',$el).val(1);
                		}else{
                			$('#aor_Secrepcount',$el).val(0);
                    		$('#aor_Secisrep',$el).val(0);
                		}
                	}else{
                		$('#aor_Secrepcount',$el).val(0);
                		$('#aor_Secisrep',$el).val(0);
                	}
                });
        	});
        }
    });
    return initialize;
});