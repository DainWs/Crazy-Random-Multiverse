import Party from "@/domain/models/Party";
import User from "@/domain/models/User";
import PartyDto from "@/api/dto/PartyDto";
import PartyListDto from "@/api/dto/PartyListDto";
import UserDto from "@/api/dto/UserDto";

const mapDtoToUser = (dto: UserDto): User => {
  const user = new User(dto.username);
  user.code = dto.id;
  return user;
}

const mapUserToDto = (user: User): UserDto => {
  return {
    id: user.code,
    username: user.username
  };
}

const mapDtoToPartyList = (dto: PartyListDto): Party[] => {
  return dto.parties.map(mapDtoToParty);
}

const mapDtoToParty = (dto: PartyDto): Party => {
  const party = new Party(dto.code);
  party.name = dto.name;
  party.gameMode = dto.gameMode;
  party.userCount = dto.userCount;
  party.maxUsers = dto.maxUsers;
  party.owner = dto.owner;
  party.users = dto.users;
  return party;
}

export {
  mapUserToDto,
  mapDtoToUser,
  mapDtoToPartyList,
  mapDtoToParty,
}