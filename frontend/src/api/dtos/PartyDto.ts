import type { GameMode } from "@/domain/GameConfiguration";
import type { UserCode } from "@/domain/User";
import Party, { PartyCode } from "@/domain/Party";

interface CreatePartyRequest {
  gameMode: GameMode;
  maxPlayers: number;
}

interface UpdatePartyRequest {
  code: PartyCode;
  maxPlayers: number;
  gameMode: GameMode;
}

interface KickoutFromPartyRequest {
  partyCode: PartyCode;
  userCode: UserCode;
}

interface PartyDto {
  code: string;
  name: string;
  gameMode: GameMode;
  userCount: number;
  maxUsers: number;
  owner: UserCode;
  users: UserCode[];
}


const toParty = (dto: PartyDto): Party => {
  const party = new Party(dto.code);
  party.name = dto.name;
  party.gameMode = dto.gameMode;
  party.userCount = dto.userCount;
  party.maxUsers = dto.maxUsers;
  party.owner = dto.owner;
  party.users = dto.users;
  return party;
}

const toMinimalParty = (dto: PartyDto): Party => {
  const party = new Party(dto.code);
  party.name = dto.name;
  party.gameMode = dto.gameMode;
  party.userCount = dto.userCount;
  party.maxUsers = dto.maxUsers;
  party.owner = dto.owner;
  return party;
}

export type { CreatePartyRequest, UpdatePartyRequest, KickoutFromPartyRequest, PartyDto }
export { toParty, toMinimalParty }