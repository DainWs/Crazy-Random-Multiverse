import type { ExceptionCodeDto } from '@/api/dtos/ExceptionDto';

const HTTP_BAD_REQUEST = 400;

const EXCEPTION_KEYS = {
  USER_NOT_FOUND: 'exception.user.not_found',
  GAME_NOT_FOUND: 'exception.game.not_found',
  WRONG_GAME: 'exception.access_denied.wrong_game',
} as const;

class ApiException extends Error {
  public readonly key: string;

  public constructor(key: string) {
    super(key);
    this.name = 'ApiException';
    this.key = key;
  }
}

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
    throw new ApiException(rejection.key);
  }
};

export { ApiException, EXCEPTION_KEYS, checkResponse, readRejection };
