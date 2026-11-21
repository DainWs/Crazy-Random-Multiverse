import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadUiFonts } from '@/core/UiFonts';

// VIEW-54
describe('UiFonts', () => {
  let load: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    load = vi.fn().mockResolvedValue([]);
    Object.defineProperty(document, 'fonts', { value: { load }, configurable: true });
  });

  afterEach(() => {
    Reflect.deleteProperty(document, 'fonts');
  });

  it('loads the regular and the bold weight of the font of the interface', async () => {
    await loadUiFonts();

    expect(load.mock.calls.map(([font]) => font)).toEqual([
      '400 24px "Atkinson Hyperlegible", sans-serif',
      '700 24px "Atkinson Hyperlegible", sans-serif'
    ]);
  });

  it('goes on with the fallback of the family when a font fails to load', async () => {
    load.mockRejectedValue(new Error('network'));

    await expect(loadUiFonts()).resolves.toBeUndefined();
  });
});
