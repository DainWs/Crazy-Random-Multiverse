
type OnCompleteCallback<S> = (s: S) => void;

class InteractionEvent<S> {
  public readonly source: S;
  private onCompleteCallbacks: OnCompleteCallback<S>[];

  public constructor(source: S) {
    this.source = source;
    this.onCompleteCallbacks = [];
  }

  public onComplete(callback: OnCompleteCallback<S>) {
    this.onCompleteCallbacks.push(callback);
    return this;
  }
}