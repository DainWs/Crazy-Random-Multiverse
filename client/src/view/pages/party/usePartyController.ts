import router from '@view/configuration/router';
import usePartyStore from '@/stores/PartyStore';
import useSessionStore from '@/stores/SessionStore';

const usePartyController = () => {
  const sessionStore = useSessionStore();
  const partyStore = usePartyStore();

  const shouldShowYouTagFor = (username: string) => {
    return sessionStore.currentUser.username == username;
  };

  const shouldShowAdminTagFor = (username: string) => {
    return partyStore.currentParty?.isUserAdmin(username);
  };

  const shouldShowStartButton = () => {
    return partyStore.currentParty?.isUserAdmin(sessionStore.currentUser.username);
  };

  const getReactivePartyInfo = () => {
    return partyStore;
  };

  const onStartClick = async () => {
    await partyStore.startPartyGame();
  };

  const onLeaveClick = async () => {
    await partyStore.leaveFromParty();
    router.push('/');
  };

  return {
    shouldShowYouTagFor,
    shouldShowAdminTagFor,
    shouldShowStartButton,
    getReactivePartyInfo,
    onStartClick,
    onLeaveClick
  };
}

export default usePartyController;