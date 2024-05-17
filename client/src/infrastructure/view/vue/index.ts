import {createApp} from 'vue';
import router from '@vue-root/configuration/router';
import app from '@vue-root/App.vue';

const mount = () => {
  createApp(app).use(router).mount('#app');
};

export default {
  mount
};
