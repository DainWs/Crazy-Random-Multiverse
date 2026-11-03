import { CreatePartyRequest, PartyDto, toMinimalParty, toParty } from "@/api/dtos/PartyDto";
import { UserDto, toUser } from "@/api/dtos/UserDto";
import { toBase64UrlSafe } from "@/api/models/Codification";
import { ApiException, EXCEPTION_KEYS, checkResponse, readRejection } from "@/api/models/ApiException";
import { PartyCode } from "@/domain/Party";
import User from "@/domain/User";

const register = async () => {
  const response = await fetch('/register', { method: 'POST' });
  await checkResponse(response);
  const body = await response.json();
  return toUser(body)
};

const findAccount = async (): Promise<User | undefined> => {
  const response = await fetch('/user');
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

  const response = await fetch('/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userDto),
  });
  await checkResponse(response);
}

const createParty = async () => {
  const createPartyRequest: CreatePartyRequest = {
    gameMode: 'CLASSIC',
    maxUsers: 4,
  }

  const response = await fetch('/party', {
    method: 'POST',
    body: JSON.stringify(createPartyRequest)
  });
  await checkResponse(response);
  const body = await response.json();
  return toParty(body)
};

const joinParty = async (partyCode: PartyCode) => {
  const response = await fetch(`/party/${toBase64UrlSafe(partyCode)}/join`, { method: 'POST' });
  await checkResponse(response);
  const body = await response.json();
  return toParty(body)
};

const getPartyList = async () => {
  const response = await fetch('/party/list');
  await checkResponse(response);
  const body = await response.json();

  return Array.from(body.parties as PartyDto[])
    .map(toMinimalParty);
};

export { register, findAccount, updateAccount }
export { createParty, joinParty, getPartyList }