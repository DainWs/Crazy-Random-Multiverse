import type { UpdatePartyRequest, KickoutFromPartyRequest } from "@/api/dtos/PartyDto";
import type { UserCode } from "@/domain/User";
import Party, { PartyCode } from "@/domain/Party";
import { toBase64UrlSafe } from "@/api/models/Codification";

const leaveParty = async (partyCode: PartyCode) => {
  await fetch(`/party/${toBase64UrlSafe(partyCode)}/leave`, { method: 'POST' });
};

const updateParty = async (party: Party) => {
  const request: UpdatePartyRequest = {
    code: party.code,
    maxPlayers: party.maxUsers,
    gameMode: party.gameMode,
  }

  await fetch(`/party/${toBase64UrlSafe(party.code)}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

const kickoutUser = async (partyCode: PartyCode, userCode: UserCode) => {
  const request: KickoutFromPartyRequest = { partyCode, userCode }

  await fetch(`/party/${toBase64UrlSafe(partyCode)}/kick`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

const startPartyGame = async (partyCode: PartyCode) => {
  await fetch(`/party/${toBase64UrlSafe(partyCode)}/start`, { method: 'POST' });
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