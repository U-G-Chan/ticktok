import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import apiConfig from '../config/api.config';

// 不需要认证的接口列表
const publicApis = [
  '/upload/media',
  '/auth/login',
  '/auth/register',
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

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 检查当前请求是否是公开接口
    const isPublic = isPublicApi(config.url || '');
    
    // 只对非公开接口添加认证
    if (!isPublic) {
      const token = localStorage.getItem('token');
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
  (error: AxiosError) => {
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
