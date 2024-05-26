import GameError from '@/domain/models/GameError';
import GameEvent from '@/domain/events/GameEvent';
import processorDispatcher from '@/application/game/processorDispatcher';
import { gameEventService } from '@/domain/services/eventService';
import { gameRepository } from '@/infrastructure/repositories';
import { errorViewer } from '@view/index';

const processGameEvent = (gameEvent: GameEvent) => {
  const details = gameEvent.getDetails();
  if (details.game) {
    gameRepository.updateCurrentGame(details.game);
  }

  processorDispatcher.dispatch(gameEvent.getCode())
    .process(gameEvent, );

  gameEventService.notify(gameEvent);
};

const processGameError = (gameError: GameError) => {
  errorViewer().showGameError(gameError);
};

export { processGameEvent, processGameError };
