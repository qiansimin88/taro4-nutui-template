/**
 * 彩色日志工具
 * 使用 consola 提供更好的开发体验
 */
import { createConsola } from "consola";

// 创建 logger 实例
const logger = createConsola({
  level: process.env.NODE_ENV === "development" ? 4 : 3, // development: 4(debug), production: 3(info)
  fancy: true, // 启用彩色输出
  formatOptions: {
    colors: true,
    date: true,
  },
});

// 导出便捷方法
export const log = {
  /** 成功信息 - 绿色 */
  success: (...args: unknown[]) =>
    logger.success(...(args as [any?, ...any[]])),

  /** 普通信息 - 蓝色 */
  info: (...args: unknown[]) => logger.info(...(args as [any?, ...any[]])),

  /** 警告信息 - 黄色 */
  warn: (...args: unknown[]) => logger.warn(...(args as [any?, ...any[]])),

  /** 错误信息 - 红色 */
  error: (...args: unknown[]) => logger.error(...(args as [any?, ...any[]])),

  /** 调试信息 - 灰色 */
  debug: (...args: unknown[]) => logger.debug(...(args as [any?, ...any[]])),

  /** 开始任务 - 青色 */
  start: (...args: unknown[]) => logger.start(...(args as [any?, ...any[]])),

  /** 追踪信息 - 紫色 */
  trace: (...args: unknown[]) => logger.trace(...(args as [any?, ...any[]])),

  /** 失败信息 - 红色 */
  fail: (...args: unknown[]) => logger.fail(...(args as [any?, ...any[]])),

  /** 就绪信息 - 绿色 */
  ready: (...args: unknown[]) => logger.ready(...(args as [any?, ...any[]])),

  /** 带标签的日志 */
  withTag: (tag: string) => ({
    success: (...args: unknown[]) =>
      logger.success(`[${tag}]`, ...(args as [any?, ...any[]])),
    info: (...args: unknown[]) =>
      logger.info(`[${tag}]`, ...(args as [any?, ...any[]])),
    warn: (...args: unknown[]) =>
      logger.warn(`[${tag}]`, ...(args as [any?, ...any[]])),
    error: (...args: unknown[]) =>
      logger.error(`[${tag}]`, ...(args as [any?, ...any[]])),
    debug: (...args: unknown[]) =>
      logger.debug(`[${tag}]`, ...(args as [any?, ...any[]])),
  }),
};

// 导出原始 logger 实例
export { logger };

// 默认导出
export default log;
