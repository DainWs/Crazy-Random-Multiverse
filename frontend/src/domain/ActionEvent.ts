import Card from "@/domain/Card";
import Player from "@/domain/Player";
import Position from "@/domain/Position";
import type { TriggerElement, TriggerInput } from "@/domain/ActionTrigger";

interface ActionEventInit extends EventInit {
  element: TriggerElement;
  input: TriggerInput;

  position: Position;
  player: Player;
  card: Card | null;
}

class ActionEvent extends Event {
  public element: TriggerElement;
  public input: TriggerInput;

  public position: Position;
  public player: Player;
  public card: Card | null;
  
  public constructor (init: ActionEventInit) {
    super('game.action-event', init);
    this.element = init.element;
    this.input = init.input;

    this.position = init.position;
    this.player = init.player;
    this.card = init.card;
  }

}

export default ActionEvent;