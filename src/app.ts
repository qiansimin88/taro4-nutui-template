/// <reference path="../types/global.d.ts" />
import React, { useEffect } from "react";
import { useDidShow, useDidHide } from "@tarojs/taro";
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
  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
