import { GameEventCode } from '@/domain/events/GameEvent';
import GameEventHandler from '@/application/events/GameEventHandler';
import GameCreateEventHandler from '@/application/events/handlers/gameCreateHandler';
import GameStartEventHandler from '@/application/events/handlers/gameStartHandler';
import GameEndEventHandler from '@/application/events/handlers/gameEndHandler';
import PlayerGetTurnEventHandler from '@/application/events/handlers/playerGetTurnHandler';
import PlayerGetCardEventHandler from '@/application/events/handlers/playerGetCardHandler';

/**
 * @typedef {import('@/application/events').EventCode} EventCode
 * @typedef {import('@/application/events').EventHandler} EventHandler
 */

/**
 * @type {Map<EventCode, EventHandler>}
 */
const eventHandlers = new Map<GameEventCode, GameEventHandler>();
eventHandlers.set('GAME_CREATED', GameCreateEventHandler);
eventHandlers.set('GAME_START', GameStartEventHandler);
eventHandlers.set('GAME_END', GameEndEventHandler);
//eventHandlers.set('PLAYER_WIN', null);
//eventHandlers.set('PLAYER_LOSE', null);
//eventHandlers.set('PLAYER_SURRENDER', null);
eventHandlers.set('PLAYER_GET_TURN', PlayerGetTurnEventHandler);
eventHandlers.set('PLAYER_GET_CARD', PlayerGetCardEventHandler);
//eventHandlers.set('PLAYER_PUT_CARD', null);
//eventHandlers.set('PLAYER_MOVE_CARD', null);
//eventHandlers.set('PLAYER_ATTACK_CARD', null);
//eventHandlers.set('PLAYER_EQUIP_CARD', null);
//eventHandlers.set('PLAYER_USE_SPELL', null);
//eventHandlers.set('PLAYER_PASS_TURN', null);

const dispatchHandler = (eventCode: GameEventCode): GameEventHandler => {
  const eventHandler = eventHandlers.get(eventCode);
  
  if (eventHandler) {
    return eventHandler;
  }
  
  throw new Error(`No event EventHandler found for EventCode "${eventCode}"`);
};

export default {
  dispatchHandler
};
