import GameEvent from "@/domain/events/GameEvent";
import { EventContext } from "@/domain/events/eventObserver";

interface GameEventHandler {
  handle(event: GameEvent, context: EventContext): Promise<void>;
}

export default GameEventHandler;