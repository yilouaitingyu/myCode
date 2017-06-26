define(['Util','list','date','selectTree','select'],   
	function(Util,list,Date,selectTree,Select){
		var list;
		var initialize = function(){
		    	eventInit();
		    	
		       
		};		
		
		var eventInit=function(){
			$('#treeDemo_1_switch').on('click',treeDemo1Switch);//一级菜单我的收藏点击事件
			$('#treeDemo_2_switch').on('click',treeDemo2Switch);//二级菜单我的收藏点击事件
		};
		 var data = [
                     {
                         "name":"11111",       //下拉框文本
                         "value":"13612345611",  //下拉框值
                         "address":"郑州"      //基它值
                     },
                     {
                         "name":"22222",
                         "value":"13612342358",
                         "address":"郑州"
                     },
                     {
                         "name":"33333",
                         "value":"13612342358",
                         "address":"郑州"
                     },
                     {
                         "name":"44444",
                         "value":"13612342358",
                         "address":"郑州"
                     }
                 ];
		var config = {
			    el:'#cs_isvali',       //要绑定的容器
			    label:'是否可用：',     //下拉框单元左侧label文本
			    name:'wrSerbrand',    //下拉框单元右侧下拉框名称
			    datas: data    //数据源
		}
		var select = new Select(config);
		
		var csIshasnextConfig = {
			    el:'#cs_ishasnext',       //要绑定的容器
			    label:'是否有下级：',     //下拉框单元左侧label文本
			    name:'wrSerbrand',    //下拉框单元右侧下拉框名称
			    datas: data    //数据源
		}
		var cs_ishasnext = new Select(csIshasnextConfig);
		
		var csIsshowConfig = {
			    el:'#cs_isshow',       //要绑定的容器
			    label:'是否在热线建单页面显示：',     //下拉框单元左侧label文本
			    name:'wrSerbrand',    //下拉框单元右侧下拉框名称
			    datas: data    //数据源
		}
		var cs_isshow = new Select(csIsshowConfig);
		
		//一级菜单我的收藏点击事件
		var treeDemo1Switch = function(){
			if($('#treeDemo_1_ul').hasClass('hide')){
				$('#treeDemo_1_ul').addClass('show').removeClass('hide');
				$('#treeDemo_1_switch').addClass('roots_open').removeClass('roots_close');
			}else if($('#treeDemo_1_ul').hasClass('show')){
				$('#treeDemo_1_ul').addClass('hide').removeClass('show');
				$('#treeDemo_1_switch').addClass('roots_close').removeClass('roots_open');
			}
			
		};
		//二级菜单我的收藏点击事件
		var treeDemo2Switch = function(){
			if($('#treeDemo_2_ul').hasClass('hide')){
				$('#treeDemo_2_ul').addClass('show').removeClass('hide');
				$('#treeDemo_2_switch').addClass('center_open').removeClass('center_close');
			}else if($('#treeDemo_2_ul').hasClass('show')){
				$('#treeDemo_2_ul').addClass('hide').removeClass('show');
				$('#treeDemo_2_switch').addClass('center_close').removeClass('center_open');
			}
		};
		return initialize();
});