import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import apiConfig from '../config/api.config';
import { clearAuth, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from './auth';

// 不需要认证的接口列表
const publicApis = [
  '/upload/media',
  '/auth/login',
  '/auth/register',
  '/auth/logout',
  '/auth/refresh',
  '/feed',
  // 可以根据需要添加更多公开接口
];

// 检查是否是公开接口
const isPublicApi = (url: string): boolean => {
  return publicApis.some(api => url.includes(api));
};

// 创建axios实例
const http: AxiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

type RefreshResponse = {
  code?: number;
  msg: string;
  access_token: string;
  refresh_token: string;
};

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 检查当前请求是否是公开接口
    const isPublic = isPublicApi(config.url || '');
    
    // 只对非公开接口添加认证
    if (!isPublic) {
      const token = getAccessToken();
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    return res;
  },
  async (error: AxiosError) => {
    const resp = error.response;
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!resp || !originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    const isPublic = isPublicApi(requestUrl);

    if (resp.status === 401 && !isPublic && !originalRequest._retry) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuth();
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        const refreshResp = await axios.post<RefreshResponse>(
          `${apiConfig.baseURL}/auth/refresh`,
          { refresh_token: refreshToken },
          { timeout: apiConfig.timeout }
        );

        const data = refreshResp.data;
        const code = (data as any)?.code ?? 0;
        if (!data || code !== 0 || !data.access_token) {
          clearAuth();
          return Promise.reject(error);
        }

        setAccessToken(data.access_token);
        if (data.refresh_token) {
          setRefreshToken(data.refresh_token);
        }

        const h = originalRequest.headers as any;
        if (h && typeof h.set === 'function') {
          h.set('Authorization', `Bearer ${data.access_token}`);
        } else {
          originalRequest.headers = {
            ...(originalRequest.headers as any),
            Authorization: `Bearer ${data.access_token}`,
          } as any;
        }

        return http.request(originalRequest);
      } catch (e) {
        clearAuth();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

// 封装GET请求方法
export const get = <T>(url: string, params?: any): Promise<T> => {
  return http.get(url, { params });
};

// 封装POST请求方法
export const post = <T>(url: string, data?: any): Promise<T> => {
  return http.post(url, data);
};

// 封装PUT请求方法
export const put = <T>(url: string, data?: any): Promise<T> => {
  return http.put(url, data);
};

// 封装DELETE请求方法
export const del = <T>(url: string, params?: any): Promise<T> => {
  return http.delete(url, { params });
};

// 导出axios实例
export default http;
