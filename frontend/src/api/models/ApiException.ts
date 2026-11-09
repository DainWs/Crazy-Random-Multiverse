import type { ExceptionCodeDto } from '@/api/dtos/ExceptionDto';
import type { Listener } from '@/api/models/Listeners';
import { notifyListeners } from '@/api/models/Listeners';

const HTTP_BAD_REQUEST = 400;

const EXCEPTION_KEYS = {
  USER_NOT_FOUND: 'exception.user.not_found',
  GAME_NOT_FOUND: 'exception.game.not_found',
  WRONG_GAME: 'exception.access_denied.wrong_game',
  SERVER_UNREACHABLE: 'exception.server_unreachable',
  UNEXPECTED: 'exception.unexpected',
} as const;

class ApiException extends Error {
  public readonly key: string;

  public constructor(key: string) {
    super(key);
    this.name = 'ApiException';
    this.key = key;
  }
}

/** The request got no response: the server is down or the network is cut (UI-24). The key is the client's own (CON-18 does not list it). */
class ServerUnreachableError extends ApiException {
  public constructor() {
    super(EXCEPTION_KEYS.SERVER_UNREACHABLE);
    this.name = 'ServerUnreachableError';
  }
}

const sessionExpiredListeners = new Set<Listener<void>>();

/** Called when the server rejects a request because the session no longer exists (USER-8). */
const onSessionExpired = (listener: Listener<void>): (() => void) => {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
};

/** Accepted requests are 2xx and rejected ones are a 400 with an exception key (CON-18); any other status is an unexpected failure. */
const readRejection = async (response: Response): Promise<ExceptionCodeDto | undefined> => {
  if (response.ok) {
    return undefined;
  }

  if (response.status === HTTP_BAD_REQUEST) {
    return await response.json();
  }

  throw new Error(`Unexpected response status ${response.status}`);
};

const checkResponse = async (response: Response): Promise<void> => {
  const rejection = await readRejection(response);
  if (rejection) {
    if (rejection.key === EXCEPTION_KEYS.USER_NOT_FOUND) {
      notifyListeners(sessionExpiredListeners, 'session expired listener', undefined);
    }

    throw new ApiException(rejection.key);
  }
};

export { ApiException, EXCEPTION_KEYS, ServerUnreachableError, checkResponse, onSessionExpired, readRejection };
