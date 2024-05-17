import StompClientImpl from '@/infrastructure/stomp/StompClientImpl';
import {setClient} from '@api/v1';
import {userRepository} from '@repositories/index';

const configureStomp = () => {
  const username: string = userRepository.findCurrentUser().username;

  setClient(new StompClientImpl(username, getServerHost()));
};

function getServerHost() {
  if (process.env.SERVER_HOST) {
    return process.env.SERVER_HOST;
  }

  if (process.env.PLATAFORM == 'browser') {
    return window.location.host;
  }

  throw new Error('SERVER_HOST enviroment variable not defined');
}

export {configureStomp};
