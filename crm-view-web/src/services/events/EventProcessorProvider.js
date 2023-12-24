import EventCodes from "./EventCodes";
import GameCreateProcessor from "./GameCreateProcessor";
import GameStartProcessor from "./GameStartProcessor";
import GameEndProcessor from "./GameEndProcessor";

const EventProcessors = new Map()
EventProcessors.set(EventCodes.GAME_CREATED, GameCreateProcessor)
EventProcessors.set(EventCodes.GAME_START, GameStartProcessor)
EventProcessors.set(EventCodes.GAME_END, GameEndProcessor)
EventProcessors.set(EventCodes.PLAYER_WIN,)
EventProcessors.set(EventCodes.PLAYER_LOSE,)
EventProcessors.set(EventCodes.PLAYER_SURRENDER,)
EventProcessors.set(EventCodes.PLAYER_GET_TURN,)
EventProcessors.set(EventCodes.PLAYER_GET_CARD,)
EventProcessors.set(EventCodes.PLAYER_PUT_CARD,)
EventProcessors.set(EventCodes.PLAYER_MOVE_CARD,)
EventProcessors.set(EventCodes.PLAYER_ATTACK_CARD,)
EventProcessors.set(EventCodes.PLAYER_EQUIP_CARD,)
EventProcessors.set(EventCodes.PLAYER_USE_SPELL,)
EventProcessors.set(EventCodes.PLAYER_PASS_TURN,)

function getEventProcessor(eventCode) {
    if (EventProcessors.has(eventCode)) {
        const processor = EventProcessors.get(eventCode)

        return {
            process: async (event, currentContext) => await processor.process(event, currentContext)
        }
    }

    throw new Error("No event processor found fo EventCode " + eventCode)
}

export default {
    getEventProcessor
}