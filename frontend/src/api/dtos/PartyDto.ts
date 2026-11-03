import type { GameMode } from "@/domain/GameConfiguration";
import type { UserDto } from "@/api/dtos/UserDto";
import { toUser } from "@/api/dtos/UserDto";
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
  owner: UserDto;
  users: UserDto[];
  locked: boolean;
}


const toParty = (dto: PartyDto): Party => {
  const party = new Party(dto.code);
  party.name = dto.name;
  party.gameMode = dto.gameMode;
  party.userCount = dto.userCount;
  party.maxUsers = dto.maxUsers;
  party.owner = toUser(dto.owner);
  party.users = dto.users.map(toUser);
  party.isLocked = dto.locked;
  return party;
}

const toMinimalParty = (dto: PartyDto): Party => {
  const party = new Party(dto.code);
  party.name = dto.name;
  party.gameMode = dto.gameMode;
  party.userCount = dto.userCount;
  party.maxUsers = dto.maxUsers;
  party.owner = toUser(dto.owner);
  party.isLocked = dto.locked;
  return party;
}

export type { CreatePartyRequest, UpdatePartyRequest, PartyDto }
export { toParty, toMinimalParty }