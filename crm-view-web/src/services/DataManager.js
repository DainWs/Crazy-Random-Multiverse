import { ref } from "vue";
import Topics from "@/services/stomp/StompTopics";
import Destinations from "@/services/stomp/StompDestinations";
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

const partyList = ref({
    parties: []
})

const userInfo = ref({
    uid: '',
    username: ''
})

StompMessageHandler.subscribe("Manager", Topics.PARTY_INFO, (data) => {partyInfo.value = data})
StompMessageHandler.subscribe("Manager", Topics.PARTY_LIST, (data) => {partyList.value = data})
StompMessageHandler.subscribe("Manager", Topics.USER_INFO, (data) => {userInfo.value = data})

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