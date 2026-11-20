import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SettingsSystem, { CARD_VALUES_STORAGE_KEY } from '@/core/SettingsSystem';

// UI-33
describe('SettingsSystem', () => {
  beforeEach(() => {
    window.localStorage.clear();
    for (const cardValue of ['DAMAGE', 'ARMOR', 'HEALTH'] as const) {
      SettingsSystem.setCardValue(cardValue, false);
    }
    SettingsSystem.closePanel();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setCardValue', () => {
    it('turns a card value on without turning the others on', () => {
      SettingsSystem.setCardValue('HEALTH', true);

      expect([
        SettingsSystem.isCardValueOn('DAMAGE'),
        SettingsSystem.isCardValueOn('ARMOR'),
        SettingsSystem.isCardValueOn('HEALTH')
      ]).toEqual([false, false, true]);
    });

    it('turns a card value off', () => {
      SettingsSystem.setCardValue('HEALTH', true);

      SettingsSystem.setCardValue('HEALTH', false);

      expect(SettingsSystem.isCardValueOn('HEALTH')).toBe(false);
    });

    it('keeps the card values that are on in the browser', () => {
      SettingsSystem.setCardValue('DAMAGE', true);
      SettingsSystem.setCardValue('HEALTH', true);

      expect(JSON.parse(window.localStorage.getItem(CARD_VALUES_STORAGE_KEY)!)).toEqual(['DAMAGE', 'HEALTH']);
    });

    it('still applies the change when the browser cannot keep it', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('storage is full');
      });

      SettingsSystem.setCardValue('ARMOR', true);

      expect(SettingsSystem.isCardValueOn('ARMOR')).toBe(true);
    });
  });

  describe('the card values at load time', () => {
    const loadWithStored = async (stored: string) => {
      window.localStorage.setItem(CARD_VALUES_STORAGE_KEY, stored);
      vi.resetModules();

      return (await import('@/core/SettingsSystem')).default;
    };

    it('starts with all off the first time', async () => {
      vi.resetModules();

      const settings = (await import('@/core/SettingsSystem')).default;

      expect(settings.cardValuesOn.value.size).toBe(0);
    });

    it('restores the card values kept from a previous visit', async () => {
      const settings = await loadWithStored('["ARMOR","HEALTH"]');

      expect([...settings.cardValuesOn.value]).toEqual(['ARMOR', 'HEALTH']);
    });

    it('ignores what is kept when it is not a list of card values', async () => {
      const settings = await loadWithStored('{"HEALTH":true}');

      expect(settings.cardValuesOn.value.size).toBe(0);
    });

    it('ignores a value of the list that is not a card value', async () => {
      const settings = await loadWithStored('["HEALTH","SPEED"]');

      expect([...settings.cardValuesOn.value]).toEqual(['HEALTH']);
    });

    it('starts with all off when what is kept cannot be read', async () => {
      const settings = await loadWithStored('not json');

      expect(settings.cardValuesOn.value.size).toBe(0);
    });
  });

  describe('the panel', () => {
    it('opens and closes', () => {
      SettingsSystem.openPanel();
      const opened = SettingsSystem.panelOpen.value;

      SettingsSystem.closePanel();

      expect([opened, SettingsSystem.panelOpen.value]).toEqual([true, false]);
    });

    it('toggles', () => {
      SettingsSystem.togglePanel();
      const afterFirst = SettingsSystem.panelOpen.value;

      SettingsSystem.togglePanel();

      expect([afterFirst, SettingsSystem.panelOpen.value]).toEqual([true, false]);
    });
  });
});
