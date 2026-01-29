import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { Button, Input, Switch, ConfigProvider } from '@nutui/nutui-react-taro';
import zhCN from '@nutui/nutui-react-taro/dist/es/locales/zh-CN';
import { nav } from '@/utils/nav';
import './index.scss';

function Test2() {
    const [inputValue, setInputValue] = useState('');
    const [switchValue, setSwitchValue] = useState(false);

    const goBack = () => {
        nav.back();
    };

    return (
        <ConfigProvider locale={zhCN}>
            <View className="p-4">
                <Text className="text-2xl font-bold mb-4 block theme-text">
                    测试页面 2
                </Text>

                <View className="bg-white rounded-lg p-4 mb-4">
                    <Text className="text-gray-600 mb-2 block">
                        这是第二个测试页面，使用了：
                    </Text>
                    <Text className="text-sm text-gray-500 block">• NutUI Input 组件</Text>
                    <Text className="text-sm text-gray-500 block">• NutUI Switch 组件</Text>
                    <Text className="text-sm text-gray-500 block">• Tailwind CSS 样式</Text>
                </View>

                <View className="theme-bg rounded-lg p-4 mb-4">
                    <Text className="text-sm text-white mb-2 block font-bold">主题色展示</Text>
                    <Text className="text-sm text-white block">当前主题色：#05df72</Text>
                </View>

                <View className="bg-white rounded-lg p-4 mb-4">
                    <Text className="text-sm text-gray-700 mb-2 block">输入框测试：</Text>
                    <Input
                        placeholder="请输入内容"
                        value={inputValue}
                        onChange={(val) => setInputValue(val)}
                    />
                </View>

                <View className="bg-white rounded-lg p-4 mb-4 flex items-center justify-between">
                    <Text className="text-sm text-gray-700">开关测试：</Text>
                    <Switch checked={switchValue} onChange={(val) => setSwitchValue(val)} />
                </View>

                <View className="mt-4">
                    <Button type="success" block onClick={goBack}>
                        返回测试页面 1
                    </Button>
                </View>
            </View>
        </ConfigProvider>
    );
}

export default Test2;
