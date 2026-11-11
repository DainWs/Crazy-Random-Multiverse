import type Card from "@/domain/Card";
import type { StatisticType } from "@/domain/Statistics";
import { getText } from "@/core/Texts";

interface EquipmentValueLine {
  /** What the piece adds, or subtracts when negative. */
  value: number;
  text: string;
}

const STATISTIC_LABEL_KEYS: Record<StatisticType, string> = {
  Damage: 'ui.card.damage',
  Armor: 'ui.card.armor',
  Health: 'ui.card.health'
};

const STATISTIC_ORDER: StatisticType[] = ['Damage', 'Armor', 'Health'];

/** One line for each statistic a piece of equipment changes, with its sign (EQUIP-1, VIEW-14). */
function equipmentValueLines(piece: Card): EquipmentValueLine[] {
  const lines: EquipmentValueLine[] = [];

  for (const statisticType of STATISTIC_ORDER) {
    const value = piece.getStatistic(statisticType)?.value;

    if (value) {
      lines.push({ value, text: `${getText(STATISTIC_LABEL_KEYS[statisticType])}: ${formatSigned(value)}` });
    }
  }

  return lines;
}

function formatSigned(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }

  return `${value}`;
}

export type { EquipmentValueLine };
export { equipmentValueLines };
