import http from "./request";
import { API } from "@/constants";
import type { UserInfo } from "@/store";

interface LoginParams {
  code: string;
}

interface LoginResponse {
  token: string;
  userInfo: UserInfo;
}

/** User service APIs */
export const userService = {
  /** WeChat login */
  login(params: LoginParams) {
    return http.post<LoginResponse>(API.USER.LOGIN, params);
  },

  /** Logout */
  logout() {
    return http.post(API.USER.LOGOUT);
  },

  /** Get user profile */
  getProfile() {
    return http.get<UserInfo>(API.USER.PROFILE);
  },

  /** Update user profile */
  updateProfile(data: Partial<UserInfo>) {
    return http.put<UserInfo>(API.USER.UPDATE_PROFILE, data);
  },
};
