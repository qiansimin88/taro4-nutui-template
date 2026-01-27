import React from 'react';
import { View, Text } from '@tarojs/components';
import { Button, ConfigProvider } from '@nutui/nutui-react-taro';
import zhCN from '@nutui/nutui-react-taro/dist/es/locales/zh-CN';
import Taro from '@tarojs/taro';
import './index.scss';

function Index() {
  const handleGetStarted = () => {
    Taro.showToast({
      title: '开始开发吧！',
      icon: 'success',
    });
  };

  return (
    <ConfigProvider locale={zhCN}>
      <View className="home-container">
        {/* Hero Section */}
        <View className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6">
          <View className="w-full max-w-md text-center">
            {/* Logo/Icon */}
            <View className="mb-8">
              <Text className="text-6xl">🚀</Text>
            </View>

            {/* Title */}
            <Text className="text-3xl font-bold text-slate-900 mb-3">
              Taro 4 + NutUI
            </Text>
            <Text className="text-lg text-slate-600 mb-2">
              多端小程序开发模板
            </Text>

            {/* Features */}
            <View className="mt-8 space-y-3">
              <View className="flex items-center justify-center gap-2">
                <Text className="text-sm text-slate-500">✨ React 18 + TypeScript</Text>
              </View>
              <View className="flex items-center justify-center gap-2">
                <Text className="text-sm text-slate-500">🎨 NutUI + Tailwind CSS</Text>
              </View>
              <View className="flex items-center justify-center gap-2">
                <Text className="text-sm text-slate-500">📦 Zustand + useRequest</Text>
              </View>
              <View className="flex items-center justify-center gap-2">
                <Text className="text-sm text-slate-500">✅ React Hook Form + Zod</Text>
              </View>
            </View>

            {/* CTA Button */}
            <View className="mt-10">
              <Button
                type="primary"
                size="large"
                block
                onClick={handleGetStarted}
              >
                开始开发
              </Button>
            </View>

            {/* Footer Info */}
            <View className="mt-8">
              <Text className="text-xs text-slate-400">
                查看 README 了解更多使用说明
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ConfigProvider>
  );
}

export default Index;
