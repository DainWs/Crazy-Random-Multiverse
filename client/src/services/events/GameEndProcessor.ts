import Event from '@/services/events/Event';
import Context from '@/services/events/Context';
import EventProcessor from '@/services/events/EventProcessor';

class GameEndProcessor extends EventProcessor {
  protected processEvent(event: Event, context: Context): void {
    console.log("############# Game Event: 'Game end' received");
  }
}

export default GameEndProcessor;