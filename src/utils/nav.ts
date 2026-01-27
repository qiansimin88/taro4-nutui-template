/**
 * 路由导航工具封装
 * 对 Taro 的导航 API 进行二次封装，提供更便捷的路由跳转功能
 * 支持自动参数序列化、页面栈管理等
 *
 * 使用示例：
 * import { nav } from '@/utils'
 * nav.to('/pages/detail/index', { params: { id: 1 } })
 * nav.back()
 * nav.redirect('/pages/login/index')
 */
import Taro from "@tarojs/taro";

/** 导航配置选项 */
interface NavOptions {
  /** URL 查询参数 */
  params?: Record<string, string | number | boolean>;
  /** 成功回调 */
  success?: () => void;
  /** 失败回调 */
  fail?: (err: Error) => void;
}

/**
 * 将参数对象序列化为 URL 查询字符串
 * @param params - 参数对象
 * @returns 查询字符串（包含 ?），无参数时返回空字符串
 * @example
 * serializeParams({ id: 1, name: 'test' }) // '?id=1&name=test'
 */
function serializeParams(
  params?: Record<string, string | number | boolean>
): string {
  if (!params || Object.keys(params).length === 0) return "";
  const query = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
  return `?${query}`;
}

/**
 * 构建完整的 URL（包含参数）
 * @param url - 基础 URL
 * @param params - 参数对象
 * @returns 完整的 URL
 * @example
 * buildUrl('/pages/detail/index', { id: 1 }) // '/pages/detail/index?id=1'
 */
function buildUrl(
  url: string,
  params?: Record<string, string | number | boolean>
): string {
  return `${url}${serializeParams(params)}`;
}

/**
 * 获取当前页面栈长度
 * @returns 页面栈长度
 */
function getPageStackLength(): number {
  const pages = Taro.getCurrentPages();
  return pages.length;
}

/**
 * 路由导航工具
 */
export const nav = {
  /**
   * 跳转到指定页面（push 模式）
   * 当页面栈达到 9 层时自动切换为 redirectTo
   * @param url - 目标页面路径
   * @param options - 导航配置选项
   * @example
   * nav.to('/pages/detail/index', { params: { id: 1 } })
   */
  to(url: string, options: NavOptions = {}) {
    const fullUrl = buildUrl(url, options.params);

    // 检查页面栈限制（最大 10 层）
    if (getPageStackLength() >= 9) {
      return this.redirect(url, options);
    }

    return Taro.navigateTo({
      url: fullUrl,
      success: options.success,
      fail: (err) => {
        console.warn("[nav] navigateTo failed:", err);
        options.fail?.(new Error(err.errMsg));
      },
    });
  },

  /**
   * 重定向到指定页面（replace 模式）
   * 会关闭当前页面，不增加页面栈
   * @param url - 目标页面路径
   * @param options - 导航配置选项
   * @example
   * nav.redirect('/pages/login/index')
   */
  redirect(url: string, options: NavOptions = {}) {
    const fullUrl = buildUrl(url, options.params);
    return Taro.redirectTo({
      url: fullUrl,
      success: options.success,
      fail: (err) => {
        console.warn("[nav] redirectTo failed:", err);
        options.fail?.(new Error(err.errMsg));
      },
    });
  },

  /**
   * 切换到 TabBar 页面
   * 注意：switchTab 不能传递参数
   * @param url - TabBar 页面路径
   * @param options - 导航配置选项（不包含 params）
   * @example
   * nav.switchTab('/pages/index/index')
   */
  switchTab(url: string, options: Omit<NavOptions, "params"> = {}) {
    return Taro.switchTab({
      url,
      success: options.success,
      fail: (err) => {
        console.warn("[nav] switchTab failed:", err);
        options.fail?.(new Error(err.errMsg));
      },
    });
  },

  /**
   * 返回上一页
   * @param delta - 返回的页面数，默认 1
   * @example
   * nav.back()     // 返回上一页
   * nav.back(2)    // 返回两页
   */
  back(delta = 1) {
    const stackLength = getPageStackLength();
    if (stackLength <= 1) {
      console.warn("[nav] Cannot go back: already at first page");
      return;
    }
    return Taro.navigateBack({ delta });
  },

  /**
   * 重启到指定页面（清空所有页面栈）
   * 关闭所有页面，打开到应用内的某个页面
   * @param url - 目标页面路径
   * @param options - 导航配置选项
   * @example
   * nav.reLaunch('/pages/index/index')
   */
  reLaunch(url: string, options: NavOptions = {}) {
    const fullUrl = buildUrl(url, options.params);
    return Taro.reLaunch({
      url: fullUrl,
      success: options.success,
      fail: (err) => {
        console.warn("[nav] reLaunch failed:", err);
        options.fail?.(new Error(err.errMsg));
      },
    });
  },

  /**
   * 获取当前页面路由
   * @returns 当前页面路径
   * @example
   * const route = nav.getCurrentRoute() // 'pages/index/index'
   */
  getCurrentRoute(): string {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    return currentPage?.route || "";
  },

  /**
   * 获取当前页面的查询参数
   * @returns 参数对象
   * @example
   * const params = nav.getCurrentParams() // { id: '1', name: 'test' }
   */
  getCurrentParams(): Record<string, string> {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    return (currentPage?.options as Record<string, string>) || {};
  },
};

export default nav;
