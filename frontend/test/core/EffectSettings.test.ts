import { afterEach, describe, expect, it, vi } from 'vitest';
import EffectSettings from '@/core/EffectSettings';

// UI-26, UI-30
describe('EffectSettings', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts at normal quality and with reduced motion off', () => {
    expect([EffectSettings.quality, EffectSettings.reducedMotion]).toEqual(['NORMAL', false]);
  });

  it('plays the essential and the non-essential effects', () => {
    expect([EffectSettings.plays('ESSENTIAL'), EffectSettings.plays('NON_ESSENTIAL')]).toEqual([true, true]);
  });

  describe('instant motion of the browser tests', () => {
    afterEach(() => {
      delete window.crmInstantMotion;
    });

    it('plays no effect, so each one ends at once', () => {
      window.crmInstantMotion = true;

      expect([EffectSettings.plays('ESSENTIAL'), EffectSettings.plays('NON_ESSENTIAL')]).toEqual([false, false]);
    });
  });

  describe('pulsesAreStill', () => {
    it('is true when the system asks for reduced motion', () => {
      vi.stubGlobal('matchMedia', () => ({ matches: true }));

      expect(EffectSettings.pulsesAreStill()).toBe(true);
    });

    it('is false when the system does not ask for it', () => {
      vi.stubGlobal('matchMedia', () => ({ matches: false }));

      expect(EffectSettings.pulsesAreStill()).toBe(false);
    });

    it('is false when the browser cannot tell', () => {
      vi.stubGlobal('matchMedia', undefined);

      expect(EffectSettings.pulsesAreStill()).toBe(false);
    });
  });

  // UI-31
  describe('accessibleModeIsOn', () => {
    afterEach(() => {
      window.history.replaceState(null, '', '/');
    });

    it.each([
      { search: '?accessible=1', expected: true },
      { search: '?a=b&accessible=1', expected: true },
      { search: '', expected: false },
      { search: '?accessible=0', expected: false },
      { search: '?accessible=true', expected: false },
      { search: '?extraMarks=1', expected: false }
    ])('is $expected for "$search"', ({ search, expected }) => {
      window.history.replaceState(null, '', `/${search}`);

      expect(EffectSettings.accessibleModeIsOn()).toBe(expected);
    });

    it('turns on the extra marks too', () => {
      window.history.replaceState(null, '', '/?accessible=1');

      expect(EffectSettings.extraMarksAreOn()).toBe(true);
    });
  });

  // UI-31
  describe('extraMarksAreOn', () => {
    afterEach(() => {
      window.history.replaceState(null, '', '/');
    });

    it.each([
      { search: '?extraMarks=1', expected: true },
      { search: '?a=b&extraMarks=1', expected: true },
      { search: '', expected: false },
      { search: '?extraMarks=0', expected: false },
      { search: '?extraMarks=true', expected: false },
      { search: '?extraMarks=', expected: false }
    ])('is $expected for "$search"', ({ search, expected }) => {
      window.history.replaceState(null, '', `/${search}`);

      expect(EffectSettings.extraMarksAreOn()).toBe(expected);
    });
  });
});
