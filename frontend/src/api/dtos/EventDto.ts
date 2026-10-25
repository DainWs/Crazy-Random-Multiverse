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
}

interface EventDto {
  code: GameEventCode;
  details: EventDetailsDto;
  timestamp: number;
}

export type { EventDetailsDto, EventDto };