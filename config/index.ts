import { defineConfig, type UserConfigExport } from "@tarojs/cli";
// import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import devConfig from "./dev";
import prodConfig from "./prod";
import vitePluginImp from "vite-plugin-imp";
// tailwindcss config
import { UnifiedViteWeappTailwindcssPlugin } from "weapp-tailwindcss/vite";
import tailwindcss from "@tailwindcss/postcss";
import path from "node:path";

const isH5 = process.env.TARO_ENV === "h5";
const isApp = process.env.TARO_ENV === "rn";
const WeappTailwindcssDisabled = isH5 || isApp;

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<"vite">(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<"vite"> = {
    projectName: "taro4-nutui-template",
    date: "2026-1-26",
    designWidth: 375,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    plugins: ["@tarojs/plugin-html"],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: "react",
    compiler: {
      type: "vite",
      vitePlugins: [
        vitePluginImp({
          libList: [
            {
              libName: "@nutui/nutui-react-taro",
              libDirectory: "dist/es/packages",
              camel2DashComponentName: false,
              style: (name) => {
                return `@nutui/nutui-react-taro/dist/es/packages/${name.toLowerCase()}/style/css`;
              },
            },
          ],
        }),
        // tailwindcss config
        {
          name: "postcss-config-loader-plugin",
          config(config) {
            // 加载 tailwindcss
            if (typeof config.css?.postcss === "object") {
              config.css?.postcss.plugins?.unshift(
                tailwindcss({
                  //在生产环境下构建时，Tailwind CSS 将不会自动校准单位（例如保持 PX 为大写），这对于 Taro 中需要区分 px 和 PX（防止被 pxtransform 转换）的场景非常重要。
                  optimize: false,
                })
              );
            }
          },
        },
        UnifiedViteWeappTailwindcssPlugin({
          // 当编译环境为 h5 或 rn 时，该插件会自动禁用，避免在非小程序环境下执行小程序特有的 CSS 转换逻辑。
          disabled: WeappTailwindcssDisabled,
          rem2rpx: true,
          cssEntries: [
            // 你 @import "tailwindcss"; 那个文件绝对路径
            path.resolve(__dirname, "../src/app.scss"),
          ],
        }),
      ],
    },
    sass: {
      data: `@use "@nutui/nutui-react-taro/dist/styles/variables.scss" as *;\n`,
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            selectorBlackList: ["nut-"],
          },
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    },
    h5: {
      publicPath: "/",
      staticDirectory: "static",

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[chunkhash].css",
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    },
    rn: {
      appName: "taroDemo",
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };
  if (process.env.NODE_ENV === "development") {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
