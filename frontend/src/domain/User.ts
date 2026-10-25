
type UserCode = string;

class User {
  public readonly code: UserCode;
  public readonly name: string;

  public constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }
}

export type { UserCode }
export default User;