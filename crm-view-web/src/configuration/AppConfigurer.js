import { configureEnviroment } from '@/configuration/enviromentConfigurer';
import { configureStomp } from '@/configuration/stompConfigurer';

const configureApp = () => {
    configureEnviroment()
    configureStomp()
}

export {
    configureApp
}