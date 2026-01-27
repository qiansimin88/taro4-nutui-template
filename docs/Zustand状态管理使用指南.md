# Zustand 状态管理使用指南

## 简介

本项目使用 [Zustand](https://github.com/pmndrs/zustand) 作为全局状态管理库，它是一个轻量级、简单易用的 React 状态管理方案。

**特点：**

- 📦 轻量级（不到 1KB）
- 🎯 API 简单，学习成本低
- 🔄 支持状态持久化
- ⚡️ 性能优秀，不需要 Context Provider
- 🎨 TypeScript 支持良好

---

## 项目已有示例

项目中已经配置好了应用全局状态管理 `useAppStore`，位于 `src/store/app.ts`。

### 基础用法示例

```tsx
import { useAppStore, selectTheme } from "@/store/app";

function MyComponent() {
  // 方式 1：使用 selector 获取特定状态（推荐，性能更好）
  const theme = useAppStore(selectTheme);

  // 方式 2：直接获取整个 store
  const { theme, locale, setTheme } = useAppStore();

  // 方式 3：获取多个状态
  const { theme, locale } = useAppStore((state) => ({
    theme: state.theme,
    locale: state.locale,
  }));

  return (
    <View>
      <Text>当前主题：{theme}</Text>
      <Button onClick={() => setTheme("dark")}>切换深色主题</Button>
    </View>
  );
}
```

---

## 跨页面共享数据

### 场景 1：用户信息跨页面共享

创建 `src/store/user.ts`：

```typescript
/**
 * 用户状态管理
 * 用于跨页面共享用户信息
 */
import { create } from "zustand";
import { persist } from "./middleware/persist";
import { STORAGE_KEYS } from "@/constants/storage";

// 用户信息类型
interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  phone: string;
}

// 用户状态
interface UserState {
  userInfo: UserInfo | null; // 用户信息
  token: string | null; // 登录令牌
  isLogin: boolean; // 是否已登录
}

// 用户操作
interface UserActions {
  setUserInfo: (userInfo: UserInfo) => void; // 设置用户信息
  setToken: (token: string) => void; // 设置令牌
  login: (userInfo: UserInfo, token: string) => void; // 登录
  logout: () => void; // 登出
}

export type UserStore = UserState & UserActions;

// 初始状态
const initialState: UserState = {
  userInfo: null,
  token: null,
  isLogin: false,
};

// 创建 Store（带持久化）
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      // 设置用户信息
      setUserInfo: (userInfo) => {
        set({ userInfo, isLogin: true });
      },

      // 设置令牌
      setToken: (token) => {
        set({ token });
      },

      // 登录
      login: (userInfo, token) => {
        set({ userInfo, token, isLogin: true });
      },

      // 登出
      logout: () => {
        set({ ...initialState });
      },
    }),
    {
      name: STORAGE_KEYS.USER_STORE, // 存储键名
      // 持久化所有状态
    }
  )
);

// Selectors
export const selectUserInfo = (state: UserStore) => state.userInfo;
export const selectIsLogin = (state: UserStore) => state.isLogin;
export const selectToken = (state: UserStore) => state.token;
```

### 使用方式

**页面 A - 登录页面：**

```tsx
import { useUserStore } from "@/store/user";

function LoginPage() {
  const login = useUserStore((state) => state.login);

  const handleLogin = async () => {
    const res = await loginApi({ phone, code });
    // 保存用户信息到全局状态
    login(res.userInfo, res.token);
    // 跳转到首页
    nav.to("/pages/index/index");
  };

  return <Button onClick={handleLogin}>登录</Button>;
}
```

**页面 B - 个人中心页面：**

```tsx
import { useUserStore, selectUserInfo } from "@/store/user";

function ProfilePage() {
  // 直接读取用户信息（页面 A 保存的数据）
  const userInfo = useUserStore(selectUserInfo);

  return (
    <View>
      <Image src={userInfo?.avatar} />
      <Text>{userInfo?.name}</Text>
      <Text>{userInfo?.phone}</Text>
    </View>
  );
}
```

**页面 C - 任意其他页面：**

```tsx
import { useUserStore, selectIsLogin } from "@/store/user";

function AnyPage() {
  const isLogin = useUserStore(selectIsLogin);
  const logout = useUserStore((state) => state.logout);

  if (!isLogin) {
    return <Text>请先登录</Text>;
  }

  return <Button onClick={logout}>退出登录</Button>;
}
```

---

### 场景 2：购物车跨页面共享

创建 `src/store/cart.ts`：

```typescript
/**
 * 购物车状态管理
 * 用于跨页面管理购物车数据
 */
import { create } from "zustand";
import { persist } from "./middleware/persist";
import { STORAGE_KEYS } from "@/constants/storage";

// 商品类型
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// 购物车状态
interface CartState {
  items: CartItem[]; // 购物车商品列表
  totalCount: number; // 商品总数量
  totalPrice: number; // 总价格
}

// 购物车操作
interface CartActions {
  addItem: (item: CartItem) => void; // 添加商品
  removeItem: (id: string) => void; // 移除商品
  updateQuantity: (id: string, quantity: number) => void; // 更新数量
  clear: () => void; // 清空购物车
  calculateTotal: () => void; // 计算总价
}

export type CartStore = CartState & CartActions;

// 初始状态
const initialState: CartState = {
  items: [],
  totalCount: 0,
  totalPrice: 0,
};

// 创建 Store
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 添加商品
      addItem: (item) => {
        const { items } = get();
        const existItem = items.find((i) => i.id === item.id);

        if (existItem) {
          // 已存在，增加数量
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          // 不存在，添加新商品
          set({ items: [...items, item] });
        }

        // 重新计算总价
        get().calculateTotal();
      },

      // 移除商品
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
        get().calculateTotal();
      },

      // 更新数量
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
        get().calculateTotal();
      },

      // 清空购物车
      clear: () => {
        set({ ...initialState });
      },

      // 计算总价
      calculateTotal: () => {
        const { items } = get();
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        set({ totalCount, totalPrice });
      },
    }),
    {
      name: STORAGE_KEYS.CART_STORE,
    }
  )
);

// Selectors
export const selectCartItems = (state: CartStore) => state.items;
export const selectTotalCount = (state: CartStore) => state.totalCount;
export const selectTotalPrice = (state: CartStore) => state.totalPrice;
```

### 使用方式

**商品列表页 - 添加到购物车：**

```tsx
import { useCartStore } from "@/store/cart";

function ProductList() {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });

    Taro.showToast({ title: "已添加到购物车", icon: "success" });
  };

  return <Button onClick={() => handleAddToCart(product)}>加入购物车</Button>;
}
```

**导航栏 - 显示购物车数量：**

```tsx
import { useCartStore, selectTotalCount } from "@/store/cart";

function Navbar() {
  const totalCount = useCartStore(selectTotalCount);

  return (
    <View className="navbar">
      <View className="cart-badge">
        <Icon name="cart" />
        {totalCount > 0 && <Text className="badge">{totalCount}</Text>}
      </View>
    </View>
  );
}
```

**购物车页面 - 显示和管理：**

```tsx
import { useCartStore, selectCartItems, selectTotalPrice } from "@/store/cart";

function CartPage() {
  const items = useCartStore(selectCartItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <View>
      {items.map((item) => (
        <View key={item.id}>
          <Image src={item.image} />
          <Text>{item.name}</Text>
          <Text>¥{item.price}</Text>
          <Stepper
            value={item.quantity}
            onChange={(value) => updateQuantity(item.id, value)}
          />
          <Button onClick={() => removeItem(item.id)}>删除</Button>
        </View>
      ))}
      <Text>总价：¥{totalPrice}</Text>
    </View>
  );
}
```

---

## 不使用持久化（临时状态）

如果不需要持久化存储，可以不使用 `persist` 中间件：

```typescript
import { create } from "zustand";

interface ModalState {
  visible: boolean;
  title: string;
  content: string;
}

interface ModalActions {
  open: (title: string, content: string) => void;
  close: () => void;
}

export const useModalStore = create<ModalState & ModalActions>((set) => ({
  visible: false,
  title: "",
  content: "",

  open: (title, content) => {
    set({ visible: true, title, content });
  },

  close: () => {
    set({ visible: false, title: "", content: "" });
  },
}));
```

---

## 性能优化建议

### 1. 使用 Selector 避免不必要的重渲染

**❌ 不推荐（会导致组件在任何状态变化时都重渲染）：**

```tsx
const store = useUserStore();
const userInfo = store.userInfo;
```

**✅ 推荐（只在 userInfo 变化时重渲染）：**

```tsx
const userInfo = useUserStore((state) => state.userInfo);
// 或使用预定义的 selector
const userInfo = useUserStore(selectUserInfo);
```

### 2. 批量更新状态

**❌ 不推荐（触发多次渲染）：**

```tsx
setUserInfo(userInfo);
setToken(token);
setIsLogin(true);
```

**✅ 推荐（只触发一次渲染）：**

```tsx
set({ userInfo, token, isLogin: true });
```

### 3. 提取复杂计算逻辑

```typescript
// 在 store 中定义计算方法
export const useCartStore = create<CartStore>((set, get) => ({
  // ...

  // 获取已选中的商品
  getSelectedItems: () => {
    return get().items.filter((item) => item.selected);
  },

  // 计算折扣后的价格
  getDiscountedPrice: () => {
    const { totalPrice } = get();
    return totalPrice > 100 ? totalPrice * 0.9 : totalPrice;
  },
}));
```

---

## 常见问题

### 1. 如何在非组件中使用 Store？

```typescript
// 在 API 请求中使用
import { useUserStore } from "@/store/user";

export async function fetchUserData() {
  const token = useUserStore.getState().token;
  const response = await request({
    url: "/api/user",
    headers: { Authorization: `Bearer ${token}` },
  });

  // 更新状态
  useUserStore.getState().setUserInfo(response.data);
}
```

### 2. 如何监听状态变化？

```typescript
import { useEffect } from "react";
import { useUserStore } from "@/store/user";

function MyComponent() {
  const isLogin = useUserStore(selectIsLogin);

  useEffect(() => {
    if (isLogin) {
      console.log("用户已登录");
    }
  }, [isLogin]);
}
```

### 3. 如何重置状态？

```typescript
// 方式 1：在 store 中定义 reset 方法
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      reset: () => {
        set({ ...initialState });
      },
    }),
    { name: STORAGE_KEYS.USER_STORE }
  )
);

// 使用
useUserStore.getState().reset();

// 方式 2：直接调用 setState
useUserStore.setState(initialState);
```

---

## 更新 constants/storage.ts

记得在 `src/constants/storage.ts` 中添加新的存储键：

```typescript
export const STORAGE_KEYS = {
  APP_STORE: "app_store",
  USER_STORE: "user_store", // 新增
  CART_STORE: "cart_store", // 新增
} as const;
```

---

## 参考资料

- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [Zustand 中文文档](https://awesomedevin.github.io/zustand-vue/docs/introduce/what-is-zustand)
- 项目示例：`src/store/app.ts`
