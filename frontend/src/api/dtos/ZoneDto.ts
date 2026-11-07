import { toCard, type CardDto } from "@/api/dtos/CardDto";
import { toPlayer, type PlayerDto } from "@/api/dtos/PlayerDto";
import { CombatantCard } from "@/domain/Card";
import { ZonePosition } from "@/domain/Position";
import { mirrorRow } from "@/api/dtos/ZonePositionDto";
import Team from "@/domain/Team";
import Zone from "@/domain/Zone";
import { ZoneOrganizationsType } from "@/domain/ZoneOrganizations";
import ZoneSlot, { AllowedCombatant } from "@/domain/ZoneSlot";

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

/** The contract numbers the rows from the leader towards the center (CON-14), and the frontend numbers them the other way round (VIEW-1). */
function toFrontendRows(backendRows: ZoneSlotDto[][]): ZoneSlot[][] {
  return backendRows.map((slotsInRow, backendRow) => toRowZoneSlots(slotsInRow, mirrorRow(backendRow, backendRows.length))).reverse();
}

function toZone(zoneDto: ZoneDto, team: Team): Zone {
  const zone = new Zone(toPlayer(zoneDto.owner), team, zoneDto.type);
  zone.slots = toFrontendRows(zoneDto.combatants);

  // The server sends no zone health: it is the health of the leader card (CON-14)
  const leaderHealth = zone.slots.flat().find((slot) => slot.allowedCombatant === 'LEADER')?.combatant?.health;
  zone.health = leaderHealth?.value ?? Infinity;
  zone.maxHealth = leaderHealth?.maxValue ?? Infinity;
  return zone;
}

export type { ZoneDto, ZoneSlotDto }
export { toZone }