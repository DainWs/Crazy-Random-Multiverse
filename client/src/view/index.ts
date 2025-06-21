import { createApp } from 'vue';
import errorViewerImpl from '@components/ErrorViewerController';
import router, { navigator as navigatorImpl } from '@view/configuration/router';
import IErrorViewer from '@view/IErrorViewer';
import INavigator from '@view/INavigator';
import app from '@view/App.vue';

import { createVuetify } from 'vuetify';
import { createPinia } from 'pinia';

import '@assets/styles/main.scss'

const mountView = () => {
  createApp(app)
    .use(createPinia())
    .use(createVuetify({}))
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