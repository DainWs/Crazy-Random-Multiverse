import eventObserver from "@/events/eventObserver";
import { sendCreateGame, sendCreateParty, sendJoinParty, sendLeaveParty, sendRefreshPartyInfo, sendRefreshPartyList } from "@/repositories/api/v1"

const properties = {
    partyInfoUpdateHandler: () => {},
    partyListUpdateHandler: () => {}
}

eventObserver.subscribe('PARTY_SERVICE', 'PARTY_INFO_UPDATE', event => properties.partyInfoUpdateHandler(event.details));
eventObserver.subscribe('PARTY_SERVICE', 'PARTY_LIST_UPDATE', event => properties.partyListUpdateHandler(event.details));

const startParty = async () => {
    await sendCreateGame();
}

const createParty = async () => {
    await sendCreateParty();
}

const joinParty = async (partyCode) => {
    await sendJoinParty(partyCode);
}

const leaveParty = async () => {
    await sendLeaveParty();
}

const refreshPartyInfo = async () => {
    await sendRefreshPartyInfo();
}

const refreshPartyList = async () => {
    await sendRefreshPartyList();
}

const setPartyInfoUpdateHandler = (handlerCallback) => {
    properties.partyInfoUpdateHandler = handlerCallback;
}

const setPartyListUpdateHandler = (handlerCallback) => {
    properties.partyListUpdateHandler = handlerCallback;
}

export {
    startParty,
    createParty,
    joinParty,
    leaveParty,
    refreshPartyInfo,
    refreshPartyList,
    setPartyInfoUpdateHandler,
    setPartyListUpdateHandler
}