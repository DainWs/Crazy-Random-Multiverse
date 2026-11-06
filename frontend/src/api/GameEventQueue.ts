import type { EventDto } from '@/api/dtos/EventDto';
import type { GameEventCode } from '@/api/models/GameEventCode';
import type { GameCode } from '@/domain/GameConfiguration';

/** The snapshots set the sequence the queue continues from, instead of following it (CON-12). */
const SNAPSHOT_EVENT_CODES: readonly GameEventCode[] = ['GAME_SYNC', 'GAME_LOADING'];

/** The first event of a game (CON-9). */
const FIRST_SEQUENCE = 1;

/** Applies the events of a game in the order of their sequence, waiting for the missing ones (CON-12). */
class GameEventQueue {
  private readonly apply: (event: EventDto) => void;
  private readonly pending: Map<number, EventDto>;

  private gameCode: GameCode | undefined;
  private nextSequence: number;

  public constructor(apply: (event: EventDto) => void) {
    this.apply = apply;
    this.pending = new Map();
    this.nextSequence = FIRST_SEQUENCE;
  }

  public push(event: EventDto): void {
    const sequence = event.sequence;

    if (sequence === undefined) {
      // Only the channels outside the contract send events without it, and they cannot be ordered
      this.apply(event);
    } else if (SNAPSHOT_EVENT_CODES.includes(event.code)) {
      this.applySnapshot(event, sequence);
    } else {
      this.enqueue(event, sequence);
    }

    this.applyPending();
  }

  public reset(): void {
    this.gameCode = undefined;
    this.nextSequence = FIRST_SEQUENCE;
    this.pending.clear();
  }

  private applySnapshot(event: EventDto, sequence: number) {
    this.followGame(event.details.game.code);
    this.nextSequence = sequence + 1;
    this.discardUpTo(sequence);
    this.apply(event);
  }

  private enqueue(event: EventDto, sequence: number) {
    this.followGame(event.details.game.code);
    if (sequence >= this.nextSequence) {
      this.pending.set(sequence, event);
    }
  }

  private applyPending() {
    let event = this.pending.get(this.nextSequence);
    while (event) {
      this.pending.delete(this.nextSequence);
      this.nextSequence++;
      this.apply(event);
      event = this.pending.get(this.nextSequence);
    }
  }

  /** A new game starts over, waiting for its first event (CON-9). */
  private followGame(gameCode: GameCode) {
    if (gameCode !== this.gameCode) {
      this.reset();
      this.gameCode = gameCode;
    }
  }

  private discardUpTo(sequence: number) {
    for (const waiting of [...this.pending.keys()]) {
      if (waiting <= sequence) {
        this.pending.delete(waiting);
      }
    }
  }
}

export default GameEventQueue;
