import eventObserver from '@/application/events/observer';
import {gameRepository} from '@/infrastructure/repositories';

const processGameEvent = (gameEvent) => {
  if (gameEvent.details.game) {
    gameRepository.updateCurrentGame(gameEvent.details.game);
  }

  eventObserver.notify(gameEvent.code, gameEvent);
};

const processGameError = (gameError) => {
  eventObserver.notify('ERROR', gameError);
};

export {processGameEvent, processGameError};
