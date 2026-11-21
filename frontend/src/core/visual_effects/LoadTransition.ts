import type { GameScene } from '@/scenes/Game';
import * as Constants from '@/core/Constants';
import { playMotion } from '@/core/visual_effects/Motion';

/**
 * The loading screen fades out and is removed, and then the board fades in, with nothing drawn between the two (VIEW-29).
 * It resolves when the board has faded in. Without a loading screen nothing is animated.
 */
async function playLoadTransition(scene: GameScene): Promise<void> {
  const sceneManager = scene.scene;
  const board = scene.cameras.main;
  board.setAlpha(1);

  if (!sceneManager.isActive(Constants.LOAD_SCENE_KEY)) {
    return;
  }

  const loading = sceneManager.get(Constants.LOAD_SCENE_KEY).cameras.main;
  board.setAlpha(0);

  await playMotion(scene, { targets: loading, to: { alpha: 0 }, duration: 'SLOW', curve: 'LEAVE', kind: 'NON_ESSENTIAL' });
  sceneManager.stop(Constants.LOAD_SCENE_KEY);
  await playMotion(scene, { targets: board, to: { alpha: 1 }, duration: 'SLOW', curve: 'ENTER', kind: 'NON_ESSENTIAL' });
}

export { playLoadTransition };
