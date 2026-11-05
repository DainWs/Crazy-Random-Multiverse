import type { ActiveGame } from "@/domain/ActiveGame";
import type { CardCode } from "@/domain/Card";
import { toCardCode } from "@/api/dtos/CardDto";
import { PlayerDto } from "@/api/dtos/PlayerDto";
import { ZoneDto, ZoneSlotDto } from "@/api/dtos/ZoneDto";
import { GameCode } from "@/domain/GameConfiguration";

interface GameDto {
  code: GameCode;
  round?: number;
  playerWithTurn?: PlayerDto;
  zones: ZoneDto[];
}

/** The leaders of every zone: they are known while the game loads, so their images can be downloaded then (LOAD-2). */
const toActiveGame = (dto: GameDto): ActiveGame => {
  const slots: ZoneSlotDto[] = [];
  for (const zone of dto.zones) {
    for (const row of zone.combatants) {
      slots.push(...row);
    }
  }

  return { gameCode: dto.code, leaders: toLeaderCodes(slots) };
};

function toLeaderCodes(slots: ZoneSlotDto[]): CardCode[] {
  const leaders = new Map<string, CardCode>();
  for (const slot of slots) {
    if (slot.allowedCombatant === 'LEADER' && slot.combatant) {
      const leader = toCardCode(slot.combatant.catalogCode);
      leaders.set(leader.text(), leader);
    }
  }

  return [...leaders.values()];
}

export type { GameDto }
export { toActiveGame }