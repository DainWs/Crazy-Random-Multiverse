import type { UserState } from '@/domain/User';
import { ApiException, EXCEPTION_KEYS, gameEventApi, socketService, userApi, userEventApi } from '@/api';
import StoreSystem from '@/core/StoreSystem';

/** The state being built from the events sent when a socket is bound, or null outside that window (CON-23). */
let syncingState: UserState | null = null;

const loadOrRegisterUser = async () => {
  try {
    return await userApi.getAccount();
  } catch (error) {
    if (error instanceof ApiException && error.key === EXCEPTION_KEYS.USER_NOT_FOUND) {
      return await userApi.register();
    }

    throw error;
  }
}

const beginSync = () => {
  syncingState = 'IDLE';
  StoreSystem.setParty(undefined);
}

const finishSync = () => {
  if (syncingState === null) return;

  StoreSystem.setUserState(syncingState);
  syncingState = null;
}

const bindListeners = () => {
  socketService.onStatusChange((status) => {
    if (status === 'connected') beginSync();
  });

  gameEventApi.onGameApiEvent('GAME_SYNC', () => {
    if (syncingState !== null) syncingState = 'GAME_IN_PROGRESS';
  });

  gameEventApi.onGameApiEvent('GAME_LOADING', () => {
    if (syncingState !== null) syncingState = 'GAME_LOADING';
  });

  userEventApi.onPartyInfo((party) => {
    StoreSystem.setParty(party);
    if (syncingState === 'IDLE') syncingState = 'IN_PARTY';
  });

  userEventApi.onUserSynced(finishSync);
}

const start = async (): Promise<void> => {
  const user = await loadOrRegisterUser();
  StoreSystem.setUser(user);

  bindListeners();
  socketService.connect();
}

const SessionSystem = {
  start
}

export default SessionSystem;
