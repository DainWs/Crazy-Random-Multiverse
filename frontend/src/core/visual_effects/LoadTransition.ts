import type { GameScene } from '@/scenes/Game';
import * as Constants from '@/core/Constants';
import { playMotion } from '@/core/visual_effects/Motion';

const FADE = { duration: Constants.LOAD_TRANSITION_MS, curve: Constants.LOAD_TRANSITION_EASE, kind: 'NON_ESSENTIAL' } as const;

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
  void playMotion(scene, { targets: board, to: { alpha: 1 }, ...FADE });
  void playMotion(scene, { targets: loading, to: { alpha: 0 }, ...FADE }).then(() => sceneManager.stop(Constants.LOAD_SCENE_KEY));
}

export { playLoadTransition };
