import SettingsService from "./settings/SettingsService";
import StompMessageHandler from "./stomp/StompMessageHandler";

StompMessageHandler.subscribe("Manager", StompMessageHandler.Topics.PARTY_INFO, onPartyInfo)
StompMessageHandler.subscribe("Manager", StompMessageHandler.Topics.PARTY_LIST, onPartyList)
StompMessageHandler.subscribe("Manager", StompMessageHandler.Topics.USER_INFO, onUserInfo)

const DATA = {
    partyInfo: {},
    partyList: {},
    userInfo: { username: undefined }
}

SettingsService.getUsername()
    .then(username => console.log(username))

function onPartyInfo(data) {
    DATA.partyInfo = JSON.parse(data.body)
}

function onPartyList(data) {
    DATA.partyList = JSON.parse(data.body)
}

function onUserInfo(data) {
    DATA.userInfo = JSON.parse(data.body)
}

function getPartyInfo() {
    return DATA.partyInfo;
}

function getPartyList() {
    return DATA.partyList;
}

function getUserInfo() {
    return DATA.userInfo;
}

export default {
    getPartyInfo,
    getPartyList,
    getUserInfo
}