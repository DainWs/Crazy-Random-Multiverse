import type { CombatResult } from '@/domain/CombatResult';
import type { ArmorType } from '@/domain/Statistics';
import type { FloatingText } from '@/core/visual_effects/FloatingTexts';

const MINUS_SIGN = '−';

/** The floating text of an attack: what the target lost, or a plain 0 when it lost nothing (VIEW-6, CON-21). */
function toDamageText(combat: CombatResult, armorType: ArmorType | undefined): FloatingText {
  if (combat.healthDamage > 0) {
    return { text: `${MINUS_SIGN}${combat.healthDamage}`, icon: 'HEART', color: 'HIT_FLASH' };
  }

  if (combat.armorDamage > 0) {
    const icon = armorType === 'MAGIC' ? 'MAGIC_SHIELD' : 'SHIELD';

    return { text: `${MINUS_SIGN}${combat.armorDamage}`, icon, color: 'HIT_FLASH_ARMOR' };
  }

  return { text: '0', icon: null, color: 'NOTICE_TEXT' };
}

export { toDamageText };
