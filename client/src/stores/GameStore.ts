import { ref } from 'vue';
import { defineStore } from 'pinia'
import Game from "@/domain/models/Game";
import Zone from '@/domain/models/Zone';
import Hand from '@/domain/models/Hand';
import Player from '@/domain/models/Player';
import GameEvent from '@/domain/events/GameEvent';
import QueueExecutor from '@/application/QueueExecutor';
import processorDispatcher from '@/application/game/processorDispatcher';
import GameError from '@/domain/models/GameError';
import useSessionStore from '@/stores/SessionStore';

type GameEventHandler = (gameEvent: GameEvent) => void;
type GameErrorHandler = (gameError: GameError) => void;

let processGameEvent: GameEventHandler | null = null;
let processGameError: GameErrorHandler | null = null;

const useGameStore = defineStore('game', initialize);

function initialize() {
  const sessionStore = useSessionStore();
  const currentGame = ref<Game | null>(null);
  const playerInfo = ref<Player>(sessionStore.currentUser.toPlayer());
  const playerHand = ref<Hand>(new Hand(playerInfo.value));
  const visibleZone = ref<Zone | null>(null);
  const errors = ref<GameError[]>([]);

  const queue = new QueueExecutor();

  const processEvent = (gameEvent: GameEvent) => {
    queue.enqueue(async () => {
      processorDispatcher.dispatch(gameEvent.getCode())
        .process(gameEvent,);

      const details = gameEvent.getDetails();
      currentGame.value = details.game;
    });
  };

  const processError = (gameError: GameError) => {
    errors.value.push(gameError);
  }

  processGameEvent = processEvent;
  processGameError = processError;

  return {
    currentGame,
    playerInfo,
    playerHand,
    visibleZone,

    errors
  };
}

export { processGameEvent, processGameError };
export default useGameStore;