import GameCreateEventHandler from "@/application/events/handlers/gameCreateHandler.js";
import GameStartEventHandler from "@/application/events/handlers/gameStartHandler.js";
import GameEndEventHandler from "@/application/events/handlers/gameEndHandler.js";
import PlayerGetTurnEventHandler from "@/application/events/handlers/playerGetTurnHandler.js";
import PlayerGetCardEventHandler from "@/application/events/handlers/playerGetCardHandler.js";

/**
 * @typedef {import('@/application/events/event').EventCode} EventCode
 * @typedef {import('@/application/events/event').EventHandler} EventHandler
 */

/**
 * @type {Map<EventCode, EventHandler>}
 */
const eventHandlers = new Map()
eventHandlers.set('GAME_CREATED', GameCreateEventHandler.handle)
eventHandlers.set('GAME_START', GameStartEventHandler.handle)
eventHandlers.set('GAME_END', GameEndEventHandler.handle)
eventHandlers.set('PLAYER_WIN',)
eventHandlers.set('PLAYER_LOSE',)
eventHandlers.set('PLAYER_SURRENDER',)
eventHandlers.set('PLAYER_GET_TURN', PlayerGetTurnEventHandler.handle)
eventHandlers.set('PLAYER_GET_CARD', PlayerGetCardEventHandler.handle)
eventHandlers.set('PLAYER_PUT_CARD',)
eventHandlers.set('PLAYER_MOVE_CARD',)
eventHandlers.set('PLAYER_ATTACK_CARD',)
eventHandlers.set('PLAYER_EQUIP_CARD',)
eventHandlers.set('PLAYER_USE_SPELL',)
eventHandlers.set('PLAYER_PASS_TURN',)

/**
 * @param {EventCode} eventCode 
 * @returns {EventHandler}
 */
const getEventHandler = (eventCode) => {
    if (eventHandlers.has(eventCode)) {
        return eventHandlers.get(eventCode);
    }

    throw new Error(`No event EventHandler found for EventCode "${eventCode}"`);
}

export default {
    getEventHandler
}