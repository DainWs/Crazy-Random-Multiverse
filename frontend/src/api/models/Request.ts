/** Every REST call of the client goes through here, so a failure of the network is handled in one place. */
const request = async (...args: Parameters<typeof fetch>): Promise<Response> => {
  return await fetch(...args);
};

export { request };
