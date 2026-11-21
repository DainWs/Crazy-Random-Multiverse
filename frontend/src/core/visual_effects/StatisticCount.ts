import type { StatisticType } from '@/domain/Statistics';
import type { CardStatisticView } from '@/game/cards/components/CardStatisticView';
import type CombatantView from '@/game/cards/CombatantView';
import type { GameScene } from '@/scenes/Game';
import { withValue } from '@/domain/Statistics';
import { playMotion } from '@/core/visual_effects/Motion';

/**
 * A statistic of the card counts from `from` to `to` in 400 ms, slowing down at the end, showing each whole number between them
 * and ending exactly at `to`. The board drawn next already has the new value (VIEW-6, VIEW-36).
 */
function countStatistic(scene: GameScene, view: CombatantView, type: StatisticType, from: number, to: number): Promise<void> {
  const statisticView = view.getByName(type) as CardStatisticView | null;
  const statistic = view.combatant.getStatistic(type);
  if (!statisticView || !statistic || from === to) {
    return Promise.resolve();
  }

  const equipmentValue = view.combatant.getEquipmentValue(type);
  const counter = { value: from };
  const showCounter = () => statisticView.update(withValue(statistic, Math.round(counter.value)), equipmentValue);
  showCounter();

  return playMotion(scene, {
    targets: counter,
    to: { value: to },
    duration: 'SLOW',
    curve: 'ENTER',
    kind: 'ESSENTIAL',
    onUpdate: showCounter
  });
}

export { countStatistic };
