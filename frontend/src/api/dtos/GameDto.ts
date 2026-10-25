import { PlayerDto } from "@/api/dtos/PlayerDto";
import { ZoneDto } from "@/api/dtos/ZoneDto";
import { GameCode } from "@/domain/GameConfiguration";

interface GameDto {
  code: GameCode;
  playerWithTurn?: PlayerDto;
  zones: ZoneDto[];
}

export type { GameDto }