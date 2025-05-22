// API配置文件
// 根据不同环境配置baseURL

interface ApiConfig {
  baseURL: string;
  timeout: number;
  // 可以根据需要添加其他配置项
}

// 开发环境API配置
const devConfig: ApiConfig = {
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
};

// 测试环境API配置
const testConfig: ApiConfig = {
  baseURL: 'https://test-api.example.com/api',
  timeout: 10000,
};

// 生产环境API配置
const prodConfig: ApiConfig = {
  baseURL: 'https://api.example.com/api',
  timeout: 15000,
};

// 根据当前环境导出相应配置
let config: ApiConfig;

if (import.meta.env.PROD) {
  // 生产环境
  config = prodConfig;
} else if (import.meta.env.MODE === 'test') {
  // 测试环境
  config = testConfig;
} else {
  // 开发环境
  config = devConfig;
}

export default config;