import Hand from '@/domain/models/Hand';
import GameEvent from '@/domain/events/GameEvent';
import Context from '@/application/game/Context'
import GameEventProcessor from '@/application/game/GameEventProcessor';
import { navigator } from '@view/index';
import { sendReadyToPlay } from '@api/v1';

class GameCreateProcessor extends GameEventProcessor {
  protected override updateContext(event: GameEvent): void {
    super.updateContext(event);

    const hand = new Hand(Context.getPlayer().code);
    Context.setHand(hand);
  }

  protected processEvent(event: GameEvent): void {
    console.log("############# Game Event: 'Game create' received");
    sendReadyToPlay(event.getDetails().game.code);
    navigator().navigateTo('game');
  }
}

export default GameCreateProcessor;
