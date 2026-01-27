import { clsx, type ClassValue } from "clsx";

/**
 * 合并类名工具函数
 * @param inputs 类名列表
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
