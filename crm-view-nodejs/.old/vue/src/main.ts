import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './shims-app'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

window.onload = () => {
    const app = createApp(App)

    //app.use(createPinia())
    app.use(router)

    app.mount('#app')
}