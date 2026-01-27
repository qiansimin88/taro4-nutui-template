import { create } from "zustand";
import { persist } from "./middleware/persist";
import { STORAGE_KEYS } from "@/constants/storage";

export interface UserInfo {
  id: string;
  nickname: string;
  avatar: string;
  phone?: string;
}

interface UserState {
  userInfo: UserInfo | null;
  token: string;
}

interface UserActions {
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => void;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  setToken: (token: string) => void;
}

export type UserStore = UserState & UserActions;

const initialState: UserState = {
  userInfo: null,
  token: "",
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (token: string, userInfo: UserInfo) => {
        set({ token, userInfo });
      },

      logout: () => {
        set(initialState);
      },

      updateUserInfo: (info: Partial<UserInfo>) => {
        const currentInfo = get().userInfo;
        if (currentInfo) {
          set({ userInfo: { ...currentInfo, ...info } });
        }
      },

      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: STORAGE_KEYS.USER_STORE,
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo,
      }),
    }
  )
);

// Selectors for better performance
export const selectIsLogin = (state: UserStore) => !!state.token;
export const selectUserInfo = (state: UserStore) => state.userInfo;
export const selectToken = (state: UserStore) => state.token;
