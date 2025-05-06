import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "./assets/iconfont.css";
import '@icon-park/vue-next/styles/index.css';
import { install } from '@icon-park/vue-next/es/all';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
install(app); // 全局注册所有icon-park图标
app.mount("#app");
