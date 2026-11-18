import type { CombatResult } from '@/domain/CombatResult';
import { paletteText } from '@/game/utils/Palette';

type DamageText = {
  text: string;
  color: string;
};

/** The floating texts of an attack: the armor lost and the health lost, only for what was lost (VIEW-6, CON-21). */
function toDamageTexts(combat: CombatResult): DamageText[] {
  const texts: DamageText[] = [];

  if (combat.armorDamage > 0) {
    texts.push({ text: `-${combat.armorDamage}`, color: paletteText('DAMAGE_TEXT_ARMOR') });
  }

  if (combat.healthDamage > 0) {
    texts.push({ text: `-${combat.healthDamage}`, color: paletteText('DAMAGE_TEXT_HEALTH') });
  }

  return texts;
}

export type { DamageText };
export { toDamageTexts };
