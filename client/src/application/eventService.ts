import eventObserver from '@/domain/events/eventObserver';

const gameEventService = {
  subscribe: eventObserver.subscribeToGameEvent,
  unsubscribe: eventObserver.unsubscribeFromGameEvent,
  notify: eventObserver.notifyGameEvent
};

const partyEventService = {
  subscribe: eventObserver.subscribeToPartyEvent,
  unsubscribe: eventObserver.unsubscribeFromPartyEvent,
  notify: eventObserver.notifyPartyEvent
};

const partyListEventService = {
  subscribe: eventObserver.subscribeToPartyListEvent,
  unsubscribe: eventObserver.unsubscribeFromPartyListEvent,
  notify: eventObserver.notifyPartyListEvent
};

const userEventService = {
  subscribe: eventObserver.subscribeToUserEvent,
  unsubscribe: eventObserver.unsubscribeFromUserEvent,
  notify: eventObserver.notifyUserEvent
};

const errorEventService = {
  subscribe: eventObserver.subscribeToErrorEvent,
  unsubscribe: eventObserver.unsubscribeFromErrorEvent,
  notify: eventObserver.notifyErrorEvent
};

export { gameEventService, partyEventService, partyListEventService, userEventService, errorEventService };
