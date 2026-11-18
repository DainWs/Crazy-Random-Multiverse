import type Player from '@/domain/Player';
import type { PlayerCode } from '@/domain/Player';
import type { GameScene } from '@/scenes/Game';
import * as Constants from '@/core/Constants';
import { getText } from '@/core/Texts';
import { playMotion } from '@/core/visual_effects/Motion';
import { createText, panelBackground } from '@/game/hud/HudPieces';
import { calculateScreenFixedTransform } from '@/core/cameras/CameraCalculations';

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

/** Shows a text over the board for a moment and resolves when it has faded out. It also ends when the scene shuts down, which drops its tweens. */
function playNotice(scene: GameScene, text: string): Promise<void> {
  const { x, y, scale } = calculateScreenFixedTransform(scene.scale.width, scene.scale.height, scene.cameraSystem.getCamera().zoom);

  const label = createText(scene, 'BODY', { fontSize: Constants.TURN_NOTICE_FONT_SIZE, color: 'NOTICE_TEXT' }, text);
  label.setOrigin(0.5, 0.5);
  label.setPadding(Constants.TURN_NOTICE_PADDING);
  label.setBackgroundColor(panelBackground('NOTICE'));
  label.setPosition(x + (scene.scale.width / 2) * scale, y + scene.scale.height * Constants.TURN_NOTICE_TOP_RATIO * scale);
  label.setScale(scale);
  label.setScrollFactor(0);
  label.setDepth(Constants.TURN_NOTICE_DEPTH);
  label.setAlpha(0);

  return playMotion(scene, {
    targets: label,
    to: { alpha: 1 },
    duration: Constants.TURN_NOTICE_FADE_MS,
    curve: Constants.TURN_NOTICE_EASE,
    kind: 'ESSENTIAL',
    hold: Constants.TURN_NOTICE_HOLD_MS,
    yoyo: true
  }).then(() => label.destroy());
}

export type { BoardTurn };
export { describeNotices, playNotice };
