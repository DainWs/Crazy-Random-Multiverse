import { ref } from "vue";
import Topics from "@/services/stomp/StompTopics";
import Destinations from "@/services/stomp/StompDestinations";
import SettingsService from "@/services/settings/SettingsService";
import StompMessageHandler from "@/services/stomp/StompMessageHandler";
import StompService from "./stomp/StompService";

const gameInfo = ref({})

const playerInfo = ref({})

const errorInfo = ref({})

StompMessageHandler.subscribe("GameController", Topics.GAME_EVENT, (data) => {partyInfo.value = data})
StompMessageHandler.subscribe("GameController", Topics.GAME_ERROR, (data) => {partyList.value = data})

function processGameEvent(event) {
    console.log(event)

}

function processGameError(error) {
    console.log(error)
}


function getPartyInfo() {
    return partyInfo;
}

function getPartyList() {
    return partyList;
}

function getUserInfo() {
    return userInfo;
}

async function refresh() {
    await StompService.send(Destinations.PARTY_LIST)
}

export default {
    getPartyInfo,
    getPartyList,
    getUserInfo,
    refresh
}