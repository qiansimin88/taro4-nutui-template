/// <reference path="../types/global.d.ts" />
import React, { useEffect } from "react";
import Taro, { useDidShow, useDidHide, useLaunch } from "@tarojs/taro";
import { useUserStore } from "@/store/user";
import { userService } from "@/services/user";
import { log } from "@/utils/logger";
import "@/utils/env-check"; // 环境变量检查
// 全局样式
import "./app.scss";

// H5 端开发环境开启 vConsole
if (process.env.TARO_ENV === "h5" && process.env.NODE_ENV === "development") {
  import("vconsole").then((module) => {
    const VConsole = module.default;
    new VConsole();
  });
}

function App(props) {
  const { login, saveWxIdentity, token } = useUserStore();

  // 小程序初始化时执行静默登录
  useLaunch(async () => {
    log.start("🚀 小程序启动 - 开始静默登录检查");
    log.debug("当前 token:", token);

    // 如果已经有 token，说明已经登录过
    if (token) {
      log.success("✅ 已存在 token，跳过静默登录");
      return;
    }

    try {
      // 1. 获取微信 login code
      const { code } = await Taro.login();
      log.info("🔑 获取到微信 code:", code);

      // 2. 调用后端静默登录接口
      const loginData = await userService.wxMiniLogin({ code });

      // 3. 判断是否需要绑定手机号
      if (loginData.needBindPhone) {
        log.warn("⚠️  检测到新用户，需要绑定手机号");
        // 保存 openId/unionId 以便后续绑定手机号时使用
        saveWxIdentity(loginData.openId, loginData.unionId);
        log.debug("💾 已保存 openId/unionId，等待用户手动登录");
      } else if (loginData.userDetail?.token && loginData.userDetail?.data) {
        // 老用户，直接登录成功
        log.success("✨ 老用户静默登录成功");
        log.debug("用户信息:", loginData.userDetail.data);
        login(loginData.userDetail.token, loginData.userDetail.data);
      }
    } catch (error) {
      log.error("❌ 静默登录失败:", error);
      // 静默登录失败不阻塞应用启动，等待用户手动登录
    }
  });

  // 可以使用所有的 React Hooks
  useEffect(() => {
    log.info("🎉 APP 初始化完成");
  });

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
