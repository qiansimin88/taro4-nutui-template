const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons");

/**
 * Tailwind CSS v4 配置文件
 * 用于配置 Iconify 图标插件
 *
 * 使用方式：
 * <View className="i-lucide-home text-3xl text-red-600" />
 *
 * 图标浏览：
 * - Lucide: https://lucide.dev/icons/
 * - Iconify: https://icon-sets.iconify.design/
 */
module.exports = {
  plugins: [
    iconsPlugin({
      // 选择你要使用的图标集合
      // 已安装: @iconify-json/lucide
      collections: getIconCollections(["lucide"]),

      // 可选配置
      // scale: 1.2, // 图标缩放比例
      // prefix: 'icon', // 类名前缀，默认为 'i'
    }),
  ],
};
