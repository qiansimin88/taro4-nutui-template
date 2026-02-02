# - Gemini 项目配置

## 项目概述

这是一个基于 Taro 4 + React 18 + NutUI 的多端小程序项目。

## 技术栈

- **框架**: Taro 4.1.10 (多端小程序框架)
- **UI**: React 18 + NutUI React 3.0.18
- **状态管理**: Zustand 5.0.10
- **请求管理**: ahooks useRequest + 自定义 request.ts
- **表单验证**: React Hook Form + Zod
- **样式**: Sass + Tailwind CSS (weapp-tailwindcss)
- **构建**: Vite 4.2.0
- **语言**: TypeScript 5.1.0

## 代码规范

### 注释语言

**所有代码注释必须使用中文**，包括：

- 文件功能说明
- 方法用途说明
- 配置项含义
- 枚举值解释

### 路径别名

使用 `@/` 作为 `src/` 的别名：

```typescript
import { useUserStore } from "@/store";
import { http } from "@/services/request";
```

### 请求规范

- 使用 `src/services/request.ts` 封装的 `http` 对象
- **禁止使用 axios**（小程序不支持）
- 通过 `useRequest` Hook 调用接口

### 状态管理

- 使用 Zustand Store
- Store 文件放在 `src/store/` 目录
- 使用 selector 优化渲染性能

### 样式规范

- 支持 Tailwind CSS
- CSS background-image **不支持本地路径**，需用网络图片或 base64
- 固定尺寸使用大写 `PX` 防止转换为 rpx

## 目录结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── config/          # 配置文件 (env.ts)
├── constants/       # 常量定义 (api.ts, storage.ts)
├── hooks/           # 自定义 Hooks
├── pages/           # 页面
├── schemas/         # Zod 验证规则
├── services/        # API 服务层 (request.ts)
├── store/           # Zustand 状态管理
├── styles/          # 全局样式
├── types/           # TypeScript 类型
└── utils/           # 工具函数
```

## Taro 开发注意事项

1. **生命周期**: 使用 Taro Hooks (useDidShow, useLoad, useReady)
2. **条件编译**: 使用 `process.env.TARO_ENV` 判断平台
3. **switchTab**: 不能传参，用 Store 或 Storage 传递数据
4. **页面栈**: 最多 10 层，超过需要用 redirectTo
5. **网络请求**: 不能用 axios，必须用 Taro.request 封装

## 常用命令

```bash
pnpm dev:weapp      # 微信小程序开发模式
pnpm dev:h5         # H5 开发模式
pnpm build:weapp    # 微信小程序生产构建
```

## 代码示例

### 请求示例

```typescript
import { useRequest } from "@/hooks";
import { userService } from "@/services/user";

const { data, loading, run } = useRequest(userService.getProfile, {
  manual: true,
  throttleWait: 1000,
});
```

### 状态管理示例

```typescript
import { useUserStore, selectIsLogin } from "@/store";

const isLogin = useUserStore(selectIsLogin);
const { login, logout } = useUserStore();
```
