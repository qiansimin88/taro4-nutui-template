import { z } from "zod";

/**
 * 常用正则
 */
export const REGEX = {
  // 中国手机号
  PHONE: /^1[3-9]\d{9}$/,
  // 密码：8-20位，包含字母和数字
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/,
};

/**
 * 公用验证规则
 */
export const commonSchema = {
  phone: z.string().regex(REGEX.PHONE, "手机号格式不正确"),
  password: z.string().regex(REGEX.PASSWORD, "密码需8-20位且包含字母和数字"),
  code: z.string().length(6, "请输入6位验证码"),
};
