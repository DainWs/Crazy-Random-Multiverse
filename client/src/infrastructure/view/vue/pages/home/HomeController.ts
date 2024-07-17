import router from '@vue-root/configuration/router';
import { createParty } from '@/application/partyService';

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

const onPreviewClick = () => {
  if (isInDevelopment()) {
    router.push('/preview');
  }
};

const onExitClick = () => {
  if (isNotBrowserPlatform()) {
    // TODO interface to close app not defined
  }
};

const isInDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

const isNotBrowserPlatform = () => {
  return process.env.PLATAFORM !== 'browser';
};

export default {
  isInDevelopment,
  isNotBrowserPlatform,
  onCreatePartyClick,
  onJoinPartyClick,
  onSettingsClick,
  onCreditsClick,
  onPreviewClick,
  onExitClick
};
