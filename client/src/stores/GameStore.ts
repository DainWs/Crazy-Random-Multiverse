import { ref } from 'vue';
import { defineStore } from 'pinia'
import Game from "@/domain/models/Game";

const useGameStore = defineStore('game', initialize);

function initialize() {
  const currentGame = ref<Game | null>(null);
  return { currentGame };
}

export default useGameStore;