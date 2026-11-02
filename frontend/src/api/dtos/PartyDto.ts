import type { GameMode } from "@/domain/GameConfiguration";
import type { UserCode } from "@/domain/User";
import Party from "@/domain/Party";

interface CreatePartyRequest {
  gameMode: GameMode;
  maxUsers: number;
}

interface UpdatePartyRequest {
  maxUsers: number;
  gameMode: GameMode;
}

interface PartyDto {
  code: string;
  name: string;
  gameMode: GameMode;
  userCount: number;
  maxUsers: number;
  owner: UserCode;
  users: UserCode[];
  locked: boolean;
}


const toParty = (dto: PartyDto): Party => {
  const party = new Party(dto.code);
  party.name = dto.name;
  party.gameMode = dto.gameMode;
  party.userCount = dto.userCount;
  party.maxUsers = dto.maxUsers;
  party.owner = dto.owner;
  party.users = dto.users;
  party.isLocked = dto.locked;
  return party;
}

const toMinimalParty = (dto: PartyDto): Party => {
  const party = new Party(dto.code);
  party.name = dto.name;
  party.gameMode = dto.gameMode;
  party.userCount = dto.userCount;
  party.maxUsers = dto.maxUsers;
  party.owner = dto.owner;
  party.isLocked = dto.locked;
  return party;
}

export type { CreatePartyRequest, UpdatePartyRequest, PartyDto }
export { toParty, toMinimalParty }