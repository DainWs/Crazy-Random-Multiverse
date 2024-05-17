import router from '@vue-root/configuration/router';
import {createParty} from '@/application/partyService';

const onCreatePartyClick = async () => {
  await createParty();
  router.push('/party');
};

const onJoinPartyClick = () => {
  router.push('/party-list');
};

const onSettingsClick = () => {
  router.push('/settings');
};

const onCreditsClick = () => {
  router.push('/credits');
};

const onExitClick = () => {
  if (isNotBrowserPlatform()) {
    // TODO interface to close app not defined
  }
};

const isNotBrowserPlatform = () => {
  return process.env.PLATAFORM !== 'browser';
};

export default {
  isNotBrowserPlatform,
  onCreatePartyClick,
  onJoinPartyClick,
  onSettingsClick,
  onCreditsClick,
  onExitClick
};
