import { Player } from "@/domain/game/player";
import { Zone } from "@/domain/game/zone";

export type GameCode = String;

export type Game = {
    code: GameCode,
    playerWithTurn: Player,
    zones: Zone[]
};

export declare function getPlayersFrom(game: Game) : Player[]; 
export declare function getPlayerZoneFrom(game: Game, player: Player) : Zone; 