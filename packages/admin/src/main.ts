import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './common/css/main.css'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
