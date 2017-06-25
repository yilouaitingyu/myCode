package cn.huchao.util;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 加密和解密的工具类
 * 
 * @author huchao
 * @description
 * @date 2017年6月25日
 */
public class EncryptionUtil {
	private static final Logger logger = LoggerFactory.getLogger(HttpUtil.class);
	private static final String ALGORITHM = "DES";

	private EncryptionUtil() {
	}

	/**
	 * Get Des Key
	 * 
	 * @throws NoSuchAlgorithmException
	 */
	public static byte[] getKey() throws NoSuchAlgorithmException {
		KeyGenerator keygen = KeyGenerator.getInstance(ALGORITHM);
		SecretKey deskey = keygen.generateKey();
		return deskey.getEncoded();
	}

	/**
	 * Encrypt Messages
	 * 
	 * @throws NoSuchPaddingException
	 * @throws NoSuchAlgorithmException
	 * @throws InvalidKeyException
	 * @throws BadPaddingException
	 * @throws IllegalBlockSizeException
	 */
	public static byte[] encode(byte[] input, byte[] key) throws NoSuchAlgorithmException, NoSuchPaddingException,
			InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
		SecretKey deskey = new javax.crypto.spec.SecretKeySpec(key, ALGORITHM);
		Cipher c1 = Cipher.getInstance(ALGORITHM);
		c1.init(Cipher.ENCRYPT_MODE, deskey);
		return c1.doFinal(input);
	}

	/**
	 * Decrypt Messages
	 * 
	 * @throws NoSuchPaddingException
	 * @throws NoSuchAlgorithmException
	 * @throws InvalidKeyException
	 * @throws BadPaddingException
	 * @throws IllegalBlockSizeException
	 */
	public static byte[] decode(byte[] input, byte[] key) throws NoSuchAlgorithmException, NoSuchPaddingException,
			InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
		SecretKey deskey = new javax.crypto.spec.SecretKeySpec(key, ALGORITHM);
		Cipher c1 = Cipher.getInstance(ALGORITHM);
		c1.init(Cipher.DECRYPT_MODE, deskey);
		return c1.doFinal(input);
	}

	/**
	 * MD5
	 * 
	 * @throws NoSuchAlgorithmException
	 */
	public static byte[] md5(byte[] input) throws NoSuchAlgorithmException {
		java.security.MessageDigest alg = java.security.MessageDigest.getInstance("MD5"); // or
																							// "SHA-1"
		alg.update(input);
		return alg.digest();
	}

	/**
	 * Convert byte[] to String
	 */
	public static String byte2hex(byte[] b) {
		String hs = "";
		for (int n = 0; n < b.length; n++) {
			String stmp = (java.lang.Integer.toHexString(b[n] & 0XFF));
			if (stmp.length() == 1) {
				hs = hs + "0" + stmp;
			} else {
				hs = hs + stmp;
			}
		}
		return hs.toUpperCase();
	}

	/**
	 * Convert String to byte[]
	 */
	public static byte[] hex2byte(String hex) throws IllegalArgumentException {
		if (hex.length() % 2 != 0) {
			throw new IllegalArgumentException();
		}
		char[] arr = hex.toCharArray();
		byte[] b = new byte[hex.length() / 2];
		for (int i = 0, j = 0, l = hex.length(); i < l; i++, j++) {
			String swap = String.valueOf(arr[i++]) + String.valueOf(arr[i]);
			Integer byteint = Integer.parseInt(swap, 16) & 0xFF;
			b[j] = byteint.byteValue();
		}
		return b;
	}

	/**
	 * 加密
	 * 
	 * @author huchao
	 * @param cry，待加密的字符串
	 * @param key，秘钥字符串,秘钥必须为八位字符串
	 * @return
	 */
	public static String encrypt(String str, String key) {
		String string = null;
		if (null == str || null == key) {
			return null;
		} else {
			try {
				string = EncryptionUtil.byte2hex(EncryptionUtil.encode(str.getBytes(), key.getBytes()));
			} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
					| BadPaddingException e) {
				logger.error("加密错误", e);
			}
		}
		return string;
	}

	/**
	 * MD5加密
	 * 
	 * @author huchao
	 * @param str，待加密的字符串
	 * @return，返回32位加密字符串
	 */
	public static String md5(String str) {
		if (null == str) {
			return null;
		} else {
			byte[] md5 = null;
			try {
				md5 = md5("123".getBytes());
			} catch (NoSuchAlgorithmException e) {
				logger.error("MD5加密错误", e);
			}
			// 用来将字节转换成 16 进制表示的字符
			char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < md5.length; i++) {
				int iRet = md5[i];
				if (iRet < 0) {
					iRet += 256;
				}
				int iD1 = iRet / 16;
				int iD2 = iRet % 16;
				sb.append(hexDigits[iD1] + "" + hexDigits[iD2]);
			}
			return sb.toString();
		}
	}

	public static String decrypt(String str, String key) {
		String string = null;
		if (null == str || null == key) {
			return null;
		} else {
			try {
				string = new String(EncryptionUtil.decode(EncryptionUtil.hex2byte(str), key.getBytes()));
			} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
					| BadPaddingException e) {
				logger.error("解密错误", e);
			}
		}
		return string;
	}

	public static void main(String[] args) {
		String encrypt = encrypt("huchao", "cmoscmot");
		System.out.println(encrypt);
		String decrypt = decrypt(encrypt, "cmoscmot");
		System.out.println(decrypt);
		String sb = md5("123");
		System.out.println(sb);
		System.out.println(sb.length());

	}

}
