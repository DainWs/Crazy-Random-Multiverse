import { Player } from "@/domain/player";
import { Zone } from "@/domain/zone";

export type GameCode = String;

export type Game = {
    code: GameCode,
    playerWithTurn: Player,
    zones: Zone[]
};

export declare function getPlayersFrom(game: Game) : Player[]; 
export declare function getPlayerZoneFrom(game: Game, player: Player) : Zone; 