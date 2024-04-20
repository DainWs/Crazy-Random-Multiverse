export type PlayerCode = String;

export type Player = {
    code: PlayerCode,
    name: String,
    isSpectator: boolean,
    isAlive: boolean
};