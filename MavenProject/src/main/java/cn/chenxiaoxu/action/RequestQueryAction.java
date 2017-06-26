package com.cmos.ngwf.action.serviceReq;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import com.cmos.core.bean.InputObject;
import com.cmos.core.bean.OutputObject;
import com.cmos.core.logger.Logger;
import com.cmos.core.logger.LoggerFactory;
import com.cmos.ngwf.action.BaseAction;
import com.cmos.ngwf.bean.ExportRequestQueryCols;
/**
 * <请求查询action>
 * @author yWX415655
 * @date   2017-3-30
 */
public class RequestQueryAction extends BaseAction{

	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getActionLog(RequestQueryAction.class);
	/**
	 * <导出请求查询数据>
	 */
	public void exportDatas(){
		OutputObject outputObject = super.getOutputObject();
		List<Map<String,Object>> listBeans=outputObject.getBeans();
		Map<String,String> cloMap0=ExportRequestQueryCols.getAllCloums();//此map为了找对应关系
		InputObject input=super.getInputObject();
		String cols=input.getValue("cols");
		String [] arr=cols.split(",");
		
		
		HttpServletRequest request = super.getRequest();
		HttpServletResponse response = super.getResponse();
		String filename="请求查询导出数据";
		//OpreateExcelByPOI.exportToExcel(request, response, listBeans, cloMap, filename);
		final String userAgent = request.getHeader("USER-AGENT"); 
		String name="";
		try {
		    if(userAgent.contains("MSIE")||userAgent.contains("Trident")){ //IE浏览器  
				name = URLEncoder.encode(filename,"UTF-8");
				name = StringUtils.replace(name, "+", "%20");//替换空格
		    }else if(userAgent.contains("Mozilla")){    
		    	name = new String(filename.getBytes("UTF-8"), "ISO8859-1");  
		    }else{                                                 
		    	name = URLEncoder.encode(filename,"UTF-8"); 
		    	name = StringUtils.replace(name, "+", "%20");
		    } 
		} catch (UnsupportedEncodingException e) {
			LOGGER.info("编码异常！",e);
		}
		response.setContentType("application/vnd.ms-excel;charset=utf-8");
		response.setHeader("Content-disposition", "attachment; filename="+name+".xls");
		HSSFWorkbook wb = new HSSFWorkbook();
		HSSFSheet  sheet = wb.createSheet(filename);//打开后shee名和文件名一至
		HSSFRow row1=sheet.createRow(0);
		//用来存储表头每列的列宽
		int[] colspan = new int[arr.length];
		//设置excel表头
		for(int i=0;i<arr.length;i++){
			HSSFCell cell = row1.createCell(i);
			cell.setCellValue(cloMap0.get(arr[i]));
			//将前台传过来的列名，转化字节长度为列宽（前台有顺序）
			colspan[i] = (cloMap0.get(arr[i]).getBytes().length+1)*256;
		}
	    // 字符串是否与正则表达式相匹配
		for(int i=0;i<listBeans.size();i++){
			HSSFRow dataRow = sheet.createRow(i+1);
			for(int j=0;j<arr.length;j++){
				HSSFCell cell = dataRow.createCell(j);
				String val = String.valueOf((listBeans.get(i).get(arr[j])==null || "undefined".equals(listBeans.get(i).get(arr[j])))?"":listBeans.get(i).get(arr[j]));
				//单个表格数据长度作为列宽
				int cellWidth = (val.getBytes().length+1)*256;//长一个字节显示好看些
				//如果宽度比表头大就用数据的长度作为列宽，如果没有就用表头的列宽
				colspan[j] = cellWidth > colspan[j] ? cellWidth : colspan[j];
				cell.setCellValue(val);
			}
		}
		for(int i=0;i<colspan.length;i++){
			sheet.setColumnWidth(i, colspan[i]);
		}
		/*for(int i=0;i<arr2.length;i++){
			if(cloMap.containsKey(arr2[i])){
				row1.createCell(li).setCellValue(cloMap.get(arr2[i]));
				li++;
			}
		}
		for(int i=0;i<listBeans.size();i++){//控制行
			int col=0;
			HSSFRow row2=sheet.createRow(i+1);
			for(int p=0;p<arr2.length;p++){//控制列
				if(cloMap.containsKey(arr2[p])){
					//sheet.autoSizeColumn(p);
					row2.createCell(col).setCellValue((listBeans.get(i).get(arr2[p])== null || "undefined".equals(listBeans.get(i).get(arr2[p]))) ? "":String.valueOf(listBeans.get(i).get(arr2[p])));
					col++;
				}
			}
		}*/
		OutputStream out;
		try {
			out=response.getOutputStream();
			out.flush();
			wb.write(out);
			out.close();
		} catch (IOException e) {
			LOGGER.info("输出文件流异常！",e);
		}
		LOGGER.info("DayReqAction.exportDatas导出成功！");
	}
}
