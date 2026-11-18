import type { GameScene } from '@/scenes/Game';
import * as Constants from '@/core/Constants';

/** Shows the board fading in over the loading screen, which fades out and is removed at the end (VIEW-29). Without a loading screen nothing is animated. */
function playLoadTransition(scene: GameScene) {
  const sceneManager = scene.scene;
  const board = scene.cameras.main;
  board.setAlpha(1);

  if (!sceneManager.isActive(Constants.LOAD_SCENE_KEY)) {
    return;
  }

  const loading = sceneManager.get(Constants.LOAD_SCENE_KEY).cameras.main;
  board.setAlpha(0);
  scene.tweens.add({ targets: board, alpha: 1, duration: Constants.LOAD_TRANSITION_MS });
  scene.tweens.add({
    targets: loading,
    alpha: 0,
    duration: Constants.LOAD_TRANSITION_MS,
    onComplete: () => sceneManager.stop(Constants.LOAD_SCENE_KEY)
  });
}

export { playLoadTransition };
