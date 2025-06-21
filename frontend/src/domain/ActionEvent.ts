import Card from "@/domain/Card";
import Player from "@/domain/Player";
import Position from "@/domain/Position";
import ActionTrigger, { TriggerElement, TriggerInput } from "@/domain/ActionTrigger";

interface ActionEventInit extends EventInit {
  element?: TriggerElement;
  input?: TriggerInput;

  position?: Position;
  player?: Player;
  card?: Card;
}

class ActionEvent extends Event {
  public element?: TriggerElement;
  public input?: TriggerInput;

  public position?: Position;
  public player?: Player;
  public card?: Card;
  
  public constructor (init?: ActionEventInit) {
    super('game.action-event', init);
    this.element = init?.element;
    this.input = init?.input;

    this.position = init?.position;
    this.player = init?.player;
    this.card = init?.card;
  }

  public getTrigger(): ActionTrigger {
    if (this.element && this.input) {
      return { element: this.element, input: this.input };
    }

    throw new Error('ActionEvent must have both element and input defined');
  }
}

export default ActionEvent;