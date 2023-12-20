import { ref } from "vue";
import Topics from "@/services/stomp/StompTopics";
import Destinations from "@/services/stomp/StompDestinations";
import SettingsService from "@/services/settings/SettingsService";
import StompMessageHandler from "@/services/stomp/StompMessageHandler";
import StompService from "./stomp/StompService";

const partyInfo = ref({
    code: undefined,
    name: undefined,
    userCount: 0,
    maxUsers: 4,
    owner: undefined,
    users: []
})

const partyList = ref([])

const userInfo = ref({
    username: ''
})

StompMessageHandler.subscribe("Manager", Topics.PARTY_INFO, (data) => {partyInfo.value = data})
StompMessageHandler.subscribe("Manager", Topics.PARTY_LIST, (data) => {partyList.value.values = data})
StompMessageHandler.subscribe("Manager", Topics.USER_INFO, (data) => {userInfo.value = data})
SettingsService.getUsername().then(username => userInfo.value.username = username)

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
    await StompService.send(Destinations.PARTY_INFO)
    await StompService.send(Destinations.PARTY_LIST)
    await StompService.send(Destinations.USER_INFO)
}

export default {
    getPartyInfo,
    getPartyList,
    getUserInfo,
    refresh
}