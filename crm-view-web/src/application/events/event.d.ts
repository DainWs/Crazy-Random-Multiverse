import { Card } from "@/domain/card";
import { Game } from "@/domain/game";
import { Hand } from "@/domain/hand";
import { Player } from "@/domain/player";
import { Position } from "@/domain/position";

export type EventCode = 'GAME_CREATED' | 'GAME_START' | 'GAME_END' | 'PLAYER_WIN' | 'PLAYER_LOSE' | 'PLAYER_SURRENDER' | 'PLAYER_GET_TURN' | 'PLAYER_GET_CARD' | 'PLAYER_PUT_CARD' | 'PLAYER_MOVE_CARD' | 'PLAYER_ATTACK_CARD' | 'PLAYER_EQUIP_CARD' | 'PLAYER_USE_SPELL' | 'PLAYER_PASS_TURN';

export type EventDetails = {
    game: Game,
    sourcePlayer: Player,
    sourceCard: Card,
    sourcePosition: Position,
    targetPlayer: Player,
    targetCard: Card,
    targetPosition: Position,
};

export type Event = {
    code: EventCode,
    details: EventDetails
};

export type Context = {
    game: Game,
    player: Player,
    hand: Hand
}

export type EventHandler = (event: Event, context?: Context) => Promise<Void>;
