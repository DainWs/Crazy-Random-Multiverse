import { createApp } from 'vue'

import App from './vue/App.vue'
import router from './vue/router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

window.onload = () => {
    const app = createApp(App)
    app.use(router)
    app.mount('#app')
}