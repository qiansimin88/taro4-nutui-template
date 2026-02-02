# 项目概述

-星链小程序 - 基于 Taro 4 + React 18 + NutUI 的多端小程序项目。

## 技术栈

- **框架**: Taro 4.1.10 (多端小程序框架)
- **UI**: React 18 + NutUI React 3.0.18
- **状态管理**: Zustand 5.0.10
- **请求管理**: ahooks useRequest + 自定义 request.ts
- **表单验证**: React Hook Form + Zod
- **样式**: Sass + Tailwind CSS (weapp-tailwindcss)
- **构建**: Vite 4.2.0
- **语言**: TypeScript 5.1.0

## 目录结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── config/          # 配置文件 (env.ts)
├── constants/       # 常量定义 (api.ts, storage.ts)
├── hooks/           # 自定义 Hooks (useRequest)
├── pages/           # 页面
├── schemas/         # Zod 验证规则
├── services/        # API 服务层 (request.ts)
├── store/           # Zustand 状态管理
├── styles/          # 全局样式 (variables.scss, mixins.scss)
├── types/           # TypeScript 类型
└── utils/           # 工具函数 (storage.ts, nav.ts, format.ts)
```

## 代码规范

### 注释语言

- **所有代码注释必须使用中文**
- 包括：文件说明、方法注释、配置项说明、枚举值解释

### 文件命名

- 组件：大驼峰 `UserProfile.tsx`
- 工具/服务：小驼峰 `userService.ts`
- 常量：全大写下划线 `API_BASE_URL`

### 路径别名

- 使用 `@/` 作为 `src/` 的别名
- 示例：`import { useUserStore } from '@/store'`

## 开发约定

### 请求封装

- 使用 `src/services/request.ts` 封装的 `http` 对象
- 不要使用 axios（小程序不支持）
- 统一通过 `useRequest` Hook 调用

### 状态管理

- 全局状态使用 Zustand Store
- Store 文件放在 `src/store/` 目录
- 使用 selector 优化渲染性能

### 路由跳转

- 使用 `src/utils/nav.ts` 封装的 `nav` 对象
- 自动处理页面栈限制（超过 9 层自动 redirectTo）

### 表单验证

- Schema 定义放在 `src/schemas/` 目录
- 使用 `z.infer` 导出类型复用

### 样式

- 支持 Tailwind CSS
- **禁止使用 `space-x-n` / `space-y-n` 工具类**：由于小程序不完全支持 `:where` 伪类和子选择器，必须统一使用 `flex flex-col gap-n` 或 `flex flex-row gap-n` 替代。
- SCSS 变量定义在 `src/styles/variables.scss`
- CSS background-image 不支持本地路径，需用网络图片或 base64
- 使用 `PX` 大写防止 px 转 rpx

## 常用命令

```bash
pnpm dev:weapp      # 微信小程序开发模式
pnpm dev:h5         # H5 开发模式
pnpm build:weapp    # 微信小程序生产构建
```

## Taro 注意事项

1. **生命周期**: 使用 Taro Hooks (useDidShow, useLoad 等)
2. **条件编译**: 使用 `process.env.TARO_ENV` 判断平台
3. **switchTab**: 不能传参，用 Store 或 Storage
4. **页面栈**: 最多 10 层，超过需要用 redirectTo

## 文档参考

- `docs/useRequest使用指南.md` - 请求管理
- `docs/表单验证指南(React-Hook-Form+Zod).md` - 表单验证
- `docs/调试工具指南(vConsole).md` - 调试工具
