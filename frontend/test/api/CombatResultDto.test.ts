import { describe, expect, it } from 'vitest';
import type { EventDetailsDto } from '@/api/dtos/EventDto';
import { toCombatResult } from '@/api/dtos/CombatResultDto';

describe('toCombatResult', () => {
  const ROW_COUNT = 3;
  const player = (code: string) => ({ code, name: code, isAlive: true, isSpectator: false });
  const createDetails = (overrides: Partial<EventDetailsDto> = {}): EventDetailsDto =>
    ({
      game: { code: 'game-1', zones: [] },
      sourcePlayer: player('p1'),
      sourcePosition: { row: 1, column: 0 },
      targetPlayer: player('p2'),
      targetPosition: { row: 2, column: 1 },
      armorDamage: 2,
      healthDamage: 3,
      targetDead: false,
      ...overrides
    }) as EventDetailsDto;

  it('maps the players and the damage', () => {
    const result = toCombatResult(createDetails({ targetDead: true }), ROW_COUNT)!;

    expect(result).toMatchObject({ attackerPlayer: 'p1', targetPlayer: 'p2', armorDamage: 2, healthDamage: 3, targetDead: true });
  });

  it('maps the rows of the contract to the frontend rows', () => {
    const result = toCombatResult(createDetails(), ROW_COUNT)!;

    expect(result.attackerPosition).toMatchObject({ row: 1, column: 0 });
    expect(result.targetPosition).toMatchObject({ row: 0, column: 1 });
  });

  it('keeps a damage of 0, which the server always sends', () => {
    const result = toCombatResult(createDetails({ armorDamage: 0, healthDamage: 0 }), ROW_COUNT)!;

    expect(result).toMatchObject({ armorDamage: 0, healthDamage: 0 });
  });

  it('gives nothing when the details lack the target', () => {
    expect(toCombatResult(createDetails({ targetPosition: undefined }), ROW_COUNT)).toBeUndefined();
  });

  it('gives nothing when the details lack the damage', () => {
    expect(toCombatResult(createDetails({ healthDamage: undefined }), ROW_COUNT)).toBeUndefined();
  });
});
