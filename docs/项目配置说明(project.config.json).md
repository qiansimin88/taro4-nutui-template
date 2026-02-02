# 项目配置说明 (project.config.json)

本文档详细说明 `project.config.json` 文件中各配置项的作用和含义。

## 配置项说明

### 基础配置

| 配置项            | 说明                                                          |
| ----------------- | ------------------------------------------------------------- |
| `miniprogramRoot` | 小程序根目录，Taro 构建后的文件会输出到此目录，默认为 `dist/` |
| `projectname`     | 项目名称                                                      |
| `description`     | 项目描述信息                                                  |
| `appid`           | 微信小程序 AppID                                              |

### setting 项目设置

| 配置项                      | 说明                                              |
| --------------------------- | ------------------------------------------------- |
| `urlCheck`                  | 检查安全域名和 TLS 版本                           |
| `es6`                       | ES6 转 ES5，Taro 构建已处理，此处关闭避免重复转换 |
| `enhance`                   | 启用增强编译                                      |
| `compileHotReLoad`          | 开启编译热重载，在开发时可实时看到修改效果        |
| `useStaticServer`           | 使用静态服务器，提升 Vite 模式下的热更新体验      |
| `postcss`                   | 启用 PostCSS，Taro 构建已处理样式转换，此处关闭   |
| `preloadBackgroundData`     | 预加载后台数据                                    |
| `minified`                  | 上传时压缩代码                                    |
| `newFeature`                | 启用新特性                                        |
| `autoAudits`                | 自动预览                                          |
| `coverView`                 | 在线调试 CoverView                                |
| `showShadowRootInWxmlPanel` | 在 WXML 面板中显示 Shadow Root                    |
| `scopeDataCheck`            | 数据缓存校验                                      |
| `useCompilerModule`         | 使用新的编译模块                                  |
| `compileWorklet`            | 编译 Worklet                                      |
| `uglifyFileName`            | 混淆文件名                                        |
| `uploadWithSourceMap`       | 上传带 Source Map                                 |
| `packNpmManually`           | 手动处理 npm 依赖                                 |
| `packNpmRelationList`       | npm 依赖关系                                      |
| `minifyWXSS`                | 压缩 WXSS                                         |
| `minifyWXML`                | 压缩 WXML                                         |
| `localPlugins`              | 使用本地插件                                      |
| `disableUseStrict`          | 禁用严格模式                                      |
| `useCompilerPlugins`        | 使用编译插件                                      |
| `condition`                 | 条件编译                                          |
| `swc`                       | 启用 SWC                                          |
| `disableSWC`                | 禁用 SWC                                          |

### babelSetting Babel 设置

| 配置项           | 说明         |
| ---------------- | ------------ |
| `ignore`         | 忽略列表     |
| `disablePlugins` | 禁用插件列表 |
| `outputPath`     | 输出路径     |

### 其他配置

| 配置项                      | 说明                                                     |
| --------------------------- | -------------------------------------------------------- |
| `compileType`               | 编译类型，可选 `miniprogram`（小程序）、`plugin`（插件） |
| `simulatorType`             | 模拟器类型                                               |
| `simulatorPluginLibVersion` | 模拟器插件库版本                                         |
| `condition`                 | 启动模式配置                                             |
| `packOptions`               | 打包配置                                                 |
| `editorSetting`             | 编辑器设置                                               |
| `libVersion`                | 基础库版本                                               |

## 特殊说明

- `useStaticServer: true` 是为了优化 Taro 4 + Vite 模式下的热更新体验而添加的配置
- `es6: false` 是因为 Taro 构建过程已处理 ES6 转换，避免重复转换
- `postcss: false` 是因为 Taro 已处理样式转换，无需微信开发者工具再次处理
