import client from "@/infrastructure/stomp";

const APPLICATION_ENDPOINT = `/application`;
const USER_ENDPOINT = `${APPLICATION_ENDPOINT}/user`;
const PARTY_ENDPOINT = `${APPLICATION_ENDPOINT}/party`;
const GAME_ENDPOINT = `${APPLICATION_ENDPOINT}/game`;

const sendRefreshUserInfo = async () => {
    await client.send(`${USER_ENDPOINT}/info`);
}

const sendUpdateUserInfo = async (userInfo) => {
    await client.send(`${USER_ENDPOINT}/update`, userInfo);
}

const sendRefreshPartyList = async () => {
    await client.send(`${PARTY_ENDPOINT}/list`);
}

const sendRefreshPartyInfo = async () => {
    await client.send(`${PARTY_ENDPOINT}/info`);
}

const sendCreateParty = async () => {
    await client.send(`${PARTY_ENDPOINT}/create`);
}

const sendJoinParty = async (partyCode) => {
    await client.send(`${PARTY_ENDPOINT}/join/${partyCode}`);
}

const sendLeaveParty = async () => {
    await client.send(`${PARTY_ENDPOINT}/leave`);
}

const sendCreateGame = async () => {
    await client.send(`${GAME_ENDPOINT}/create`);
}

const sendReadyToPlay = async (gameCode) => {
    await client.send(`${GAME_ENDPOINT}/${gameCode}/ready`);
}

const sendAction = async (gameCode, action) => {
    await client.send(`${GAME_ENDPOINT}/${gameCode}/action`, action);
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
    sendReadyToPlay,
    sendAction
}