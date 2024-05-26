import GameEvent from '@/domain/events/GameEvent';
import GameEventProcessor from '@/application/game/GameEventProcessor';

class GameStartProcessor extends GameEventProcessor {
  protected processEvent(event: GameEvent): void {
    console.log("############# Game Event: 'Game start' received");
  }
}

export default GameStartProcessor;
