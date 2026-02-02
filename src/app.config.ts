/**
 * Taro 应用全局配置文件
 * 定义小程序的页面路由、窗口样式等全局设置
 * 对应小程序的 app.json 配置
 */
export default defineAppConfig({
  // 主包页面：TabBar 页面 + 入口页面 + 公共页面
  pages: [
    "pages/index/index", // 首页（TabBar）
    "pages/personalCenter/index", // 个人中心首页（TabBar）
    "pages/login/index", // 登录页（入口页面）
    "pages/webview/index", // WebView（公共页面）
  ],

  // 分包配置 - 按业务功能划分
  subPackages: [
    // 用户相关分包
    {
      root: "sub-packages/user",
      name: "user",
      pages: [
        "profile/index", // 个人资料
        "address/index", // 地址管理
        "receivingAccount/index", // 收款账户
        "points/index", // 积分中心
        "favorites/index", // 我的收藏
        "following/index", // 我的关注
        "followers/index", // 我的粉丝
        "invite/index", // 邀请好友
      ],
    },
    // 交易订单分包
    {
      root: "sub-packages/trade",
      name: "trade",
      pages: [
        "orderList/index", // 订单列表
        "couponList/index", // 优惠券列表
        "comments/index", // 评价管理
        "ratings/index", // 评分记录
      ],
    },
    // 设计师相关分包
    {
      root: "sub-packages/designer",
      name: "designer",
      pages: [
        "designerAuth/index", // 设计师认证
        "designerOrder/index", // 设计师订单
        "myModels/index", // 我的模型
        "commission/index", // 佣金管理
      ],
    },
    // 安全设置分包
    {
      root: "sub-packages/security",
      name: "security",
      pages: [
        "settings/index", // 安全设置首页
        "password/index", // 修改密码
        "phone/index", // 手机绑定
        "realname/index", // 实名认证
      ],
    },
    // 工具类分包（低频页面）
    {
      root: "sub-packages/tools",
      name: "tools",
      pages: [
        "gradient-generator/index", // 渐变生成器
        "test1/index", // 测试页面1
        "test2/index", // 测试页面2
      ],
    },
  ],

  // 分包预下载配置
  preloadRule: {
    "pages/personalCenter/index": {
      network: "all",
      packages: ["user"], // 进入个人中心时预下载用户相关分包
    },
    "pages/index/index": {
      network: "wifi", // 仅在 WiFi 下预下载
      packages: ["trade"], // 首页预下载交易相关分包
    },
  },

  // TabBar 配置
  tabBar: {
    color: "#999",
    selectedColor: "#05df72",
    backgroundColor: "#fff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/icons/home.png",
        selectedIconPath: "assets/icons/home-active.png",
      },
      {
        pagePath: "pages/personalCenter/index",
        text: "我的",
        iconPath: "assets/icons/my.png",
        selectedIconPath: "assets/icons/my-active.png",
      },
    ],
  },

  // 窗口表现配置
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "-星链",
    navigationBarTextStyle: "black",
    enablePullDownRefresh: false,
    backgroundColor: "#f5f5f5",
  },

  // 网络超时配置
  networkTimeout: {
    request: 30000,
    downloadFile: 30000,
    uploadFile: 30000,
  },

  // 性能优化配置
  lazyCodeLoading: "requiredComponents",
  initialRenderingCache: "static",
  restartStrategy: "homePage",

  // 权限配置
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于小程序位置接口的效果展示",
    },
  },

  // 用户隐私保护指引
  privacy: {
    desc: "你的隐私信息将用于小程序的功能实现",
  },
});
