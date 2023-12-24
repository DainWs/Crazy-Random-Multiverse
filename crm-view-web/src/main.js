import { createApp } from 'vue'

import AppConfigurator from '@/configuration/AppConfigurer'
AppConfigurator.configure();

import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

createApp(App).use(router).mount('#app');

