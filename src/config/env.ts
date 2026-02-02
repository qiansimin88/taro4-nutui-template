const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

interface EnvConfig {
  /** API 基础路径 */
  apiBaseUrl: string;
  /** 是否开启调试模式 */
  debug: boolean;
  /** 请求超时时间 (ms) */
  timeout: number;
  /** 小程序版本 */
  version: string;
  /** 环境名称 */
  envName: string;
  /** 是否启用 vConsole */
  enableVConsole: boolean;
  /** 上传文件大小限制 (MB) */
  uploadSizeLimit: number;
  /** 分页默认大小 */
  defaultPageSize: number;
}

const devConfig: EnvConfig = {
  // 优先读取 .env 里的变量，如果没有再用默认值
  apiBaseUrl: process.env.TARO_APP_API_URL || "https://dev-api.joykings3d.com",
  debug: true,
  timeout: 30000,
  version: "1.0.0-dev",
  envName: "开发环境",
  enableVConsole: true,
  uploadSizeLimit: 10,
  defaultPageSize: 20,
};

const prodConfig: EnvConfig = {
  apiBaseUrl: process.env.TARO_APP_API_URL || "https://api.joykings3d.com",
  debug: false,
  timeout: 30000,
  version: "1.0.0",
  envName: "生产环境",
  enableVConsole: false,
  uploadSizeLimit: 5,
  defaultPageSize: 20,
};

export const env: EnvConfig = isDev ? devConfig : prodConfig;

// 环境检查函数
export const isDevEnv = () => isDev;
export const isProdEnv = () => isProd;
export const isMiniProgram = () => process.env.TARO_ENV === "weapp";
export const isH5 = () => process.env.TARO_ENV === "h5";

export default env;
