# 表单验证指南 (React Hook Form + Zod)

本项目采用 `react-hook-form` 处理表单逻辑，结合 `zod` 进行数据验证和类型推导。

## 核心优势

- **性能优异**：减少不必要的重新渲染。
- **类型安全**：Zod Schema 可以直接导出 TypeScript 类型。
- **逻辑清晰**：验证规则与 UI 逻辑分离。

---

## 基础设置

### 1. 推荐安装 Resolver

为了将 Zod 与 React Hook Form 链接，建议安装：

```bash
pnpm add @hookform/resolvers
```

### 2. 定义 Schema (`src/schemas/user.ts`)

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(2, "用户名至少2个字符"),
  password: z.string().min(6, "密码至少6位"),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "手机号格式不正确"),
});

// 导出类型
export type LoginInput = z.infer<typeof loginSchema>;
```

---

## 在小程序组件中使用

### 基础示例

```tsx
import { View, Input, Button, Text } from "@tarojs/components";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/user";

export function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", phone: "" },
  });

  const onSubmit = (data: LoginInput) => {
    console.log("提交数据:", data);
  };

  return (
    <View className="form-container">
      <View>
        <Text>用户名</Text>
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <Input
              {...field}
              onInput={(e) => field.onChange(e.detail.value)}
              placeholder="请输入用户名"
            />
          )}
        />
        {errors.username && (
          <Text className="error-msg">{errors.username.message}</Text>
        )}
      </View>

      <Button onClick={handleSubmit(onSubmit)}>登录</Button>
    </View>
  );
}
```

---

## Clsx 使用建议

配合 `clsx` 处理动态样式类：

```tsx
import { cn } from "@/utils";

// 示例：根据错误状态切换样式
<View className={cn("input-item", errors.username && "input-error")}>...</View>;
```

## 最佳实践

1. **统一存放**：所有的 Zod Schema 存放在 `src/schemas`。
2. **错误处理**：利用 `formState.errors` 获取 Zod 定义的错误信息并展示。
3. **类型复用**：通过 `z.infer` 导出的类型应在接口请求和服务层复用。
