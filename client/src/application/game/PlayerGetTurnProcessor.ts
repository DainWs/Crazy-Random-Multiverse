import GameEvent from '@/domain/events/GameEvent';
import GameEventProcessor from '@/application/game/GameEventProcessor';

class PlayerGetTurnProcessor extends GameEventProcessor {
  protected processEvent(event: GameEvent): void {
    console.log("############# Player Event: 'Player get turn' received");
  }
}

export default PlayerGetTurnProcessor;