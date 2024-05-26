import Game from "@/domain/models/Game";
import GameEvent from "@/domain/events/GameEvent";
import Context from "@/application/game/Context";

abstract class GameEventProcessor {

  public process(event: GameEvent) {
    this.updateContext(event);
    this.processEvent(event);
  }

  protected updateContext(event: GameEvent) {
    console.log('updating context');
  
    const game = event.getDetails().game;
    const player = this.getPlayerFrom(game);
    Context.setGame(game);
    Context.setPlayer(player);
    
    console.log('current context updated:');
    console.log(Context);
  }

  protected abstract processEvent(event: GameEvent): void;

  private getPlayerFrom(game: Game) {
    const contextPlayer = Context.getPlayer();
    let newestPlayer = game.getPlayerWithCode(contextPlayer.code);
    if (newestPlayer == undefined) {
      contextPlayer.isAlive = false;
      contextPlayer.isSpectator = true;
      return contextPlayer;
    }
  
    return newestPlayer;
  }
}

export default GameEventProcessor;