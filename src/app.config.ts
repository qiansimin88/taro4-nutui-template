/**
 * Taro 应用全局配置文件
 * 定义小程序的页面路由、窗口样式等全局设置
 * 对应小程序的 app.json 配置
 */
export default defineAppConfig({
  lazyCodeLoading: "requiredComponents", // 开启按需注入

  // 页面路由列表（数组第一项为首页）
  pages: [
    "pages/test1/index",
    "pages/test2/index",
    "pages/login/index",
    "pages/index/index",
  ],
  // 窗口表现配置
  window: {
    // 下拉 loading 的样式：light(浅色) / dark(深色)
    backgroundTextStyle: "light",
    // 导航栏背景颜色
    navigationBarBackgroundColor: "#fff",
    // 导航栏标题文字
    navigationBarTitleText: "测试小程序",
    // 导航栏标题颜色：black(黑色) / white(白色)
    navigationBarTextStyle: "black",
  },
});
