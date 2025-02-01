import router from '@view/configuration/router';
import usePartyStore from '@/stores/PartyStore';
import Party from '@/domain/models/Party';

const usePartyListController = () => {
  const partyStore = usePartyStore();

  const getReactivePartyList = () => {
    return partyStore;
  };

  const onRefreshPartiesClick = async () => {
    await partyStore.refreshPartyList();
  };

  const onJoinPartyClick = async (party: Party) => {
    await partyStore.joinToParty(party.code);
    router.push('/party');
  };

  const onBackClick = () => {
    router.push('/');
  };

  return {
    getReactivePartyList,
    onRefreshPartiesClick,
    onJoinPartyClick,
    onBackClick
  };
}

export default usePartyListController;
