import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "@icon-park/vue-next/styles/index.css";
import { install } from "@icon-park/vue-next/es/all";
import { setupMockWebSocket } from "./api/websocket-mock";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
install(app); // 全局注册所有icon-park图标

// 设置模拟WebSocket
setupMockWebSocket();

app.mount("#app");
