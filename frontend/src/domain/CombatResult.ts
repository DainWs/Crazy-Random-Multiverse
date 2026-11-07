import type { PlayerCode } from "@/domain/Player";
import type { ZonePosition } from "@/domain/Position";

/** The outcome of an attack the server resolved: what the target lost and whether it died (CON-21). */
type CombatResult = {
  attackerPlayer: PlayerCode;
  attackerPosition: ZonePosition;
  targetPlayer: PlayerCode;
  targetPosition: ZonePosition;
  armorDamage: number;
  healthDamage: number;
  targetDead: boolean;
}

export type { CombatResult };
