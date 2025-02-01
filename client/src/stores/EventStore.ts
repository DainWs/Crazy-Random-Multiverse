import { defineStore } from 'pinia'
import GameEvent from '@/domain/events/GameEvent';
import QueueExecutor from '@/application/QueueExecutor';
import processorDispatcher from '@/application/game/processorDispatcher';
import useGameStore from '@/stores/GameStore';

const useEventStore = defineStore('event', initialize);

function initialize() {
  const gameStore = useGameStore();
  const queue = new QueueExecutor();

  const processGameEvent = (gameEvent: GameEvent) => {
    queue.enqueue(async () => {
      processorDispatcher.dispatch(gameEvent.getCode())
        .process(gameEvent,);

      const details = gameEvent.getDetails();
      gameStore.currentGame = details.game;
    });
  };

  return { processGameEvent };
}

export default useEventStore;