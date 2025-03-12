import { createApp } from "vue";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import router from './router';
import App from "./App.vue";
import { registerSvgIcon } from './plugins/svgIcon';

const app = createApp(App);

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 使用插件
app.use(ElementPlus);
app.use(router);
app.use(registerSvgIcon);

app.mount("#app");
