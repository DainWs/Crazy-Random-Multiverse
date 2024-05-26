import Hand from '@/domain/models/Hand';
import Player from '@/domain/models/Player';
import GameEvent from '@/domain/events/GameEvent';
import Context from '@/application/game/Context'
import GameEventProcessor from '@/application/game/GameEventProcessor';
import { navigator } from '@view/index';
import { sendReadyToPlay } from '@api/v1';
import { userRepository } from '@/infrastructure/repositories';


class GameCreateProcessor extends GameEventProcessor {
  protected override updateContext(event: GameEvent): void {
    const user = userRepository.getCurrentUser();
    const player = new Player(user.code, user.username);
    Context.setPlayer(player);

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
