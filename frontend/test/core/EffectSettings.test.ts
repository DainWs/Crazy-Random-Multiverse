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
});
