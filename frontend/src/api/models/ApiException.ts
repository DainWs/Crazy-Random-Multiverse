import type { ExceptionCodeDto } from '@/api/dtos/ExceptionDto';

const HTTP_BAD_REQUEST = 400;

const EXCEPTION_KEYS = {
  USER_NOT_FOUND: 'exception.user.not_found',
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
const checkResponse = async (response: Response): Promise<void> => {
  if (response.ok) return;

  if (response.status === HTTP_BAD_REQUEST) {
    const body: ExceptionCodeDto = await response.json();
    throw new ApiException(body.key);
  }

  throw new Error(`Unexpected response status ${response.status}`);
}

export { ApiException, EXCEPTION_KEYS, checkResponse };
