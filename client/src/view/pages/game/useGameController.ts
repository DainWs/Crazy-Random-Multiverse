import Game from '@/domain/models/Game';
import Zone from '@/domain/models/Zone';
import Hand from '@/domain/models/Hand';
import Player from '@/domain/models/Player';
import ActionParts from '@/domain/actions/ActionParts';
import useGameStore from '@/stores/GameStore';
import useActionStore from '@/stores/ActionStore';

const useGameController = () => {
  const gameStore = useGameStore();
  const actionStore = useActionStore();

  const getReactiveGame = () => {
    return gameStore.currentGame as Game;
  };

  const getReactivePlayerInfo = () => {
    return gameStore.playerInfo as Player;
  };

  const getReactivePlayerHand = () => {
    return gameStore.playerHand as Hand;
  };

  const getReactiveVisibleZone = () => {
    return gameStore.visibleZone as Zone;
  };

  const onZoneSelect = (zone: Zone) => {
    gameStore.visibleZone = zone;
  };

  const onActionPerformed = async (event: ActionParts) => {
    console.log('Source:');
    console.log(event.source);
    console.log('Target:');
    console.log(event.target);
    await actionStore.executeAction(event.source, event.target);
  };

  return {
    getReactiveGame,
    getReactivePlayerInfo,
    getReactivePlayerHand,
    getReactiveVisibleZone,
    onZoneSelect,
    onActionPerformed,
    passTurn: actionStore.executePassTurnAction
  };
};

export default useGameController;
