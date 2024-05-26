import GameEvent from '@/domain/events/GameEvent';
import GameEventProcessor from '@/application/game/GameEventProcessor';

class GameEndProcessor extends GameEventProcessor {
  protected processEvent(event: GameEvent): void {
    console.log("############# Game Event: 'Game end' received");
  }
}

export default GameEndProcessor;