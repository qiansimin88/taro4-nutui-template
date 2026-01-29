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
          // Tailwind v4 下不再需要 injectAdditionalCssVarScope，设为 false 以避免潜在的变量冲突
          injectAdditionalCssVarScope: true,
          // 在 H5 或 RN 环境下禁用该插件（仅小程序需要）
          disabled: WeappTailwindcssDisabled,
          // 将 rem 单位转换为 rpx
          rem2rpx: true,
          // CSS 入口文件路径（包含 @import "tailwindcss" 的文件）
          cssEntries: [path.resolve(__dirname, "../src/app.scss")],
        }),
        /**
         * 移除微信小程序不支持的 CSS 规则
         *
         * 问题：Tailwind CSS v4 会生成以下微信小程序不支持的 CSS 特性：
         * 1. 嵌套的 @supports 和 @media (color-gamut: p3) 规则
         * 2. :where() 选择器
         * 3. color(display-p3 ...) 颜色函数
         *
         * 报错示例：
         * ./app-origin.wxss(7:59052): error at token `:`
         *
         * 解决方案：在构建时移除或替换这些不兼容的 CSS 规则
         */
        {
          name: "vite-plugin-remove-unsupported-css",
          enforce: "post",
          generateBundle(
            _: unknown,
            bundle: Record<
              string,
              { type: string; source?: string | Uint8Array }
            >,
          ) {
            // 仅在小程序环境下处理
            if (WeappTailwindcssDisabled) return;

            /**
             * 移除从指定位置开始的完整嵌套块（包括所有嵌套的大括号）
             * @param css CSS 源码
             * @param startIndex 块开始的位置（@规则的起始位置）
             * @returns 移除块后的 CSS
             */
            const removeNestedBlock = (
              css: string,
              startIndex: number,
            ): string => {
              // 找到第一个 { 的位置
              const openBraceIndex = css.indexOf("{", startIndex);
              if (openBraceIndex === -1) return css;

              let depth = 1;
              let endIndex = openBraceIndex + 1;

              // 遍历找到匹配的闭合大括号
              while (depth > 0 && endIndex < css.length) {
                if (css[endIndex] === "{") depth++;
                else if (css[endIndex] === "}") depth--;
                endIndex++;
              }

              // 移除从 startIndex 到 endIndex 的内容
              return css.slice(0, startIndex) + css.slice(endIndex);
            };

            for (const fileName in bundle) {
              const chunk = bundle[fileName];
              // 只处理 CSS 文件
              if (chunk.type === "asset" && fileName.endsWith(".wxss")) {
                let source =
                  typeof chunk.source === "string"
                    ? chunk.source
                    : new TextDecoder().decode(chunk.source);

                // 1. 循环移除所有 @supports (color: color(display-p3 ...)) 块
                let supportsMatch;
                const supportsRegex =
                  /@supports\s*\(\s*color:\s*color\(display-p3/g;
                while ((supportsMatch = supportsRegex.exec(source)) !== null) {
                  source = removeNestedBlock(source, supportsMatch.index);
                  supportsRegex.lastIndex = 0;
                }

                // 2. 循环移除所有独立的 @media (color-gamut: p3) 块
                let mediaMatch;
                const mediaRegex = /@media\s*\(\s*color-gamut:\s*p3\s*\)/g;
                while ((mediaMatch = mediaRegex.exec(source)) !== null) {
                  source = removeNestedBlock(source, mediaMatch.index);
                  mediaRegex.lastIndex = 0;
                }

                // 3. 将 :where(...) 选择器简化为普通选择器
                // 例如: .space-y-3 :where(>:not(:last-child)) -> .space-y-3 >:not(:last-child)
                source = source.replace(/:where\(([^)]+)\)/g, "$1");

                // 4. 移除 color(display-p3 ...) 颜色声明（保留前面的 rgb() 回退值）
                // 匹配: color:rgb(...);color:color(display-p3 ...); -> color:rgb(...);
                source = source.replace(
                  /;color:color\(display-p3[^;)]+\)/g,
                  "",
                );
                // 匹配: background-color:rgb(...);background-color:color(display-p3 ...); -> background-color:rgb(...);
                source = source.replace(
                  /;background-color:color\(display-p3[^;)]+\)/g,
                  "",
                );

                // 5. 将不兼容的子选择器转换成小程序兼容的形式
                // 把 .space-y-3 >:not(:last-child) 转换成 .space-y-3>view+view
                // 这是 weapp-tailwindcss 文档推荐的兼容方案
                source = source.replace(
                  /(\.[a-zA-Z0-9_-]+)\s*>:not\(:last-child\)/g,
                  "$1>view+view",
                );
                source = source.replace(
                  /(\.[a-zA-Z0-9_-]+)\s*>:not\(:first-child\)/g,
                  "$1>view+view",
                );
                // 处理带有 :where() 包裹的情况（已经被步骤 3 简化过）
                source = source.replace(
                  /(\.[a-zA-Z0-9_-]+)\s+>:not\(:last-child\)/g,
                  "$1>view+view",
                );
                source = source.replace(
                  /(\.[a-zA-Z0-9_-]+)\s+>:not\(:first-child\)/g,
                  "$1>view+view",
                );

                // 6. 清理可能遗留的空行
                source = source.replace(/\n{3,}/g, "\n\n");

                chunk.source = source;
              }
            }
          },
        },
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
