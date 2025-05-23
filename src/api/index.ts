// API模块统一导出文件

// 导入各个API模块
import * as userApi from './modules/user';
import * as chatApi from './modules/chat';
import * as mallApi from './modules/mall';
import * as blogApi from './modules/blog';
import * as userContentApi from './modules/userContent';

// 导出所有API
export {
  userApi,
  chatApi,
  mallApi,
  blogApi,
  userContentApi
};

// 默认导出所有API
export default {
  user: userApi,
  chat: chatApi,
  mall: mallApi,
  blog: blogApi,
  userContent: userContentApi
};