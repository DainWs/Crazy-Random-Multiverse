import type { UserState } from '@/domain/User';
import { Game } from 'phaser';
import { ref, watch } from 'vue';
import { UNKNOWN_CARD_KEY } from '@/domain/ResourceKeys';
import SessionSystem from '@/core/SessionSystem';
import { PRELOADED_EVENT } from '@/core/Constants';

const SCENE_BY_USER_STATE: Partial<Record<UserState, string>> = {
  GAME_LOADING: 'GameLoad',
  GAME_IN_PROGRESS: 'Game'
};

const GAME_SCENES = Object.values(SCENE_BY_USER_STATE);

/** A game in progress needs the fixed resources, which a client that just entered it may not have downloaded yet (LOAD-6). */
const sceneFor = (userState: UserState, hasGameResources: boolean) => {
  if (userState === 'GAME_IN_PROGRESS' && !hasGameResources) return SCENE_BY_USER_STATE.GAME_LOADING;

  return SCENE_BY_USER_STATE[userState];
}

/** Starts the scene of the state, and stops the game scenes when the state leaves them (UI-17). */
const syncScenes = (sceneManager: Phaser.Scenes.SceneManager, userState: UserState, hasGameResources: boolean) => {
  const target = sceneFor(userState, hasGameResources);

  for (const key of GAME_SCENES) {
    if (key !== target && sceneManager.isActive(key)) sceneManager.stop(key);
  }

  if (target && !sceneManager.isActive(target)) sceneManager.start(target);
}

/** The fixed resources are downloaded together, so one of them tells whether the others are there. */
const hasGameResources = (game: Game) => game.textures.exists(UNKNOWN_CARD_KEY);

function useAppController(config: Phaser.Types.Core.GameConfig) {
  const scene = ref();
  const game = ref();
  let stopWatching: (() => void) | null = null;

  const createGame = () => {
    const created = new Game(config);
    game.value = created;

    created.events.once(PRELOADED_EVENT, () => {
      stopWatching = watch(SessionSystem.userState, (userState) => syncScenes(created.scene, userState, hasGameResources(created)), { immediate: true });
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
