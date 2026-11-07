import Card, { CombatantCard } from "@/domain/Card";
import { ZonePosition } from "@/domain/Position";
import { slotMarkKey } from "@/domain/ResourceKeys";

type AllowedCombatant = 'LEADER' | 'WARRIOR';

class ZoneSlot {
  public readonly position: ZonePosition;
  public readonly allowedCombatant: AllowedCombatant;
  public combatant: CombatantCard | null;

  public constructor(position: ZonePosition, allowedCombatant: AllowedCombatant) {
    this.position = position;
    this.allowedCombatant = allowedCombatant;
    this.combatant = null;
  }

  public canPlaceCard(card: Card): boolean {
    if (card.isCombatant() && !this.combatant) {
      return this.allowedCombatant === card.type;
    }

    if (card.isType('EQUIPMENT') && this.combatant) {
      return true;
    }

    return false;
  }

  public isOccupied(): boolean {
    return this.combatant !== null;
  }

  public getMaskTexture(): string {
    return slotMarkKey(this.allowedCombatant);
  }
}

export type { AllowedCombatant };
export default ZoneSlot;