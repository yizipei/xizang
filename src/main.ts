import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'amfe-flexible'

import './assets/main.css'

// Toast
import { Toast } from 'vant'
import 'vant/es/toast/style'

// Dialog
import { Dialog } from 'vant'
import 'vant/es/dialog/style'

// Notify
import { Notify } from 'vant'
import 'vant/es/notify/style'

// ImagePreview
import { ImagePreview } from 'vant'
import 'vant/es/image-preview/style'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
