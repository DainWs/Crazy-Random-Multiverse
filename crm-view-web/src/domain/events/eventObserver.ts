import Game from '@/domain/models/Game';
import Hand from '@/domain/models/Hand';
import Player from '@/domain/models/Player';
import GameEvent from '@/domain/events/GameEvent';
import PartyEvent from '@/domain/events/PartyEvent';
import UserEvent from '@/domain/events/UserEvent';
import PartyListEvent from '@/domain/events/PartyListEvent';

type SubscriberId = string;

type EventContext = {
  game: Game;
  player: Player;
  hand: Hand;
};

type GameEventHandler = (event: GameEvent, context?: EventContext) => void;
type PartyEventHandler = (event: PartyEvent) => void;
type PartyListEventHandler = (event: PartyListEvent) => void;
type UserEventHandler = (event: UserEvent) => void;

const gameEventSubscribers = new Map<SubscriberId, GameEventHandler>();
const partyEventSubscribers = new Map<SubscriberId, PartyEventHandler>();
const partyListEventSubscribers = new Map<SubscriberId, PartyListEventHandler>();
const userEventSubscribers = new Map<SubscriberId, UserEventHandler>();

const subscribeToGameEvent = (id: SubscriberId, eventHandler: GameEventHandler) => {
  gameEventSubscribers.set(id, eventHandler);
};

const subscribeToPartyEvent = (id: SubscriberId, eventHandler: PartyEventHandler) => {
  partyEventSubscribers.set(id, eventHandler);
};

const subscribeToPartyListEvent = (id: SubscriberId, eventHandler: PartyListEventHandler) => {
  partyListEventSubscribers.set(id, eventHandler);
};

const subscribeToUserEvent = (id: SubscriberId, eventHandler: UserEventHandler) => {
  userEventSubscribers.set(id, eventHandler);
};

const unsubscribeFromGameEvent = (id: SubscriberId) => {
  gameEventSubscribers.delete(id);
};

const unsubscribeFromPartyEvent = (id: SubscriberId) => {
  partyEventSubscribers.delete(id);
};

const unsubscribeFromPartyListEvent = (id: SubscriberId) => {
  partyListEventSubscribers.delete(id);
};

const unsubscribeFromUserEvent = (id: SubscriberId) => {
  userEventSubscribers.delete(id);
};

const notifyGameEvent = (event: GameEvent, context?: EventContext) => {
  Array.from(gameEventSubscribers.values()).forEach((handler) => handler(event, context));
};

const notifyPartyEvent = (event: PartyEvent) => {
  Array.from(partyEventSubscribers.values()).forEach((handler) => handler(event));
};

const notifyPartyListEvent = (event: PartyListEvent) => {
  Array.from(partyListEventSubscribers.values()).forEach((handler) => handler(event));
};

const notifyUserEvent = (event: UserEvent) => {
  Array.from(userEventSubscribers.values()).forEach((handler) => handler(event));
};

export {SubscriberId, EventContext};
export default {
  subscribeToGameEvent,
  subscribeToPartyEvent,
  subscribeToPartyListEvent,
  subscribeToUserEvent,
  unsubscribeFromGameEvent,
  unsubscribeFromPartyEvent,
  unsubscribeFromPartyListEvent,
  unsubscribeFromUserEvent,
  notifyGameEvent,
  notifyPartyEvent,
  notifyPartyListEvent,
  notifyUserEvent
};
