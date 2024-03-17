import stompAdapter from "@/api/stomp/stompAdapter";
import StompDestinations from "@/api/stomp/stompDestinations";

const refreshUserInfo = async () => {
    await stompAdapter.send(StompDestinations.USER_INFO);
}

const updateUserInfo = async (userInfo) => {
    await stompAdapter.send(StompDestinations.USER_UPDATE, userInfo);
}

const refreshPartyList = async () => {
    await stompAdapter.send(StompDestinations.PARTY_LIST);
}

const refreshPartyInfo = async () => {
    await stompAdapter.send(StompDestinations.PARTY_INFO);
}

const createParty = async () => {
    await stompAdapter.send(StompDestinations.PARTY_CREATE);
}

const joinParty = async (partyCode) => {
    await stompAdapter.send(`${StompDestinations.PARTY_JOIN}/${partyCode}`);
}

const leaveParty = async (partyCode) => {
    await stompAdapter.send(`${StompDestinations.PARTY_LEAVE}/${partyCode}`);
}

const startGame = async () => {
    await stompAdapter.send(StompDestinations.GAME_CREATE);
}

const sendReady = async () => {
    await stompAdapter.send(StompDestinations.GAME_READY);
}

export {
    refreshUserInfo,
    updateUserInfo,
    refreshPartyList,
    refreshPartyInfo,
    createParty,
    joinParty,
    leaveParty,
    startGame,
    sendReady
}