
class User {
  public readonly code: string;
  public readonly name: string;

  public constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }
}

export default User;