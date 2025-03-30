import Event from "@/services/events/Event";
import Context from "@/services/events/Context";

abstract class EventProcessor {

  public process(event: Event, context: Context) {
    this.updateContext(event, context);
    this.processEvent(event, context);
  }

  protected updateContext(event: Event, context: Context) {
    console.log('updating context');

    const game = event.details.game;
    context.setCurrentGame(game);

    const sessionUser = context.getUser();
    const sessionPlayer = game.getPlayerWithCode(sessionUser.code);
    if (sessionPlayer) {
      context.setPlayerInfo(sessionPlayer);
    }

    console.log('current context updated');
  }

  protected abstract processEvent(event: Event, context: Context): void;
}

export default EventProcessor;