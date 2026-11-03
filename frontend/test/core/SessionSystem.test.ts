import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiException, EXCEPTION_KEYS, userApi } from '@/api';
import User from '@/domain/User';
import SessionSystem from '@/core/SessionSystem';
import StoreSystem from '@/core/StoreSystem';

vi.mock('@/api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api')>()),
  userApi: { getAccount: vi.fn(), register: vi.fn() }
}));

describe('SessionSystem', () => {
  const registeredUser = new User('usr-1', 'One');

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userApi.getAccount).mockResolvedValue(registeredUser);
  });

  describe('start', () => {
    // USER-6
    it('stores the existing user', async () => {
      await SessionSystem.start();

      expect(StoreSystem.getUser()).toBe(registeredUser);
    });

    // USER-6
    it('registers a new user when the user is not found', async () => {
      const newUser = new User('usr-2', 'Two');
      vi.mocked(userApi.getAccount).mockRejectedValueOnce(new ApiException(EXCEPTION_KEYS.USER_NOT_FOUND));
      vi.mocked(userApi.register).mockResolvedValueOnce(newUser);

      await SessionSystem.start();

      expect(StoreSystem.getUser()).toBe(newUser);
    });

    it('rethrows other rejections without registering', async () => {
      vi.mocked(userApi.getAccount).mockRejectedValueOnce(new ApiException('exception.request.malformed'));

      await expect(SessionSystem.start()).rejects.toThrow('exception.request.malformed');
      expect(userApi.register).not.toHaveBeenCalled();
    });
  });
});
