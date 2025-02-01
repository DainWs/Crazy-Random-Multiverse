import { ref } from 'vue';
import { defineStore } from 'pinia'
import GameError from "@/domain/models/GameError";

const useErrorStore = defineStore('error', initialize);

function initialize() {
  const gameErrors = ref<GameError[]>([]);
  return { gameErrors };
}

export default useErrorStore;