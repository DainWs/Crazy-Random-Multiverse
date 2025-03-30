import Event from '@/services/events/Event';
import Context from '@/services/events/Context';
import EventProcessor from '@/services/events/EventProcessor';

class PlayerReceiveCardProcessor extends EventProcessor {
  protected processEvent(event: Event, context: Context): void {
    console.log("############# Player Event: 'Player get card' received");
    console.log(event.details.targetCard);

    const player = context.getPlayerInfo();
    if (player.code == event.details.targetPlayer?.code) {
      this.updateHand(event, context);
    }
  }

  private updateHand(event: Event, context: Context): void {
    const hand = context.getPlayerHand();

    const card = event.details.targetCard;
    if (!card) throw new Error('Event should contain target card');
    hand.addCard(card);

    context.setPlayerHand(hand);
  }
}

export default PlayerReceiveCardProcessor;
