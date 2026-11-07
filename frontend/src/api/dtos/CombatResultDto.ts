import type { EventDetailsDto } from "@/api/dtos/EventDto";
import type { CombatResult } from "@/domain/CombatResult";
import { mirrorRow, toZonePosition } from "@/api/dtos/ZonePositionDto";

/** The attack a `PLAYER_ATTACK_CARD` describes, with its positions in the frontend rows (CON-14, CON-21). */
const toCombatResult = (details: EventDetailsDto, rowCount: number): CombatResult | undefined => {
  const { sourcePlayer, sourcePosition, targetPlayer, targetPosition, armorDamage, healthDamage, targetDead } = details;
  const isComplete = sourcePlayer && sourcePosition && targetPlayer && targetPosition;
  const hasDamage = armorDamage !== undefined && healthDamage !== undefined && targetDead !== undefined;
  if (!isComplete || !hasDamage) {
    return undefined;
  }

  return {
    attackerPlayer: sourcePlayer.code,
    attackerPosition: toZonePosition({ ...sourcePosition, row: mirrorRow(sourcePosition.row, rowCount) }),
    targetPlayer: targetPlayer.code,
    targetPosition: toZonePosition({ ...targetPosition, row: mirrorRow(targetPosition.row, rowCount) }),
    armorDamage,
    healthDamage,
    targetDead
  };
}

export { toCombatResult };
