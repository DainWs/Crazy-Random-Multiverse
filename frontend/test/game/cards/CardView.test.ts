import { describe, expect, it } from 'vitest';
// Loading Phaser takes over 5 s without a cache, which must not count towards the timeout of the test
import 'phaser';

describe('CardView', () => {
  describe('module loading', () => {
    it('loads before its subclasses without an import cycle', async () => {
      const { CardView } = await import('@/game/cards/CardView');
      const { default: EquipmentView } = await import('@/game/cards/EquipmentView');

      expect(EquipmentView.prototype).toBeInstanceOf(CardView);
    });
  });
});
