type GameCode = string;
type GameMode = 'CLASSIC' | 'PLAYER_VS_AI';


const MAX_PLAYER_COUNTS = 12;

class GameConfiguration {
  public readonly gameCode: GameCode;
  public readonly gameMode: GameMode;
  public readonly playerCount: number;
  public readonly maxPlayerCount: number;

  constructor(gameCode: GameCode, gameMode: GameMode, playerCount: number) {
    this.gameCode = gameCode;
    this.gameMode = gameMode;
    this.playerCount = (playerCount > MAX_PLAYER_COUNTS) ? MAX_PLAYER_COUNTS : playerCount;
    this.maxPlayerCount = MAX_PLAYER_COUNTS;
  }
}

export { MAX_PLAYER_COUNTS }
export type { GameCode, GameMode };
export default GameConfiguration;
