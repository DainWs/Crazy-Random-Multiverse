import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import AppConfigurator from './configuration/AppConfigurer'
AppConfigurator.configure();

createApp(App).use(router).mount('#app');

