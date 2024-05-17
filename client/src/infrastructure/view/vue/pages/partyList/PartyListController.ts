import {ref} from 'vue';
import router from '@vue-root/configuration/router';
import {joinParty, refreshPartyList} from '@/application/partyService';
import {partyListEventService} from '@/application/eventService';
import Party from '@/domain/models/Party';
import PartyList from '@/domain/models/PartyList';
import PartyListEvent from '@/domain/events/PartyListEvent';

const subscriberId = 'party-list__controller';
const partyList = ref(new PartyList());

const onLoad = async () => {
  partyListEventService.subscribe(subscriberId, handlePartyListEvent);
  await refreshPartyList();
};

function handlePartyListEvent(partyListEvent: PartyListEvent) {
  if (partyListEvent.getCode() == 'PARTY_LIST_UPDATE') {
    partyList.value = partyListEvent.getDetails();
  }
}

const onUnload = async () => {
  partyListEventService.unsubscribe(subscriberId);
};

const getReactivePartyList = () => {
  return partyList;
};

const onRefreshPartiesClick = async () => {
  await refreshPartyList();
};

const onJoinPartyClick = async (party: Party) => {
  await joinParty(party.code);
  router.push('/party');
};

const onBackClick = () => {
  router.push('/');
};

export default {
  onLoad,
  onUnload,
  getReactivePartyList,
  onRefreshPartiesClick,
  onJoinPartyClick,
  onBackClick
};
