import type Player from '@/domain/Player';
import type { PlayerCode } from '@/domain/Player';
import type ZoneView from '@/game/zone/ZoneView';
import type { GameScene } from '@/scenes/Game';
import * as Constants from '@/core/Constants';
import { getText } from '@/core/Texts';
import { playMotion, waitFor } from '@/core/visual_effects/Motion';
import { ELIMINATION_NOTICE_TIMING, playNotice } from '@/core/visual_effects/TurnNotices';

type Fadable = Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Alpha;

/** The zones that are eliminated in `shown` and were alive in `before`: the ones whose elimination is announced now (VIEW-11). */
function findNewlyEliminated(before: PlayerCode[], shown: ZoneView[]): ZoneView[] {
  return shown.filter((zoneView) => !zoneView.zone.owner.isAlive && before.includes(zoneView.zone.owner.code));
}

/** "Has sido eliminado" for the local player and "<name> eliminado" for anyone else (VIEW-11). */
function describeElimination(player: Player, localPlayer: PlayerCode): string {
  return player.code === localPlayer ? getText('ui.game.you_were_eliminated') : `${player.name} ${getText('ui.game.player_eliminated')}`;
}

/**
 * The dark red and the label of the eliminated zones fade in over their empty slots, and then the notice of each one, unless the
 * elimination ends the game, which only plays the veil because the result says who won (VIEW-11).
 */
async function playElimination(scene: GameScene, zoneViews: ZoneView[], notices: string[]): Promise<void> {
  const marks = zoneViews.flatMap((zoneView) => zoneView.getEliminatedMarks() as Fadable[]);
  for (const mark of marks) {
    mark.setAlpha(0);
  }

  await playMotion(scene, { targets: marks, to: { alpha: 1 }, duration: Constants.ELIMINATION_VEIL_MS, curve: 'ENTER', kind: 'ESSENTIAL' });

  for (const text of notices) {
    await waitFor(scene, Constants.ELIMINATION_NOTICE_DELAY_MS, 'ESSENTIAL');
    await playNotice(scene, text, ELIMINATION_NOTICE_TIMING);
  }
}

export { describeElimination, findNewlyEliminated, playElimination };
