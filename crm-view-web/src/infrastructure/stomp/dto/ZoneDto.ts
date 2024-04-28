import PlayerDto from "@/infrastructure/stomp/dto/PlayerDto";
import CardDto from "@/infrastructure/stomp/dto/CardDto";

type ZoneDto = {
    owner: PlayerDto,
    health: Number,
    maxHealth: Number,
    combatants: CardDto[][]
}

export default ZoneDto;