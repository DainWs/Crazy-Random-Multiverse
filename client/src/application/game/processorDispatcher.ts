import { GameEventCode } from '@/domain/events/GameEvent';
import GameEventProcessor from '@/application/game/GameEventProcessor';
import GameCreateEventProcessor from '@/application/game/GameCreateProcessor';
import GameStartEventProcessor from '@/application/game/GameStartProcessor';
import GameEndEventProcessor from '@/application/game/GameEndProcessor';
import PlayerReceiveCardProcessor from '@/application/game/PlayerReceiveCardProcessor';

const eventProcessors = new Map<GameEventCode, new () => GameEventProcessor>();
eventProcessors.set('GAME_CREATED', GameCreateEventProcessor);
eventProcessors.set('GAME_START', GameStartEventProcessor);
eventProcessors.set('GAME_END_WITH_TIE', GameEndEventProcessor);
eventProcessors.set('GAME_END_WITH_WINNER', GameEndEventProcessor);
eventProcessors.set('PLAYER_RECEIVE_CARD', PlayerReceiveCardProcessor);

const dispatch = (eventCode: GameEventCode): GameEventProcessor => {
  const EventProcessorClass = eventProcessors.get(eventCode);
  
  if (EventProcessorClass) {
    return new EventProcessorClass();
  }
  
  throw new Error(`No event processor found for EventCode "${eventCode}"`);
};

export default {
  dispatch
};
