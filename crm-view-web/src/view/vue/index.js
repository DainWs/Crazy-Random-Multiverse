import { createApp } from 'vue'
import router from '@/view/vue/configuration/router'
import app from '@/view/vue/app.vue'

const mount = () => {
    createApp(app).use(router).mount('#app');
}

export default {
    mount
}