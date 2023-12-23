import { createApp } from 'vue'
import App from './App.vue'
import store from "./store";
import router from "./router/index";
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css';
// import locale from 'element-plus/lib/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Katex from 'vue-katex-auto-render';

const app = createApp(App);
app.directive('katex', Katex)
app.use(store);
app.use(router);
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app');
