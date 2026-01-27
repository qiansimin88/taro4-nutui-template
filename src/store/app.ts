/**
 * 应用全局状态管理
 * 使用 Zustand 管理应用级别的状态：主题、语言、系统信息等
 * 支持持久化存储（theme 和 locale 会自动保存到本地）
 *
 * 使用示例：
 * import { useAppStore, selectTheme } from '@/store/app'
 * const theme = useAppStore(selectTheme)
 * const { setTheme, initSystemInfo } = useAppStore()
 */
import { create } from "zustand";
import Taro from "@tarojs/taro";
import { persist } from "./middleware/persist";
import { STORAGE_KEYS } from "@/constants/storage";

// 主题模式枚举
export type ThemeMode = "light" | "dark" | "system"; // light:浅色 dark:深色 system:跟随系统

// 语言类型枚举
export type LocaleType = "zh-CN" | "en-US"; // zh-CN:简体中文 en-US:英文

// 系统信息类型
interface SystemInfo {
  platform: string; // 平台类型：ios/android/devtools
  screenWidth: number; // 屏幕宽度（像素）
  screenHeight: number; // 屏幕高度（像素）
  statusBarHeight: number; // 状态栏高度（像素）
  safeArea: {
    // 安全区域
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
  };
}

// 应用状态类型
interface AppState {
  theme: ThemeMode; // 当前主题
  locale: LocaleType; // 当前语言
  systemInfo: SystemInfo | null; // 系统信息
  networkType: string; // 网络类型：wifi/4g/3g/2g/none
  isConnected: boolean; // 是否连接网络
}

// 应用操作类型
interface AppActions {
  setTheme: (theme: ThemeMode) => void; // 设置主题
  setLocale: (locale: LocaleType) => void; // 设置语言
  setSystemInfo: (info: SystemInfo) => void; // 设置系统信息
  setNetworkStatus: (type: string, isConnected: boolean) => void; // 设置网络状态
  initSystemInfo: () => void; // 初始化系统信息
}

export type AppStore = AppState & AppActions;

// 初始状态
const initialState: AppState = {
  theme: "light", // 默认浅色主题
  locale: "zh-CN", // 默认中文
  systemInfo: null, // 系统信息需要初始化后获取
  networkType: "unknown", // 网络类型未知
  isConnected: true, // 默认认为已连接
};

// 创建 Store
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,

      // 设置主题
      setTheme: (theme: ThemeMode) => {
        set({ theme });
      },

      // 设置语言
      setLocale: (locale: LocaleType) => {
        set({ locale });
      },

      // 设置系统信息
      setSystemInfo: (info: SystemInfo) => {
        set({ systemInfo: info });
      },

      // 设置网络状态
      setNetworkStatus: (type: string, isConnected: boolean) => {
        set({ networkType: type, isConnected });
      },

      // 初始化系统信息
      initSystemInfo: () => {
        try {
          const info = Taro.getSystemInfoSync();
          set({
            systemInfo: {
              platform: info.platform,
              screenWidth: info.screenWidth,
              screenHeight: info.screenHeight,
              statusBarHeight: info.statusBarHeight || 0,
              safeArea: info.safeArea || {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: info.screenWidth,
                height: info.screenHeight,
              },
            },
          });
        } catch (e) {
          console.warn("[app store] Failed to get system info:", e);
        }
      },
    }),
    {
      name: STORAGE_KEYS.APP_STORE, // 存储键名
      // 只持久化 theme 和 locale，其他状态每次启动时重新获取
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
      }),
    }
  )
);

// Selectors（选择器，用于选择特定状态）
export const selectTheme = (state: AppStore) => state.theme;
export const selectLocale = (state: AppStore) => state.locale;
export const selectSystemInfo = (state: AppStore) => state.systemInfo;
export const selectIsConnected = (state: AppStore) => state.isConnected;
