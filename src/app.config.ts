/**
 * Taro 应用全局配置文件
 * 定义小程序的页面路由、窗口样式等全局设置
 * 对应小程序的 app.json 配置
 */
export default defineAppConfig({
  // 页面路由列表（数组第一项为首页）
  pages: [
    "pages/test1/index",
    "pages/test2/index",
    "pages/login/index",
    "pages/index/index",
    "pages/securitySettings/index",
    "pages/securitySettings/password/index",
    "pages/securitySettings/phone/index",
    "pages/securitySettings/realname/index",
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
  // 按需注入，仅加载当前页面需要的代码，提升启动速度
  lazyCodeLoading: "requiredComponents",
  // 开启初始渲染缓存，提升二次进入页面的速度
  initialRenderingCache: "static",
  // 设置小程序被销毁后再次进入时的重启策略  回到首页  避免state 缺失导致的问题
  restartStrategy: "homePage",
});
