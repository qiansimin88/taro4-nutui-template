/** API endpoints */
export const API = {
  /** User related APIs */
  USER: {
    LOGIN: "/user/login",
    LOGOUT: "/user/logout",
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile/update",
  },
  /** Common APIs */
  COMMON: {
    UPLOAD: "/common/upload",
    CONFIG: "/common/config",
  },
} as const;
