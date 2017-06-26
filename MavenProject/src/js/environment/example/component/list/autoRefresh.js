
define(['Util', 'text!module/example/component/list/autoRefresh.tpl'],
    function(Util, tpl){

    var $el = null, template = Util.hdb.compile(tpl);
    var initialize = function(options){
        this.options = options;
        
        $el = $(template({}));
        $el.on('click','.btn',function(){
            console.log('you click the save button.');
        });
        this.content = $el;
    };

    return initialize;
});


