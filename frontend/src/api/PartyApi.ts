import type { UpdatePartyRequest } from "@/api/dtos/PartyDto";
import type { UserCode } from "@/domain/User";
import Party, { PartyCode } from "@/domain/Party";
import { toBase64UrlSafe } from "@/api/models/Codification";
import { request } from "@/api/models/Request";
import { checkResponse } from "@/api/models/ApiException";

const leaveParty = async (partyCode: PartyCode) => {
  const response = await request(`/party/${toBase64UrlSafe(partyCode)}/leave`, { method: 'POST' });
  await checkResponse(response);
};

const updateParty = async (party: Party) => {
  const updateRequest: UpdatePartyRequest = {
    maxUsers: party.maxUsers,
    gameMode: party.gameMode,
  }

  const response = await request(`/party/${toBase64UrlSafe(party.code)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateRequest),
  });
  await checkResponse(response);
}

const kickoutUser = async (partyCode: PartyCode, userCode: UserCode) => {
  const response = await request(`/party/${toBase64UrlSafe(partyCode)}/kick/${toBase64UrlSafe(userCode)}`, { method: 'POST' });
  await checkResponse(response);
}

const startPartyGame = async (partyCode: PartyCode) => {
  const response = await request(`/party/${toBase64UrlSafe(partyCode)}/start`, { method: 'POST' });
  await checkResponse(response);
}

const partyMemberApi = {
  leaveParty,
}

const partyOwnerApi = {
  updateParty,
  kickoutUser,
  startPartyGame
}

export { partyMemberApi, partyOwnerApi }