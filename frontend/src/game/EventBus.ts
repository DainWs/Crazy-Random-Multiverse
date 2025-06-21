import { Events } from 'phaser';

type CardEvents = 'card.left-click' | 'card.right-click' | 'card.grab' | 'card.drop' | 'card.drag';
type ZoneSlotEvents = 'zone-slot.card_over' | 'zone-slot.card_out'; // TODO to remove

type Event = CardEvents | ZoneSlotEvents;
type Listener = (...args: any[]) => void;

const emitter = new Events.EventEmitter();

class EventBus {
  static rawOn(event: string, listener: Listener, context?: any): void {
    emitter.on(event, listener, context);
  }

  static rawOff(event: string, listener: Listener, context?: any): void {
    emitter.off(event, listener, context);
  }

  static rawEmit(event: string, ...args: any[]): void {
    emitter.emit(event, ...args);
  }

  static on(event: Event, listener: Listener, context?: any): void {
    emitter.on(event, listener, context);
  }

  static off(event: Event, listener: Listener, context?: any): void {
    emitter.off(event, listener, context);
  }

  static emit(event: Event, ...args: any[]): void {
    emitter.emit(event, ...args);
  }
}

export default EventBus;
