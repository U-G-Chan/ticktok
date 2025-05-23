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
    
    console.log(`请求 ${config.url}: ${isPublic ? '公开接口' : '需要认证'}`);
    
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
    
    // 直接返回响应数据，不进行复杂的错误码判断
    // 让具体的业务逻辑处理错误
    return res;
  },
  (error: AxiosError) => {
    console.error('请求出错:', error);
    
    // 可以在这里统一处理HTTP错误状态码
    if (error.response) {
      const { status } = error.response;
      const url = error.config?.url || '';
      
      console.error(`请求失败，状态码: ${status}, 接口: ${url}`);
      
      // 特别处理401错误
      if (status === 401) {
        const isPublic = isPublicApi(url);
        if (!isPublic) {
          console.warn('🔐 认证失败！请检查Token是否正确设置');
          console.warn('💡 可以访问 /clear-storage.html 来设置测试Token');
        }
      }
      
    } else if (error.request) {
      console.error('网络错误，请检查网络连接');
    } else {
      console.error('请求配置错误');
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
