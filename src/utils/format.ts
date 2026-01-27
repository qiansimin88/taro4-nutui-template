/**
 * 数据格式化工具函数集
 * 提供常用的数据格式化功能：手机号、价格、文件大小等
 */

/**
 * 手机号脉名处理
 * @param phone - 11 位手机号
 * @returns 脉名后的手机号
 * @example
 * maskPhone('13812345678') // '138****5678'
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

/**
 * 价格格式化（分转元）
 * @param price - 价格（单位：分）
 * @param decimals - 小数位数，默认 2 位
 * @returns 格式化后的价格字符串
 * @example
 * formatPrice(1000) // '10.00'
 * formatPrice(1234, 1) // '12.3'
 */
export function formatPrice(price: number, decimals = 2): string {
  return (price / 100).toFixed(decimals);
}

/**
 * 数字千分位格式化
 * @param num - 要格式化的数字
 * @returns 带千分位分隔符的数字字符串
 * @example
 * formatNumber(1000000) // '1,000,000'
 * formatNumber(12345) // '12,345'
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 字符串截断并添加省略号
 * @param str - 要截断的字符串
 * @param maxLength - 最大长度
 * @returns 截断后的字符串
 * @example
 * truncate('Hello World', 5) // 'Hello...'
 * truncate('Hi', 10) // 'Hi'
 */
export function truncate(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

/**
 * 文件大小格式化
 * @param bytes - 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 * @example
 * formatFileSize(1024) // '1.00KB'
 * formatFileSize(1048576) // '1.00MB'
 * formatFileSize(0) // '0B'
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)}${units[i]}`;
}
