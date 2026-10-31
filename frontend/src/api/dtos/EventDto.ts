import { CardDto } from "@/api/dtos/CardDto";
import { GameDto } from "@/api/dtos/GameDto";
import { PlayerDto } from "@/api/dtos/PlayerDto";
import type { ZonePositionDto } from "@/api/dtos/ZonePositionDto";
import { GameEventCode } from "@/api/models/GameEventCode";

interface EventDetailsDto {
  game: GameDto;

  sourcePlayer?: PlayerDto;
  sourceCard?: CardDto;
  sourcePosition?: ZonePositionDto;

  targetPlayer?: PlayerDto;
  targetCard?: CardDto;
  targetPosition?: ZonePositionDto;

  // Only in GAME_SYNC: the hand of the player who receives the event
  hand?: CardDto[];
}

interface EventDto {
  code: GameEventCode;
  details: EventDetailsDto;
  sequence?: number;
}

export type { EventDetailsDto, EventDto };