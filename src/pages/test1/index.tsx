import { View, Text } from '@tarojs/components';
import { Button, Cell, ConfigProvider } from '@nutui/nutui-react-taro';
import zhCN from '@nutui/nutui-react-taro/dist/es/locales/zh-CN';
import { nav } from '@/utils/nav';
import './index.scss';

function Test1() {
    const goToTest2 = () => {
        nav.to('/pages/test2/index');
    };

    const goToLogin = () => {
        nav.to('/pages/login/index');
    };

    return (
        <ConfigProvider locale={zhCN}>
            <View className="p-4">
                <Text className="text-2xl font-bold mb-4 block theme-text">
                    测试页面 122333311111jajaj嘻嘻嘻1122112312
                </Text>

                <View className="bg-white rounded-lg p-4 mb-4 theme-border">
                    <Text className="text-gray-600 mb-2 block">
                        111    3333  22              </Text>
                    <Text className="text-sm text-gray-500 block">• NutUI Button 组件</Text>
                    <Text className="text-sm text-gray-500 block">• NutUI Cell 组件</Text>
                    <Text className="text-sm text-gray-500 block">• Tailwind CSS 样式</Text>
                    <Text className="text-sm theme-text block mt-2">• 主题色:#05df72</Text>
                </View>

                <Cell title="测试单元格 1" />
                <Cell title="测试单元格 2" />

                <View className="mt-4 space-y-2">
                    <Button type="primary" block onClick={goToTest2}>
                        跳转到测试页面 2
                    </Button>

                    <Button type="success" block onClick={goToLogin}>
                        跳转到登录页面
                    </Button>
                </View>
            </View>
        </ConfigProvider>
    );
}

export default Test1;
