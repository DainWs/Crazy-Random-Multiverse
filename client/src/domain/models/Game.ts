import GameCode from '@/domain/models/GameCode';
import Player from '@/domain/models/Player';
import Zone from '@/domain/models/Zone';

class Game {
  public code: GameCode;
  public playerWithTurn: Player;
  public zones: Zone[];

  public constructor(code: GameCode, playerWithTurn: Player) {
    this.code = code;
    this.playerWithTurn = playerWithTurn;
    this.zones = new Array();
  }

  public getPlayers(): Player[] {
    return this.zones.map((zone) => zone.owner);
  }

  public getPlayerZone(player: Player): Zone | undefined {
    return this.zones.find((zone) => zone.isPlayerOwner(player));
  }
}

export default Game;
