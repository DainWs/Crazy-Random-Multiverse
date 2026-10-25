import { CreatePartyRequest, PartyDto, toMinimalParty, toParty } from "@/api/dtos/PartyDto";
import { UserDto, toUser } from "@/api/dtos/UserDto";
import { toBase64UrlSafe } from "@/api/models/Codification";
import { PartyCode } from "@/domain/Party";
import User from "@/domain/User";

const register = async () => {
  const response = await fetch('/register', { method: 'POST' });
  const body = await response.json();
  return toUser(body)
};

const login = async (username: string) => {
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: username,
  });

  const body = await response.json();
  return toUser(body)
};

const getAccount = async () => {
  const response = await fetch('/user');
  const body = await response.json();
  return toUser(body)
}

const updateAccount = async (user: User) => {
  const userDto: UserDto = {
    id: user.code,
    username: user.name,
  }

  await fetch('/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userDto),
  });
}

const createParty = async () => {
  const createPartyRequest: CreatePartyRequest = {
    gameMode: 'CLASSIC',
    maxPlayers: 4,
  }

  const response = await fetch('/party', {
    method: 'POST',
    body: JSON.stringify(createPartyRequest)
  });
  const body = await response.json();
  return toParty(body)
};

const joinParty = async (partyCode: PartyCode) => {
  const response = await fetch(`/party/${toBase64UrlSafe(partyCode)}/join`, { method: 'POST' });
  const body = await response.json();
  return toParty(body)
};

const getPartyList = async () => {
  const response = await fetch('/party/list');
  const body = await response.json();

  return Array.from(body.parties as PartyDto[])
    .map(toMinimalParty);
};

export { register, login, getAccount, updateAccount }
export { createParty, joinParty, getPartyList }