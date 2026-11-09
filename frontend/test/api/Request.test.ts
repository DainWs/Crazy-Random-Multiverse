import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiException, ServerUnreachableError } from '@/api/models/ApiException';
import { request } from '@/api/models/Request';

describe('request', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the response of the server, whatever its status', async () => {
    const response = { ok: false, status: 500 } as Response;
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(request('/user')).resolves.toBe(response);
  });

  // UI-24
  it('fails with ServerUnreachableError when there is no response', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(request('/user')).rejects.toBeInstanceOf(ServerUnreachableError);
  });

  // UI-24
  it('fails with an exception the player is shown, with the key of the client', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const error = await request('/user').catch((thrown: unknown) => thrown);

    expect(error).toBeInstanceOf(ApiException);
    expect((error as ApiException).key).toBe('exception.server_unreachable');
  });

  it('does not hide any other failure', async () => {
    const failure = new Error('boom');
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(failure);

    await expect(request('/user')).rejects.toBe(failure);
  });
});
