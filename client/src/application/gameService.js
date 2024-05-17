import { gameEventService } from '@/application/eventService';
import { gameRepository } from '@/infrastructure/repositories';

const processGameEvent = (gameEvent) => {
  if (gameEvent.details.game) {
    gameRepository.updateCurrentGame(gameEvent.details.game);
  }

  gameEventService.notify(gameEvent);
};

const processGameError = (gameError) => {
  eventObserver.notify('ERROR', gameError);
};

export { processGameEvent, processGameError };
