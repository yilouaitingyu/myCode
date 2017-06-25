package cn.huchao.util;

import java.util.Date;
import java.util.Random;

import cn.huchao.util.DateUtil.DATE_PATTERN;

/**
 * @author huchao
 * @2017年6月12日
 * @description 生成随机数的类
 */
public class RandomUtil {
	private final static Random rd = new Random();
	private static final String INT = "0123456789";
	private static final String STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	private static final String ALL = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	/** 私有构造器 **/
	private RandomUtil() {
	}
	/**
	 * @description 生成一个A-Z，a-z之间的随机字符串，如oUCMpeLZ
	 * @param length
	 * @return
	 * @2017年6月12日
	 * @author huchao
	 */
	public static String randomStr(int length) {
		return random(length, RndType.STRING);
	}

	/**
	 * @description 生成一个0-9之间的随机字符串，如1435455512
	 * @param length
	 * @return
	 * @2017年6月12日
	 * @author huchao
	 */
	public static String randomInt(int length) {
		return random(length, RndType.INT);
	}

	/**
	 * @description 生成一个0-9,A-Z,a-z之间的随机字符串，如9cWUNAd
	 * @param length
	 * @return
	 * @2017年6月12日
	 * @author huchao
	 */
	public static String randomAll(int length) {
		return random(length, RndType.ALL);
	}

	/**
	 * @description 返回指定随机数的流水号，格式为时间戳加指定位数随机数
	 * @param length
	 * @return
	 * @2017年6月12日
	 * @author huchao
	 */
	public static String getTransNum(int length) {
		String date2String = DateUtil.date2String(new Date(), DATE_PATTERN.YYYYMMDDHHMMSS);
		StringBuilder stb = new StringBuilder(date2String);
		stb.append(randomInt(length));
		return stb.toString();
	}

	/**
	 * 
	 * @param length，随机数的长度，随机数的种类，如数字，字母，数字字母混合all
	 * @param rndType
	 * @return
	 */
	private static String random(int length, RndType rndType) {
		StringBuilder s = new StringBuilder();
		char num = 0;
		for (int i = 0; i < length; i++) {
			if (rndType.equals(RndType.INT))
				num = INT.charAt(rd.nextInt(INT.length()));// 产生数字0-9的随机数
			else if (rndType.equals(RndType.STRING))
				num = STR.charAt(rd.nextInt(STR.length()));// 产生字母a-z的随机数
			else {
				num = ALL.charAt(rd.nextInt(ALL.length()));
			}
			s.append(num);
		}
		return s.toString();
	}

	public static enum RndType {
		INT, STRING, ALL
	}

	public static void main(String[] args) {
		System.out.println(RandomUtil.randomInt(10));
		System.out.println(RandomUtil.randomStr(8));
		System.out.println(RandomUtil.randomAll(7));

	}
}
