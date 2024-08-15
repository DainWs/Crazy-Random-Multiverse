import Action from "@/domain/actions/Action";
import ActionSource from "@/domain/actions/ActionSource";
import ActionSourceBuilder from "@/domain/actions/ActionSourceBuilder";
import ActionTarget from "@/domain/actions/ActionTarget";
import ActionTargetBuilder from "@/domain/actions/ActionTargetBuilder";
import Game from "@/domain/models/Game";
import Player from "@/domain/models/Player";

type OnCompleteActionSource = (source: ActionSource) => void;
type OnCompleteTargetSource = (target: ActionTarget) => void;

class ActionBuilder {
  private onCompleteActionSource: OnCompleteActionSource;
  private onCompleteTargetSource: OnCompleteTargetSource;
  private source?: ActionSource;
  private target?: ActionTarget;
  private finished: boolean;

  public constructor(
    onCompleteActionSource: OnCompleteActionSource, 
    onCompleteTargetSource: OnCompleteTargetSource
  ) {
    this.onCompleteActionSource = onCompleteActionSource;
    this.onCompleteTargetSource = onCompleteTargetSource;
    console.log(this.onCompleteActionSource)
    this.finished = false;
  }

  public sourceActionBuilder(sourcePlayer: Player): ActionSourceBuilder {
    this.throwErrorIfAlreadyFinished();
    
    return new ActionSourceBuilder(this.completeActionSource.bind(this), this.cancel.bind(this), sourcePlayer);
  }

  private completeActionSource(source: ActionSource) {
    this.source = source;
    console.log(this.onCompleteActionSource)
    this.onCompleteActionSource(source);
  }
  
  public targetActionBuilder(): ActionTargetBuilder {
    this.throwErrorIfAlreadyFinished();

    return new ActionTargetBuilder(this.completeActionTarget.bind(this), this.cancel.bind(this));
  }

  private completeActionTarget(target: ActionTarget) {
    this.target = target;

    this.onCompleteTargetSource(target);
  }

  public cancel() {
    this.finished = true;
  }

  public build(game: Game): Action {
    this.throwErrorIfAlreadyFinished();
    
    if (this.source == undefined) throw new Error("Source action can't be null");
    if (this.target == undefined) throw new Error("Target action can't be null");

    this.finished = true;
    return new Action(game, this.source, this.target);
  }

  public hasFinish(): boolean {
    return this.finished;
  }

  private throwErrorIfAlreadyFinished() {
    if (this.finished) {
      throw new Error("You cannot complete an already finished action");
    }
  }
}

export default ActionBuilder;