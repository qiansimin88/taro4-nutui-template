/**
 * 登录页面
 * 微信登录按钮 + 手机号授权
 */
import { useState } from 'react';
import { View, Text, Button as TaroButton } from '@tarojs/components';
import { Button, Checkbox } from '@nutui/nutui-react-taro';
import Taro from '@tarojs/taro';
import { useUserStore } from '@/store/user';
import { nav } from '@/utils/nav';
import './index.scss'; // 移除 SCSS 引用

function Login() {
    /** 是否同意协议 */
    const [agreed, setAgreed] = useState(false);
    /** 加载状态 */
    const [loading, setLoading] = useState(false);

    /** 用户 Store */
    const { login } = useUserStore();

    /** 微信登录 */
    const handleWxLogin = async () => {
        if (!agreed) {
            Taro.showToast({ title: '请先阅读并同意用户协议', icon: 'none' });
            return;
        }

        try {
            setLoading(true);

            // 1. 调用 wx.login 获取 code
            const { code } = await Taro.login();
            console.log('微信登录 code:', code);

            // 2. 模拟登录成功
            const mockUserInfo = {
                id: 'user_001',
                nickname: '微信用户',
                avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
                phone: '',
            };
            const mockToken = 'mock_token_' + Date.now();

            // 3. 保存登录状态
            login(mockToken, mockUserInfo);

            Taro.showToast({ title: '登录成功', icon: 'success' });

            // 4. 返回上一页或首页
            setTimeout(() => {
                const pages = Taro.getCurrentPages();
                if (pages.length > 1) {
                    nav.back();
                } else {
                    nav.switchTab('/pages/index/index');
                }
            }, 1500);
        } catch (error) {
            console.error('登录失败:', error);
            Taro.showToast({ title: '登录失败，请重试', icon: 'none' });
        } finally {
            setLoading(false);
        }
    };

    /** 获取手机号 */
    const handleGetPhoneNumber = (e: any) => {
        if (!agreed) {
            Taro.showToast({ title: '请先阅读并同意用户协议', icon: 'none' });
            return;
        }

        const { code, errMsg } = e.detail;

        if (code) {
            console.log('手机号授权码:', code);
            Taro.showToast({ title: '授权成功', icon: 'success' });
        } else {
            console.log('用户拒绝授权:', errMsg);
            // Taro.showToast({ title: '您已取消授权', icon: 'none' });
        }
    };

    /** 查看用户协议 */
    const handleViewAgreement = () => {
        Taro.showToast({ title: '用户协议页面开发中', icon: 'none' });
    };

    /** 查看隐私政策 */
    const handleViewPrivacy = () => {
        Taro.showToast({ title: '隐私政策页面开发中', icon: 'none' });
    };

    return (
        <View className="min-h-screen flex flex-col bg-slate-50 px-8 pt-0 pb-10 relative overflow-hidden">
            {/* 装饰背景圆 - 左上与右下，增加氛围感 */}
            <View className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <View className="absolute bottom-[-50px] right-[-50px] w-60 h-60 bg-green-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

            {/* Logo 区域 */}
            <View className="flex flex-col items-center justify-center pt-32 pb-16 z-10">
                <View className="w-24 h-24 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
                    <View className="i-lucide-shopping-bag text-5xl text-blue-600" />
                </View>
                <Text className="text-2xl font-bold text-slate-800 tracking-wide mb-2">-星链商城</Text>
                <Text className="text-sm text-slate-500 font-medium tracking-widest uppercase">Creative 3D Print Store</Text>
            </View>

            <View className='test-logo'>
                KIKI
            </View>

            {/* 登录按钮区域 */}
            <View className="w-full space-y-5 z-10">
                {/* 微信一键登录 - 突出显示 */}
                <Button
                    type="primary"
                    block
                    className="!h-12 !rounded-full !text-base !font-medium !bg-blue-600 !border-blue-600 !shadow-md !shadow-blue-200 active:!scale-95 transition-all"
                    loading={loading}
                    onClick={handleWxLogin}
                >
                    {loading ? '登录中...' : '微信一键登录'}
                </Button>

                {/* 手机号授权按钮 - 次级样式 */}
                <TaroButton
                    openType="getPhoneNumber"
                    onGetPhoneNumber={handleGetPhoneNumber}
                    className="w-full h-12 rounded-full text-base font-medium flex items-center justify-center bg-white border border-slate-200 text-slate-700 shadow-sm active:bg-slate-50 after:border-none"
                    hoverClass="none"
                >
                    手机号快捷登录
                </TaroButton>
            </View>

            {/* 底部协议与提示 */}
            <View className="mt-auto flex flex-col items-center z-10 text-center">
                <View className="flex items-center justify-center flex-wrap gap-1 mb-8">
                    <Checkbox
                        checked={agreed}
                        onChange={setAgreed}
                        className="transform scale-75 -mr-1"
                    // NutUI 的 Checkbox 样式可能需要通过 css变量微调，这里先用默认
                    />
                    <Text className="text-xs text-slate-500" onClick={() => setAgreed(!agreed)}>我已阅读并同意</Text>
                    <Text className="text-xs text-blue-600 active:opacity-70" onClick={handleViewAgreement}>《用户协议》</Text>
                    <Text className="text-xs text-slate-500">和</Text>
                    <Text className="text-xs text-blue-600 active:opacity-70" onClick={handleViewPrivacy}>《隐私政策》</Text>
                </View>

                <Text className="text-[10px] text-slate-300 font-light">
                    JoyKings 3D Technology © 2026
                </Text>
            </View>
        </View>
    );
}

export default Login;
