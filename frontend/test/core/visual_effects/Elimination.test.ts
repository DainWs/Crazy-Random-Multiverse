import 'phaser';
import { describe, expect, it } from 'vitest';
import Player from '@/domain/Player';
import type ZoneView from '@/game/zone/ZoneView';
import { describeElimination, findNewlyEliminated } from '@/core/visual_effects/Elimination';

const createZone = (code: string, isAlive: boolean) => {
  const owner = new Player(code, `Name ${code}`);
  owner.isAlive = isAlive;

  return { zone: { owner } } as unknown as ZoneView;
};

// VIEW-11
describe('findNewlyEliminated', () => {
  it('returns the zone of a player that was alive and is eliminated now', () => {
    const shown = [createZone('p-1', true), createZone('p-2', false)];

    expect(findNewlyEliminated(['p-1', 'p-2'], shown)).toEqual([shown[1]]);
  });

  it('does not return a zone that was already eliminated, so a board drawn again plays nothing', () => {
    const shown = [createZone('p-1', true), createZone('p-2', false)];

    expect(findNewlyEliminated(['p-1'], shown)).toEqual([]);
  });

  it('returns nothing when everybody is alive', () => {
    expect(findNewlyEliminated(['p-1'], [createZone('p-1', true)])).toEqual([]);
  });
});

describe('describeElimination', () => {
  it('names the eliminated rival', () => {
    expect(describeElimination(new Player('p-2', 'Two'), 'p-1')).toBe('Two eliminado');
  });

  it('tells the local player they were eliminated', () => {
    expect(describeElimination(new Player('p-1', 'One'), 'p-1')).toBe('Has sido eliminado');
  });
});
