import { createApp } from 'vue';
import router from '@/infrastructure/view/vue/configuration/router';
import app from '@/infrastructure/view/vue/App.vue';

const mount = () => {
  createApp(app).use(router).mount('#app');
};

export default {
  mount
};
