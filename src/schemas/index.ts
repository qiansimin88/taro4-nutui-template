/**
 * Zod Schema 统一导出文件
 * 用于表单验证和数据类型校验，配合 react-hook-form 使用
 *
 * 使用示例：
 * import { loginSchema } from '@/schemas'
 * const form = useForm({ resolver: zodResolver(loginSchema) })
 */

// 导出通用 Schema
export * from "./common";

// 后续可以增加 user.ts, order.ts 等业务 Schema
