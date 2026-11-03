import type { UserState } from '@/domain/User';
import type Party from '@/domain/Party';
import { computed, shallowRef } from 'vue';
import { gameEventApi, socketService, userApi, userEventApi } from '@/api';
import StoreSystem from '@/core/StoreSystem';

const currentParty = shallowRef<Party | undefined>();
const currentUserState = shallowRef<UserState>('IDLE');

/** Read-only views for Vue components; computed does not wrap the value in a proxy. */
const party = computed(() => currentParty.value);
const userState = computed(() => currentUserState.value);

/** The state being built from the events sent when a socket is bound, or null outside that window (CON-23). */
let syncingState: UserState | null = null;

const beginSync = () => {
  syncingState = 'IDLE';
  currentParty.value = undefined;
}

const finishSync = () => {
  if (syncingState === null) return;

  currentUserState.value = syncingState;
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

  userEventApi.onPartyInfo((receivedParty) => {
    currentParty.value = receivedParty;
    if (syncingState === 'IDLE') syncingState = 'IN_PARTY';
  });

  userEventApi.onUserSynced(finishSync);
}

const start = async (): Promise<void> => {
  let account = await userApi.findAccount();
  if (!account) account = await userApi.register();

  const user = account;
  StoreSystem.setUser(user);

  bindListeners();
  socketService.connect();
}

const SessionSystem = {
  party,
  userState,
  start
}

export default SessionSystem;
