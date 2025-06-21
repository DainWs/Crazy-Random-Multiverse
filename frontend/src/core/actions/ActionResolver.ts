import GameCode from "@/domain/GameCode";
import Action from "@/domain/Action";
import ActionEvent from "@/domain/ActionEvent";
import ActionPattern from "@/core/actions/ActionPattern";

class ActionResolver {
  private source: ActionEvent | null;
  private target: ActionEvent | null;
  private pattern: ActionPattern;

  public constructor(pattern: ActionPattern) {
    this.pattern = pattern;
    this.source = null;
    this.target = null;
  }

  public apply(event: ActionEvent): boolean {
    const trigger = event.trigger;

    if (this.source == null && this.pattern.matchSourceCondition(trigger)) {
      this.source = event;
      return true;
    }
  
    if (this.target == null && this.pattern.matchTargetCondition(trigger)) {
      this.target = event;
      return true;
    }

    return false;
  }

  public isComplete(): boolean {
    return this.source !== null && this.target !== null;
  }

  public createAction(gameCode: GameCode): Action {
    if (!this.isComplete()) throw new Error("Pattern is not completed");
    return new Action(gameCode, this.source as ActionEvent, this.target as ActionEvent);
  }

  public reset(): void {
    this.source = null;
    this.target = null;
  }
}

export default ActionResolver;