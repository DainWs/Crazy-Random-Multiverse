import PlayerDto from '@/infrastructure/stomp/dto/PlayerDto';
import CardDto from '@/infrastructure/stomp/dto/CardDto';

type ZoneDto = {
  owner: PlayerDto;
  health: number;
  maxHealth: number;
  combatants: CardDto[][];
};

export default ZoneDto;
