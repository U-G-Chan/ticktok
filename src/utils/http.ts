import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import apiConfig from '../config/api.config';

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
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    
    // 如果有token则添加到请求头
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
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
    
    // 根据实际后端接口定义，可以统一处理错误码
    if (res.code && res.code !== 200) {
      // 处理特定的错误码，例如401表示未授权
      if (res.code === 401) {
        // 处理未授权情况，比如跳转到登录页
        console.error('未授权，请重新登录');
        // 可以在这里执行路由跳转
        // router.push('/login');
      }
      
      // 返回错误信息
      return Promise.reject(new Error(res.message || '请求错误'));
    }
    
    // 直接返回数据部分
    return res.data;
  },
  (error: AxiosError) => {
    console.error('请求出错:', error);
    
    // 可以在这里统一处理HTTP错误状态码
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          console.error('未授权，请重新登录');
          // router.push('/login');
          break;
        case 403:
          console.error('拒绝访问');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error(`请求失败，状态码: ${status}`);
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
