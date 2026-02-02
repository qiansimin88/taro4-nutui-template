# 图标使用指南 (Iconify + Tailwind CSS)

本项目集成了 **Iconify for Tailwind CSS**，可以直接使用 Tailwind CSS 类名的方式来使用海量图标，无需手动导入图标组件。

---

## 快速开始

### 基本用法

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

### 语法规则

```
i-{collection}-{icon-name}
```

- `i-`: 固定前缀（可在配置文件中自定义）
- `{collection}`: 图标集合名称（如 `lucide`、`mdi`）
- `{icon-name}`: 图标名称（小写，用 `-` 连接）

---

## 调整图标样式

### 修改大小

使用 Tailwind CSS 的 `text-{size}` 类：

```tsx
<View className="i-lucide-heart text-xs" />   {/* 12px */}
<View className="i-lucide-heart text-sm" />   {/* 14px */}
<View className="i-lucide-heart text-base" /> {/* 16px */}
<View className="i-lucide-heart text-lg" />   {/* 18px */}
<View className="i-lucide-heart text-xl" />   {/* 20px */}
<View className="i-lucide-heart text-2xl" />  {/* 24px */}
<View className="i-lucide-heart text-3xl" />  {/* 30px */}
<View className="i-lucide-heart text-4xl" />  {/* 36px */}
<View className="i-lucide-heart text-5xl" />  {/* 48px */}
<View className="i-lucide-heart text-6xl" />  {/* 60px */}
```

### 修改颜色

使用 Tailwind CSS 的 `text-{color}` 类：

```tsx
<View className="i-lucide-star text-yellow-400" />
<View className="i-lucide-heart text-red-500" />
<View className="i-lucide-check text-green-600" />
<View className="i-lucide-alert text-orange-500" />
<View className="i-lucide-info text-blue-600" />
```

### 组合使用

```tsx
<View className="i-lucide-rocket text-4xl text-purple-600 hover:text-purple-800" />
```

---

## 已安装的图标集

### Lucide Icons

- **官网**: https://lucide.dev/icons/
- **数量**: 1000+ 图标
- **特点**: 现代化、简洁、开源
- **使用**: `i-lucide-{icon-name}`

**常用图标示例**：

```tsx
{/* 导航类 */}
<View className="i-lucide-home" />
<View className="i-lucide-menu" />
<View className="i-lucide-search" />
<View className="i-lucide-arrow-left" />
<View className="i-lucide-arrow-right" />

{/* 操作类 */}
<View className="i-lucide-plus" />
<View className="i-lucide-minus" />
<View className="i-lucide-edit" />
<View className="i-lucide-trash" />
<View className="i-lucide-save" />

{/* 状态类 */}
<View className="i-lucide-check" />
<View className="i-lucide-x" />
<View className="i-lucide-alert-circle" />
<View className="i-lucide-info" />
<View className="i-lucide-check-circle" />

{/* 用户类 */}
<View className="i-lucide-user" />
<View className="i-lucide-users" />
<View className="i-lucide-user-plus" />
<View className="i-lucide-heart" />
<View className="i-lucide-star" />

{/* 文件类 */}
<View className="i-lucide-file" />
<View className="i-lucide-folder" />
<View className="i-lucide-download" />
<View className="i-lucide-upload" />
<View className="i-lucide-image" />

{/* 设置类 */}
<View className="i-lucide-settings" />
<View className="i-lucide-lock" />
<View className="i-lucide-unlock" />
<View className="i-lucide-eye" />
<View className="i-lucide-eye-off" />
```

---

## 添加更多图标集

### 1. 安装图标集合包

```bash
# 安装 Material Design Icons
pnpm add -D @iconify-json/mdi

# 安装 Heroicons
pnpm add -D @iconify-json/heroicons

# 或者安装所有图标（50MB+，不推荐）
pnpm add -D @iconify/json
```

### 2. 更新配置文件

编辑 `tailwind.config.js`：

```javascript
const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons");

module.exports = {
  plugins: [
    iconsPlugin({
      collections: getIconCollections([
        "lucide", // Lucide Icons
        "mdi", // Material Design Icons
        "heroicons", // Heroicons
      ]),
    }),
  ],
};
```

### 3. 重启开发服务器

```bash
# 停止当前进程，然后重新运行
pnpm dev:weapp
```

---

## 智能提示

在支持的编辑器（如 VS Code）中，输入 `i-lucide-` 会自动提示所有可用的图标名称。

**推荐安装 VS Code 插件**：

- **Tailwind CSS IntelliSense**: 提供 Tailwind CSS 类名智能提示

---

## 实际应用示例

### 按钮图标

```tsx
import { View, Text } from "@tarojs/components";
import { Button } from "@nutui/nutui-react-taro";

function ActionButtons() {
  return (
    <View className="flex gap-2">
      <Button>
        <View className="flex items-center gap-1">
          <View className="i-lucide-plus text-lg" />
          <Text>添加</Text>
        </View>
      </Button>

      <Button type="danger">
        <View className="flex items-center gap-1">
          <View className="i-lucide-trash text-lg" />
          <Text>删除</Text>
        </View>
      </Button>
    </View>
  );
}
```

### 列表项图标

```tsx
function FeatureList() {
  return (
    <View className="flex flex-col gap-3">
      <View className="flex items-center gap-2">
        <View className="i-lucide-check-circle text-xl text-green-500" />
        <Text>功能已启用</Text>
      </View>

      <View className="flex items-center gap-2">
        <View className="i-lucide-clock text-xl text-orange-500" />
        <Text>等待处理</Text>
      </View>

      <View className="flex items-center gap-2">
        <View className="i-lucide-x-circle text-xl text-red-500" />
        <Text>功能已禁用</Text>
      </View>
    </View>
  );
}
```

### 导航图标

```tsx
function TabBar() {
  return (
    <View className="flex justify-around py-2">
      <View className="flex flex-col items-center">
        <View className="i-lucide-home text-2xl text-blue-600" />
        <Text className="text-xs">首页</Text>
      </View>

      <View className="flex flex-col items-center">
        <View className="i-lucide-shopping-cart text-2xl text-gray-600" />
        <Text className="text-xs">购物车</Text>
      </View>

      <View className="flex flex-col items-center">
        <View className="i-lucide-user text-2xl text-gray-600" />
        <Text className="text-xs">我的</Text>
      </View>
    </View>
  );
}
```

---

## 配置文件说明

### tailwind.config.js

```javascript
const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons");

module.exports = {
  plugins: [
    iconsPlugin({
      // 选择要使用的图标集合
      collections: getIconCollections(["lucide"]),

      // 可选配置
      // scale: 1.2,           // 图标缩放比例，默认 1
      // prefix: 'icon',       // 类名前缀，默认 'i'
      // extraProperties: {    // 额外的 CSS 属性
      //   'display': 'inline-block',
      //   'vertical-align': 'middle',
      // },
    }),
  ],
};
```

### src/app.scss

```scss
/* 导入 Tailwind CSS */
@import "tailwindcss";

/* 引入 Tailwind 配置文件 */
@config "../tailwind.config.js";
```

---

## 常见问题

### Q: 图标不显示？

**解决方案**：

1. 检查是否已安装对应的图标集合包：

   ```bash
   pnpm add -D @iconify-json/lucide
   ```

2. 检查 `tailwind.config.js` 是否正确配置

3. 检查 `src/app.scss` 是否包含 `@config` 指令

4. 重启开发服务器：
   ```bash
   pnpm dev:weapp
   ```

### Q: 智能提示不工作？

**解决方案**：

1. 安装 VS Code 插件：**Tailwind CSS IntelliSense**

2. 重启 VS Code

3. 确保项目根目录有 `tailwind.config.js` 文件

### Q: 如何查找图标名称？

**解决方案**：

访问图标集合的官网：

- Lucide: https://lucide.dev/icons/
- Iconify 搜索引擎: https://icon-sets.iconify.design/

搜索你需要的图标，复制名称（注意转换为小写并使用 `-` 连接）

### Q: 图标太小或太大？

**解决方案**：

使用 Tailwind CSS 的 `text-{size}` 类调整大小：

```tsx
{
  /* 太小 */
}
<View className="i-lucide-home text-xs" />;

{
  /* 正常 */
}
<View className="i-lucide-home text-base" />;

{
  /* 较大 */
}
<View className="i-lucide-home text-2xl" />;

{
  /* 很大 */
}
<View className="i-lucide-home text-6xl" />;
```

---

## 性能优化

### 按需加载

项目已配置按需加载，只会打包实际使用的图标，不会增加多余的包体积。

### 推荐做法

1. **只安装需要的图标集合**，避免安装 `@iconify/json`（50MB+）

2. **使用常用图标集**，如 `lucide`、`heroicons`

3. **避免在循环中使用大量图标**，可能影响性能

---

## 相关资源

- [Iconify 官网](https://iconify.design/)
- [Lucide Icons](https://lucide.dev/)
- [Iconify 图标搜索](https://icon-sets.iconify.design/)
- [@egoist/tailwindcss-icons](https://github.com/egoist/tailwindcss-icons)
- [Tailwind CSS 文档](https://tailwindcss.com/)

---

## 总结

使用 Iconify for Tailwind CSS 的优势：

✅ **无需手动导入** - 直接使用类名即可  
✅ **智能提示** - 编辑器自动提示可用图标  
✅ **按需加载** - 只打包使用的图标  
✅ **统一风格** - 使用 Tailwind CSS 类名统一管理  
✅ **海量图标** - 支持 100+ 图标集合  
✅ **易于维护** - 无需管理图标文件
