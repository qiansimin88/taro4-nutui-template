const isDev = process.env.NODE_ENV === "development";

interface EnvConfig {
  /** API 基础路径 */
  apiBaseUrl: string;
  /** 是否开启调试模式 */
  debug: boolean;
  /** 请求超时时间 (ms) */
  timeout: number;
}
// src/config/env.ts
const devConfig: EnvConfig = {
  // 优先读取 .env 里的变量，如果没有再用默认值
  apiBaseUrl: process.env.TARO_APP_API_URL || "https://dev-api.example.com",
  debug: true,
  timeout: 30000,
};

const prodConfig: EnvConfig = {
  apiBaseUrl: process.env.TARO_APP_API_URL || "https://api.example.com",
  debug: false,
  timeout: 30000,
};

export const env: EnvConfig = isDev ? devConfig : prodConfig;

export default env;
