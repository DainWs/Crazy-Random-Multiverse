import { createApp } from 'vue';
import errorViewerImpl from '@vue-components/ErrorViewerController';
import router, { navigator as navigatorImpl } from '@/infrastructure/view/vue/configuration/router';
import app from '@vue-root/App.vue';

const mount = () => {
  createApp(app).use(router).mount('#app');
};

const navigator = () => {
  return navigatorImpl;
}

const errorViewer = () => {
  return errorViewerImpl;
}

export default {
  mount,
  navigator,
  errorViewer
};
