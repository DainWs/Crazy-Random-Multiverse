type PlayerCode = string;

class Player {
  public code: PlayerCode;
  public name: string;
  public isSpectator: boolean;
  public isAlive: boolean;

  public constructor(code: string, name: string, isSpectator: boolean = false) {
    this.code = code;
    this.name = name;
    this.isSpectator = isSpectator;
    this.isAlive = !isSpectator;
  }
}

export type { PlayerCode };
export default Player;
