import { CardType } from "@/domain/models/Card";
import { GameMode } from "@/domain/models/Game";
import GameCode from "@/domain/models/GameCode";
import PartyCode from "@/domain/models/PartyCode";
import { PlayerCode } from "@/domain/models/Player";
import User from "@/domain/models/User";

type CardCodeDto = {
  code: number;
  type: CardType;
}

type PositionDto = {
  row: number;
  column: number;
};

type LoginRequest = {
  username: string;
}

type SetAccountInfoRequest = {
  user: User;
}

type JoinPartyRequest = {
  partyCode: string
}

type LeavePartyRequest = {
  partyCode: string
}

type CreatePartyRequest = {
  gameMode: GameMode
  maxPlayers: number
}

type UpdatePartyRequest = {
  partyCode: PartyCode
  gameMode: GameMode
  maxPlayers: number
}

type StartGameRequest = {
  partyCode: PartyCode;
}

type ReadyGameRequest = {
  gameCode: GameCode;
}

type ActionRequest = {
  game: GameCode;
  type: 'PUT_ACTION' | 'MOVE_ACTION' | 'ATTACK_ACTION' | 'PASS_TURN';
  sourcePlayer: PlayerCode;
  sourceCard?: CardCodeDto;
  sourcePosition?: PositionDto;
  targetPlayer?: PlayerCode;
  targetCard?: CardCodeDto;
  targetPosition?: PositionDto;
}

export {
  LoginRequest,
  SetAccountInfoRequest,
  JoinPartyRequest,
  LeavePartyRequest,
  CreatePartyRequest,
  UpdatePartyRequest,
  StartGameRequest,
  ReadyGameRequest,
  ActionRequest
}