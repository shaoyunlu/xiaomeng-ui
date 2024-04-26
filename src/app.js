/**
 * 程序入口
 */

import { createApp } from "vue";
import App from './app.vue'
import register from '../xmv-entry'
import 'style/app.less'


const app = createApp(App)
app.use(register)
app.mount("#app")