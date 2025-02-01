import PlayerDto from '@/services/websocket/dto/PlayerDto';
import ZoneDto from '@/services/websocket/dto/ZoneDto';

type GameCodeDto = string;

type GameDto = {
  code: GameCodeDto;
  playerWithTurn: PlayerDto;
  zones: Array<ZoneDto>;
};

export default GameDto;
