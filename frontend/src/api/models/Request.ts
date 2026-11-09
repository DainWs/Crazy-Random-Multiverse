import { ServerUnreachableError } from '@/api/models/ApiException';

/** Every REST call of the client goes through here. A `fetch` that gets no response fails with a `TypeError`,
 * which is told apart from a response with an error status (UI-24). */
const request = async (...args: Parameters<typeof fetch>): Promise<Response> => {
  try {
    return await fetch(...args);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ServerUnreachableError();
    }

    throw error;
  }
};

export { request };
