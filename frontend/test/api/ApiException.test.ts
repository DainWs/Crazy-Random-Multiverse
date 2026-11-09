import { describe, expect, it } from 'vitest';
import { ApiException, checkResponse, onSessionExpired, readRejection } from '@/api/models/ApiException';
import { vi } from 'vitest';

describe('checkResponse', () => {
  // CON-18
  it('accepts a successful response', async () => {
    const response = { ok: true, status: 200 } as Response;

    await expect(checkResponse(response)).resolves.toBeUndefined();
  });

  it('throws an ApiException for a 400 response', async () => {
    const response = { ok: false, status: 400, json: async () => ({ key: 'exception.party.is_full' }) } as Response;

    await expect(checkResponse(response)).rejects.toThrow(ApiException);
  });

  it('exposes the key of a 400 response', async () => {
    const response = { ok: false, status: 400, json: async () => ({ key: 'exception.party.locked' }) } as Response;

    const error = await checkResponse(response).catch((thrown: unknown) => thrown);

    expect((error as ApiException).key).toBe('exception.party.locked');
  });

  it('throws a generic error for an unexpected status', async () => {
    const response = { ok: false, status: 500 } as Response;

    await expect(checkResponse(response)).rejects.toThrow('Unexpected response status 500');
  });
});

describe('readRejection', () => {
  // CON-18
  it('returns undefined for a successful response', async () => {
    const response = { ok: true, status: 200 } as Response;

    await expect(readRejection(response)).resolves.toBeUndefined();
  });

  it('returns the key of a 400 response', async () => {
    const response = { ok: false, status: 400, json: async () => ({ key: 'exception.party.is_full' }) } as Response;

    await expect(readRejection(response)).resolves.toEqual({ key: 'exception.party.is_full' });
  });

  it('throws a generic error for an unexpected status', async () => {
    const response = { ok: false, status: 500 } as Response;

    await expect(readRejection(response)).rejects.toThrow('Unexpected response status 500');
  });
});

describe('onSessionExpired', () => {
  const rejected = (key: string) => ({ ok: false, status: 400, json: async () => ({ key }) }) as Response;

  // USER-8
  it('notifies when the server says the session does not exist', async () => {
    const listener = vi.fn();
    const stop = onSessionExpired(listener);

    await checkResponse(rejected('exception.user.not_found')).catch(() => undefined);
    stop();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('does not notify for any other rejection', async () => {
    const listener = vi.fn();
    const stop = onSessionExpired(listener);

    await checkResponse(rejected('exception.party.is_full')).catch(() => undefined);
    stop();

    expect(listener).not.toHaveBeenCalled();
  });
});
