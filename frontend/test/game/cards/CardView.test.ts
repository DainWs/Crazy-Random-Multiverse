import { describe, expect, it } from 'vitest';

describe('CardView', () => {
  describe('module loading', () => {
    it('loads before its subclasses without an import cycle', async () => {
      const { CardView } = await import('@/game/cards/CardView');
      const { default: EquipmentView } = await import('@/game/cards/EquipmentView');

      expect(EquipmentView.prototype).toBeInstanceOf(CardView);
    });
  });
});
