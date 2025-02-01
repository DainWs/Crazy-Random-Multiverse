import router from '@view/configuration/router';
import usePartyStore from '@/stores/PartyStore';

const useHomeController = () => {
  const partyStore = usePartyStore();

  const onCreatePartyClick = async () => {
    await partyStore.createOwnParty('CLASSIC', 4);
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

  return {
    isInDevelopment,
    isNotBrowserPlatform,
    onCreatePartyClick,
    onJoinPartyClick,
    onSettingsClick,
    onCreditsClick,
    onPreviewClick,
    onExitClick
  };
}

export default useHomeController;