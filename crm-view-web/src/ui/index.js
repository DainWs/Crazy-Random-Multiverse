import { createApp } from 'vue'
import App from '@/ui/vue/app.vue'
import router from '@/configuration/vueRouter'

const createUI = () => {
    createApp(App).use(router).mount('#app');
}

export {
    createUI
}