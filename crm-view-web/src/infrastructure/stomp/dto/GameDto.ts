import PlayerDto from '@/infrastructure/stomp/dto/PlayerDto';
import ZoneDto from '@/infrastructure/stomp/dto/ZoneDto';

type GameCodeDto = string;

type GameDto = {
  code: GameCodeDto;
  playerWithTurn: PlayerDto;
  zones: Array<ZoneDto>;
};

export default GameDto;
