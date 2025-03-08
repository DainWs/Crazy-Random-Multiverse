import { GameMode } from '@/domain/models/Game';
import PartyCode from '@/domain/models/PartyCode';

type Username = string;

class Party {
  public code: PartyCode;
  public name: string;
  public gameMode: GameMode;
  public userCount: number;
  public maxUsers: number;
  public owner: Username;
  public users: Array<Username>;

  public constructor(code: PartyCode) {
    this.code = code;
    this.name = code;
    this.gameMode = 'CLASSIC';
    this.userCount = 1;
    this.maxUsers = 4;
    this.owner = 'none';
    this.users = new Array();
  }

  public getUserTags(username: string) {
    const tags = [];
    if (this.isUserAdmin(username)) tags.push('Admin');
    return tags;
  }

  public isUserAdmin(username: string) {
    return this.owner == username;
  }

  public getUserCapacity(): string {
    return `${this.userCount}/${this.maxUsers}`;
  }

  public isFullCapacity(): boolean {
    return this.userCount >= this.maxUsers;
  }
}

export default Party;
