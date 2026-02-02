/**
 * 路由常量定义
 * 统一管理所有页面路径，便于分包重构后的路径更新
 */

// 主包路由
export const MAIN_ROUTES = {
  // TabBar 页面
  HOME: '/pages/index/index',
  PERSONAL_CENTER: '/pages/personalCenter/index',

  // 入口页面
  LOGIN: '/pages/login/index',

  // 公共页面
  WEBVIEW: '/pages/webview/index',
} as const;

// 用户相关分包路由
export const USER_ROUTES = {
  PROFILE: '/sub-packages/user/profile/index',
  ADDRESS: '/sub-packages/user/address/index',
  RECEIVING_ACCOUNT: '/sub-packages/user/receivingAccount/index',
  POINTS: '/sub-packages/user/points/index',
  FAVORITES: '/sub-packages/user/favorites/index',
  FOLLOWING: '/sub-packages/user/following/index',
  FOLLOWERS: '/sub-packages/user/followers/index',
  INVITE: '/sub-packages/user/invite/index',
} as const;

// 交易订单分包路由
export const TRADE_ROUTES = {
  ORDER_LIST: '/sub-packages/trade/orderList/index',
  COUPON_LIST: '/sub-packages/trade/couponList/index',
  COMMENTS: '/sub-packages/trade/comments/index',
  RATINGS: '/sub-packages/trade/ratings/index',
} as const;

// 设计师相关分包路由
export const DESIGNER_ROUTES = {
  DESIGNER_AUTH: '/sub-packages/designer/designerAuth/index',
  DESIGNER_ORDER: '/sub-packages/designer/designerOrder/index',
  MY_MODELS: '/sub-packages/designer/myModels/index',
  COMMISSION: '/sub-packages/designer/commission/index',
} as const;

// 安全设置分包路由
export const SECURITY_ROUTES = {
  SETTINGS: '/sub-packages/security/settings/index',
  PASSWORD: '/sub-packages/security/password/index',
  PHONE: '/sub-packages/security/phone/index',
  REALNAME: '/sub-packages/security/realname/index',
} as const;

// 工具类分包路由
export const TOOLS_ROUTES = {
  GRADIENT_GENERATOR: '/sub-packages/tools/gradient-generator/index',
  TEST1: '/sub-packages/tools/test1/index',
  TEST2: '/sub-packages/tools/test2/index',
} as const;

// 所有路由的联合类型
export const ROUTES = {
  ...MAIN_ROUTES,
  ...USER_ROUTES,
  ...TRADE_ROUTES,
  ...DESIGNER_ROUTES,
  ...SECURITY_ROUTES,
  ...TOOLS_ROUTES,
} as const;

// 路由类型定义
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

// 分包名称常量
export const PACKAGE_NAMES = {
  MAIN: 'main',
  USER: 'user',
  TRADE: 'trade',
  DESIGNER: 'designer',
  SECURITY: 'security',
  TOOLS: 'tools',
} as const;

// 根据路径获取分包名称
export const getPackageName = (path: string): string => {
  if (path.startsWith('/sub-packages/user/')) return PACKAGE_NAMES.USER;
  if (path.startsWith('/sub-packages/trade/')) return PACKAGE_NAMES.TRADE;
  if (path.startsWith('/sub-packages/designer/')) return PACKAGE_NAMES.DESIGNER;
  if (path.startsWith('/sub-packages/security/')) return PACKAGE_NAMES.SECURITY;
  if (path.startsWith('/sub-packages/tools/')) return PACKAGE_NAMES.TOOLS;
  return PACKAGE_NAMES.MAIN;
};

// 检查是否为分包路径
export const isSubPackage = (path: string): boolean => {
  return path.startsWith('/sub-packages/');
};

// 检查是否为主包路径
export const isMainPackage = (path: string): boolean => {
  return path.startsWith('/pages/');
};
