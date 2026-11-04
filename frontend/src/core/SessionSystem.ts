import type { Screen, UserState } from '@/domain/User';
import type { ActiveGame } from '@/domain/ActiveGame';
import type Party from '@/domain/Party';
import { computed, shallowRef } from 'vue';
import { gameEventApi, socketService, userApi, userEventApi } from '@/api';
import StoreSystem from '@/core/StoreSystem';

const currentParty = shallowRef<Party | undefined>();
const currentUserState = shallowRef<UserState>('IDLE');
const currentActiveGame = shallowRef<ActiveGame | undefined>();

/** Read-only views for Vue components; computed does not wrap the value in a proxy. */
const party = computed(() => currentParty.value);
const userState = computed(() => currentUserState.value);
const activeGame = computed(() => currentActiveGame.value);

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
  currentActiveGame.value = undefined;
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

const isMember = (candidate: Party) => candidate.users.some((member) => member.code === StoreSystem.getUser().code);

/** The server confirmed the user is in the party, through the response to creating or joining it. */
const enterParty = (confirmed: Party) => {
  currentParty.value = confirmed;
  followLiveState('IN_PARTY', ['IDLE']);
}

/** The user cannot continue the game, so they go back to the party, or to the main menu if they have none (UI-12). */
const abandonGame = () => {
  followLiveState(currentParty.value ? 'IN_PARTY' : 'IDLE', ['GAME_LOADING', 'GAME_IN_PROGRESS']);
}

/** The user is no longer in a party: they left it, or the server says they were kicked (PARTY-12). */
const leaveParty = () => {
  currentParty.value = undefined;
  followLiveState('IDLE', ['IN_PARTY']);
}

const bindListeners = () => {
  // The server sends the state before the connect ack, so the sync must start before the socket reports connected.
  socketService.onStatusChange((status) => {
    if (status === 'connecting' || status === 'reconnecting') beginSync();
  });

  gameEventApi.onGameApiEvent('GAME_SYNC', () => {
    if (syncingState !== null) syncingState = 'GAME_IN_PROGRESS';
  });

  gameEventApi.onGameLoading((game) => {
    currentActiveGame.value = game;
    if (syncingState !== null) syncingState = 'GAME_LOADING';
    else followLiveState('GAME_LOADING', ['IN_PARTY']);
  });

  gameEventApi.onGameApiEvent('GAME_START', () => followLiveState('GAME_IN_PROGRESS', ['GAME_LOADING']));
  gameEventApi.onGameApiEvent('GAME_CANCELLED', () => followLiveState('IN_PARTY', ['GAME_LOADING']));

  userEventApi.onPartyInfo((receivedParty) => {
    if (syncingState === null && !isMember(receivedParty)) {
      leaveParty();
      return;
    }

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
  activeGame,
  isSynced: isUserSynced,
  screen,
  enterParty,
  leaveParty,
  abandonGame,
  start
}

export default SessionSystem;
