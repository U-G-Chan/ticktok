import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "./assets/iconfont.css";
import '@icon-park/vue-next/styles/index.css';
import { install } from '@icon-park/vue-next/es/all';
import { setupMockWebSocket } from './api/websocket-mock';
import { useUserStore } from "./store/user";
import { useChatStore } from "./store/chat";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
install(app); // 全局注册所有icon-park图标

// 设置模拟WebSocket
setupMockWebSocket();

// 初始化应用
async function initApp() {
  // 获取用户存储
  const userStore = useUserStore(pinia);
  const chatStore = useChatStore(pinia);

  // 模拟用户登录 (使用ID 10000 作为测试用户)
  try {
    await userStore.login(0);
    console.log('模拟用户登录成功');
    
    // 用户登录成功后初始化WebSocket连接
    chatStore.initWebSocket();
  } catch (error) {
    console.error('模拟用户登录失败:', error);
  }
}

// 初始化完成后挂载应用
initApp().then(() => {
  app.mount("#app");
});
