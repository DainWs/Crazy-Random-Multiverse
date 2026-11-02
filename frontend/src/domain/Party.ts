import { GameMode } from "@/domain/GameConfiguration";
import { UserCode } from "@/domain/User";

type PartyCode = string;

class Party {
  public readonly code: PartyCode;
  public name: string;
  public gameMode: GameMode;
  public userCount: number;
  public maxUsers: number;
  public owner: UserCode;
  public users: UserCode[];
  public isLocked: boolean;

  public constructor(code: PartyCode) {
    this.code = code;
    this.name = '';
    this.gameMode = 'CLASSIC';
    this.userCount = 1;
    this.maxUsers = 4;
    this.owner = '';
    this.users = [];
    this.isLocked = false;
  }
}


export type { PartyCode };
export default Party;