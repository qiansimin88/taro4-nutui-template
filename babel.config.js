/**
 * Babel 编译配置文件
 * 配置 JavaScript/TypeScript 代码的转译规则和插件
 * 注意：当前项目使用 Vite 编译，但 Taro 仍需要此配置文件
 */
// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  // 预设配置
  presets: [
    [
      "taro", // Taro 官方预设
      {
        framework: "react", // 使用的框架：react
        ts: "true", // 启用 TypeScript 支持
        compiler: "vite", // 编译器：vite
      },
    ],
  ],
  // 插件配置
  plugins: [
    [
      "import", // babel-plugin-import 插件（按需导入）
      {
        libraryName: "@nutui/nutui-react-taro", // 库名
        libraryDirectory: "dist/es/packages", // 修复：正确的模块目录
        style: (name) => `${name}/style/css`, // 样式路径
        camel2DashComponentName: false, // 不转换组件名为短横线形式
      },
      "nutui-react-taro", // 插件别名
    ],
  ],
};
