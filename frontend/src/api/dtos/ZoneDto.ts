import { toCard, type CardDto } from "@/api/dtos/CardDto";
import { toPlayer, type PlayerDto } from "@/api/dtos/PlayerDto";
import { CombatantCard } from "@/domain/Card";
import { ZonePosition } from "@/domain/Position";
import Team from "@/domain/Team";
import Zone from "@/domain/Zone";
import { ZoneOrganizationsType } from "@/domain/ZoneOrganizations";
import ZoneSlot, { AllowedCombatant } from "@/domain/ZoneSlot";

interface ZoneSlotDto {
  allowedCombatant: AllowedCombatant;
  combatant: CardDto | null;
}

interface ZoneDto {
  owner: PlayerDto;
  type: ZoneOrganizationsType;
  health?: number;
  maxHealth?: number;
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
  zone.health = zoneDto.health ?? Infinity;
  zone.maxHealth = zoneDto.maxHealth ?? Infinity;
  zone.slots = zoneDto.combatants.map(toRowZoneSlots);
  return zone;
}

export type { ZoneDto }
export { toZone }