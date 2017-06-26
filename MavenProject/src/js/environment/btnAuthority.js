define(['jquery','Util'],function($,Util) {
    //$el 为根dom，下面所有的遍历将控制在这个范围内
    //比如 $el内有按钮元素 <input type="button" value="button1" id="btn1" mo="998" /> 其中id和mo属性必须存在
    var btnAuthority = function($el){
        var $ = jQuery;
        //获取带有mo属性的按钮
        var mos = $el.find('[mo]');
        if (mos.length){
            var params = [];
            mos.each(function(){
                var _this = $(this);
                var tempVal = {
                    'mo':_this.attr('mo'),
                    'btnId':_this.attr('id')
                };

                params.push(tempVal);
            })
            if (params.length) {
                params = JSON.stringify(params);
                Util.ajax.postJson('/ngwf_he/front/sh/permcommon!checkPerm?uid=perm001',{'datas':params},function(json,status){
                    if (status) {
                        for(var i in json.beans){
                            //mo：1：有权限，0：无权限
                            var bean = json.beans[i];
                            if (bean){
                                if (bean['mo'] == '1') {
                                	$('#'+bean['btnId'], $el).show();
                                }else{
                                	$('#'+bean['btnId'], $el).hide();
                                }
                            }
                            
                        }
                    }
                })
            };
        }
        
    }
    return btnAuthority;
});
