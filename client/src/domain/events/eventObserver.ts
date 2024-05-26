import Event from '@/domain/events/Event';

type SubscriberId = string;

type EventHandler<T extends Event<Object>> = (event: T) => void;

class EventObserver<T extends Event<Object>> {
  private subscribers: Map<SubscriberId, EventHandler<T>>;

  public constructor() {
    this.subscribers = new Map();
  }

  public subscribe(id: SubscriberId, eventHandler: EventHandler<T>): void {
    this.subscribers.set(id, eventHandler);
  };

  public unsubscribe(id: SubscriberId): void {
    this.subscribers.delete(id);
  }

  public notify(event: T) {
    Array.from(this.subscribers.values())
      .forEach((eventHandler) => eventHandler(event));
  };
}

export default EventObserver;