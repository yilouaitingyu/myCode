alert("dds3");
//model追加到html
var add_model =function (){
	$('#complaintype').on('focus',modal_box);
	var model_div="<div class=\"t-popup t-popup-layer hide\" id=\"modal\">"+
			"<div class=\"t-popup-overlay\"></div>"+
			"<div class=\"t-popup-container\">"+
			"	<div class=\"t-popup-title\">"+
			"		<h3 style=\"width:95%;height:30px;text-align:center;\">投诉类型查询</h3>"+
				"	<a  title=\"关闭\"  href=\"#nogo\" id=\"cancelx\">×</a>"+
			"	</div>"+
			"	<div class=\"t-popup-content\">"+
			"		<label class=\"coms\" for=\"comClass\">投诉类型:</label>"+
			"		<input type=\"text\" id=\"comClass\" name=\"comClass\" style=\"width:390px;height:25px;\">"+
			"		<a class=\"btn btn-dark bttn\"  id =\"complant_Search\">搜索</a>"+
			"		<div id=\"modal_b\" class=\"modals\">"+
			"		</div>"+
			"	</div>"+
			"	<div class=\"t-popup-bottom\">"+
			"	 <a href=\"#\" class=\"btn btn-blue\" id=\"aor_submit\">提交</a>"+
			"	 <a href=\"#nogo\" class=\"btn btn-blue\" id=\"cancels\">取消</a>"+
			"	</div>"+
			"</div>"+
		"</div> ";
	$(document.body).append(model_div); 
	
}