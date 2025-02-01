import { GameMode } from "@/domain/models/Game";
import GameCode from "@/domain/models/GameCode";
import PartyCode from "@/domain/models/PartyCode";
import User from "@/domain/models/User";

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

export {
  LoginRequest,
  SetAccountInfoRequest,
  JoinPartyRequest,
  LeavePartyRequest,
  CreatePartyRequest,
  UpdatePartyRequest,
  StartGameRequest,
  ReadyGameRequest
}