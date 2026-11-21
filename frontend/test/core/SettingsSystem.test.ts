import { beforeEach, describe, expect, it } from 'vitest';
import SettingsSystem from '@/core/SettingsSystem';

// UI-33
describe('SettingsSystem', () => {
  beforeEach(() => {
    SettingsSystem.closePanel();
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
