import type { UserState } from '@/domain/User';
import { Game } from 'phaser';
import { ref, watch } from 'vue';
import SessionSystem from '@/core/SessionSystem';
import { PRELOADED_EVENT } from '@/core/Constants';

const SCENE_BY_USER_STATE: Partial<Record<UserState, string>> = {
  GAME_LOADING: 'GameLoad',
  GAME_IN_PROGRESS: 'Game'
};

const GAME_SCENES = Object.values(SCENE_BY_USER_STATE);

/** Starts the scene of the state, and stops the game scenes when the state leaves them (UI-17). */
const syncScenes = (sceneManager: Phaser.Scenes.SceneManager, userState: UserState) => {
  const target = SCENE_BY_USER_STATE[userState];

  for (const key of GAME_SCENES) {
    if (key !== target && sceneManager.isActive(key)) sceneManager.stop(key);
  }

  if (target && !sceneManager.isActive(target)) sceneManager.start(target);
}

function useAppController(config: Phaser.Types.Core.GameConfig) {
  const scene = ref();
  const game = ref();
  let stopWatching: (() => void) | null = null;

  const createGame = () => {
    const created = new Game(config);
    game.value = created;

    created.events.once(PRELOADED_EVENT, () => {
      stopWatching = watch(SessionSystem.userState, (userState) => syncScenes(created.scene, userState), { immediate: true });
    });
  }

  const destroyGame = () => {
    stopWatching?.();
    stopWatching = null;

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

export { syncScenes };
export default useAppController;
