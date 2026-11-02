import { toCard, type CardDto } from "@/api/dtos/CardDto";
import { toPlayer, type PlayerDto } from "@/api/dtos/PlayerDto";
import { CombatantCard } from "@/domain/Card";
import { ZonePosition } from "@/domain/Position";
import Team from "@/domain/Team";
import Zone from "@/domain/Zone";
import { ZoneOrganizationsType } from "@/domain/ZoneOrganizations";
import ZoneSlot, { AllowedCombatant } from "@/domain/ZoneSlot";

const LEADER_ROW = 0;
const LEADER_COLUMN = 0;

interface ZoneSlotDto {
  allowedCombatant: AllowedCombatant;
  combatant?: CardDto;
}

interface ZoneDto {
  owner: PlayerDto;
  type: ZoneOrganizationsType;
  combatants: ZoneSlotDto[][];
}

function toZoneSlot(dto: ZoneSlotDto, row: number, column: number): ZoneSlot {
  const position = new ZonePosition(row, column);
  const zoneSlot = new ZoneSlot(position, dto.allowedCombatant);
  if (dto.combatant) {
    zoneSlot.combatant = toCard(dto.combatant) as CombatantCard;
  }

  return zoneSlot;
}

function toRowZoneSlots(slotsInRow: ZoneSlotDto[], row: number): ZoneSlot[] {
  return slotsInRow.map((zoneSlotDto, column) => toZoneSlot(zoneSlotDto, row, column));
}

function toZone(zoneDto: ZoneDto, team: Team): Zone {
  const zone = new Zone(toPlayer(zoneDto.owner), team, zoneDto.type);
  zone.slots = zoneDto.combatants.map(toRowZoneSlots);

  // The server sends no zone health: it is the health of the leader card (CON-14)
  const leaderHealth = zone.slots[LEADER_ROW]?.[LEADER_COLUMN]?.combatant?.health;
  zone.health = leaderHealth?.value ?? Infinity;
  zone.maxHealth = leaderHealth?.maxValue ?? Infinity;
  return zone;
}

export type { ZoneDto }
export { toZone }