import { GameMode } from "@/domain/models/Game";

type PartyDto = {
  code: string,
  name: string,
  gameMode: GameMode,
  userCount: number,
  maxUsers: number,
  owner: string,
  users: string[],
}

export default PartyDto;