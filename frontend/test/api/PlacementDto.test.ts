import { describe, expect, it } from 'vitest';
import type { EventDetailsDto } from '@/api/dtos/EventDto';
import { toPlacement } from '@/api/dtos/PlacementDto';

const ROW_COUNT = 3;

const details = (fields: Partial<EventDetailsDto>) => fields as EventDetailsDto;
const player = (code: string) => ({ code, name: code }) as EventDetailsDto['sourcePlayer'];

describe('toPlacement', () => {
  // VIEW-35
  it('settles the target slot of a placed card, with its row in the frontend rows', () => {
    const placement = toPlacement('PLAYER_PUT_CARD', details({ targetPlayer: player('p-1'), targetPosition: { row: 0, column: 2 } }), ROW_COUNT);

    expect(placement).toEqual({ settled: [{ player: 'p-1', position: { row: 2, column: 2 } }] });
  });

  // VIEW-35
  it('settles the source and the target slots of a moved card, which are both warriors in a swap', () => {
    const placement = toPlacement('PLAYER_MOVE_CARD', details({
      sourcePlayer: player('p-1'),
      sourcePosition: { row: 1, column: 0 },
      targetPlayer: player('p-1'),
      targetPosition: { row: 1, column: 1 }
    }), ROW_COUNT);

    expect(placement?.settled.map((slot) => [slot.position.row, slot.position.column])).toEqual([[1, 0], [1, 1]]);
  });

  // VIEW-36
  it('names the slot of the card that received the equipment', () => {
    const placement = toPlacement('PLAYER_EQUIP_CARD', details({ targetPlayer: player('p-2'), targetPosition: { row: 2, column: 1 } }), ROW_COUNT);

    expect(placement).toEqual({ settled: [], equipped: { player: 'p-2', position: { row: 0, column: 1 } } });
  });

  it('is nothing for the events that put no card in a slot', () => {
    expect(toPlacement('TURN_CHANGE', details({}), ROW_COUNT)).toBeUndefined();
  });

  it('is nothing for an event without its positions', () => {
    expect(toPlacement('PLAYER_PUT_CARD', details({}), ROW_COUNT)).toEqual({ settled: [] });
  });
});
