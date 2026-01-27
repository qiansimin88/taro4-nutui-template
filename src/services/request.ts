import Taro from "@tarojs/taro";
import { env } from "@/config/env";
import { useUserStore } from "@/store";

export interface RequestOptions extends Omit<Taro.request.Option, "url"> {
  /** Show loading indicator */
  showLoading?: boolean;
  /** Loading text */
  loadingText?: string;
  /** Show error toast */
  showError?: boolean;
  /** Custom base URL */
  baseUrl?: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

/** HTTP methods */
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/** Default request options */
const defaultOptions: Partial<RequestOptions> = {
  showLoading: true,
  loadingText: "加载中...",
  showError: true,
  timeout: env.timeout,
};

/** Loading counter for multiple concurrent requests */
let loadingCount = 0;

const showLoading = (text: string) => {
  if (loadingCount === 0) {
    Taro.showLoading({ title: text, mask: true });
  }
  loadingCount++;
};

const hideLoading = () => {
  loadingCount--;
  if (loadingCount <= 0) {
    loadingCount = 0;
    Taro.hideLoading();
  }
};

const showErrorToast = (message: string) => {
  Taro.showToast({
    title: message,
    icon: "none",
    duration: 2000,
  });
};

/**
 * Request function wrapper
 */
async function request<T = unknown>(
  url: string,
  method: HttpMethod,
  data?: object,
  options: RequestOptions = {}
): Promise<T> {
  const mergedOptions = { ...defaultOptions, ...options };
  const {
    showLoading: shouldShowLoading,
    loadingText,
    showError,
    baseUrl,
  } = mergedOptions;

  // Get token from store
  const token = useUserStore.getState().token;

  // Build full URL
  const fullUrl = `${baseUrl || env.apiBaseUrl}${url}`;

  // Show loading
  if (shouldShowLoading) {
    showLoading(loadingText!);
  }

  try {
    const response = await Taro.request<ApiResponse<T>>({
      url: fullUrl,
      method,
      data,
      timeout: mergedOptions.timeout,
      header: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...mergedOptions.header,
      },
    });

    // Hide loading
    if (shouldShowLoading) {
      hideLoading();
    }

    const { statusCode, data: responseData } = response;

    // HTTP error
    if (statusCode < 200 || statusCode >= 300) {
      const errorMessage = getHttpErrorMessage(statusCode);
      if (showError) {
        showErrorToast(errorMessage);
      }
      throw new Error(errorMessage);
    }

    // Business error
    if (responseData.code !== 0) {
      // Handle token expired
      if (responseData.code === 401) {
        useUserStore.getState().logout();
        Taro.navigateTo({ url: "/pages/login/index" });
      }

      if (showError) {
        showErrorToast(responseData.message || "请求失败");
      }
      throw new Error(responseData.message || "请求失败");
    }

    return responseData.data;
  } catch (error) {
    // Hide loading on error
    if (shouldShowLoading) {
      hideLoading();
    }

    // Network error
    if (error instanceof Error && error.message.includes("request:fail")) {
      const message = "网络连接失败，请检查网络";
      if (showError) {
        showErrorToast(message);
      }
      throw new Error(message);
    }

    throw error;
  }
}

/** Get HTTP error message by status code */
function getHttpErrorMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: "请求参数错误",
    401: "登录已过期，请重新登录",
    403: "没有权限访问",
    404: "请求的资源不存在",
    500: "服务器内部错误",
    502: "网关错误",
    503: "服务暂不可用",
    504: "网关超时",
  };
  return messages[statusCode] || `请求失败 (${statusCode})`;
}

/** HTTP request methods */
export const http = {
  get<T = unknown>(url: string, data?: object, options?: RequestOptions) {
    return request<T>(url, "GET", data, options);
  },
  post<T = unknown>(url: string, data?: object, options?: RequestOptions) {
    return request<T>(url, "POST", data, options);
  },
  put<T = unknown>(url: string, data?: object, options?: RequestOptions) {
    return request<T>(url, "PUT", data, options);
  },
  delete<T = unknown>(url: string, data?: object, options?: RequestOptions) {
    return request<T>(url, "DELETE", data, options);
  },
  patch<T = unknown>(url: string, data?: object, options?: RequestOptions) {
    return request<T>(url, "PATCH", data, options);
  },
};

export default http;
