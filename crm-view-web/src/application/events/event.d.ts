import { Card } from "@/domain/game/card";
import { Game } from "@/domain/game/game";
import { Hand } from "@/domain/game/hand";
import { Party } from "@/domain/game/party";
import { PartyList } from "@/domain/game/partyList";
import { Player } from "@/domain/game/player";
import { Position } from "@/domain/game/position";
import { User } from "@/domain/UserRepository";

type GameEvent = {
    code: 'GAME_CREATED' | 'GAME_START' | 'GAME_END' | 'PLAYER_WIN' | 'PLAYER_LOSE' 
| 'PLAYER_SURRENDER' | 'PLAYER_GET_TURN' | 'PLAYER_GET_CARD' | 'PLAYER_PUT_CARD' | 'PLAYER_MOVE_CARD' 
| 'PLAYER_ATTACK_CARD' | 'PLAYER_EQUIP_CARD' | 'PLAYER_USE_SPELL' | 'PLAYER_PASS_TURN',
    details: {
        game: Game,
        sourcePlayer: Player,
        sourceCard: Card,
        sourcePosition: Position,
        targetPlayer: Player,
        targetCard: Card,
        targetPosition: Position,
    }
};

type UserEvent = {
    code: 'USER_UPDATE',
    details: User
}

type PartyEvent = {
    code: 'PARTY_INFO_UPDATE',
    details: Party
}

type PartyListEvent = {
    code: 'PARTY_LIST_UPDATE',
    details: PartyList
}

type Event = GameEvent | UserEvent | PartyEvent | PartyListEvent;

type Context = {
    game: Game,
    player: Player,
    hand: Hand
}

type EventHandler = (event: Event, context?: Context) => Promise<void>;

export { 
    GameEvent,
    UserEvent,
    PartyEvent,
    PartyListEvent,
    Event,
    Context, 
    EventHandler 
}
export default Event;