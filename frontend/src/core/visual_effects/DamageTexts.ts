import type { CombatResult } from '@/domain/CombatResult';
import * as Constants from '@/core/Constants';

type DamageText = {
  text: string;
  color: string;
};

/** The floating texts of an attack: the armor lost and the health lost, only for what was lost (VIEW-6, CON-21). */
function toDamageTexts(combat: CombatResult): DamageText[] {
  const texts: DamageText[] = [];

  if (combat.armorDamage > 0) {
    texts.push({ text: `-${combat.armorDamage}`, color: Constants.ARMOR_DAMAGE_TEXT_COLOR });
  }

  if (combat.healthDamage > 0) {
    texts.push({ text: `-${combat.healthDamage}`, color: Constants.HEALTH_DAMAGE_TEXT_COLOR });
  }

  return texts;
}

export type { DamageText };
export { toDamageTexts };
