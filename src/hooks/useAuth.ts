/**
 * 鉴权 Hook
 * 用于任何需要登录验证的场景
 */
import Taro from "@tarojs/taro";
import { useUserStore } from "@/store/user";
import { userService } from "@/services/user";
import { log } from "@/utils/logger";
import { nav } from "@/utils/nav";
import { MAIN_ROUTES } from "@/constants/routes";

interface UseAuthResult {
  /** 是否已登录 */
  isAuthenticated: boolean;
  /** 检查鉴权并执行回调 */
  checkAuth: (callback?: () => void | Promise<void>) => Promise<boolean>;
  /** 手动触发手机号授权 */
  requestPhoneAuth: () => Promise<boolean>;
}

/**
 * 鉴权 Hook
 *
 * @example
 * ```tsx
 * function ProductCard() {
 *   const { checkAuth } = useAuth();
 *
 *   const handleBuy = async () => {
 *     const isAuthed = await checkAuth();
 *     if (isAuthed) {
 *       // 执行购买逻辑
 *     }
 *   };
 *
 *   return <View onClick={handleBuy}>购买</View>;
 * }
 * ```
 */
export const useAuth = (): UseAuthResult => {
  const { token, openId, unionId, login, clearWxIdentity } = useUserStore();

  /**
   * 处理手机号授权
   */
  const handlePhoneAuth = async (phoneCode: string): Promise<boolean> => {
    try {
      // 判断是否为新用户绑定手机号流程
      if (openId) {
        log.info("📱 新用户绑定手机号");
        const loginData = await userService.wxMiniPhoneLogin({
          phoneCode,
          openId,
          unionId,
        });

        if (loginData?.token && loginData?.data) {
          clearWxIdentity();
          login(loginData.token, loginData.data);
          Taro.showToast({ title: "登录成功", icon: "success" });
          return true;
        }
      } else {
        // 老用户快捷登录，需要先获取 loginCode 和 openId
        log.info("🚀 老用户快捷登录");
        const { code: loginCode } = await Taro.login();
        const loginRes = await userService.wxMiniLogin({ code: loginCode });
        const tempOpenId = loginRes.openId;

        if (tempOpenId) {
          const loginData = await userService.wxMiniPhoneLogin({
            phoneCode,
            openId: tempOpenId,
            unionId: loginRes.unionId,
          });

          if (loginData?.token && loginData?.data) {
            login(loginData.token, loginData.data);
            Taro.showToast({ title: "登录成功", icon: "success" });
            return true;
          }
        }
      }
    } catch (error) {
      log.error("❌ 手机号登录失败:", error);
      Taro.showToast({ title: "登录失败，请重试", icon: "none" });
    }
    return false;
  };

  /**
   * 请求手机号授权
   */
  const requestPhoneAuth = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // 注意: 这里需要用户手动触发授权按钮
      // 小程序限制,必须通过 button open-type="getPhoneNumber" 触发
      log.warn("⚠️ 请使用 AuthButton 组件或手动添加授权按钮");
      resolve(false);
    });
  };

  /**
   * 检查鉴权
   * 如果已登录,直接执行回调并返回 true
   * 如果未登录,提示用户登录并返回 false
   */
  const checkAuth = async (
    callback?: () => void | Promise<void>
  ): Promise<boolean> => {
    if (token) {
      // 已登录,执行回调
      if (callback) {
        await callback();
      }
      return true;
    }

    // 未登录,提示用户并跳转登录页
    Taro.showModal({
      title: "需要登录",
      content: "该操作需要登录,请先授权手机号",
      confirmText: "去登录",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          log.info("用户点击去登录,跳转到登录页");
          // 跳转到登录页
          nav.to(MAIN_ROUTES.LOGIN);
        } else {
          log.info("用户取消登录");
        }
      },
    });

    return false;
  };

  return {
    isAuthenticated: !!token,
    checkAuth,
    requestPhoneAuth,
  };
};
