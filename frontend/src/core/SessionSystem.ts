import type { Screen, UserState } from '@/domain/User';
import type Party from '@/domain/Party';
import { computed, shallowRef } from 'vue';
import { gameEventApi, socketService, userApi, userEventApi } from '@/api';
import StoreSystem from '@/core/StoreSystem';

const currentParty = shallowRef<Party | undefined>();
const currentUserState = shallowRef<UserState>('IDLE');

/** Read-only views for Vue components; computed does not wrap the value in a proxy. */
const party = computed(() => currentParty.value);
const userState = computed(() => currentUserState.value);

const SCREEN_BY_USER_STATE: Record<UserState, Screen> = {
  IDLE: 'MAIN_MENU',
  IN_PARTY: 'PARTY',
  GAME_LOADING: 'GAME',
  GAME_IN_PROGRESS: 'GAME'
};

const isSynced = shallowRef(false);
const isUserSynced = computed(() => isSynced.value);

/** The screen to show, or undefined while waiting for user:synced (UI-17). */
const screen = computed(() => (isSynced.value ? SCREEN_BY_USER_STATE[currentUserState.value] : undefined));

/** The state being built from the events sent when a socket is bound, or null outside that window (CON-23). */
let syncingState: UserState | null = null;

const beginSync = () => {
  isSynced.value = false;
  syncingState = 'IDLE';
  currentParty.value = undefined;
}

const finishSync = () => {
  if (syncingState === null) return;

  currentUserState.value = syncingState;
  syncingState = null;
  isSynced.value = true;
}

/** After the sync, the state follows the events that reach the user (UI-17). */
const followLiveState = (state: UserState, from: readonly UserState[]) => {
  if (syncingState === null && from.includes(currentUserState.value)) currentUserState.value = state;
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
    else followLiveState('GAME_LOADING', ['IN_PARTY']);
  });

  gameEventApi.onGameApiEvent('GAME_START', () => followLiveState('GAME_IN_PROGRESS', ['GAME_LOADING']));
  gameEventApi.onGameApiEvent('GAME_CANCELLED', () => followLiveState('IN_PARTY', ['GAME_LOADING']));

  userEventApi.onPartyInfo((receivedParty) => {
    currentParty.value = receivedParty;
    if (syncingState === 'IDLE') syncingState = 'IN_PARTY';
    else followLiveState('IN_PARTY', ['IDLE']);
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
  isSynced: isUserSynced,
  screen,
  start
}

export default SessionSystem;
