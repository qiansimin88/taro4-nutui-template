import type { UserConfigExport } from "@tarojs/cli";
export default {
  mini: {
    debugReact: true, // ✅ 这个配置解决了 zustand 编译问题  主要是taro 的bug导致的
  },
  h5: {},
} satisfies UserConfigExport<"vite">;
