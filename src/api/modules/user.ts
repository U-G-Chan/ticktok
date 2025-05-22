import { get, post, put } from "@/utils/http";

// 用户信息接口定义
export interface UserInfo {
  id: number;
  uid: number;
  username: string;
  nickname: string;
  avatar: string;
  email?: string;
  phone?: string;
  gender?: number;
  signature?: string;
  createTime?: string;
  updateTime?: string;
  status?: string;
}

// 登录请求参数接口
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应结果接口
export interface LoginResult {
  token: string;
  userInfo: UserInfo;
}

// 注册请求参数接口
export interface RegisterParams {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
  phone?: string;
}

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录结果，包含token和用户信息
 */
export const login = (params: LoginParams): Promise<LoginResult> => {
  return post<LoginResult>("/user/login", params);
};

/**
 * 用户注册
 * @param params 注册参数
 * @returns 注册结果
 */
export const register = (params: RegisterParams): Promise<LoginResult> => {
  return post<LoginResult>("/user/register", params);
};

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export const getCurrentUserInfo = (): Promise<UserInfo> => {
  return get<UserInfo>("/user/info");
};

/**
 * 获取用户信息
 * @param userId 用户ID
 */
export const getUserInfo = (userId: number): Promise<UserInfo> => {
  //===============================<Mock>=========================================
  if (import.meta.env.DEV) {
    return new Promise<UserInfo>((resolve) => {
      fetch("/mock/user-data.json")
        .then((response) => response.json())
        .then((data) => {
          resolve(data[userId]);
        });
    });
  }
  //===============================</Mock>=========================================
  return get<UserInfo>('/user/userInfo', { userId });
}

/**
 * 更新当前用户信息
 * @param userInfo 用户信息
 * @returns 更新后的用户信息
 */
export const updateUserInfo = (
  userInfo: Partial<UserInfo>
): Promise<UserInfo> => {
  return put<UserInfo>("/user/info", userInfo);
};

/**
 * 修改用户密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns 操作结果
 */
export const changePassword = (
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  return post<void>("/user/password", { oldPassword, newPassword });
};

/**
 * 退出登录
 * @returns 操作结果
 */
export const logout = (): Promise<void> => {
  return post<void>("/user/logout");
};
