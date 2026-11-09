import { CreatePartyRequest, PartyDto, toMinimalParty, toParty } from "@/api/dtos/PartyDto";
import { UserDto, toUser } from "@/api/dtos/UserDto";
import { toBase64UrlSafe } from "@/api/models/Codification";
import { request } from "@/api/models/Request";
import { ApiException, EXCEPTION_KEYS, checkResponse, readRejection } from "@/api/models/ApiException";
import { PartyCode } from "@/domain/Party";
import User from "@/domain/User";
import { DEFAULT_PARTY_MAX_USERS } from "@/core/Constants";

const register = async () => {
  const response = await request('/register', { method: 'POST' });
  await checkResponse(response);
  const body = await response.json();
  return toUser(body)
};

const findAccount = async (): Promise<User | undefined> => {
  const response = await request('/user');
  const rejection = await readRejection(response);
  if (rejection?.key === EXCEPTION_KEYS.USER_NOT_FOUND) return undefined;
  if (rejection) throw new ApiException(rejection.key);

  const body = await response.json();
  return toUser(body)
}

const updateAccount = async (user: User) => {
  const userDto: UserDto = {
    id: user.code,
    username: user.name,
  }

  const response = await request('/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userDto),
  });
  await checkResponse(response);
}

const createParty = async () => {
  const createPartyRequest: CreatePartyRequest = {
    gameMode: 'CLASSIC',
    maxUsers: DEFAULT_PARTY_MAX_USERS,
  }

  const response = await request('/party', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createPartyRequest)
  });
  await checkResponse(response);
  const body = await response.json();
  return toParty(body)
};

const joinParty = async (partyCode: PartyCode) => {
  const response = await request(`/party/${toBase64UrlSafe(partyCode)}/join`, { method: 'POST' });
  await checkResponse(response);
  const body = await response.json();
  return toParty(body)
};

const getPartyList = async () => {
  const response = await request('/party/list');
  await checkResponse(response);
  const body = await response.json();

  return Array.from(body.parties as PartyDto[])
    .map(toMinimalParty);
};

export { register, findAccount, updateAccount }
export { createParty, joinParty, getPartyList }