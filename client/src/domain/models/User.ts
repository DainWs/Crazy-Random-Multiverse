import Player from "@/domain/models/Player";

class User {
  public code: string;
  public username: string;
  public isSpectating: boolean;

  public constructor(username: string) {
    this.code = '';
    this.username = username;
    this.isSpectating = false;
  }

  public toPlayer() {
    return new Player(this.code, this.username, this.isSpectating);
  }
}

export default User;
