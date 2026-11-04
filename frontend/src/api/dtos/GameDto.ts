import type { ActiveGame } from "@/domain/ActiveGame";
import type { CardCode } from "@/domain/Card";
import { toCardCode } from "@/api/dtos/CardDto";
import { PlayerDto } from "@/api/dtos/PlayerDto";
import { ZoneDto } from "@/api/dtos/ZoneDto";
import { GameCode } from "@/domain/GameConfiguration";

interface GameDto {
  code: GameCode;
  round?: number;
  playerWithTurn?: PlayerDto;
  zones: ZoneDto[];
}

/** The leaders of every zone: they are known while the game loads, so their images can be downloaded then (LOAD-2). */
const toActiveGame = (dto: GameDto): ActiveGame => {
  const leaders: CardCode[] = [];
  for (const zone of dto.zones) {
    for (const row of zone.combatants) {
      for (const slot of row) {
        if (slot.allowedCombatant !== 'LEADER' || !slot.combatant) continue;

        const leader = toCardCode(slot.combatant.catalogCode);
        if (!leaders.some((known) => known.equals(leader))) leaders.push(leader);
      }
    }
  }

  return { gameCode: dto.code, leaders };
}

export type { GameDto }
export { toActiveGame }