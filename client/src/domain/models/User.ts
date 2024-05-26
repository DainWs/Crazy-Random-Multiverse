class User {
  public code: string;
  public username: string;

  public constructor(username: string) {
    this.code = '';
    this.username = username;
  }
}

export default User;
