import type { GameCode } from "@/domain/GameConfiguration";
import type { CardCodeDto } from "@/api/dtos/CardDto";
import type { ZonePositionDto } from "@/api/dtos/ZonePositionDto";
import type { PlayerCodeDto } from "@/api/dtos/PlayerDto";
import type { ActionType } from "@/domain/Action";
import type Action from "@/domain/Action";
import { toCardCodeDto } from "@/api/dtos/CardDto";
import { toPositionDto } from "@/api/dtos/ZonePositionDto";
import { toPlayerCode } from "@/api/dtos/PlayerDto";

interface ActionDto {
  game: GameCode;
  type: ActionType;

  sourcePlayer?: PlayerCodeDto;
  sourceCard?: CardCodeDto;
  sourcePosition?: ZonePositionDto;

  targetPlayer?: PlayerCodeDto;
  targetCard?: CardCodeDto;
  targetPosition?: ZonePositionDto;
}

function toActionDto(actionType: ActionType, action: Action): ActionDto {
  return {
    game: action.game,
    type: actionType,

    sourceCard: toCardCodeDto(action.sourceCard?.code),
    sourcePlayer: toPlayerCode(action.sourcePlayer),
    sourcePosition: toPositionDto(action.sourcePosition),

    targetCard: toCardCodeDto(action.targetCard?.code),
    targetPlayer: toPlayerCode(action.targetPlayer),
    targetPosition: toPositionDto(action.targetPosition),
  };
}

export type { ActionDto };
export { toActionDto };
