/**
 * 错误监控和性能监控配置
 * 用于收集小程序运行时错误和性能数据
 */
import Taro from "@tarojs/taro";
import { env } from "./env";

interface ErrorInfo {
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  timestamp: number;
  userAgent?: string;
  userId?: string;
  page?: string;
}

interface PerformanceInfo {
  type: "navigation" | "api" | "render";
  name: string;
  duration: number;
  timestamp: number;
  page?: string;
}

class Monitor {
  private errorQueue: ErrorInfo[] = [];
  private performanceQueue: PerformanceInfo[] = [];
  private maxQueueSize = 50;

  /**
   * 初始化监控
   */
  init() {
    if (!env.debug) {
      this.setupErrorHandler();
      this.setupPerformanceMonitor();
    }
  }

  /**
   * 设置错误处理器
   */
  private setupErrorHandler() {
    // 监听小程序错误
    Taro.onError((error) => {
      this.reportError({
        message: error,
        timestamp: Date.now(),
        page: this.getCurrentPage(),
      });
    });

    // 监听未处理的 Promise 拒绝
    Taro.onUnhandledRejection?.((res) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${res.reason}`,
        timestamp: Date.now(),
        page: this.getCurrentPage(),
      });
    });
  }

  /**
   * 设置性能监控
   */
  private setupPerformanceMonitor() {
    // 监听页面性能
    Taro.onMemoryWarning?.((res) => {
      console.warn("内存警告:", res.level);
      this.reportPerformance({
        type: "render",
        name: "memory_warning",
        duration: res.level,
        timestamp: Date.now(),
        page: this.getCurrentPage(),
      });
    });
  }

  /**
   * 上报错误
   */
  reportError(errorInfo: Partial<ErrorInfo>) {
    const error: ErrorInfo = {
      message: errorInfo.message || "Unknown error",
      stack: errorInfo.stack,
      timestamp: errorInfo.timestamp || Date.now(),
      page: errorInfo.page || this.getCurrentPage(),
      userAgent: this.getUserAgent(),
      ...errorInfo,
    };

    this.errorQueue.push(error);
    
    // 队列满了就上报
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.flushErrors();
    }

    // 严重错误立即上报
    if (error.message.includes("ReferenceError") || error.message.includes("TypeError")) {
      this.flushErrors();
    }
  }

  /**
   * 上报性能数据
   */
  reportPerformance(performanceInfo: PerformanceInfo) {
    this.performanceQueue.push({
      ...performanceInfo,
      page: performanceInfo.page || this.getCurrentPage(),
    });

    if (this.performanceQueue.length >= this.maxQueueSize) {
      this.flushPerformance();
    }
  }

  /**
   * 批量上报错误
   */
  private async flushErrors() {
    if (this.errorQueue.length === 0) return;

    try {
      const errors = [...this.errorQueue];
      this.errorQueue = [];

      // 这里可以替换为你的错误上报接口
      await Taro.request({
        url: `${env.apiBaseUrl}/monitor/errors`,
        method: "POST",
        data: { errors },
      });

      console.log(`已上报 ${errors.length} 个错误`);
    } catch (error) {
      console.error("错误上报失败:", error);
      // 上报失败的错误重新加入队列
      this.errorQueue.unshift(...this.errorQueue);
    }
  }

  /**
   * 批量上报性能数据
   */
  private async flushPerformance() {
    if (this.performanceQueue.length === 0) return;

    try {
      const performances = [...this.performanceQueue];
      this.performanceQueue = [];

      await Taro.request({
        url: `${env.apiBaseUrl}/monitor/performance`,
        method: "POST",
        data: { performances },
      });

      console.log(`已上报 ${performances.length} 个性能数据`);
    } catch (error) {
      console.error("性能数据上报失败:", error);
    }
  }

  /**
   * 获取当前页面路径
   */
  private getCurrentPage(): string {
    try {
      const pages = Taro.getCurrentPages();
      const currentPage = pages[pages.length - 1];
      return currentPage?.route || "unknown";
    } catch {
      return "unknown";
    }
  }

  /**
   * 获取用户代理信息
   */
  private getUserAgent(): string {
    try {
      const systemInfo = Taro.getSystemInfoSync();
      return `${systemInfo.platform} ${systemInfo.system} ${systemInfo.version}`;
    } catch {
      return "unknown";
    }
  }

  /**
   * 手动上报自定义错误
   */
  captureError(error: Error, extra?: Record<string, any>) {
    this.reportError({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      ...extra,
    });
  }

  /**
   * 手动上报性能数据
   */
  capturePerformance(name: string, duration: number, type: PerformanceInfo["type"] = "api") {
    this.reportPerformance({
      type,
      name,
      duration,
      timestamp: Date.now(),
    });
  }

  /**
   * 应用退出时上报剩余数据
   */
  flush() {
    this.flushErrors();
    this.flushPerformance();
  }
}

export const monitor = new Monitor();
export default monitor;