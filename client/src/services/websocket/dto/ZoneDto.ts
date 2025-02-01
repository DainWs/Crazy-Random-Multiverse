import PlayerDto from '@/services/websocket/dto/PlayerDto';
import CardDto from '@/services/websocket/dto/CardDto';

type ZoneDto = {
  owner: PlayerDto;
  health: number;
  maxHealth: number;
  combatants: CardDto[][];
};

export default ZoneDto;
