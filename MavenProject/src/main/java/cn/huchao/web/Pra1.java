package cn.huchao.web;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author huchao
 * @description 测试方法的类、练习类
 */
public class Pra1 {
	static Logger logger = LoggerFactory.getLogger(Pra1.class);

	@Test
	public void function1() {
		logger.debug("我的世界");
		
		System.out.println("号楼");
	}
	public static void doId(){
		logger.info("天天");
	}
	public static void main(String[] args) {
		logger.info("haha");
	}
}
