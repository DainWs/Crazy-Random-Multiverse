import { navigator } from '@view/index';

import Hand from '@/domain/models/Hand';
import Player from '@/domain/models/Player';
import GameEvent from '@/domain/events/GameEvent';
import Context from '@/application/game/Context'
import GameEventProcessor from '@/application/game/GameEventProcessor';
import { ready } from '@api/v1';
import User from '@/domain/models/User';


class GameCreateProcessor extends GameEventProcessor {
  protected override updateContext(event: GameEvent): void {
    const user = new User("pepito");// sessionStore.currentUser;
    const player = new Player(user.code, user.username);
    Context.setPlayer(player);

    super.updateContext(event);

    const hand = new Hand(Context.getPlayer());
    Context.setHand(hand);
  }

  protected processEvent(event: GameEvent): void {
    console.log("############# Game Event: 'Game create' received");
    const gameCode = event.getDetails().game.code;

    ready({ gameCode });
    navigator().navigateTo('game');
  }
}

export default GameCreateProcessor;
