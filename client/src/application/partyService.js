import eventObserver from '@/application/events/observer';
import {sendCreateGame, sendCreateParty, sendJoinParty, sendLeaveParty, sendRefreshPartyInfo, sendRefreshPartyList} from '@/infrastructure/api/v1';

const properties = {
  partyInfo: {},
  partyList: []
};

const updateLocalPartyInfo = (partyInfo) => {
  properties.partyInfo = partyInfo;

  const event = {code: 'PARTY_INFO_UPDATE', details: partyInfo};
  eventObserver.notify(event.code, event);
};

const updateLocalPartyList = (partyList) => {
  properties.partyList = partyList;

  const event = {code: 'PARTY_LIST_UPDATE', details: partyList};
  eventObserver.notify(event.code, event);
};

const startParty = async () => {
  await sendCreateGame();
};

const createParty = async () => {
  await sendCreateParty();
};

const joinParty = async (partyCode) => {
  await sendJoinParty(partyCode);
};

const leaveParty = async () => {
  await sendLeaveParty();
};

const refreshPartyInfo = async () => {
  await sendRefreshPartyInfo();
};

const refreshPartyList = async () => {
  await sendRefreshPartyList();
};

export {updateLocalPartyInfo, updateLocalPartyList, startParty, createParty, joinParty, leaveParty, refreshPartyInfo, refreshPartyList};
