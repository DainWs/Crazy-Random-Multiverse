import type { Screen, UserState } from '@/domain/User';
import type { ActiveGame } from '@/domain/ActiveGame';
import type Party from '@/domain/Party';
import { computed, shallowRef } from 'vue';
import { gameEventApi, gameStateApi, socketService, userApi, userEventApi } from '@/api';
import StoreSystem from '@/core/StoreSystem';

const currentParty = shallowRef<Party | undefined>();
const currentUserState = shallowRef<UserState>('IDLE');
const currentActiveGame = shallowRef<ActiveGame | undefined>();

/** Read-only views for Vue components; computed does not wrap the value in a proxy. */
const party = computed(() => currentParty.value);
const userState = computed(() => currentUserState.value);
const activeGame = computed(() => currentActiveGame.value);

const GAME_USER_STATES: readonly UserState[] = ['GAME_LOADING', 'GAME_IN_PROGRESS'];

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

/** The game state is kept while the user has a game, and dropped when they no longer do (UI-17). */
const setUserState = (state: UserState) => {
  currentUserState.value = state;
  if (!GAME_USER_STATES.includes(state)) {
    StoreSystem.clearGame();
    gameStateApi.reset();
  }
}

const beginSync = () => {
  isSynced.value = false;
  syncingState = 'IDLE';
  currentParty.value = undefined;
  currentActiveGame.value = undefined;
}

const finishSync = () => {
  if (syncingState === null) return;

  setUserState(syncingState);
  syncingState = null;
  isSynced.value = true;
}

/** After the sync, the state follows the events that reach the user (UI-17). */
const followLiveState = (state: UserState, from: readonly UserState[]) => {
  if (syncingState === null && from.includes(currentUserState.value)) setUserState(state);
}

const isMember = (candidate: Party) => {
  return candidate.users.some((member) => 
    member.code === StoreSystem.getUser().code);
}

/** The server confirmed the user is in the party, through the response to creating or joining it. */
const enterParty = (confirmed: Party) => {
  currentParty.value = confirmed;
  followLiveState('IN_PARTY', ['IDLE']);
}

/** The user cannot continue the game, so they go back to the party, or to the main menu if they have none (UI-12). */
const abandonGame = () => {
  let state: UserState = 'IDLE';
  if (currentParty.value) {
    state = 'IN_PARTY';
  }

  followLiveState(state, ['GAME_LOADING', 'GAME_IN_PROGRESS']);
};

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

  gameEventApi.onGameSync((game) => {
    currentActiveGame.value = game;
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
    if (syncingState === 'IDLE') {
      syncingState = 'IN_PARTY';
    } else {
      const from: UserState[] = receivedParty.isLocked
        ? ['IDLE']
        : ['IDLE', 'GAME_IN_PROGRESS'];

      followLiveState('IN_PARTY', from);
    }
  });

  userEventApi.onUserSynced(finishSync);
}

const start = async (): Promise<void> => {
  let account = await userApi.findAccount();
  if (!account) account = await userApi.register();

  const user = account;
  StoreSystem.setUser(user);

  bindListeners();
  gameStateApi.bind();
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
