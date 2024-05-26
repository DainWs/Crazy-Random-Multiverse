import EventObserver from '@/domain/events/EventObserver';
import PartyListEvent from '@/domain/events/PartyListEvent';
import PartyEvent from '@/domain/events/PartyEvent';
import GameEvent from '@/domain/events/GameEvent';
import UserEvent from '@/domain/events/UserEvent';

const gameEventService = new EventObserver<GameEvent>();
const userEventService = new EventObserver<UserEvent>();
const partyEventService = new EventObserver<PartyEvent>();
const partyListEventService = new EventObserver<PartyListEvent>();

export { gameEventService, partyEventService, partyListEventService, userEventService };
