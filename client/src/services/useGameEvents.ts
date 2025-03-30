import QueueExecutor from "@/application/QueueExecutor";
import Event from "@/services/events/Event";
import Game from "@/domain/models/Game";
import Hand from "@/domain/models/Hand";
import Player from "@/domain/models/Player";
import Zone from "@/domain/models/Zone";
import { Context, process } from "@/services/events";
import useGameStore from "@/stores/GameStore";
import useSessionStore from "@/stores/SessionStore";

const useGameEvents = () => {
  const sessionStore = useSessionStore();
  const gameStore = useGameStore();

  const queue = new QueueExecutor();

  const addEventToQueue = (gameEvent: Event) => {
    queue.enqueue(async () => processEvent(gameEvent));
  }

  async function processEvent(gameEvent: Event) {
    const context = createContext();
    await process(gameEvent, context);
  };

  function createContext(): Context {
    return {
      getUser: () => sessionStore.currentUser,

      setCurrentGame: game => gameStore.currentGame = game,
      getCurrentGame: () => gameStore.currentGame as Game,

      setPlayerInfo: playerInfo => gameStore.playerInfo = playerInfo,
      getPlayerInfo: () => gameStore.playerInfo as Player,

      setPlayerHand: hand => gameStore.playerHand = hand,
      getPlayerHand: () => gameStore.playerHand as Hand,

      setVisibleZone: zone => gameStore.visibleZone = zone,
      getVisibleZone: () => gameStore.visibleZone as Zone,
    }
  }

  return { addEventToQueue };
}

export default useGameEvents;