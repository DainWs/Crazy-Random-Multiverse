import { CardDto } from "@/api/dtos/CardDto";
import { PlayerDto } from "@/api/dtos/PlayerDto";
import { GameCode } from "@/domain/GameConfiguration";

type ZoneCombantantDto = CardDto | null;

interface ZoneDto {
  owner: PlayerDto;
  health: number;
  maxHealth: number;
  combatants: ZoneCombantantDto[][];
}

interface GameDto {
  code: GameCode;
  playerWithTurn?: PlayerDto;
  zones: ZoneDto[];
}

export type { GameDto }