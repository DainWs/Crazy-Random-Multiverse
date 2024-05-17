import PartyCode from '@/domain/models/PartyCode';

type Username = string;

class Party {
  public code: PartyCode;
  public name: string;
  public userCount: number;
  public maxUsers: number;
  public owner: Username;
  public users: Array<Username>;

  public constructor(code: PartyCode) {
    this.code = code;
    this.name = code;
    this.userCount = 1;
    this.maxUsers = 4;
    this.owner = 'none';
    this.users = new Array();
  }

  public getUserCapacity(): string {
    return `${this.userCount}/${this.maxUsers}`;
  }

  public isFullCapacity(): boolean {
    return this.userCount >= this.maxUsers;
  }
}

export default Party;
