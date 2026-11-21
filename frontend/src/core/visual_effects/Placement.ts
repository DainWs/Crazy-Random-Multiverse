import type { CombatantCard } from '@/domain/Card';
import type { Placement, SlotRef } from '@/domain/Placement';
import type { StatisticType } from '@/domain/Statistics';
import type CombatantView from '@/game/cards/CombatantView';
import type ZoneSlotView from '@/game/zone/ZoneSlotView';
import type { GameScene } from '@/scenes/Game';
import type { FloatingText } from '@/core/visual_effects/FloatingTexts';
import { showFloatingTexts } from '@/core/visual_effects/FloatingTexts';
import { playMotion } from '@/core/visual_effects/Motion';
import { countStatistic } from '@/core/visual_effects/StatisticCount';
import * as Constants from '@/core/Constants';

/** What a statistic of a combatant was and is, after it received a piece of equipment (VIEW-36). */
type StatisticChange = { type: StatisticType; from: number; to: number };

/** The order the floating texts are stacked in, from the bottom up: damage, armor and health (VIEW-36). */
const STATISTIC_ORDER: StatisticType[] = ['Damage', 'Armor', 'Health'];

const MINUS_SIGN = '−';

/** The statistics the equipment changed, with the value the card showed before and the one it shows now, in the order of the texts (VIEW-36). */
function statisticChanges(before: CombatantCard | undefined, after: CombatantCard): StatisticChange[] {
  const changes: StatisticChange[] = [];

  for (const type of STATISTIC_ORDER) {
    const from = before?.getStatistic(type)?.value ?? 0;
    const to = after.getStatistic(type)?.value ?? 0;

    if (from !== to) {
      changes.push({ type, from, to });
    }
  }

  return changes;
}

/** "+N" in green with the icon of the value, or "−N" in red when it went down (VIEW-36). */
function toFloatingText(change: StatisticChange, combatant: CombatantCard): FloatingText {
  const difference = change.to - change.from;
  const text = difference > 0 ? `+${difference}` : `${MINUS_SIGN}${-difference}`;

  return { text, icon: iconOf(change.type, combatant), color: difference > 0 ? 'TOOLTIP_POSITIVE' : 'TOOLTIP_NEGATIVE' };
}

function iconOf(type: StatisticType, combatant: CombatantCard): FloatingText['icon'] {
  if (type === 'Damage') {
    return 'SWORD';
  }

  if (type === 'Health') {
    return 'HEART';
  }

  return combatant.getStatistic('Armor')?.valueType === 'MAGIC' ? 'MAGIC_SHIELD' : 'SHIELD';
}

/**
 * The cards an event put in their slots settle, and the one that received equipment plays its equipment too. `equippedBefore` is that
 * combatant as the board showed it before the event (VIEW-35, VIEW-36).
 */
async function playPlacement(scene: GameScene, placement: Placement, equippedBefore: CombatantCard | undefined): Promise<void> {
  const animations = placement.settled.map((ref) => settle(scene, findSlot(scene, ref)?.getCombatant()));

  if (placement.equipped) {
    animations.push(playEquip(scene, findSlot(scene, placement.equipped), equippedBefore));
  }

  await Promise.all(animations);
}

function findSlot(scene: GameScene, ref: SlotRef): ZoneSlotView | undefined {
  const zoneView = scene.zones.find((zone) => zone.zone.owner.code === ref.player);

  return zoneView?.getSlotAt(ref.position);
}

/** The card appears at once at 106% of its size, growing from its center, and settles at exactly its size in 250 ms, slowing down at the end (VIEW-35). */
function settle(scene: GameScene, view: CombatantView | null | undefined): Promise<void> {
  if (!view) {
    return Promise.resolve();
  }

  const rest = view.getOriginalScale();
  const scaleX = rest.scaleX;
  const scaleY = rest.scaleY ?? rest.scaleX;
  view.setScale(scaleX * Constants.SETTLE_START_SCALE, scaleY * Constants.SETTLE_START_SCALE);

  return playMotion(scene, { targets: view, to: { scaleX, scaleY }, duration: 'MEDIUM', curve: 'ENTER', kind: 'ESSENTIAL' });
}

/** At the same time: the settle, the piece sliding out and back, the values counting and the floating texts (VIEW-36). */
async function playEquip(scene: GameScene, slot: ZoneSlotView | undefined, before: CombatantCard | undefined): Promise<void> {
  const view = slot?.getCombatant();
  if (!slot || !view) {
    return;
  }

  const changes = statisticChanges(before, view.combatant);
  const animations = [settle(scene, view), view.showLatestPiece(scene, Constants.EQUIPMENT_SHOWN_MS)];
  animations.push(...changes.map((change) => countStatistic(scene, view, change.type, change.from, change.to)));
  if (changes.length > 0) {
    animations.push(showFloatingTexts(scene, slot, changes.map((change) => toFloatingText(change, view.combatant))));
  }

  await Promise.all(animations);
}

export type { StatisticChange };
export { playPlacement, statisticChanges, toFloatingText };
