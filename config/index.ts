// Taro CLI 配置函数和类型
import { defineConfig, type UserConfigExport } from "@tarojs/cli";
// import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
// 开发环境和生产环境配置
import devConfig from "./dev";
import prodConfig from "./prod";
// Vite 按需加载插件
import vitePluginImp from "vite-plugin-imp";
// TailwindCSS 相关插件
import { UnifiedViteWeappTailwindcssPlugin } from "weapp-tailwindcss/vite";
import tailwindcss from "@tailwindcss/postcss";
import path from "node:path";

const isH5 = process.env.TARO_ENV === "h5";
// 判断是否为 React Native 环境
const isApp = process.env.TARO_ENV === "rn";
// 在 H5 和 RN 环境下禁用小程序 TailwindCSS 插件
const WeappTailwindcssDisabled = isH5 || isApp;

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<"vite">(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<"vite"> = {
    projectName: "joykings3d-mini",
    date: "2026-1-26",
    // 设计稿宽度，单位 px
    designWidth: 375,
    // 设计稿尺寸换算规则
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    // 源码目录
    sourceRoot: "src",
    // 输出目录
    outputRoot: "dist",
    // Taro 插件
    plugins: ["@tarojs/plugin-html"],
    // 全局常量定义
    defineConstants: {},
    // 文件拷贝配置
    copy: {
      patterns: [],
      options: {},
    },
    // 框架类型
    framework: "react",
    // 路径别名配置
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    // 编译器配置
    compiler: {
      type: "vite",
      vitePlugins: [
        // Vite 路径别名配置（确保开发模式也能正确解析）
        {
          name: "vite-alias-resolver",
          enforce: "pre",
          config() {
            return {
              resolve: {
                alias: {
                  "@": path.resolve(__dirname, "../src"),
                },
              },
            };
          },
        },
        // NutUI 按需加载插件
        vitePluginImp({
          libList: [
            {
              // 组件库名称
              libName: "@nutui/nutui-react-taro",
              // 组件库目录
              libDirectory: "dist/es/packages",
              replaceOldImport: false,
              // 不转换组件名称格式（保持原样）
              camel2DashComponentName: false,
              // 样式文件路径规则
              style: (name) => {
                return `@nutui/nutui-react-taro/dist/es/packages/${name.toLowerCase()}/style/css`;
              },
            },
          ],
        }),
        // PostCSS 配置加载插件
        {
          name: "postcss-config-loader-plugin",
          config(config: any) {
            // 加载 TailwindCSS PostCSS 插件
            if (typeof config.css?.postcss === "object") {
              config.css?.postcss.plugins?.unshift(
                tailwindcss({
                  // 禁用优化，保持 PX 大写不被转换（Taro 中 PX 不会被 pxtransform 转换为 rpx）
                  optimize: false,
                }),
              );
            }
          },
        },
        // 小程序 TailwindCSS 转换插件
        UnifiedViteWeappTailwindcssPlugin({
          // 把它设为 true，这能在插件内部启用功能，来重新注入整个 tailwindcss 的 css 中的 var 区域块( tailwindcss@3 )。
          injectAdditionalCssVarScope: true,
          // 在 H5 或 RN 环境下禁用该插件（仅小程序需要）
          disabled: WeappTailwindcssDisabled,
          // 将 rem 单位转换为 rpx
          rem2rpx: true,
          // CSS 入口文件路径（包含 @import "tailwindcss" 的文件）
          cssEntries: [path.resolve(__dirname, "../src/app.scss")],
        }),
      ],
    },
    // Sass 配置
    sass: {
      // 全局注入样式变量和 mixins
      data: `@use "@nutui/nutui-react-taro/dist/styles/variables.scss" as *;
              @use "src/styles/variables.scss" as *;
              @use "src/styles/mixins.scss" as *;
              `,
    },
    // 小程序配置
    mini: {
      // 禁用 SourceMap 以减少内存占用，防止 OOM
      enableSourceMap: false,
      postcss: {
        // px 转 rpx 配置
        pxtransform: {
          enable: true,
          config: {
            // 选择器黑名单，nut- 开头的类名不转换（保持 NutUI 组件样式）
            selectorBlackList: ["nut-"],
          },
        },
        // CSS Modules 配置
        cssModules: {
          // 是否启用 CSS Modules（默认关闭）
          enable: false,
          config: {
            // 命名模式：global（全局） / module（模块化）
            namingPattern: "module",
            // 生成的类名格式
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    },
    // H5 配置
    h5: {
      // 禁用 SourceMap 以减少内存占用，防止 OOM
      enableSourceMap: false,
      // 静态资源公共路径
      publicPath: "/",
      // 静态资源目录
      staticDirectory: "static",

      // CSS 提取插件配置
      miniCssExtractPluginOption: {
        // 忽略 CSS 引入顺序警告
        ignoreOrder: true,
        // CSS 文件名格式
        filename: "css/[name].[hash].css",
        // CSS chunk 文件名格式
        chunkFilename: "css/[name].[chunkhash].css",
      },
      postcss: {
        // 自动添加浏览器前缀
        autoprefixer: {
          enable: true,
          config: {},
        },
        // CSS Modules 配置
        cssModules: {
          // 是否启用 CSS Modules（默认关闭）
          enable: false,
          config: {
            // 命名模式：global（全局） / module（模块化）
            namingPattern: "module",
            // 生成的类名格式
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    },
    // React Native 配置
    rn: {
      // RN 应用名称
      appName: "taroDemo",
      postcss: {
        // CSS Modules 配置
        cssModules: {
          // 是否启用 CSS Modules（默认关闭）
          enable: false,
        },
      },
    },
  };
  // 根据环境变量合并对应配置
  if (process.env.NODE_ENV === "development") {
    // 开发环境：合并开发配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产环境：合并生产配置（开启压缩混淆等优化）
  return merge({}, baseConfig, prodConfig);
});
