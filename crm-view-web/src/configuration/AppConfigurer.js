import { configureApi } from '@/configuration/apiConfigurer';
import { configureStorage } from '@/configuration/storageConfigurer';
import { configureEnviroment } from './enviromentConfigurer';

const configureApp = () => {
    configureEnviroment()
    configureStorage()
    configureApi()
}

export {
    configureApp
}