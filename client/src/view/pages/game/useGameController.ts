import Zone from '@/domain/models/Zone';
import ActionParts from '@/domain/actions/ActionParts';
import useGameStore from '@/stores/GameStore';

const useGameController = () => {
  const gameStore = useGameStore();
  if (gameStore.currentGame == null) throw new Error("Not in a game");

  const getReactiveGame = () => {
    return gameStore.currentGame;
  };

  const getReactivePlayerInfo = () => {
    return gameStore.playerInfo;
  };

  const getReactivePlayerHand = () => {
    return gameStore.playerHand;
  };

  const getReactiveVisibleZone = () => {
    return gameStore.visibleZone;
  };

  const onZoneSelect = (zone: Zone) => {
    gameStore.visibleZone = zone;
  };

  const onActionPerformed = async (event: ActionParts) => {
    console.log('Source:');
    console.log(event.source);
    console.log('Target:');
    console.log(event.target);
  };

  return {
    getReactiveGame,
    getReactivePlayerInfo,
    getReactivePlayerHand,
    getReactiveVisibleZone,
    onZoneSelect,
    onActionPerformed
  };
};

export default useGameController;
