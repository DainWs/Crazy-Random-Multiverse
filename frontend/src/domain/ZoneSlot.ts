import { CombatantCard } from "@/domain/Card";
import { ZonePosition } from "@/domain/Position";

type AllowedCombatant = 'LEADER' | 'WARRIOR';
type ZoneSlotMarkTexture = `zoneslot-mark-${Lowercase<AllowedCombatant>}`;

class ZoneSlot {
  public readonly position: ZonePosition;
  public readonly allowedCombatant: AllowedCombatant;
  public combatant: CombatantCard | null;

  public constructor(position: ZonePosition, allowedCombatant: AllowedCombatant) {
    this.position = position;
    this.allowedCombatant = allowedCombatant;
    this.combatant = null;
  }

  public getMaskTexture(): ZoneSlotMarkTexture {
    return `zoneslot-mark-${this.allowedCombatant.toLowerCase()}` as ZoneSlotMarkTexture;
  }
}

export type { AllowedCombatant, ZoneSlotMarkTexture };
export default ZoneSlot;