# Taro 4 + NutUI 小程序

<p align="center">
  <b>🚀 小程序</b>
</p>

<p align="center">
  基于 <b>Taro 4</b> + <b>React 18</b> + <b>NutUI</b> 的现代化多端小程序，集成了最佳实践和常用工具库。
</p>

---

## 特性亮点

### 📦 开箱即用

- ✅ 完整的项目结构和配置
- ✅ 集成了所有常用工具库
- ✅ 详细的使用文档和示例

### 🎨 现代化技术栈

- ✨ Taro 4 + React 18 + TypeScript
- 🎨 NutUI React + Tailwind CSS 4
- 🕹️ Iconify 图标系统（支持 1000+ 图标）
- 📦 Zustand 状态管理 + 持久化
- 🔄 ahooks useRequest 请求管理
- ✅ React Hook Form + Zod 表单验证

### 🔧 开发工具

- 🛠️ ESLint + EditorConfig 代码规范
- 🐛 vConsole H5 调试工具
- 🎯 环境配置分离（dev/prod）

---

## 技术栈

| 类别     | 技术                  | 版本           |
| -------- | --------------------- | -------------- |
| 框架     | Taro                  | 4.1.11         |
| UI 框架  | React                 | 18.x           |
| 组件库   | NutUI React           | 3.0.18         |
| 状态管理 | Zustand               | 5.0.10         |
| 请求管理 | ahooks (useRequest)   | 3.9.6          |
| 表单验证 | React Hook Form + Zod | 7.71.1 / 4.3.6 |
| 样式方案 | Sass + Tailwind CSS   | 1.60 / 4.1.18  |
| 图标系统 | Iconify + Lucide      | 1.9.0 / 1.2.87 |
| 构建工具 | Vite                  | 4.2.0          |
| 语言     | TypeScript            | 5.1.0          |

## 支持平台

- 微信小程序
- H5
- 支付宝小程序
- 百度小程序
- 字节跳动小程序
- QQ 小程序
- 京东小程序

## 快速开始

<!-- ### 1. 克隆/使用模板

```bash
# # 克隆项目
# git clone <your-template-repo-url>
# cd taro4-nutui-template

# 安装依赖
pnpm install
``` -->

<!-- ### 2. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env.development

# 编辑 .env.development 文件，填入实际的 API 地址
TARO_APP_API_URL=https://your-api.example.com
```

### 3. 修改项目信息

```bash
# 修改 package.json 中的项目名称和描述
{
  "name": "your-project-name",
  "description": "Your project description"
}

# 修改 config/index.ts 中的项目名
projectName: "your-project-name"
``` -->

### 4. 启动开发

```bash
# 开发模式（微信小程序）
pnpm dev:weapp

# 开发模式（H5）
pnpm dev:h5

# 生产构建（微信小程序）
pnpm build:weapp
```

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── config/          # 配置文件
├── constants/       # 常量定义
├── hooks/           # 自定义 Hooks
├── pages/           # 页面
├── schemas/         # Zod 验证规则
├── services/        # API 服务层
├── store/           # Zustand 状态管理
├── styles/          # 全局样式
├── types/           # TypeScript 类型
└── utils/           # 工具函数
```

---

## 核心工具使用规范

### 1. 登录鉴权 (AuthButton + useAuth Hook)

项目采用**静默登录 + 分层鉴权**架构，无需独立登录页即可完成用户认证。

**核心特点**：

- 老用户自动登录，无感知
- 新用户在操作时触发手机号授权
- 分层设计：按钮用组件，非按钮用 Hook
- 灵活应对各种鉴权场景

#### 按钮场景：使用 AuthButton 组件

直接在当前页授权，无跳转，体验流畅：

```tsx
import { AuthButton } from "@/components";

function ProductDetail() {
  const handleBuy = () => {
    // 已登录才会执行
    console.log("购买商品");
  };

  return <AuthButton onClick={handleBuy}>立即购买</AuthButton>;
}
```

#### 非按钮场景：使用 useAuth Hook

适用于图片、List Item、View 等非按钮元素：

```tsx
import { useAuth } from '@/hooks';
import { Image } from '@tarojs/components';

function Gallery() {
  const { checkAuth } = useAuth();

  const handleImageClick = async () => {
    await checkAuth(() => {
      // 登录后执行的业务逻辑
      Taro.previewImage({ urls: [...] });
    });
  };

  return <Image onClick={handleImageClick} src="..." />;
}
```

**工作流程**：

```
按钮场景：
  点击按钮 → AuthButton 检测未登录 → 弹出手机号授权 → 授权成功 → 执行回调

非按钮场景：
  点击元素 → checkAuth 检测未登录 → 提示弹窗 → 跳转登录页 →
  用户使用 AuthButton 授权 → 返回原页面
```

> 详细文档：[docs/登录鉴权架构指南.md](./docs/登录鉴权架构指南.md)

### 1. 请求管理 (useRequest)

项目使用 `ahooks` 的 `useRequest` 配合 `request.ts` 进行请求管理。

**核心特性：**

- 自动处理 Loading 状态
- 统一错误处理和 Toast 提示
- 401 自动跳转登录
- 支持防抖、节流、轮询、缓存、重试

**基础用法：**

```typescript
import { useRequest } from "@/hooks";
import { userService } from "@/services/user";

// 自动请求
const { data, loading } = useRequest(userService.getProfile);

// 手动请求
const { run } = useRequest(userService.updateProfile, {
  manual: true,
  throttleWait: 1000, // 防止重复提交
  onSuccess: () => {
    /* 成功回调 */
  },
});
```

**常用配置：**

- `manual: true` - 手动触发
- `debounceWait: 300` - 搜索防抖
- `throttleWait: 1000` - 提交节流
- `pollingInterval: 3000` - 轮询
- `cacheKey: 'xxx'` - 缓存
- `retryCount: 3` - 失败重试

> 详细文档：[docs/useRequest 使用指南.md](./docs/useRequest使用指南.md)

---

### 2. 表单验证 (React Hook Form + Zod)

使用 `react-hook-form` 处理表单逻辑，`zod` 进行数据验证。

**基础用法：**

```typescript
// 1. 定义 Schema (src/schemas/user.ts)
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(2, "用户名至少2个字符"),
  password: z.string().min(6, "密码至少6位"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// 2. 在组件中使用
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
});
```

**最佳实践：**

- Schema 统一存放在 `src/schemas/` 目录
- 使用 `z.infer` 导出类型复用
- 通过 `formState.errors` 展示错误信息

> 详细文档：[docs/表单验证指南(React-Hook-Form+Zod).md](<./docs/表单验证指南(React-Hook-Form+Zod).md>)

---

### 3. 状态管理 (Zustand)

轻量级状态管理，支持小程序 Storage 持久化。

**基础用法：**

```typescript
// 使用 Store
import { useUserStore, selectIsLogin } from "@/store";

function Component() {
  const isLogin = useUserStore(selectIsLogin);
  const { login, logout } = useUserStore();
}
```

**已有 Store：**

- `useUserStore` - 用户状态（登录、token、用户信息）
- `useAppStore` - 应用状态（主题、语言、系统信息）

---

### 4. 调试工具 (vConsole)

H5 端调试工具，仅在开发环境启用。

```typescript
// src/app.ts
import VConsole from "vconsole";

if (process.env.NODE_ENV === "development") {
  new VConsole();
}
```

**小程序调试：**

```typescript
import Taro from "@tarojs/taro";

// 开启小程序调试面板
Taro.setEnableDebug({ enableDebug: true });
```

> 详细文档：[docs/调试工具指南(vConsole).md](<./docs/调试工具指南(vConsole).md>)

---

### 5. 样式方案 (Tailwind CSS)

项目集成了 `weapp-tailwindcss`，支持在小程序中使用 Tailwind CSS。

> [!IMPORTANT] > **⚠️ 禁用 `space-x/y` 工具类**：
> 在微信小程序中，Tailwind CSS 的 `space-y-n` / `space-x-n` 会编译出含 `:where` 伪类的选择器，小程序 WXSS 编译器不支持该语法，会导致布局失效。
> **必须统一使用 `flex flex-col gap-n` 或 `flex flex-row gap-n` 布局方式替代。**

```tsx
<View className="flex items-center justify-between p-4 bg-white">
  <Text className="text-lg font-bold text-gray-800">标题</Text>
</View>
```

---

### 6. 图标方案 (Iconify + Tailwind CSS)

集成了 Iconify for Tailwind CSS，支持直接使用类名调用图标。

**基本用法：**

```tsx
import { View } from "@tarojs/components";

function MyComponent() {
  return (
    <View>
      {/* 使用 Lucide 图标 */}
      <View className="i-lucide-home text-2xl text-blue-600" />
      <View className="i-lucide-user text-3xl text-gray-800" />
      <View className="i-lucide-settings text-xl text-green-500" />
    </View>
  );
}
```

**常用图标示例：**

```tsx
{/* 导航类 */}
<View className="i-lucide-home text-2xl" />
<View className="i-lucide-search text-2xl" />
<View className="i-lucide-menu text-2xl" />

{/* 状态类 */}
<View className="i-lucide-check-circle text-xl text-green-500" />
<View className="i-lucide-alert-circle text-xl text-orange-500" />
<View className="i-lucide-x-circle text-xl text-red-500" />

{/* 操作类 */}
<View className="i-lucide-plus text-lg" />
<View className="i-lucide-edit text-lg" />
<View className="i-lucide-trash text-lg" />
```

**特性：**

- ✅ 无需手动导入 - 直接使用类名即可
- ✅ 智能提示 - 输入 `i-lucide-` 自动提示
- ✅ 按需加载 - 只打包使用的图标
- ✅ 海量图标 - 支持 Lucide 等多个图标集

**图标资源：**

- Lucide Icons: https://lucide.dev/icons/
- Iconify 搜索: https://icon-sets.iconify.design/

> 详细文档：[docs/图标使用指南(Iconify+TailwindCSS).md](<./docs/图标使用指南(Iconify+TailwindCSS).md>)

---

### 7. 开发编译模式 (Condition)

项目在 `project.config.json` 中配置了 `condition` 字段，用于定义微信开发者工具的**自定义编译模式**。

**核心作用：**

- **页面直达**：避免开发过程中每次保存代码（热更新）后都自动跳回首页，通过切换编译模式可以固定在某个开发中的页面（如登录页）。
- **参数调试**：可以预设页面 `query` 参数，方便调试需要参数的详情页或搜索页。
- **场景模拟**：可以模拟特定的进入场景（scene），如扫码进入、分享进入等。

**使用方法：**

1. 在微信开发者工具顶部的编译按钮旁，点击**“普通编译”**下拉框。
2. 在下拉列表中选择已定义的模式（如“开发-登录页”）。
3. 按 `Command + B` (Mac) 或 `Ctrl + B` (Win) 编译后，小程序将直接打开预设的页面。

> **注意**：如果修改了 `project.config.json` 但模式未生效，请检查 `project.private.config.json` 是否有冲突，私有配置的优先级更高。

---

## 开发规范

### 文件命名

- 组件：大驼峰 `UserProfile.tsx`
- 工具/服务：小驼峰 `userService.ts`
- 常量：全大写 `API_BASE_URL`

### 注释规范

- 所有注释使用中文
- 复杂逻辑需添加说明

### 代码提交

```
feat: 新功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
```

---

## 常用命令

| 命令               | 说明               |
| ------------------ | ------------------ |
| `pnpm dev:weapp`   | 微信小程序开发模式 |
| `pnpm dev:h5`      | H5 开发模式        |
| `pnpm build:weapp` | 微信小程序生产构建 |
| `pnpm build:h5`    | H5 生产构建        |

---

## 相关资源

### 框架和库

- [Taro 官方文档](https://taro-docs.jd.com/)
- [React 官方文档](https://react.dev/)
- [NutUI React 文档](https://nutui.jd.com/react/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [ahooks 文档](https://ahooks.js.org/)
- [React Hook Form 文档](https://react-hook-form.com/)
- [Zod 文档](https://zod.dev/)

### 图标资源

- [Iconify 官网](https://iconify.design/)
- [Lucide Icons](https://lucide.dev/)
- [Iconify 图标搜索](https://icon-sets.iconify.design/)

### 项目文档

- [登录鉴权架构指南](./docs/登录鉴权架构指南.md)
- [useRequest 使用指南](./docs/useRequest使用指南.md)
- [表单验证指南](<./docs/表单验证指南(React-Hook-Form+Zod).md>)
- [调试工具指南](<./docs/调试工具指南(vConsole).md>)
- [图标使用指南](<./docs/图标使用指南(Iconify+TailwindCSS).md>)
- [Zustand 状态管理使用指南](./docs/Zustand状态管理使用指南.md)

---

<p align="center">
  Made with ❤️ by joykings3d
</p>
