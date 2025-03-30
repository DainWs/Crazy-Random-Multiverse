import { navigator } from '@view/index';

import { ready } from '@api/v1';

import Hand from '@/domain/models/Hand';
import Event from '@/services/events/Event';
import EventProcessor from '@/services/events/EventProcessor';
import Context from '@/services/events/Context';

class GameCreateProcessor extends EventProcessor {

  protected override updateContext(event: Event, context: Context): void {
    super.updateContext(event, context);

    const game = context.getCurrentGame();
    const sessionPlayer = context.getPlayerInfo();

    const hand = new Hand(sessionPlayer);
    context.setPlayerHand(hand);

    const zone = game.getPlayerZone(sessionPlayer);
    if (zone) context.setVisibleZone(zone);
  }

  protected processEvent(event: Event, context: Context): void {
    console.log("############# Game Event: 'Game create' received");
    const gameCode = event.details.game.code;

    ready({ gameCode });
    navigator().navigateTo('game');
  }
}

export default GameCreateProcessor;
