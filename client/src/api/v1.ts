import { mapDtoToParty, mapDtoToPartyList, mapDtoToUser, mapUserToDto } from "@/api/mapper";
import * as Requests from "@/api/requests";

const headers = new Headers();
headers.set('content-type', 'application/json');


const login = async (request: Requests.LoginRequest) => {
  const response = await fetch(`/login`, {
    method: "POST", headers,
    body: `${request.username}`
  });

  validate(response);

  const dto = await response.json();
  return mapDtoToUser(dto);
}

const setAccountInfo = async (request: Requests.SetAccountInfoRequest) => {
  const response = await fetch(`/user`, {
    method: "PUT", headers,
    body: JSON.stringify(mapUserToDto(request.user))
  });

  validate(response);
}

const getAccountInfo = async () => {
  const response = await fetch(`/user`, { method: "GET" });

  validate(response);

  const dto = await response.json();
  return mapDtoToUser(dto);
}

const getPartyList = async () => {
  const response = await fetch(`/party/list`, { method: "GET" });

  validate(response);

  const dto = await response.json();
  return mapDtoToPartyList(dto);
}

const createParty = async (request: Requests.CreatePartyRequest) => {
  const response = await fetch(`/party`, {
    method: "POST", headers,
    body: JSON.stringify(request)
  });

  validate(response);

  const dto = await response.json();
  return mapDtoToParty(dto);
}

const updateParty = async (request: Requests.UpdatePartyRequest) => {
  const response = await fetch(`/party/${request.partyCode}`, {
    method: "PUT", headers,
    body: JSON.stringify(request)
  });

  validate(response);
}

const startGame = async (request: Requests.StartGameRequest) => {
  const response = await fetch(`/party/${request.partyCode}/start`, { method: "POST" });

  validate(response);
}

const joinParty = async (request: Requests.JoinPartyRequest) => {
  const response = await fetch(`/party/${request.partyCode}/join`, { method: "POST" });

  validate(response);

  const dto = await response.json();
  return mapDtoToParty(dto);
}

const leaveParty = async (request: Requests.LeavePartyRequest) => {
  const response = await fetch(`/party/${request.partyCode}/leave`, { method: "POST" });

  validate(response);
}

const ready = async (request: Requests.ReadyGameRequest) => {
  const response = await fetch(`/game/${btoa(request.gameCode)}/ready`, { method: "POST" })

  validate(response);
}

function validate(response: Response) {
  if (!response.ok) throw new Error(response.statusText);
}

export {
  login,
  setAccountInfo,
  getAccountInfo,
  getPartyList,
  createParty,
  updateParty,
  startGame,
  joinParty,
  leaveParty,
  ready
};