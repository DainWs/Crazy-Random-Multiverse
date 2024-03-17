import { ref } from "vue";
import Topics from "@/api/stomp/stompTopics";
import Destinations from "@/api/stomp/stompDestinations";
import StompMessageHandler from "@/api/stomp/stompMessageHandler";
import StompService from "../api/stomp/stompAdapter";

const partyInfo = ref({
    code: undefined,
    name: undefined,
    userCount: 0,
    maxUsers: 4,
    owner: undefined,
    users: []
})

const partyList = {
    parties: []
}

const userInfo = ref({
    uid: '',
    username: ''
})

StompMessageHandler.subscribe("Manager", Topics.PARTY_INFO, (data) => {partyInfo.value = data})
StompMessageHandler.subscribe("Manager", Topics.PARTY_LIST, (data) => {partyList.parties = data.parties})
StompMessageHandler.subscribe("Manager", Topics.USER_INFO, (data) => {userInfo.value = data})

function getPartyInfo() {
    return partyInfo;
}

const setPartyInfo = (partyInfo) => {
}

function getPartyList() {
    return partyList;
}

const setPartyList = (partyList) => {

}

function getUserInfo() {
    return userInfo;
}

const setUserInfo = (userInfo) => {

}

async function refresh() {
    await StompService.send(Destinations.PARTY_LIST)
}

export default {
    getPartyInfo,
    setPartyInfo,
    getPartyList,
    setPartyList,
    getUserInfo,
    setUserInfo,
    refresh
}