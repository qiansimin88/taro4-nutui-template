/**
 * Zustand 持久化中间件
 * 将 Store 状态自动保存到本地存储（Taro Storage）
 * 支持状态部分持久化、版本迁移等功能
 *
 * 使用示例：
 * const useStore = create<State>()(persist(
 *   (set) => ({ count: 0 }),
 *   { name: 'my-store', partialize: (state) => ({ count: state.count }) }
 * ))
 */
import Taro from "@tarojs/taro";
import type { StateCreator, StoreMutatorIdentifier } from "zustand";

/** 持久化配置选项 */
export interface PersistOptions<T> {
  /** 存储键名 */
  name: string;
  /** 只持久化这些键（白名单），返回需要持久化的状态 */
  partialize?: (state: T) => Partial<T>;
  /** 版本号，用于状态迁移 */
  version?: number;
  /** 迁移函数，用于处理版本升级时的状态转换 */
  migrate?: (persistedState: unknown, version: number) => T;
}

// Persist 类型定义
type Persist = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  initializer: StateCreator<T, Mps, Mcs>,
  options: PersistOptions<T>
) => StateCreator<T, Mps, Mcs>;

// Persist 实现类型
type PersistImpl = <T>(
  initializer: StateCreator<T, [], []>,
  options: PersistOptions<T>
) => StateCreator<T, [], []>;

// 持久化中间件实现
const persistImpl: PersistImpl = (initializer, options) => (set, get, api) => {
  const { name, partialize, version = 0, migrate } = options;

  /**
   * 加载持久化的状态
   * @returns 持久化的状态对象，加载失败返回 null
   */
  const loadPersistedState = (): Partial<ReturnType<typeof get>> | null => {
    try {
      const stored = Taro.getStorageSync(name);
      if (!stored) return null;

      const { state, version: storedVersion } = JSON.parse(stored);

      // 处理版本迁移
      if (migrate && storedVersion !== version) {
        return migrate(state, storedVersion) as Partial<ReturnType<typeof get>>;
      }

      return state;
    } catch (e) {
      console.warn(`[persist] Failed to load state for key "${name}":`, e);
      return null;
    }
  };

  /**
   * 保存状态到本地存储
   * @param state - 要保存的状态对象
   */
  const saveState = (state: ReturnType<typeof get>) => {
    try {
      // 如果配置了 partialize，只保存指定的部分
      const stateToPersist = partialize ? partialize(state) : state;
      Taro.setStorageSync(
        name,
        JSON.stringify({
          state: stateToPersist,
          version,
        })
      );
    } catch (e) {
      console.warn(`[persist] Failed to save state for key "${name}":`, e);
    }
  };

  /**
   * 包装 set 函数，使其在每次状态更新后自动保存
   */
  const persistSet: typeof set = (partial, replace) => {
    set(partial, replace);
    saveState(get());
  };

  // 初始化状态：先用初始化函数创建状态，再用持久化的数据覆盖
  const persistedState = loadPersistedState();
  const initialState = initializer(persistSet, get, api);

  return {
    ...initialState,
    ...(persistedState || {}),
  };
};

// 导出持久化中间件
export const persist = persistImpl as Persist;

export default persist;
