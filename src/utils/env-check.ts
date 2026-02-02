/**
 * 环境变量检查工具
 * 用于调试环境变量是否正确加载
 */
import { env } from "@/config/env";
import { log } from "@/utils/logger";

export const checkEnv = () => {
  const envLog = log.withTag("环境检查");
  envLog.info("=== 环境变量检查 ===");
  envLog.info("NODE_ENV:", process.env.NODE_ENV);
  envLog.info("TARO_ENV:", process.env.TARO_ENV);
  envLog.info("TARO_APP_API_URL:", process.env.TARO_APP_API_URL);
  envLog.info("TARO_APP_ID:", process.env.TARO_APP_ID);
  envLog.info("---");
  envLog.info("env.apiBaseUrl:", env.apiBaseUrl);
  envLog.info("env.debug:", env.debug);
  envLog.info("env.timeout:", env.timeout);
  envLog.info("==================");
};

// 自动执行检查
if (process.env.NODE_ENV === "development") {
  checkEnv();
}
