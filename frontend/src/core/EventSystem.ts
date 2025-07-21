import { Events } from 'phaser';

// TODO esta clase tal vez tampoco es necesaria, ya que los eventos se estan manejando a bajo nivel
type HandCardActionEvents = 'hand.grab_card' | 'hand.left-click_card';
type ZoneSlotActionEvents = 'zone-slot.grab_card' | 'zone-slot.drop_card' | 'zone-slot.left-click_card' | 'zone-slot.right-click_card';

/** @deprecated */
type CardEvents = 'card.left-click' | 'card.right-click' | 'card.grab' | 'card.drop' | 'card.drag';
/** @deprecated */
type ZoneSlotEvents = 'zone-slot.card_over' | 'zone-slot.card_out'; // TODO to remove

type Event = HandCardActionEvents | ZoneSlotActionEvents | CardEvents | ZoneSlotEvents;
type Listener = (...args: any[]) => void;

const emitter = new Events.EventEmitter();

class EventSystem {
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

export default EventSystem;

