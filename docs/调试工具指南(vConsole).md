# 调试工具指南 (vConsole)

本项目集成了 `vConsole` 用于在移动端（尤其是 H5 环境）进行前端调试。

## 核心用途

- **查看日志**：在手机上直接查看 `console.log/error`。
- **网络请求**：监控 API 请求及响应。
- **系统信息**：查看设备信息、LocalStorage、Cookie 等。
- **Element 检查**：简易的 DOM 树查看。

---

## 快速集成

### 在 `src/app.ts` 中引入

建议仅在开发环境或测试环境开启：

```typescript
import VConsole from "vconsole";

if (process.env.NODE_ENV === "development") {
  new VConsole();
}
```

---

## 多端调试建议

### 1. H5 端

`vConsole` 是 H5 调试的最佳选择。集成后，页面右下角会出现绿色的 `vConsole` 按钮。

### 2. 小程序端 (WeApp/Alipay/TT...)

虽然 `vConsole` 可以在某些小程序环境运行，但更推荐使用平台原生的调试面板：

- **代码触发**：

  ```typescript
  import Taro from "@tarojs/taro";

  // 开启小程序调试面板
  Taro.setEnableDebug({ enableDebug: true });
  ```

- **手动开启**：点击小程序右上角“...” -> 开发调试 -> 打开调试。

---

## 最佳实践

1. **条件开启**：通过环境变量或 URL 参数控制 `vConsole` 的显隐，避免在生产环境露出。
2. **插件扩展**：`vConsole` 支持自定义插件，如果有特殊监控需求可以自行扩展。
3. **日志清理**：正式发版前，请确保通过插件或配置过滤掉敏感的日志信息。
