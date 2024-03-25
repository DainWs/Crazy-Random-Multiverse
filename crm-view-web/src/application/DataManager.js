import { ref } from 'vue';
import Destinations from "@/repositories/api/destinations";
import StompService from "@/repositories/api/stomp/adapter";

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

//StompMessageHandler.subscribe("Manager", 'PARTY_INFO', (data) => {partyInfo.value = data})
//StompMessageHandler.subscribe("Manager", 'PARTY_LIST', (data) => {partyList.parties = data.parties})
//StompMessageHandler.subscribe("Manager", 'USER_INFO', (data) => {userInfo.value = data})

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