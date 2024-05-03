import {ref} from 'vue';
import router from '@vue-root/configuration/router';
import {getUser} from '@/application/userService';
import {startParty, leaveParty, refreshPartyInfo} from '@/application/partyService';
import {partyEventService} from '@/application/eventService';
import PartyEvent from '@/domain/events/PartyEvent';
import Party from '@/domain/models/Party';

const subscriberId = 'party__controller';
const partyInfo = ref<Party>();

const onLoad = async () => {
  partyEventService.subscribe(subscriberId, handlePartyEvent);
  await refreshPartyInfo();
};

function handlePartyEvent(partyEvent: PartyEvent) {
  if (partyEvent.getCode() == 'PARTY_INFO_UPDATE') {
    partyInfo.value = partyEvent.getDetails();
  }
}

const onUnload = async () => {
  partyEventService.unsubscribe(subscriberId);
};

const shouldShowYouTagFor = (username: string) => {
  return getUser().username == username;
};

const shouldShowAdminTagFor = (username: string) => {
  return partyInfo.value?.owner == username;
};

const shouldShowStartButton = () => {
  return partyInfo.value?.owner == getUser().username;
};

const getReactivePartyInfo = () => {
  return partyInfo;
};

const onStartClick = async () => {
  await startParty();
};

const onLeaveClick = async () => {
  await leaveParty();
  router.push('/');
  partyInfo.value = undefined;
};

export default {
  onLoad,
  onUnload,
  shouldShowYouTagFor,
  shouldShowAdminTagFor,
  shouldShowStartButton,
  getReactivePartyInfo,
  onStartClick,
  onLeaveClick
};
