/** Storage keys for Taro storage */
export const STORAGE_KEYS = {
  /** User store persistence key */
  USER_STORE: "user_store",
  /** App store persistence key */
  APP_STORE: "app_store",
  /** Token storage key */
  TOKEN: "token",
  /** User info storage key */
  USER_INFO: "user_info",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
