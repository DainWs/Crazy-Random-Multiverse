import EventCode from '@/domain/events/EventCode';

abstract class Event<T> {
  private code: EventCode;
  private details: T;

  protected constructor(code: EventCode, details: T) {
    this.code = code;
    this.details = details;
  }

  public getCode() {
    return this.code;
  }

  public getDetails() {
    return this.details;
  }
}

export default Event;
