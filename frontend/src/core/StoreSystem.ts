import type { PlayerCode } from "@/domain/Player";
import type { UserCode } from "@/domain/User";
import type Player from "@/domain/Player";
import type User from "@/domain/User";
import type Zone from "@/domain/Zone";
import type GameConfiguration from "@/domain/GameConfiguration";
import type Card from "@/domain/Card";
import type { CardCode } from "@/domain/Card";
import type Battlefield from "@/domain/Battlefield";
import type { CancelListenerCallback, Listener } from "@/api/models/Listeners";
import { localStorageApi as ExternalStoreApi } from "@/api";
import { notifyListeners } from "@/api/models/Listeners";

type SessionCode = UserCode | PlayerCode;

type PlayerHand = Card[];
type PlayerZone = Zone;

type GameState = {
  gameConfiguration: GameConfiguration;
  battlefield: Battlefield;
  round?: number;
  playerWithTurn?: PlayerCode;

  zones: Zone[];
  player: Player;
  playerZone: PlayerZone;
  playerHand: PlayerHand;
}

/** What a GameDto carries: the hand does not travel in every event (CON-11). */
type GameSnapshot = Omit<GameState, 'playerHand'>;

/** What changed in the game state: the views draw the zones again, restore the hand without animating it, or animate the cards that came or went. */
type GameChange = 'GAME_UPDATED' | 'HAND_RESTORED' | 'HAND_CHANGED';

type Store = {
  user?: User;
  gameState?: GameState;
}

const store: Store = {};
const changeListeners = new Set<Listener<GameChange>>();

function onChange(listener: Listener<GameChange>): CancelListenerCallback {
  changeListeners.add(listener);
  return () => changeListeners.delete(listener);
}

function notifyChange(change: GameChange) {
  notifyListeners(changeListeners, 'game change listener', change);
}

/** Replaces the state with the one the server sent, and keeps the hand of the same game, which the snapshots do not replace. */
function applyGame(snapshot: GameSnapshot) {
  const isSameGame = store.gameState?.gameConfiguration.gameCode === snapshot.gameConfiguration.gameCode;
  store.gameState = { ...snapshot, playerHand: (isSameGame && store.gameState?.playerHand) || [] };
  notifyChange('GAME_UPDATED');
}

function clearGame() {
  store.gameState = undefined;
}

function isSessionCode(code: PlayerCode | UserCode | null | undefined): boolean {
  if (!code) return false;
  return getSessionCode() === code;
}

function getSessionCode(): SessionCode {
  if (store.gameState?.player?.code) {
    return store.gameState.player.code;
  }

  return getUser().code;
}

function getUser(): User {
  if (!store.user) {
    store.user = ExternalStoreApi.loadUser();
  }

  return store.user;
}

function setUser(user: User): void {
  store.user = user;
  ExternalStoreApi.saveUser(user);
}

function getGameConfiguration(): GameConfiguration {
  if (!store.gameState?.gameConfiguration) {
    throw new Error('Game not initialized');
  }

  return store.gameState.gameConfiguration;
}

function getRound(): number | undefined {
  if (!store.gameState) {
    throw new Error('Game not initialized');
  }

  return store.gameState.round;
}

function getPlayer(): Player {
  if (!store.gameState?.player) {
    throw new Error('Game not initialized');
  }

  return store.gameState.player;
}

/** Whether the local player holds the turn and can still act (UI-4, ELIM-2). */
function canPlayerAct(): boolean {
  const player = getPlayer();
  return player.isAlive && !player.isSpectator && store.gameState?.playerWithTurn === player.code;
}

/** The player who holds the turn, unknown until the first `TURN_CHANGE` (CON-32). */
function getPlayerWithTurn(): Player | undefined {
  const code = store.gameState?.playerWithTurn;
  return getZones().find((zone) => zone.owner.code === code)?.owner;
}

function getPlayerHand(): PlayerHand {
  if (!store.gameState?.playerHand) {
    throw new Error('Game not initialized');
  }

  return store.gameState.playerHand;
}

function setPlayerHand(playerHand: PlayerHand): void {
  numberCopies(playerHand);
  store.gameState!.playerHand = playerHand;
  notifyChange('HAND_RESTORED');
}

function addCardToHand(card: Card): void {
  const hand = getPlayerHand();
  hand.push(card);
  numberCopies(hand);
  notifyChange('HAND_CHANGED');
}

/** Removes one copy of the card, as the server only says which card was played (CON-13, CON-26). */
function removeCardFromHand(cardCode: CardCode): Card | undefined {
  const hand = getPlayerHand();
  const index = hand.findIndex((card) => card.code.equals(cardCode));
  const [removed] = index === -1 ? [] : hand.splice(index, 1);
  numberCopies(hand);
  if (removed) {
    notifyChange('HAND_CHANGED');
  }

  return removed;
}

function numberCopies(hand: PlayerHand): void {
  const copiesByCode = new Map<string, number>();
  for (const card of hand) {
    const copyNumber = (copiesByCode.get(card.code.text()) ?? 0) + 1;
    copiesByCode.set(card.code.text(), copyNumber);
    card.copyNumber = copyNumber;
  }
}

function getPlayerZone(): PlayerZone {
  if (!store.gameState?.playerZone) {
    throw new Error('Game not initialized');
  }

  return store.gameState.playerZone;
}

function setPlayerZone(playerZone: PlayerZone): void {
  store.gameState!.playerZone = playerZone;
}

function getZones(): Zone[] {
  if (!store.gameState?.zones) {
    throw new Error('Game not initialized');
  }

  return store.gameState.zones;
}

function setZones(zones: Zone[]): void {
  store.gameState!.zones = zones;
}

function getBattlefield(): Battlefield {
  if (!store.gameState?.battlefield) {
    throw new Error('Game not initialized');
  }

  return store.gameState.battlefield;
}

const StoreSystem = {
  onChange,
  applyGame,
  clearGame,
  getSessionCode,
  isSessionCode,
  getUser,
  setUser,
  getGameConfiguration,
  getRound,
  getPlayer,
  canPlayerAct,
  getPlayerWithTurn,
  getPlayerZone,
  setPlayerZone,
  getPlayerHand,
  setPlayerHand,
  addCardToHand,
  removeCardFromHand,
  getZones,
  setZones,
  getBattlefield
}

export type { GameChange, GameSnapshot, GameState };
export default StoreSystem;