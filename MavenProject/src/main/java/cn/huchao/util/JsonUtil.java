package cn.huchao.util;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
/**
 * json转换工具类
 * @author huchao
 *	@description
 * @date 2017年6月25日
 */
public class JsonUtil {
	private static ObjectMapper objectMapper = new ObjectMapper();
	private static final Logger logger = LoggerFactory.getLogger(JsonUtil.class);
	static {
		objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
	}

	/** 私有构造器 **/
	private JsonUtil() {
	}

	/**
	 * 将Object对象转换成Json
	 * 
	 * @param object
	 *            Object对象
	 * @return Json字符串
	 */
	public static String convertObject2Json(Object object) {
		try {
			return objectMapper.writeValueAsString(object);
		} catch (Exception e) {
			logger.error("Object转换成json错误", e);
		}
		return null;
	}

	/**
	 * 将Json转换成Object对象
	 * 
	 * @param json
	 *            Json字符串
	 * @param cls
	 *            转换成的对象类型
	 * @return 转换之后的对象
	 */
	public static <T> T convertJson2Object(String json, Class<T> cls) {
		try {
			return objectMapper.readValue(json, cls);
		} catch (Exception e) {
			logger.error("json转换成Object错误", e);
		}
		return null;
	}

	/**
	 * 将Json转换成List<Object>对象
	 * 
	 * @param <T>
	 * 
	 * @param json
	 *            Json字符串
	 * @param cls
	 *            转换成的对象类型
	 * @return 转换之后的对象
	 */
	public static <T> List<T> convertJson2ListObject(String json, Class<T> cls) {
		try {
			return objectMapper.readValue(json, objectMapper.getTypeFactory().constructCollectionType(List.class, cls));
		} catch (Exception e) {
			logger.error("json转换成List<T>错误", e);
		}
		return null;
	}

	public static void main(String[] args) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("1", "a");
		map.put("3", "c");
		map.put("2", "b");
		String str = JsonUtil.convertObject2Json(map);
		System.out.println(str);
		String str1 ="{\"3\":\"c\",\"2\":\"b\",\"1\":\"a\"}";
		Map map2 = JsonUtil.convertJson2Object(str1, Map.class);
		System.out.println(map2);
	}
}
