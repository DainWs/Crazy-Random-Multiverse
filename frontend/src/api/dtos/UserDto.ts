import User from "@/domain/User";

interface UserDto {
  id: string;
  username: string;
}

const toUser = (dto: UserDto): User => {
  return new User(dto.id, dto.username);
}

export type { UserDto }
export { toUser }