import { afterEach, describe, expect, it, vi } from 'vitest';
import { prefersReducedMotion, pulseWave, readyMarkAlpha } from '@/core/visual_effects/ReadyMarkPulse';
import { SLOT_MARKER_READY_MIN_ALPHA, SLOT_MARKER_READY_PULSE_PERIOD_MS } from '@/core/Constants';

describe('readyMarkAlpha', () => {
  // VIEW-17
  it('never goes below the minimum alpha nor above 1', () => {
    const alphas = Array.from({ length: SLOT_MARKER_READY_PULSE_PERIOD_MS }, (_, time) => readyMarkAlpha(time));

    expect([Math.min(...alphas) >= SLOT_MARKER_READY_MIN_ALPHA - 1e-9, Math.max(...alphas) <= 1 + 1e-9]).toEqual([true, true]);
  });

  it('reaches both the minimum and the maximum in one period', () => {
    const quarter = SLOT_MARKER_READY_PULSE_PERIOD_MS / 4;

    expect([readyMarkAlpha(quarter), readyMarkAlpha(3 * quarter)]).toEqual([expect.closeTo(1), expect.closeTo(SLOT_MARKER_READY_MIN_ALPHA)]);
  });

  // VIEW-17
  it('repeats the same alpha one period later, so a frame drawn again continues in phase', () => {
    expect(readyMarkAlpha(250 + SLOT_MARKER_READY_PULSE_PERIOD_MS)).toBeCloseTo(readyMarkAlpha(250));
  });
});

describe('prefersReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is true when the system asks for reduced motion', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));

    expect(prefersReducedMotion()).toBe(true);
  });

  it('is false when the system does not ask for it', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));

    expect(prefersReducedMotion()).toBe(false);
  });

  it('is false when the browser cannot tell', () => {
    vi.stubGlobal('matchMedia', undefined);

    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('pulseWave', () => {
  // VIEW-20
  it('goes from 0 to 1 and back in one period', () => {
    expect([pulseWave(750, 1000), pulseWave(250, 1000)]).toEqual([expect.closeTo(0), expect.closeTo(1)]);
  });

  // VIEW-20
  it('is the same one period later, so a glow drawn again continues in phase', () => {
    expect(pulseWave(130 + 2400, 2400)).toBeCloseTo(pulseWave(130, 2400));
  });
});
