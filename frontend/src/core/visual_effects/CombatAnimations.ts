import type { CombatResult } from '@/domain/CombatResult';
import type { PlayerCode } from '@/domain/Player';
import type { ZonePosition } from '@/domain/Position';
import type { ArmorType, StatisticType } from '@/domain/Statistics';
import { valueAfterDamage } from '@/domain/Statistics';
import type CombatantView from '@/game/cards/CombatantView';
import type ZoneSlotView from '@/game/zone/ZoneSlotView';
import type { GameScene } from '@/scenes/Game';
import { boxOfSlot, lungeVector, shakeOffset, toSlotSpace } from '@/game/cards/CombatLayout';
import { toDamageText } from '@/core/visual_effects/DamageTexts';
import { showFloatingTexts } from '@/core/visual_effects/FloatingTexts';
import { countStatistic } from '@/core/visual_effects/StatisticCount';
import { playMotion, waitFor } from '@/core/visual_effects/Motion';
import CardClickHandler from '@/core/interactions/CardClickHandler';
import * as Constants from '@/core/Constants';
import { paletteFill } from '@/game/utils/Palette';

/** The shake goes back and forth by nature, so it is the one motion that moves at a constant pace (VIEW-31). */
const SHAKE_EASE = { ease: 'Linear' };

/** The attack plays on the board as it was before it, which is the one drawn while its step runs (VIEW-5, VIEW-7). */
async function playCombat(scene: GameScene, combat: CombatResult): Promise<void> {
  const attackerSlot = findSlot(scene, combat.attackerPlayer, combat.attackerPosition);
  const targetSlot = findSlot(scene, combat.targetPlayer, combat.targetPosition);

  CardClickHandler.dropTargeting();

  if (attackerSlot && targetSlot) {
    await playAttack(scene, attackerSlot, targetSlot, combat);
  } else if (targetSlot) {
    await playImpact(scene, targetSlot, combat);
  }
}

function findSlot(scene: GameScene, playerCode: PlayerCode, position: ZonePosition): ZoneSlotView | undefined {
  const zoneView = scene.zones.find((zone) => zone.zone.owner.code === playerCode);

  return zoneView?.getSlotAt(position);
}

/** The attacker travels to the target, and the impact is when it touches it, as it starts its trip back (VIEW-5). */
async function playAttack(scene: GameScene, attackerSlot: ZoneSlotView, targetSlot: ZoneSlotView, combat: CombatResult): Promise<void> {
  const attacker = attackerSlot.getCombatant();
  if (!attacker) {
    await playImpact(scene, targetSlot, combat);
    return;
  }

  scene.raiseSlot(attackerSlot);
  const origin = attacker.getOriginalPosition();
  const trip = toSlotSpace(lungeOf(attackerSlot, targetSlot), worldOf(attackerSlot));

  await playMotion(scene, {
    targets: attacker,
    to: { x: origin.x + trip.x, y: origin.y + trip.y },
    duration: 'MEDIUM',
    curve: 'STRIKE',
    kind: 'ESSENTIAL'
  });

  const rest = attacker.getOriginalScale();
  const back = playMotion(scene, {
    targets: attacker,
    to: { x: origin.x, y: origin.y, scaleX: rest.scaleX, scaleY: rest.scaleY ?? rest.scaleX },
    duration: 'MEDIUM',
    curve: 'ENTER',
    kind: 'ESSENTIAL'
  });

  await Promise.all([back, playImpact(scene, targetSlot, combat)]);
}

/** The vector on the screen the attacker travels, from its card to where it touches the target (VIEW-5). */
function lungeOf(attackerSlot: ZoneSlotView, targetSlot: ZoneSlotView) {
  const attackerWorld = attackerSlot.getWorldTransformMatrix();
  const targetWorld = targetSlot.getWorldTransformMatrix();
  const attackerBox = boxOfSlot(attackerSlot.corners, { x: attackerWorld.tx, y: attackerWorld.ty }, attackerWorld.scaleX);
  const targetBox = boxOfSlot(targetSlot.corners, { x: targetWorld.tx, y: targetWorld.ty }, targetWorld.scaleX);

  return lungeVector(attackerBox, targetBox);
}

function worldOf(slot: ZoneSlotView) {
  const world = slot.getWorldTransformMatrix();

  return { rotation: world.rotation, scale: world.scaleX };
}

/** Everything that happens to the target when the attacker touches it, at the same time (VIEW-5, VIEW-6, VIEW-7). */
async function playImpact(scene: GameScene, targetSlot: ZoneSlotView, combat: CombatResult): Promise<void> {
  const target = targetSlot.getCombatant();
  const isLeaderDeath = combat.targetDead && target?.combatant.type === 'LEADER';

  if (target) {
    scene.tweens.killTweensOf(target);
    target.resetScale();
  }

  const flash = flashColorOf(combat);
  const flashed = flash === undefined ? Promise.resolve() : targetSlot.flash(flash, isLeaderDeath ? Constants.LEADER_FREEZE_MS : 0);
  if (isLeaderDeath) {
    await waitFor(scene, Constants.LEADER_FREEZE_MS, 'NON_ESSENTIAL');
  }

  const reactions = [flashed, showDamageText(scene, targetSlot, target, combat)];
  if (target) {
    reactions.push(countDown(scene, target, 'Armor', combat.armorDamage));
    reactions.push(countDown(scene, target, 'Health', combat.healthDamage));
    reactions.push(shakeThenDie(scene, targetSlot, target, combat.targetDead));
  }

  await Promise.all(reactions);
}

/** Red if the target lost health, steel grey if it lost armor, and no flash if it lost neither (VIEW-5). */
function flashColorOf(combat: CombatResult): number | undefined {
  if (combat.healthDamage > 0) {
    return paletteFill('HIT_FLASH');
  }

  return combat.armorDamage > 0 ? paletteFill('HIT_FLASH_ARMOR') : undefined;
}

async function shakeThenDie(scene: GameScene, slot: ZoneSlotView, target: CombatantView, isDead: boolean): Promise<void> {
  await shake(scene, slot, target);

  if (isDead) {
    await die(scene, target, target.combatant.type === 'LEADER');
  }
}

/** The card moves from side to side on the screen, with less amplitude each time, and ends where it was (VIEW-5). */
function shake(scene: GameScene, slot: ZoneSlotView, view: CombatantView): Promise<void> {
  const world = worldOf(slot);
  const start = { x: view.x, y: view.y };
  const progress = { value: 0 };

  return playMotion(scene, {
    targets: progress,
    to: { value: 1 },
    duration: 'MEDIUM',
    curve: SHAKE_EASE,
    kind: 'NON_ESSENTIAL',
    onUpdate: () => {
      const side = shakeOffset(progress.value, Constants.HIT_SHAKE_SWINGS, Constants.HIT_SHAKE_AMPLITUDE);
      const offset = toSlotSpace({ x: side, y: 0 }, world);
      view.setPosition(start.x + offset.x, start.y + offset.y);
    }
  });
}

/** The card, with its equipment, shrinks towards its center while it fades out; the leader first turns dark grey and waits (VIEW-7, VIEW-18). */
async function die(scene: GameScene, view: CombatantView, isLeader: boolean): Promise<void> {
  if (isLeader) {
    view.coverWith(paletteFill('LEADER_DEATH_TINT'), Constants.LEADER_DEATH_TINT_ALPHA);
    await waitFor(scene, Constants.LEADER_STILL_MS, 'ESSENTIAL');
  }

  await playMotion(scene, {
    targets: view,
    to: { alpha: 0, scaleX: view.scaleX * Constants.DEATH_END_SCALE, scaleY: view.scaleY * Constants.DEATH_END_SCALE },
    duration: 'SLOW',
    curve: 'LEAVE',
    kind: 'ESSENTIAL'
  });
}

/** The statistic counts from its value to the one after the damage (VIEW-6). */
function countDown(scene: GameScene, view: CombatantView, type: StatisticType, damage: number): Promise<void> {
  const statistic = view.combatant.getStatistic(type);
  if (!statistic || damage <= 0) {
    return Promise.resolve();
  }

  return countStatistic(scene, view, type, statistic.value, valueAfterDamage(statistic, damage));
}

/** What the target lost rises from its top edge and fades out (VIEW-6). */
function showDamageText(scene: GameScene, slot: ZoneSlotView, target: CombatantView | null, combat: CombatResult): Promise<void> {
  const armorType = target?.combatant.getStatistic('Armor')?.valueType as ArmorType | undefined;

  return showFloatingTexts(scene, slot, [toDamageText(combat, armorType)]);
}

export { playCombat };
