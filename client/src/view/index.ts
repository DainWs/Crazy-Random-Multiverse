import { createApp } from 'vue';
import errorViewerImpl from '@components/ErrorViewerController';
import router, { navigator as navigatorImpl } from '@view/configuration/router';
import IErrorViewer from '@view/IErrorViewer';
import INavigator from '@view/INavigator';
import app from '@view/App.vue';

import '@assets/styles/main.scss'
import { createPinia } from 'pinia';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap';

const mountView = () => {
  createApp(app)
    .use(createPinia())
    .use(router)
    .mount('#app');
};

const navigator = (): INavigator => {
  return navigatorImpl;
}

const errorViewer = (): IErrorViewer => {
  return errorViewerImpl;
}

export {
  mountView,
  navigator,
  errorViewer,
};