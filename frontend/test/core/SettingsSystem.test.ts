import { beforeEach, describe, expect, it, vi } from 'vitest';
import SettingsSystem, { BOARD_CAMERA_STORAGE_KEY, DEFAULT_BOARD_CAMERA } from '@/core/SettingsSystem';

/** The choice is read when the module loads, so each test of the loading gets a fresh module. */
async function loadSettings() {
  vi.resetModules();
  const module = await import('@/core/SettingsSystem');

  return module.default;
}

// UI-33
describe('SettingsSystem', () => {
  beforeEach(() => {
    SettingsSystem.closePanel();
    window.localStorage.clear();
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

  // UI-34
  describe('the help panel', () => {
    beforeEach(() => {
      SettingsSystem.closeHelp();
    });

    it('toggles', () => {
      SettingsSystem.toggleHelp();
      const afterFirst = SettingsSystem.helpOpen.value;

      SettingsSystem.toggleHelp();

      expect([afterFirst, SettingsSystem.helpOpen.value]).toEqual([true, false]);
    });

    it('closes the settings when it opens', () => {
      SettingsSystem.openPanel();

      SettingsSystem.toggleHelp();

      expect([SettingsSystem.panelOpen.value, SettingsSystem.helpOpen.value]).toEqual([false, true]);
    });

    it('closes when the settings open', () => {
      SettingsSystem.toggleHelp();

      SettingsSystem.togglePanel();

      expect([SettingsSystem.panelOpen.value, SettingsSystem.helpOpen.value]).toEqual([true, false]);
    });

    it('keeps the settings open when the help is closed', () => {
      SettingsSystem.openPanel();

      SettingsSystem.closeHelp();

      expect(SettingsSystem.panelOpen.value).toBe(true);
    });

    // UI-4
    it.each([
      { open: 'settings', toggle: () => SettingsSystem.togglePanel() },
      { open: 'help', toggle: () => SettingsSystem.toggleHelp() }
    ])('counts the $open panel as a panel open', ({ toggle }) => {
      toggle();

      expect(SettingsSystem.anyPanelOpen.value).toBe(true);
    });

    it('counts no panel open when both are closed', () => {
      expect(SettingsSystem.anyPanelOpen.value).toBe(false);
    });
  });

  // VIEW-57
  describe('the camera of the board', () => {
    it('starts with the default camera when none was kept', async () => {
      const settings = await loadSettings();

      expect(settings.boardCamera.value).toBe(DEFAULT_BOARD_CAMERA);
    });

    it('reads a kept choice that is not a camera as the default one', async () => {
      window.localStorage.setItem(BOARD_CAMERA_STORAGE_KEY, 'FISHEYE');

      const settings = await loadSettings();

      expect(settings.boardCamera.value).toBe(DEFAULT_BOARD_CAMERA);
    });

    it('keeps the chosen camera for the next visit', async () => {
      SettingsSystem.setBoardCamera('TOP_DOWN');

      const settings = await loadSettings();

      expect(settings.boardCamera.value).toBe('TOP_DOWN');
    });
  });
});
