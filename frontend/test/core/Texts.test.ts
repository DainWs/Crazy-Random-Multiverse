import { describe, expect, it } from 'vitest';
import { getText } from '@/core/Texts';

describe('getText', () => {
  it('returns the Spanish text of a known key', () => {
    expect(getText('exception.party.is_full')).toBe('La party está llena');
  });

  it('returns the key itself when it has no text', () => {
    expect(getText('exception.unknown.key')).toBe('exception.unknown.key');
  });
});
