import { describe, expect, it } from 'vitest';
import EquipmentCardLayout from '@/game/cards/EquipmentCardLayout';

describe('EquipmentCardLayout', () => {
  const layout = new EquipmentCardLayout(200, 300);

  it('places the name at the top of the card', () => {
    expect(layout.nameArea()).toEqual({ x: 0, y: -127.5, width: 100, height: 15 });
  });

  it('places the values under the middle of the card', () => {
    expect(layout.valueArea(0, 3).y).toBeGreaterThan(0);
  });

  it('stacks the values from top to bottom', () => {
    expect(layout.valueArea(1, 3).y).toBeGreaterThan(layout.valueArea(0, 3).y);
  });

  it('centers a single value in the band of the three', () => {
    expect(layout.valueArea(0, 1).y).toBe(layout.valueArea(1, 3).y);
  });

  it('keeps every value inside the card', () => {
    expect(layout.valueArea(2, 3).y + layout.valueArea(2, 3).height / 2).toBeLessThanOrEqual(150);
  });
});
