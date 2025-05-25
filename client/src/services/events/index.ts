
import Event, { EventCode } from '@/services/events/Event';
import Context from '@/services/events/Context';
import EventProcessor from '@/services/events/EventProcessor';
import GameCreateProcessor from '@/services/events/GameCreateProcessor';
import GameLoadingProcessor from '@/services/events/GameLoadingProcessor';
import GameStartEventProcessor from '@/services/events/GameStartProcessor';
import GameEndEventProcessor from '@/services/events/GameEndProcessor';
import PlayerReceiveCardProcessor from '@/services/events/PlayerReceiveCardProcessor';

const eventProcessors = new Map<EventCode, new () => EventProcessor>();
eventProcessors.set('GAME_CREATED', GameCreateProcessor);
eventProcessors.set('GAME_LOADING', GameLoadingProcessor);
eventProcessors.set('GAME_START', GameStartEventProcessor);
eventProcessors.set('GAME_END_WITH_TIE', GameEndEventProcessor);
eventProcessors.set('GAME_END_WITH_WINNER', GameEndEventProcessor);
eventProcessors.set('PLAYER_RECEIVE_CARD', PlayerReceiveCardProcessor);

const process = async (event: Event, context: Context) => {
  const EventProcessorClass = eventProcessors.get(event.code);

  if (EventProcessorClass) {
    const processor = new EventProcessorClass();
    processor.process(event, context);
  } else {
    console.log(`No event processor found for EventCode "${event.code}"`);
  }
};

export { Context, process };