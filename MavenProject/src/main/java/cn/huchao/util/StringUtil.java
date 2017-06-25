package cn.huchao.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author huchao
 * @description
 * @date 2017年6月24日
 */
public class StringUtil {
	/** 私有构造器 **/
	private StringUtil() {
	}

	/**
	 * 判断传入的是否为空字符串，当为null和""时，返回true
	 * 
	 * @author huchao
	 * @param obj
	 * @return
	 */
	public static boolean isEmpty(Object obj) {
		if (null == obj) {
			return true;
		} else {
			if ("".equals(obj.toString().trim())) {
				return true;
			} else {
				return false;
			}
		}
	}

	/**
	 * 判断传入的是否为空字符串，当为null和""时，返回false
	 * 
	 * @author huchao
	 * @param obj
	 * @return
	 */
	public static boolean isNotEmpty(Object obj) {
		if (null == obj) {
			return false;
		} else {
			if ("".equals(obj.toString().trim())) {
				return false;
			} else {
				return true;
			}
		}
	}

	/**
	 * 去掉传入参数的前后空格，当为null时，返回空字符串
	 * 
	 * @author huchao
	 * @param obj
	 * @return
	 */
	public static String clearBlank(Object obj) {
		if (null == obj) {
			return "";
		} else {
			return obj.toString().trim();
		}
	}

	/**
	 * 判断一个字符串是不是手机号
	 * 
	 * @author huchao
	 * @param phone
	 * @return
	 */
	public static boolean isMobilePhone(String phone) {
		if (null == phone) {
			return false;
		} else {
			Pattern p = Pattern.compile("^((13[0-9])|(15[^4,\\D])|(18[0-9]))\\d{8}$");
			Matcher m = p.matcher(phone);
			return m.matches();
		}
	}

	public static void main(String[] args) {
		String a = "18239639432   ";
		System.out.println(StringUtil.isNotEmpty(a));
		System.out.println(StringUtil.isEmpty(a));
		System.out.println(StringUtil.clearBlank(a));
		System.out.println(StringUtil.isMobilePhone(a));
	}

}
