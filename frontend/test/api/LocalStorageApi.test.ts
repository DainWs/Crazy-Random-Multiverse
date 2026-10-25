import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadUser, saveUser, loadHand, saveHand } from '@/api/LocalStorageApi';
import User from '@/domain/User';

describe('LocalStorageApi', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe('User storage', () => {
    it('loadUser retrieves existing user from localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ code: 'stored-id', name: 'Stored User' }));

      const user = loadUser();

      expect(user).toBeInstanceOf(User);
      expect(user.code).toBe('stored-id');
      expect(user.name).toBe('Stored User');
    });

    it('loadUser creates, saves, and returns a new user when none exists in localStorage', () => {
      const user = loadUser();

      expect(user).toBeInstanceOf(User);
      expect(user.code).toBeTruthy();
      expect(user.name).toBeTruthy();

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      expect(stored.code).toBe(user.code);
      expect(stored.name).toBe(user.name);
    });

    it('saveUser stores user JSON in localStorage', () => {
      const user = new User('manual-code', 'Manual User');

      saveUser(user);

      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      expect(stored.code).toBe('manual-code');
      expect(stored.name).toBe('Manual User');
    });
  });

  describe('Hand storage', () => {
    it('loadHand returns empty array when nothing in sessionStorage', () => {
      expect(loadHand()).toEqual([]);
    });

    it('saveHand and loadHand persist cards across sessionStorage', () => {
      const hand = [{ code: { code: 1, type: 'COMBATANT' }, name: 'Card 1' }] as any;

      saveHand(hand);
      const loaded = loadHand();

      expect(loaded).toEqual(hand);
    });
  });
});
