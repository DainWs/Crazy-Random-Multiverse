import GameError from '@/domain/models/GameError';
import GameEvent from '@/domain/events/GameEvent';
import ErrorEvent from '@/domain/events/ErrorEvent';
import { gameEventService, errorEventService } from '@/application/eventService';
import { gameRepository } from '@/infrastructure/repositories';

const processGameEvent = (gameEvent: GameEvent) => {
  const details = gameEvent.getDetails();
  if (details.game) {
    gameRepository.updateCurrentGame(details.game);
  }

  gameEventService.notify(gameEvent);
};

const processGameError = (gameError: GameError) => {
  const errorEvent = new ErrorEvent('ERROR', gameError);
  errorEventService.notify(errorEvent);
};

export { processGameEvent, processGameError };
