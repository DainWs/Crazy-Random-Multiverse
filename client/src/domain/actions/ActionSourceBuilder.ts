import ActionSource from "@/domain/actions/ActionSource";
import ActionTrigger from "@/domain/actions/ActionTrigger";
import ViewAction from "@/domain/actions/ViewAction";
import ViewElement from "@/domain/actions/ViewElements";
import Card, { CardCode } from "@/domain/models/Card";
import Player, { PlayerCode } from "@/domain/models/Player";
import Position from "@/domain/models/Position";

type OnCompleteSource = (source: ActionSource) => void;
type OnCancel = () => void;

class ActionSourceBuilder {
  private onComplete: OnCompleteSource;
  private onCancel: OnCancel;
  private player: PlayerCode;
  private trigger?: ActionTrigger;
  private card?: CardCode;
  private position?: Position;
  private finished: boolean;

  public constructor(onComplete: OnCompleteSource, onCancel: OnCancel, player: Player) {
    this.onComplete = onComplete;
    this.onCancel = onCancel;
    this.player = player.code;
    this.finished = false;
  }

  public whereTriggerIs(element: ViewElement, action: ViewAction): ActionSourceBuilder {
    this.throwErrorIfAlreadyFinished();

    this.trigger = { element, action };
    return this;
  }

  public withCard(card: Card): ActionSourceBuilder {
    this.throwErrorIfAlreadyFinished();

    this.card = card.code;
    return this;
  }

  public fromPosition(position: Position): ActionSourceBuilder {
    this.throwErrorIfAlreadyFinished();

    this.position = position;
    return this;
  }

  public completeActionSource() {
    this.throwErrorIfAlreadyFinished();
    
    if (this.trigger == undefined) throw new Error("Trigger can't be null");
    if (this.player == undefined) throw new Error("Player can't be null");
    if (this.card == undefined) throw new Error("Card can't be null");
    if (this.position == undefined) throw new Error("Position can't be null");

    const source: ActionSource = {
      sourceTrigger: this.trigger,
      sourcePlayer: this.player,
      sourceCard: this.card,
      sourcePosition: this.position
    }

    this.finished = true;
    this.onComplete(source);
  }

  public cancel() {
    this.finished = true;
    this.onCancel();
  }

  private throwErrorIfAlreadyFinished() {
    if (this.finished) {
      throw new Error("You cannot complete a canceled action");
    }
  }
}

export default ActionSourceBuilder;