import { configureRepositories } from '@/configuration/repositoryConfigurer';
import { configureStomp } from '@/configuration/stompConfigurer';

const configureApp = () => {
  configureRepositories();
  configureStomp();
};

export { configureApp };
