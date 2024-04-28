type PlayerCode = String;

class Player {
    public code: PlayerCode;
    public name: String;
    public isSpectator: boolean;
    public isAlive: boolean;

    public constructor(code: string, name: string) {
        this.code = code;
        this.name = name;
        this.isSpectator = false;
        this.isAlive = true;
    }
};

export { PlayerCode };
export default Player;