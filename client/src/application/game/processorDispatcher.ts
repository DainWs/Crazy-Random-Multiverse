import { GameEventCode } from '@/domain/events/GameEvent';
import GameEventProcessor from '@/application/game/GameEventProcessor';
import GameCreateEventProcessor from '@/application/game/GameCreateProcessor';
import GameStartEventProcessor from '@/application/game/GameStartProcessor';
import GameEndEventProcessor from '@/application/game/GameEndProcessor';
import PlayerGetTurnEventProcessor from '@/application/game/PlayerGetTurnProcessor';
import PlayerGetCardEventProcessor from '@/application/game/PlayerGetCardProcessor';

const eventProcessors = new Map<GameEventCode, new () => GameEventProcessor>();
eventProcessors.set('GAME_CREATED', GameCreateEventProcessor);
eventProcessors.set('GAME_START', GameStartEventProcessor);
eventProcessors.set('GAME_END', GameEndEventProcessor);
//eventProcessors.set('PLAYER_WIN', null);
//eventProcessors.set('PLAYER_LOSE', null);
//eventProcessors.set('PLAYER_SURRENDER', null);
eventProcessors.set('PLAYER_GET_TURN', PlayerGetTurnEventProcessor);
eventProcessors.set('PLAYER_GET_CARD', PlayerGetCardEventProcessor);
//eventProcessors.set('PLAYER_PUT_CARD', null);
//eventProcessors.set('PLAYER_MOVE_CARD', null);
//eventProcessors.set('PLAYER_ATTACK_CARD', null);
//eventProcessors.set('PLAYER_EQUIP_CARD', null);
//eventProcessors.set('PLAYER_USE_SPELL', null);
//eventProcessors.set('PLAYER_PASS_TURN', null);

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
