import Event from '@/services/events/Event';
import Context from '@/services/events/Context'
import EventProcessor from '@/services/events/EventProcessor';
import { ready } from '@api/v1';

class GameLoadingProcessor extends EventProcessor {
  protected processEvent(event: Event, _: Context): void {
    console.log("############# Game Event: 'Loading Game' received");
    const gameCode = event.details.game.code;
    console.log("## Nothing to load");

    ready({ gameCode });
  }
}

export default GameLoadingProcessor;
