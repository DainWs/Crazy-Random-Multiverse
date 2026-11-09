import { describe, expect, it } from 'vitest';
import { getText } from '@/core/Texts';

describe('getText', () => {
  it('returns the Spanish text of a known key', () => {
    expect(getText('exception.party.is_full')).toBe('La party está llena');
  });

  it('returns the Spanish name of a warrior', () => {
    expect(getText('card.warrior.2.name')).toBe('Policía');
  });

  it('returns the Spanish description of a piece of equipment', () => {
    expect(getText('card.equipment.0.description')).toBe('Arma a distancia');
  });

  it('returns the code as the name of a leader', () => {
    expect(getText('card.leader.1.name')).toBe('1');
  });

  it('returns the key itself when it has no text', () => {
    expect(getText('exception.unknown.key')).toBe('exception.unknown.key');
  });

  it('returns an empty text for an empty key', () => {
    expect(getText('')).toBe('');
  });
});
