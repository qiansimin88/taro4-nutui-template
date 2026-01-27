# useRequest 使用指南

本项目使用 ahooks 的 useRequest，与 request.ts 深度集成，提供强大的请求管理能力。

## 核心特性

✅ **完整继承 request.ts 的异常处理**

- HTTP 错误自动提示（400, 401, 404, 500 等）
- 业务错误自动显示 message（code !== 0）
- 401 自动跳转登录页
- 网络错误自动提示
- Loading 状态自动管理

✅ **ahooks useRequest 提供的高级功能**

- 防抖/节流
- 轮询
- 依赖刷新
- 缓存
- 失败重试
- 并发控制
- 加载更多

---

## 基础用法

### 1. 手动触发请求

```typescript
import { View, Button } from "@tarojs/components";
import { useRequest } from "@/hooks";
import { userService } from "@/services/user";

function UserProfile() {
  const { data, loading, error, run } = useRequest(userService.getProfile, {
    manual: true, // 手动触发，不会自动执行
  });

  const handleGetProfile = () => {
    run(); // 点击时才发起请求
  };

  return (
    <View>
      <Button onClick={handleGetProfile}>获取用户信息</Button>
      {loading && <View>加载中...</View>}
      {error && <View>错误: {error.message}</View>}
      {data && (
        <View>
          <View>昵称: {data.nickname}</View>
          <View>手机: {data.phone}</View>
        </View>
      )}
    </View>
  );
}
```

**说明：**

- `manual: true` 表示手动触发
- 调用 `run()` 发起请求
- request.ts 会自动处理所有异常并显示 toast
- `error` 会包含 request.ts 抛出的错误信息

---

### 2. 自动请求（组件加载时）

```typescript
import { View } from "@tarojs/components";
import { useRequest } from "@/hooks";
import { userService } from "@/services/user";

function UserInfo() {
  // manual 默认为 false，组件挂载时自动执行
  const { data, loading } = useRequest(userService.getProfile);

  if (loading) return <View>加载中...</View>;

  return (
    <View>
      <View>用户名: {data?.nickname}</View>
      <View>邮箱: {data?.email}</View>
    </View>
  );
}
```

**说明：**

- 不传 `manual` 或 `manual: false` 时自动执行
- 适合页面加载时就需要获取的数据

---

### 3. 带参数的请求

```typescript
import { useRequest } from "@/hooks";
import { http } from "@/services/request";

function OrderDetail({ orderId }: { orderId: string }) {
  const getOrderDetail = (id: string) => {
    return http.get(`/api/orders/${id}`);
  };

  const { data, loading } = useRequest(() => getOrderDetail(orderId), {
    refreshDeps: [orderId], // orderId 变化时自动重新请求
  });

  if (loading) return <View>加载中...</View>;

  return <View>订单号: {data?.orderNo}</View>;
}
```

---

## 高级功能

### 4. 防抖搜索

```typescript
import { View, Input } from "@tarojs/components";
import { useRequest } from "@/hooks";
import { http } from "@/services/request";

function UserSearch() {
  const searchUsers = (keyword: string) => {
    return http.get("/api/users/search", { keyword });
  };

  const { data, loading, run } = useRequest(searchUsers, {
    manual: true,
    debounceWait: 300, // 300ms 防抖
  });

  const handleInput = (e) => {
    run(e.detail.value); // 用户输入时，300ms 后才发起请求
  };

  return (
    <View>
      <Input onInput={handleInput} placeholder="搜索用户" />
      {loading && <View>搜索中...</View>}
      {data?.list.map((user) => (
        <View key={user.id}>{user.name}</View>
      ))}
    </View>
  );
}
```

**说明：**

- `debounceWait: 300` 防止频繁请求
- 适合搜索、输入框等场景

---

### 5. 节流（防止重复点击）

```typescript
import { Button } from "@tarojs/components";
import { useRequest } from "@/hooks";
import { userService } from "@/services/user";

function UpdateProfile() {
  const { loading, run } = useRequest(userService.updateProfile, {
    manual: true,
    throttleWait: 1000, // 1 秒内只执行一次
    onSuccess: () => {
      console.log("更新成功");
    },
  });

  const handleSubmit = () => {
    run({ nickname: "新昵称" });
  };

  return (
    <Button onClick={handleSubmit} disabled={loading}>
      {loading ? "提交中..." : "保存"}
    </Button>
  );
}
```

**说明：**

- `throttleWait: 1000` 防止用户快速点击多次
- 适合提交表单、点赞等场景

---

### 6. 轮询

```typescript
import { View } from "@tarojs/components";
import { useRequest } from "@/hooks";
import { http } from "@/services/request";

function OrderStatus({ orderId }: { orderId: string }) {
  const getOrderStatus = () => {
    return http.get(`/api/orders/${orderId}/status`);
  };

  const { data, loading } = useRequest(getOrderStatus, {
    pollingInterval: 3000, // 每 3 秒轮询一次
    pollingWhenHidden: false, // 页面隐藏时停止轮询
    pollingErrorRetryCount: 3, // 轮询错误重试 3 次
  });

  return (
    <View>
      <View>订单状态: {data?.status}</View>
      {loading && <View>刷新中...</View>}
    </View>
  );
}
```

**说明：**

- `pollingInterval` 设置轮询间隔
- `pollingWhenHidden: false` 页面隐藏时停止轮询，节省资源
- 适合订单状态、支付状态等需要实时更新的场景

---

### 7. 缓存（避免重复请求）

```typescript
import { View } from "@tarojs/components";
import { useRequest } from "@/hooks";
import { userService } from "@/services/user";

function UserProfile() {
  const { data, loading } = useRequest(userService.getProfile, {
    cacheKey: "user-profile", // 缓存 key
    staleTime: 60000, // 缓存有效期 1 分钟
    cacheTime: 300000, // 缓存保留时间 5 分钟
  });

  // 同一个 cacheKey 的请求会共享缓存数据
  return <View>{data?.nickname}</View>;
}
```

**说明：**

- `cacheKey` 设置缓存标识
- `staleTime` 缓存有效期内不会重新请求
- 多个组件使用同一个 cacheKey 可以共享数据
- 适合用户信息、配置信息等不常变化的数据

---

### 8. 失败重试

```typescript
import { View } from "@tarojs/components";
import { useRequest } from "@/hooks";
import { userService } from "@/services/user";

function UserData() {
  const { data, loading, error } = useRequest(userService.getProfile, {
    retryCount: 3, // 失败后重试 3 次
    retryInterval: 1000, // 重试间隔 1 秒
  });

  if (loading) return <View>加载中...</View>;
  if (error) return <View>请求失败，已重试 3 次</View>;

  return <View>用户名: {data?.nickname}</View>;
}
```

**说明：**

- `retryCount` 设置重试次数
- `retryInterval` 设置重试间隔
- 适合网络不稳定的场景

---

### 9. 依赖刷新

```typescript
import { View } from "@tarojs/components";
import { useRequest } from "@/hooks";
import { http } from "@/services/request";

function ProductDetail({ productId }: { productId: string }) {
  const getProduct = () => {
    return http.get(`/api/products/${productId}`);
  };

  const { data, loading } = useRequest(getProduct, {
    refreshDeps: [productId], // productId 变化时自动重新请求
    refreshDepsAction: () => {
      console.log("productId 变化，重新获取商品信息");
    },
  });

  if (loading) return <View>加载中...</View>;

  return (
    <View>
      <View>商品名: {data?.name}</View>
      <View>价格: {data?.price}</View>
    </View>
  );
}
```

**说明：**

- `refreshDeps` 监听依赖变化
- 依赖变化时自动重新请求
- 适合详情页、tab 切换等场景

---

### 10. 成功/失败回调

```typescript
import Taro from "@tarojs/taro";
import { Button } from "@tarojs/components";
import { useRequest } from "@/hooks";
import { userService } from "@/services/user";

function EditProfile() {
  const { loading, run } = useRequest(userService.updateProfile, {
    manual: true,
    onSuccess: (data) => {
      console.log("更新成功", data);
      // request.ts 已经显示了成功 toast
      // 这里可以做额外操作，比如返回上一页
      Taro.navigateBack();
    },
    onError: (error) => {
      console.error("更新失败", error);
      // request.ts 已经显示了错误 toast
      // 这里可以做额外的错误处理，比如埋点上报
    },
  });

  const handleUpdate = () => {
    run({
      nickname: "新昵称",
      avatar: "https://example.com/avatar.jpg",
    });
  };

  return (
    <Button onClick={handleUpdate} disabled={loading}>
      {loading ? "保存中..." : "保存"}
    </Button>
  );
}
```

---

### 11. 手动更新数据（mutate）

```typescript
import { View, Button } from "@tarojs/components";
import { useRequest } from "@/hooks";
import { userService } from "@/services/user";

function UserProfile() {
  const { data, loading, mutate } = useRequest(userService.getProfile);

  const handleUpdateLocal = () => {
    // 手动更新本地数据，不发起请求
    mutate({
      ...data,
      nickname: "新昵称",
    });
  };

  return (
    <View>
      <View>昵称: {data?.nickname}</View>
      <Button onClick={handleUpdateLocal}>本地修改昵称</Button>
    </View>
  );
}
```

**说明：**

- `mutate` 可以直接修改 data，不发起请求
- 适合乐观更新、本地预览等场景

---

### 12. 刷新数据（refresh）

```typescript
import { View, Button } from "@tarojs/components";
import { useRequest } from "@/hooks";
import { userService } from "@/services/user";

function UserProfile() {
  const { data, loading, refresh } = useRequest(userService.getProfile);

  const handleRefresh = () => {
    refresh(); // 使用上次的参数重新请求
  };

  return (
    <View>
      <View>昵称: {data?.nickname}</View>
      <Button onClick={handleRefresh} disabled={loading}>
        刷新
      </Button>
    </View>
  );
}
```

---

## 结合 request.ts 的自定义选项

### 13. 控制 loading 和错误提示

```typescript
import { useRequest } from "@/hooks";
import { http } from "@/services/request";

function SilentUpdate() {
  const updateData = (data: any) => {
    // 传入 request.ts 的自定义选项
    return http.post("/api/update", data, {
      showLoading: false, // 不显示 loading 提示
      showError: false, // 不显示错误提示
      timeout: 10000, // 自定义超时时间
    });
  };

  const { run } = useRequest(updateData, {
    manual: true,
    onError: (error) => {
      // 因为 showError: false，这里可以自定义错误处理
      console.error("静默更新失败", error);
    },
  });

  return <Button onClick={() => run({ value: 123 })}>静默更新</Button>;
}
```

**说明：**

- 可以在 service 层传入 request.ts 的配置
- `showLoading: false` 不显示 loading
- `showError: false` 不显示错误 toast
- 适合后台静默更新、埋点上报等场景

---

## 实际业务场景示例

### 14. 完整的表单提交

```typescript
import { useState } from "react";
import { View, Input, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRequest } from "@/hooks";
import { userService } from "@/services/user";

function EditProfile() {
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");

  // 获取用户信息
  const { data: userInfo } = useRequest(userService.getProfile, {
    onSuccess: (data) => {
      setNickname(data.nickname);
      setPhone(data.phone);
    },
  });

  // 更新用户信息
  const { loading: updating, run: updateProfile } = useRequest(
    userService.updateProfile,
    {
      manual: true,
      throttleWait: 1000, // 防止重复提交
      onSuccess: () => {
        Taro.showToast({ title: "保存成功", icon: "success" });
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      },
    }
  );

  const handleSubmit = () => {
    if (!nickname.trim()) {
      Taro.showToast({ title: "请输入昵称", icon: "none" });
      return;
    }
    updateProfile({ nickname, phone });
  };

  return (
    <View>
      <View>
        <Input
          value={nickname}
          onInput={(e) => setNickname(e.detail.value)}
          placeholder="请输入昵称"
        />
      </View>
      <View>
        <Input
          value={phone}
          onInput={(e) => setPhone(e.detail.value)}
          placeholder="请输入手机号"
        />
      </View>
      <Button onClick={handleSubmit} disabled={updating}>
        {updating ? "保存中..." : "保存"}
      </Button>
    </View>
  );
}
```

---

### 15. 列表页 + 下拉刷新

```typescript
import { View, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRequest } from "@/hooks";
import { http } from "@/services/request";

function ProductList() {
  const getProducts = () => {
    return http.get("/api/products");
  };

  const { data, loading, refresh } = useRequest(getProducts, {
    cacheKey: "product-list",
    staleTime: 30000, // 30 秒缓存
  });

  const handleRefresh = async () => {
    Taro.showLoading({ title: "刷新中..." });
    await refresh();
    Taro.hideLoading();
  };

  return (
    <ScrollView
      scrollY
      refresherEnabled
      refresherTriggered={loading}
      onRefresherRefresh={handleRefresh}
    >
      {data?.list.map((item) => (
        <View key={item.id}>
          <View>{item.name}</View>
          <View>{item.price}</View>
        </View>
      ))}
    </ScrollView>
  );
}
```

---

### 16. 支付状态轮询

```typescript
import { useEffect } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRequest } from "@/hooks";
import { http } from "@/services/request";

function PaymentStatus({ orderId }: { orderId: string }) {
  const getPaymentStatus = () => {
    return http.get(`/api/orders/${orderId}/payment-status`);
  };

  const { data, cancel } = useRequest(getPaymentStatus, {
    pollingInterval: 2000, // 每 2 秒轮询
    pollingWhenHidden: false,
    onSuccess: (result) => {
      // 支付成功后停止轮询
      if (result.status === "paid") {
        cancel(); // 取消轮询
        Taro.showToast({ title: "支付成功", icon: "success" });
        setTimeout(() => {
          Taro.redirectTo({ url: "/pages/order/detail?id=" + orderId });
        }, 1500);
      }
    },
  });

  useEffect(() => {
    return () => {
      cancel(); // 组件卸载时取消轮询
    };
  }, []);

  return (
    <View>
      <View>等待支付...</View>
      <View>订单号: {orderId}</View>
      <View>状态: {data?.status}</View>
    </View>
  );
}
```

---

## 常见问题

### Q1: loading 状态显示了两次？

**A:** request.ts 默认会显示 `Taro.showLoading`，组件中不需要再显示。如果想自定义 loading 样式，可以：

```typescript
const updateData = (data: any) => {
  return http.post("/api/update", data, {
    showLoading: false, // 关闭 request.ts 的 loading
  });
};

const { loading, run } = useRequest(updateData, { manual: true });

// 使用组件中的 loading 状态
{
  loading && <View>自定义 loading 样式</View>;
}
```

---

### Q2: 错误提示显示了两次？

**A:** request.ts 默认会显示错误 toast，组件中不需要再显示。如果想自定义错误处理：

```typescript
const updateData = (data: any) => {
  return http.post("/api/update", data, {
    showError: false, // 关闭 request.ts 的错误提示
  });
};

const { error, run } = useRequest(updateData, {
  manual: true,
  onError: (error) => {
    // 自定义错误处理
    Taro.showModal({
      title: "错误",
      content: error.message,
    });
  },
});
```

---

### Q3: 如何取消请求？

**A:** 使用 `cancel` 方法：

```typescript
const { data, loading, run, cancel } = useRequest(fetchData, {
  manual: true,
});

// 取消请求
const handleCancel = () => {
  cancel();
};
```

---

### Q4: 如何在请求前做验证？

**A:** 在调用 `run` 之前做验证：

```typescript
const { run } = useRequest(updateProfile, { manual: true });

const handleSubmit = () => {
  // 先验证
  if (!nickname.trim()) {
    Taro.showToast({ title: "请输入昵称", icon: "none" });
    return;
  }

  // 验证通过后才发起请求
  run({ nickname });
};
```

---

## 总结

**useRequest 的核心优势：**

1. ✅ **完全兼容 request.ts**：所有异常处理、token 管理、loading 管理都自动生效
2. ✅ **功能强大**：防抖、节流、轮询、缓存、重试等开箱即用
3. ✅ **状态管理简单**：自动管理 loading、error、data 状态
4. ✅ **类型安全**：完整的 TypeScript 类型支持
5. ✅ **性能优化**：自动缓存、防止重复请求

**使用建议：**

- 简单请求：使用基础的 `manual` + `run`
- 搜索场景：使用 `debounceWait`
- 提交表单：使用 `throttleWait`
- 实时状态：使用 `pollingInterval`
- 缓存数据：使用 `cacheKey`
- 网络不稳定：使用 `retryCount`

**最佳实践：**

1. 在 service 层定义 API 方法
2. 在组件中使用 useRequest 调用
3. request.ts 负责底层异常处理
4. useRequest 负责状态管理和高级功能
5. 根据场景选择合适的配置项

---

更多详情请参考：

- [ahooks useRequest 官方文档](https://ahooks.js.org/zh-CN/hooks/use-request/index)
- [request.ts 源码](../src/services/request.ts)
