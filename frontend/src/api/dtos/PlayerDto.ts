import Player, { PlayerCode } from "@/domain/Player";

type PlayerCodeDto = PlayerCode;

interface PlayerDto {
  code: PlayerCodeDto;
  name: string;
  isSpectator: boolean;
  isAlive: boolean;
}

function toPlayerCode(player: Player | PlayerCode | null | undefined): PlayerCodeDto | undefined {
  if (!player) return undefined;
  if (typeof player === 'string') return player;
  return player.code;
}

function toPlayer(dto: PlayerDto): Player {
  const player = new Player(dto.code, dto.name);
  player.isSpectator = dto.isSpectator;
  player.isAlive = dto.isAlive;
  return player;
}

export type { PlayerCodeDto, PlayerDto };
export { toPlayerCode, toPlayer };