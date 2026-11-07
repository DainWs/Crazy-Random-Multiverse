import type { CombatResult } from '@/domain/CombatResult';
import type { StatisticType } from '@/domain/Statistics';
import { valueAfterDamage, withValue } from '@/domain/Statistics';
import type { CardStatisticView } from '@/game/cards/components/CardStatisticView';
import type CombatantView from '@/game/cards/CombatantView';
import type ZoneSlotView from '@/game/zone/ZoneSlotView';
import DamageTextLayout from '@/game/cards/DamageTextLayout';
import type { GameScene } from '@/scenes/Game';
import { toDamageTexts } from '@/core/visual_effects/DamageTexts';
import * as Constants from '@/core/Constants';

type TweenConfig = Phaser.Types.Tweens.TweenBuilderConfig;

function playTween(scene: GameScene, config: TweenConfig): Promise<void> {
  return new Promise((resolve) => {
    scene.tweens.add({ ...config, onComplete: () => resolve() });
  });
}

/** The attacker grows and shrinks back, and then the target reacts to the hit (VIEW-5, VIEW-6). */
async function playAttack(scene: GameScene, attackerSlot: ZoneSlotView, targetSlot: ZoneSlotView, combat: CombatResult): Promise<void> {
  const attacker = attackerSlot.getCombatant();
  const target = targetSlot.getCombatant();

  if (attacker) {
    await pulse(scene, attacker);
  }

  const reactions = [targetSlot.flash(Constants.HIT_FLASH_COLOR), showDamageTexts(scene, targetSlot, combat)];
  if (target) {
    reactions.push(shake(scene, target, Constants.HIT_SHAKE_REPEATS));
    reactions.push(countDown(scene, target, 'Armor', combat.armorDamage));
    reactions.push(countDown(scene, target, 'Health', combat.healthDamage));
  }

  await Promise.all(reactions);
}

/** The card, or the leader with its own longer animation, shrinks and fades out before the board is drawn without it (VIEW-7, COMBAT-7). */
async function playDeath(scene: GameScene, slot: ZoneSlotView): Promise<void> {
  const combatant = slot.getCombatant();

  if (combatant) {
    const isLeader = combatant.combatant.type === 'LEADER';
    await fadeOut(scene, combatant, isLeader);
  }
}

function pulse(scene: GameScene, view: CombatantView): Promise<void> {
  return playTween(scene, {
    targets: view,
    scaleX: view.scaleX * Constants.ATTACK_PULSE_SCALE,
    scaleY: view.scaleY * Constants.ATTACK_PULSE_SCALE,
    duration: Constants.ATTACK_PULSE_DURATION_MS,
    yoyo: true,
    ease: 'Power1'
  });
}

/** The statistic counts from its value to the one after the damage; the board drawn next already has that value (VIEW-6). */
function countDown(scene: GameScene, view: CombatantView, type: StatisticType, damage: number): Promise<void> {
  const statisticView = view.getByName(type) as CardStatisticView | null;
  const statistic = view.combatant.getStatistic(type);
  if (!statisticView || !statistic || damage <= 0) {
    return Promise.resolve();
  }

  const equipmentValue = view.combatant.getEquipmentValue(type);
  const counter = { value: statistic.value };
  const showCounter = () => statisticView.update(withValue(statistic, Math.round(counter.value)), equipmentValue);

  return playTween(scene, {
    targets: counter,
    value: valueAfterDamage(statistic, damage),
    duration: Constants.STATISTIC_COUNT_DURATION_MS,
    onUpdate: showCounter
  });
}

function shake(scene: GameScene, view: CombatantView, repeats: number): Promise<void> {
  return playTween(scene, {
    targets: view,
    x: view.x + Constants.HIT_SHAKE_DISTANCE,
    duration: Constants.HIT_SHAKE_DURATION_MS,
    yoyo: true,
    repeat: repeats,
    ease: 'Linear'
  });
}

async function fadeOut(scene: GameScene, view: CombatantView, isLeader: boolean): Promise<void> {
  const shrink = isLeader ? Constants.LEADER_DEATH_SCALE : Constants.DEATH_SCALE;
  const duration = isLeader ? Constants.LEADER_DEATH_DURATION_MS : Constants.DEATH_DURATION_MS;

  if (isLeader) {
    await shake(scene, view, Constants.LEADER_DEATH_SHAKE_REPEATS);
  }

  await playTween(scene, {
    targets: view,
    alpha: 0,
    scaleX: view.scaleX * shrink,
    scaleY: view.scaleY * shrink,
    duration,
    ease: 'Power1'
  });
}

/** The texts are placed in the world, not in the slot, because the slot is rotated with its zone and the text would turn upside down. */
async function showDamageTexts(scene: GameScene, slot: ZoneSlotView, combat: CombatResult): Promise<void> {
  const { tx, ty } = slot.getWorldTransformMatrix();
  const layout = new DamageTextLayout({ x: tx, y: ty });
  const rises = toDamageTexts(combat).map(({ text, color }, index) => {
    const style = { fontSize: Constants.DAMAGE_TEXT_FONT_SIZE, color, stroke: Constants.DAMAGE_TEXT_STROKE_COLOR, strokeThickness: Constants.DAMAGE_TEXT_STROKE_WIDTH };
    const start = layout.startPosition(index);
    const damageText = scene.add.text(start.x, start.y, text, style);
    damageText.setOrigin(0.5, 0.5);
    damageText.setDepth(Constants.DAMAGE_TEXT_DEPTH);

    return rise(scene, damageText, layout.riseTargetY(index));
  });

  await Promise.all(rises);
}

async function rise(scene: GameScene, damageText: Phaser.GameObjects.Text, targetY: number): Promise<void> {
  await playTween(scene, {
    targets: damageText,
    y: targetY,
    alpha: 0,
    duration: Constants.DAMAGE_TEXT_DURATION_MS,
    ease: 'Power1'
  });

  damageText.destroy();
}

export { playAttack, playDeath };
