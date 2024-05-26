import Party from '@/domain/models/Party';
import PartyCode from '@/domain/models/PartyCode';
import PartyList from '@/domain/models/PartyList';
import PartyEvent from '@/domain/events/PartyEvent';
import PartyListEvent from '@/domain/events/PartyListEvent';
import { partyEventService, partyListEventService } from '@/domain/services/eventService';
import { sendCreateGame, sendCreateParty, sendJoinParty, sendLeaveParty, sendRefreshPartyInfo, sendRefreshPartyList } from '@/infrastructure/api/v1';

const updateLocalPartyInfo = (partyInfo: Party) => {
  partyEventService.notify(new PartyEvent('PARTY_INFO_UPDATE', partyInfo));
};

const updateLocalPartyList = (partyList: PartyList) => {
  partyListEventService.notify(new PartyListEvent('PARTY_LIST_UPDATE', partyList));
};

const startParty = async () => {
  await sendCreateGame();
};

const createParty = async () => {
  await sendCreateParty();
};

const joinParty = async (partyCode: PartyCode) => {
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

export { updateLocalPartyInfo, updateLocalPartyList, startParty, createParty, joinParty, leaveParty, refreshPartyInfo, refreshPartyList };
