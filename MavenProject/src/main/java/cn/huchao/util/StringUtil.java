package cn.huchao.util;

/**
 * @author huchao
 * @description
 * @date 2017年6月24日
 */
public class StringUtil {
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

	public static void main(String[] args) {
		String a = null;
		System.out.println(StringUtil.isNotEmpty(a));
		System.out.println(StringUtil.isEmpty(a));
		System.out.println(StringUtil.clearBlank(a));
	}

}
