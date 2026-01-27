/**
 * 本地存储工具封装
 * 对 Taro 的 storage API 进行二次封装，提供更友好的接口和错误处理
 * 支持自动 JSON 序列化/反序列化
 *
 * 使用示例：
 * import { storage } from '@/utils'
 * storage.set('user', { name: 'John' })
 * const user = storage.get<User>('user')
 * storage.remove('user')
 */
import Taro from "@tarojs/taro";

/**
 * Storage utility wrapper for Taro storage
 */
export const storage = {
  /**
   * 从存储中获取数据
   * @param key - 存储键名
   * @returns 存储的值，不存在则返回 null
   * @example
   * const token = storage.get<string>('token')
   * const user = storage.get<User>('user')
   */
  get<T = string>(key: string): T | null {
    try {
      const value = Taro.getStorageSync(key);
      if (!value) return null;
      try {
        // 尝试 JSON 解析
        return JSON.parse(value) as T;
      } catch {
        // 解析失败，返回原始值
        return value as T;
      }
    } catch (e) {
      console.warn(`[storage] Failed to get "${key}":`, e);
      return null;
    }
  },

  /**
   * 将数据存储到本地
   * @param key - 存储键名
   * @param value - 要存储的值（支持对象、数组、字符串等）
   * @returns 是否成功
   * @example
   * storage.set('token', 'abc123')
   * storage.set('user', { name: 'John', age: 18 })
   */
  set(key: string, value: unknown): boolean {
    try {
      // 如果是字符串直接存储，否则 JSON 序列化
      const data = typeof value === "string" ? value : JSON.stringify(value);
      Taro.setStorageSync(key, data);
      return true;
    } catch (e) {
      console.warn(`[storage] Failed to set "${key}":`, e);
      return false;
    }
  },

  /**
   * 从存储中移除指定数据
   * @param key - 存储键名
   * @returns 是否成功
   * @example
   * storage.remove('token')
   */
  remove(key: string): boolean {
    try {
      Taro.removeStorageSync(key);
      return true;
    } catch (e) {
      console.warn(`[storage] Failed to remove "${key}":`, e);
      return false;
    }
  },

  /**
   * 清空所有存储数据
   * @returns 是否成功
   * @example
   * storage.clear()
   */
  clear(): boolean {
    try {
      Taro.clearStorageSync();
      return true;
    } catch (e) {
      console.warn("[storage] Failed to clear:", e);
      return false;
    }
  },

  /**
   * 获取存储信息（已使用空间、限制等）
   * @returns 存储信息对象，失败返回 null
   * @example
   * const info = storage.getInfo()
   * console.log(info?.currentSize, info?.limitSize)
   */
  getInfo() {
    try {
      return Taro.getStorageInfoSync();
    } catch (e) {
      console.warn("[storage] Failed to get info:", e);
      return null;
    }
  },
};

export default storage;
