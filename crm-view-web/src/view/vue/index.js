import { createApp } from 'vue'
import router from '@/view/vue/configuration/router'
import app from '@/view/vue/app.vue'

const mountView = () => {
    createApp(app).use(router).mount('#app');
}

const navigate = (route) => {
    router.push(route);
}

export default { 
    mountView, 
    navigate
}