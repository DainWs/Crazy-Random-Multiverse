import GameCode from '@/domain/models/GameCode';
import Player, { PlayerCode } from '@/domain/models/Player';
import Zone from '@/domain/models/Zone';

type GameMode = 'CLASSIC' | 'PLAYER_VS_AI';

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

  public getPlayerWithCode(code: PlayerCode) {
    return this.getPlayers()
      .find(player => player.code == code);
  }

  public getPlayerZone(player: Player): Zone | undefined {
    return this.zones.find((zone) => zone.isPlayerOwner(player));
  }
}

export { GameMode };
export default Game;
