/**
 * 工具函数统一导出文件
 * 聚合项目中所有工具函数，提供统一的导入入口
 *
 * 使用示例：
 * import { storage, nav, formatPrice } from '@/utils'
 * storage.set('key', 'value')
 * nav.to('/pages/detail/index')
 * const price = formatPrice(1000) // '10.00'
 */

// 存储工具
export { storage } from "./storage";

// 路由导航工具
export { nav } from "./nav";

// 样式工具（clsx 类名合并）
export { cn } from "./style";

// 格式化工具
export {
  maskPhone, // 手机号脉名
  formatPrice, // 价格格式化（分转元）
  formatNumber, // 数字千分位
  truncate, // 字符串截断
  formatFileSize, // 文件大小格式化
} from "./format";
