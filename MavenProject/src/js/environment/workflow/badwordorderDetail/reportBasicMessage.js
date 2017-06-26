define(['Util', 'timer', 'validator', 'select', 'selectTree', 'date', 'indexLoad', "detailPanel", "hdb", 'text!module/workflow/badwordorderDetail/reportBasicMessage.html', 'style!css/workflow/oneservicecompain/basicMessage.css'],
function(Util, Timer, Validator, Select, SelectTree, Date, IndexLoad, DetailPanel, Hdb, Html_basicMessage) {
    var $el;    
    var _index;
    var _options;
    var _result;
    var initialize = function(index, options) {
        $el = $(Html_basicMessage);
        _index = index;
        _options = options;
        this.dateInit();
       formInit.call(this, $el);
       this.eventInit();
        this.content = $el;
    };
    var formInit = function() {
        var params = {
        		serialno: _options.serialno
        };
        
        Util.ajax.postJson('/ngwf_he/front/sh/workflow!execute?uid=queryReportInfoById', params,
        function(result) {
            _result = result;
            // 注册一个Handlebars模版，通过id找到某一个模版，获取模版的html框架
            var myTemplate = Hdb.compile($("#aor_form", $el).html());
            // 将json对象用刚刚注册的Handlebars模版封装，得到最终的html，插入到基础table中。
            if (result.beans.length != 0) {
                $('#aor_form', $el).html(myTemplate(result.beans[0]));
                 
                if ($.trim(result.beans[0].compltObjTypeCd) != '') {
                    $('#compltObjTypeCd', $el).val(result.beans[0].compltObjTypeCd);
                }
                if ($.trim(result.beans[0].userBelgCityCode) != '') {
                    $('#userBelgCityCode', $el).val(result.beans[0].userBelgCityCode);
                }
                if ($.trim(result.beans[0].userBelgCityCode) != '') {
                    $('#compltCnttTypeNm', $el).val(result.beans[0].compltCnttTypeNm);
                }
                if ($.trim(result.beans[0].custProvCode) != '') {
                    $('#custProvCode', $el).val(result.beans[0].custProvCode);
                }
                if ($.trim(result.beans[0].acptNumBelgCityCode) != '') {
                    $('#acptNumBelgCityCode', $el).val(result.beans[0].acptNumBelgCityCode);
                }
                if ($.trim(result.beans[0].custBrandCode) != '') {
                    $('#custBrandCode', $el).val(result.beans[0].custBrandCode);
                }
                if ($.trim(result.beans[0].custLvlCd) != '') {
                    $('#custLvlCd', $el).val(result.beans[0].custLvlCd);
                }
                if ($.trim(result.beans[0].CompltWayCd) != '') {
                    $('#CompltWayCd', $el).val(result.beans[0].CompltWayCd);
                }
                if ($.trim(result.beans[0].UrgntExtentCd) != '') {
                    $('#UrgntExtentCd', $el).val(result.beans[0].UrgntExtentCd);
                }
                if ($.trim(result.beans[0].userBelgCityCode) != '') {
                	//黑白名单
                    $('#userBelgCityCode', $el).val(result.beans[0].userBelgCityCode);
                }
                if ($.trim(result.beans[0].needRevstFlag) != '') {
                    $('#isCallBack', $el).val(result.beans[0].needRevstFlag);
                }
                if ($.trim(result.beans[0].acptNumBelgCityCode) != '') {
                    $('#acptNumBelgCityCode', $el).val(result.beans[0].acptNumBelgCityCode);
                }
                if ($.trim(result.beans[0].byCompltNumBrandCode) != '') {
                    $('#byCompltNumBrandCode', $el).val(result.beans[0].byCompltNumBrandCode);
                }
                if ($.trim(result.beans[0].byCompltCustLvlCd) != '') {
                    $('#byCompltCustLvlCd', $el).val(result.beans[0].byCompltCustLvlCd);
                }
                if ($.trim(result.beans[0].byCompltNumBlegProvCode) != '') {
                    $('#byCompltNumBlegProvCode', $el).val(result.beans[0].byCompltNumBlegProvCode);
                }
                if ($.trim(result.beans[0].byCompltNumBelgCityCode) != '') {
                    $('#byCompltNumBelgCityCode', $el).val(result.beans[0].byCompltNumBelgCityCode);
                }
                if ($.trim(result.beans[0].byCompltNumClsdnStsCd) != '') {
                    $('#byCompltNumClsdnStsCd', $el).val(result.beans[0].byCompltNumClsdnStsCd);
                }
                if ($.trim(result.beans[0].byCompltSmsStsCd) != '') {
                    $('#byCompltSmsStsCd', $el).val(result.beans[0].byCompltSmsStsCd);
                }
                if ($.trim(result.beans[0].byCompltMmsStsCd) != '') {
                    $('#byCompltMmsStsCd', $el).val(result.beans[0].byCompltMmsStsCd);
                }
                if ($.trim(result.beans[0].byCompltOtherBizCnspFlag) != '') {
                    $('#byCompltOtherBizCnspFlag', $el).val(result.beans[0].byCompltOtherBizCnspFlag);
                }
                if ($.trim(result.beans[0].byCompltNumRlnMsysFlag) != '') {
                    $('#byCompltNumRlnMsysFlag', $el).val(result.beans[0].byCompltNumRlnMsysFlag);
                }
                if ($.trim(result.beans[0].allOrLocal) != '') {
                    $('#allOrLocal', $el).val(result.beans[0].allOrLocal);
                }
                if ($.trim(result.beans[0].dplctCompltFlag) != '') {
                    $('#dplctCompltFlag', $el).val(result.beans[0].dplctCompltFlag);
                }
                
                if ($.trim(result.beans[0].dspsOpinDesc) != '') {
                    $('#dspsOpinDesc', $el).val(result.beans[0].dspsOpinDesc);
                }
                if ($.trim(result.beans[0].blstFlag) != '') {
                    $('#blstFlag', $el).val(result.beans[0].blstFlag);
                }
                if ($.trim(result.beans[0].blstFlag) != '') {
                    $('#blstFlag', $el).val(result.beans[0].blstFlag);
                }
                if ($.trim(result.beans[0].blstFlag) != '') {
                    $('#blstFlag', $el).val(result.beans[0].blstFlag);
                }
                if ($.trim(result.beans[0].compltObjTypeCd) != '') {
                    $('#compltObjTypeCd', $el).val(result.beans[0].compltObjTypeCd);
                }
                if ($.trim(result.beans[0].compltTypeCd) != '') {
                    $('#compltTypeCd', $el).val(result.beans[0].compltTypeCd);
                }                
                if ($.trim(result.beans[0].compltCnttTypeNm) != '') {
                    $('#compltCnttTypeNm', $el).val(result.beans[0].compltCnttTypeNm);
                }               
                
            } else {
                $('#aor_form', $el).html(myTemplate());
            }
        },
        true);
    };
    $.extend(initialize.prototype, {
        eventInit: function() {
            
        },
        //入网时间
        netTime: function() {
            var dateagain = new Date({
                el: $('#aor_Secgonettime', $el),
                label: '入网时间',
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
        },

        //	      动态获取下拉框
        loadDictionary: function(mothedName, dicName, seleId) {
            var params = {
                method: mothedName,
                paramDatas: '{typeId:"' + dicName + '"}'
            };
            var seleOptions = "<option value=''>请选择</option>";
            // 
            Util.ajax.postJson('/ngwf_he/front/sh/common!execute?uid=callCSF', params, function(result) {
                $.each(result.beans, function(index, bean) {
                    seleOptions += "<option value='" + bean.value + "'>" + bean.name + "</option>"
                });
                $('#' + seleId, $el).append(seleOptions);
            },
            true);
        },
        dateInit: function() {
        	var _this=this;
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.TRASH.QUESTIONTYPE','compltObjTypeCd');// 加载举报对象类型			
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.WF.TRASH.COMPLT_TYPE','compltTypeCd');// 加载举报分类	
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.TRASH.CONTENTTYPE','comppltCnttTypeNm');// 加载内容分类	
        	_this.loadDictionary('staticDictionary_get', 'CSP.PUB.PROVINCE', 'custProvCode'); //加载省份信息
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.CITY', 'acptNumBelgCityCode'); //加载客户地市信息
        	_this.loadDictionary('staticDictionary_get', 'HEIBEI.DIC.CUST.BRAND', 'custBrandCode'); //加载客户品牌信息
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.LEVEL', 'custLvlCd'); //加载客级别信息           
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.EDUCATION.TYPE', 'urgntExtentCd'); //加载紧急程度信息      
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.BADWORK.CHANNEL', 'compltWayCd');//举报途径
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.BADWORD.ROLLCALL', 'blstFlag');//黑白名单
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'needRevstFlag');//是否要求电话回复
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.BADWORK.SHORTMESSAGE', 'byCompltSmsStsCd');//短信功能
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.EDUCATION.TYPE', 'byCompltMmsStsCd');//彩信功能
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'byCompltOtherBizCnspFlag');//其他业务是否消费
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'byCompltNumRlnMsysFlag');//是否实名制
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.BADWORK.LOCALNETWORK', 'allOrLocal');//全网/本地
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.BADWORK.ISSTOP', 'byCompltNumClsdnStsCd');//停机状态
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'dplctCompltFlag');//是否重复举报
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.OR.COMMON', 'preDspsQualFlag')//预处理情况是否合格
        	_this.loadDictionary('staticDictionary_get', 'CSP.PUB.PROVINCE', 'byCompltNumBlegProvCode'); //举报省份信息
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.CITY', 'byCompltNumBelgCityCode'); //举报客户地市信息
        	_this.loadDictionary('staticDictionary_get', 'HEIBEI.DIC.CUST.BRAND', 'byCompltNumBrandCode'); //加载客户品牌信息
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.CUSTOM.LEVEL', 'byCompltCustLvlCd'); //加载客级别信息           	
        	_this.loadDictionary('staticDictionary_get', 'HEBEI.TRASH.CONTENTTYPE', 'compltCnttTypeNm');//不良工单内容分类
        },
        timeDateInit: function() {
            if (_result.beans.length != 0) {
                if ($.trim(_result.beans[0].innettime) != '') {
                    $('input[name=innettime]', $el).val(_result.beans[0].innettime);
                }
                if ($.trim(_result.beans[0].expectedfeedbacktime) != '') {
                    $('input[name=expectedfeedbacktime]', $el).val(_result.beans[0].expectedfeedbacktime);
                }
            }
        },
        chairput: function(){
        	$('#chairput',$el).on('click',function(){
        		if($('#basic_topchair li').hasClass('hide')){
        			$('#basic_topchair .hide').removeClass('hide').addClass('show');
        		}else{
        			$('#basic_topchair .show').removeClass('show').addClass('hide');
        		}
        	})
        },
        chairputnext: function(){
        	$('#nextchairputclick',$el).on('click',function(){
        		if($('#nextchairput li').hasClass('hide')){
        			$('#nextchairput .hide').removeClass('hide').addClass('show');
        		}else{
        			$('#nextchairput .show').removeClass('show').addClass('hide');
        		}
        	})
        },
        
        
    });
    
    
    
    return initialize;
});