import GameEvent from '@/domain/events/GameEvent';
import Context from '@/application/game/Context';
import GameEventProcessor from '@/application/game/GameEventProcessor';

class PlayerGetCardProcessor extends GameEventProcessor {
  protected processEvent(event: GameEvent): void {
    console.log("############# Player Event: 'Player get card' received");
    console.log(event.getDetails().targetCard);
    const details = event.getDetails();

    const player = Context.getPlayer();
    if (player.code == details.targetPlayer?.code) {
      this.updateHand(event);
    }

  }

  private updateHand(event: GameEvent): void {
    const hand = Context.getHand();

    const card = event.getDetails().targetCard;
    if (!card) throw new Error('Event should contain target card');
    hand.addCard(card);

    Context.setHand(hand);
  }
}

export default PlayerGetCardProcessor;
