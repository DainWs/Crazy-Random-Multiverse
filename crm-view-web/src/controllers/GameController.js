import { ref } from "vue";
import Topics from "@/services/stomp/StompTopics";
import StompMessageHandler from "@/services/stomp/StompMessageHandler";
import EventProcessorProvider from "@/services/events/EventProcessorProvider";

const gameInfo = ref({
    playerWithTurn: undefined,
    zones: []
})

const playerInfo = ref({
    code: undefined,
    name: undefined,
    isSpectator: false,
    isAlive: true
})

const handInfo = ref({
    cards: []
})

const errorInfo = ref({
    key: undefined,
    value: undefined,
    language: undefined
})

StompMessageHandler.subscribe("GameController", Topics.GAME_EVENT, processGameEvent)
StompMessageHandler.subscribe("GameController", Topics.GAME_ERROR, processGameError)

async function processGameEvent(event) {
    try {
        const currentContext = {
            game: gameInfo.value,
            player: playerInfo.value,
            hand: handInfo.value
        }

        const eventProcessor = EventProcessorProvider.getEventProcessor(event.code)
        await eventProcessor.process(event, currentContext)

        gameInfo.value = currentContext.game
        playerInfo.value = currentContext.player
        handInfo.value = currentContext.hand
    }
    catch(error) {
        console.error(error)
        errorInfo.value = error.message
    }
}

function processGameError(error) {
    errorInfo.value = error
}


function getGameInfo() {
    return gameInfo;
}

function getPlayerInfo() {
    return playerInfo;
}

function getHandInfo() {
    return handInfo;
}

export default {
    getGameInfo,
    getPlayerInfo,
    getHandInfo
}