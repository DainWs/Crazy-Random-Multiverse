import PartyListEvent from "@/domain/events/PartyListEvent";
import PartyEvent from "@/domain/events/PartyEvent";
import UserEvent from "@/domain/events/UserEvent";
import GameEvent from "@/domain/events/GameEvent";

type Event = GameEvent | UserEvent | PartyEvent | PartyListEvent;

export default Event;