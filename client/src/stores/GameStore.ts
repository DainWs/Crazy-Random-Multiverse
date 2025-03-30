import { ref } from 'vue';
import { defineStore } from 'pinia'
import Game from "@/domain/models/Game";
import Zone from '@/domain/models/Zone';
import Hand from '@/domain/models/Hand';
import Player from '@/domain/models/Player';
import GameError from '@/domain/models/GameError';

const useGameStore = defineStore('game', initialize);

function initialize() {
  const currentGame = ref<Game | null>(null);
  const playerInfo = ref<Player | null>(null);
  const playerHand = ref<Hand | null>(null);
  const visibleZone = ref<Zone | null>(null);
  const errors = ref<GameError[]>([]);

  return {
    currentGame,
    playerInfo,
    playerHand,
    visibleZone,

    errors
  };
}

export default useGameStore;