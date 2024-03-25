import stompAdapter from "@/repositories/api/stomp/adapter";
import Destinations from "@/repositories/api/destinations";

const sendRefreshUserInfo = async () => {
    await stompAdapter.send(Destinations.USER_INFO);
}

const sendUpdateUserInfo = async (userInfo) => {
    await stompAdapter.send(Destinations.USER_UPDATE, userInfo);
}

const sendRefreshPartyList = async () => {
    await stompAdapter.send(Destinations.PARTY_LIST);
}

const sendRefreshPartyInfo = async () => {
    await stompAdapter.send(Destinations.PARTY_INFO);
}

const sendCreateParty = async () => {
    await stompAdapter.send(Destinations.PARTY_CREATE);
}

const sendJoinParty = async (partyCode) => {
    await stompAdapter.send(`${Destinations.PARTY_JOIN}/${partyCode}`);
}

const sendLeaveParty = async () => {
    await stompAdapter.send(Destinations.PARTY_LEAVE);
}

const sendCreateGame = async () => {
    await stompAdapter.send(Destinations.GAME_CREATE);
}

const sendReadyToPlay = async () => {
    await stompAdapter.send(Destinations.GAME_READY);
}

export {
    sendRefreshUserInfo,
    sendUpdateUserInfo,
    sendRefreshPartyList,
    sendRefreshPartyInfo,
    sendCreateParty,
    sendJoinParty,
    sendLeaveParty,
    sendCreateGame,
    sendReadyToPlay
}