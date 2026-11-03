
type UserCode = string;

/** Where the server says the user stands after a socket is bound (CON-23). */
type UserState = 'GAME_IN_PROGRESS' | 'GAME_LOADING' | 'IN_PARTY' | 'IDLE';

class User {
  public readonly code: UserCode;
  public readonly name: string;

  public constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }
}

/** The screen the interface shows for the user state (UI-17). */
type Screen = 'MAIN_MENU' | 'PARTY' | 'GAME';

export type { Screen, UserCode, UserState }
export default User;