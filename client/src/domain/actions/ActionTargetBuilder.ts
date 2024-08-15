import ActionTarget from "@/domain/actions/ActionTarget";
import ActionTrigger from "@/domain/actions/ActionTrigger";
import ViewAction from "@/domain/actions/ViewAction";
import ViewElement from "@/domain/actions/ViewElements";
import Card, { CardCode } from "@/domain/models/Card";
import Player, { PlayerCode } from "@/domain/models/Player";
import Position from "@/domain/models/Position";

type OnCompleteTarget = (target: ActionTarget) => void;
type OnCancel = () => void;

class ActionTargetBuilder {
  private onComplete: OnCompleteTarget;
  private onCancel: OnCancel;
  private player?: PlayerCode;
  private trigger?: ActionTrigger;
  private card?: CardCode;
  private position?: Position;
  private finished: boolean;

  public constructor(onComplete: OnCompleteTarget, onCancel: OnCancel) {
    this.onComplete = onComplete;
    this.onCancel = onCancel;
    this.finished = false;
  }
  
  public whereTriggerIs(element: ViewElement, action: ViewAction): ActionTargetBuilder {
    this.throwErrorIfAlreadyFinished();
    
    this.trigger = { element, action };
    return this;
  }
  
  public toPlayer(player: Player): ActionTargetBuilder {
    this.throwErrorIfAlreadyFinished();
    
    this.player = player.code;
    return this;
  }

  public toCard(card: Card): ActionTargetBuilder {
    this.throwErrorIfAlreadyFinished();
    
    if (card != undefined) {
      this.card = card.code;
    }

    return this;
  }

  public atPosition(position: Position): ActionTargetBuilder {
    this.throwErrorIfAlreadyFinished();
    
    this.position = position;
    return this;
  }

  public completeActionTarget() {
    this.throwErrorIfAlreadyFinished();

    if (this.trigger == undefined) throw new Error("Trigger can't be null");
    if (this.player == undefined) throw new Error("Player can't be null");
    if (this.position == undefined) throw new Error("Position can't be null");

    const target: ActionTarget = {
      targetTrigger: this.trigger,
      targetPlayer: this.player,
      targetCard: this.card,
      targetPosition: this.position
    }

    this.finished = true;
    this.onComplete(target);
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

export default ActionTargetBuilder;