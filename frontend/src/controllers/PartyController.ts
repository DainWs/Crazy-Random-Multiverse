import type Party from '@/domain/Party';
import type User from '@/domain/User';
import { partyMemberApi, partyOwnerApi, userApi } from '@/api';
import { ApiException } from '@/api/models/ApiException';
import { MIN_PARTY_USERS_TO_START } from '@/core/Constants';
import SessionSystem from '@/core/SessionSystem';

const UNEXPECTED_ERROR_KEY = 'exception.unexpected';

/** The exception key of a failed request, which is what the player is shown (CON-18). */
const toErrorKey = (error: unknown): string => (error instanceof ApiException ? error.key : UNEXPECTED_ERROR_KEY);

/** Returns the exception key if the request was rejected, or undefined if it was accepted. */
const attempt = async (request: () => Promise<void>): Promise<string | undefined> => {
  try {
    await request();
    return undefined;
  } catch (error) {
    return toErrorKey(error);
  }
}

const createParty = (): Promise<string | undefined> =>
  attempt(async () => SessionSystem.enterParty(await userApi.createParty()));

const joinParty = (partyCode: string): Promise<string | undefined> =>
  attempt(async () => SessionSystem.enterParty(await userApi.joinParty(partyCode.trim())));

const leaveParty = (party: Party): Promise<string | undefined> =>
  attempt(async () => {
    await partyMemberApi.leaveParty(party.code);
    SessionSystem.leaveParty();
  });

const startGame = (party: Party): Promise<string | undefined> => attempt(() => partyOwnerApi.startPartyGame(party.code));

const isOwner = (party: Party, user: User): boolean => party.owner?.code === user.code;

/** Only the owner can start, with enough members and while the party is not locked (UI-16, UI-20). */
const canStartGame = (party: Party, user: User): boolean =>
  isOwner(party, user) && !party.isLocked && party.userCount >= MIN_PARTY_USERS_TO_START;

const partyController = { createParty, joinParty, leaveParty, startGame, isOwner, canStartGame };

export default partyController;
