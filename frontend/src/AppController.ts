import { Game } from 'phaser';
import { ref } from 'vue';

function useAppController(config: Phaser.Types.Core.GameConfig) {
  const scene = ref();
  const game = ref();

  const createGame = () => {
    game.value = new Game(config);
  }

  const destroyGame = () => {
    if (game.value) {
      game.value.destroy(true);
      game.value = null;
    }
  }

  return {
    getReactiveScene: () => scene,
    getReactiveGame: () => game,
    createGame,
    destroyGame
  }
}

export default useAppController;