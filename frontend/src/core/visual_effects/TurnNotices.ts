import type Player from '@/domain/Player';
import type { PlayerCode } from '@/domain/Player';
import type { GameScene } from '@/scenes/Game';
import * as Constants from '@/core/Constants';
import { getText } from '@/core/Texts';
import type { MotionSpeed } from '@/core/visual_effects/Motion';
import { playMotion } from '@/core/visual_effects/Motion';
import { createText, panelBackground } from '@/game/hud/HudPieces';
import { calculateScreenFixedTransform, toLogicalScreen } from '@/core/cameras/CameraCalculations';

/** The round and the turn of a board, which is what a notice announces when it changes (VIEW-15). */
type BoardTurn = { round?: number; playerWithTurn?: PlayerCode };

/** The texts of the notices to show when the board goes from `shown` to `next`: the new round first, then the new turn (VIEW-15). */
function describeNotices(shown: BoardTurn, next: BoardTurn, localPlayer: PlayerCode, players: Player[]): string[] {
  const texts: string[] = [];

  if (next.round !== undefined && next.round !== shown.round) {
    texts.push(`${getText('ui.game.round')} ${next.round}`);
  }

  if (next.playerWithTurn !== undefined && next.playerWithTurn !== shown.playerWithTurn) {
    const name = players.find((player) => player.code === next.playerWithTurn)?.name ?? '';
    texts.push(next.playerWithTurn === localPlayer ? getText('ui.game.your_turn') : `${getText('ui.game.turn_of')} ${name}`);
  }

  return texts;
}

/** How long a notice takes to fade in, stays and takes to fade out (VIEW-15, VIEW-11). */
type NoticeTiming = { fadeIn: MotionSpeed | number; hold: number; fadeOut: MotionSpeed | number };

const TURN_NOTICE_TIMING: NoticeTiming = { fadeIn: 'MEDIUM', hold: Constants.TURN_NOTICE_HOLD_MS, fadeOut: 'MEDIUM' };

const ELIMINATION_NOTICE_TIMING: NoticeTiming = {
  fadeIn: Constants.ELIMINATION_NOTICE_FADE_MS,
  hold: Constants.ELIMINATION_NOTICE_HOLD_MS,
  fadeOut: Constants.ELIMINATION_NOTICE_FADE_MS
};

/** Shows a text over the board for a moment and resolves when it has faded out. It also ends when the scene shuts down, which drops its tweens. */
function playNotice(scene: GameScene, text: string, timing: NoticeTiming = TURN_NOTICE_TIMING): Promise<void> {
  const screen = toLogicalScreen(scene.scale, Constants.RENDER_SCALE);
  const { x, y, scale } = calculateScreenFixedTransform(screen.width, screen.height, scene.cameraSystem.getCamera().zoom, Constants.RENDER_SCALE);

  const label = createText(scene, 'TITLE', { color: 'NOTICE_TEXT' }, text);
  label.setOrigin(0.5, 0.5);
  label.setPadding(Constants.TURN_NOTICE_PADDING);
  label.setBackgroundColor(panelBackground('NOTICE'));
  label.setPosition(x + (screen.width / 2) * scale, y + (screen.height / 2) * scale);
  label.setScale(scale);
  label.setScrollFactor(0);
  label.setDepth(Constants.TURN_NOTICE_DEPTH);
  label.setAlpha(0);

  return fadeInAndOut(scene, label, timing).then(() => label.destroy());
}

/** It fades in slowing down at the end, stays, and fades out speeding up, without moving (VIEW-15, VIEW-30, VIEW-31). */
async function fadeInAndOut(scene: GameScene, label: Phaser.GameObjects.Text, timing: NoticeTiming): Promise<void> {
  await playMotion(scene, {
    targets: label,
    to: { alpha: 1 },
    duration: timing.fadeIn,
    curve: 'ENTER',
    kind: 'ESSENTIAL',
    completeDelay: timing.hold
  });
  await playMotion(scene, { targets: label, to: { alpha: 0 }, duration: timing.fadeOut, curve: 'LEAVE', kind: 'ESSENTIAL' });
}

export type { BoardTurn, NoticeTiming };
export { describeNotices, ELIMINATION_NOTICE_TIMING, playNotice };
