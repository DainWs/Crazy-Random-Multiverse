import type { PlayerCode } from "@/domain/Player";
import type { UserCode } from "@/domain/User";
import type Player from "@/domain/Player";
import type User from "@/domain/User";
import type Zone from "@/domain/Zone";
import type GameConfiguration from "@/domain/GameConfiguration";
import type Card from "@/domain/Card";
import type { CardCode } from "@/domain/Card";
import type Battlefield from "@/domain/Battlefield";
import type { CombatResult } from "@/domain/CombatResult";
import type { CancelListenerCallback, Listener } from "@/api/models/Listeners";
import { localStorageApi as ExternalStoreApi } from "@/api";
import { notifyListeners } from "@/api/models/Listeners";

type SessionCode = UserCode | PlayerCode;

type PlayerHand = Card[];
type PlayerZone = Zone;

/** How the game ended: the winner is known with the event that names them (WIN-3). */
type GameResult = {
  winner?: Player;
}

type GameState = {
  gameConfiguration: GameConfiguration;
  battlefield: Battlefield;
  round?: number;
  playerWithTurn?: PlayerCode;

  zones: Zone[];
  player: Player;
  playerZone: PlayerZone;
  playerHand: PlayerHand;
  result?: GameResult;
}

/** What a GameDto carries: the hand and the result do not travel in every event (CON-11, WIN-3). */
type GameSnapshot = Omit<GameState, 'playerHand' | 'result'>;

/** What changed in the game state: the views draw the zones again, restore the hand without animating it, animate the cards that came or went, or show the result. */
type GameChange = 'GAME_UPDATED' | 'HAND_RESTORED' | 'HAND_CHANGED' | 'GAME_ENDED';

/** What a listener receives: the kind of change and the snapshot of the state right after it, so the views can draw that state later (CON-12). */
type GameChangeEvent = {
  change: GameChange;
  snapshot: GameSnapshot;
  combat?: CombatResult;
}

type Store = {
  user?: User;
  gameState?: GameState;
}

const store: Store = {};
const changeListeners = new Set<Listener<GameChangeEvent>>();

function onChange(listener: Listener<GameChangeEvent>): CancelListenerCallback {
  changeListeners.add(listener);
  return () => changeListeners.delete(listener);
}

function notifyChange(change: GameChange, snapshot: GameSnapshot = store.gameState!, combat?: CombatResult) {
  notifyListeners(changeListeners, 'game change listener', { change, snapshot, combat });
}

/** Replaces the state with the one the server sent, and keeps the hand and the result of the same game, which the snapshots do not replace. `combat` is the attack that led to it. */
function applyGame(snapshot: GameSnapshot, combat?: CombatResult) {
  const previous = store.gameState;
  const isSameGame = previous?.gameConfiguration.gameCode === snapshot.gameConfiguration.gameCode;
  const playerHand = (isSameGame && previous?.playerHand) || [];
  const result = isSameGame ? previous?.result : undefined;

  store.gameState = { ...snapshot, playerHand, result };
  notifyChange('GAME_UPDATED', snapshot, combat);
}

/** The server decided the end of the game, so nobody acts any more (WIN-3, WIN-4). */
function endGame() {
  const gameState = store.gameState!;
  gameState.result = gameState.result ?? {};
  notifyChange('GAME_ENDED');
}

function setWinner(winner: Player) {
  const gameState = store.gameState!;
  gameState.result = { ...gameState.result, winner };
  notifyChange('GAME_ENDED');
}

function getResult(): GameResult | undefined {
  return store.gameState?.result;
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

/** Whether the interface treats the local player as a spectator: eliminated, or watching without having played (UI-8, SPEC-1). */
function isPlayerSpectator(): boolean {
  const player = getPlayer();
  return !player.isAlive || player.isSpectator;
}

/** Whether the local player holds the turn and can still act: not a spectator and before the game ends (UI-4, ELIM-2, WIN-4). */
function canPlayerAct(): boolean {
  return !isPlayerSpectator() && !store.gameState?.result && store.gameState?.playerWithTurn === getPlayer().code;
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
  endGame,
  setWinner,
  getResult,
  clearGame,
  getSessionCode,
  isSessionCode,
  getUser,
  setUser,
  getGameConfiguration,
  getRound,
  isPlayerSpectator,
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

export type { GameChange, GameChangeEvent, GameResult, GameSnapshot, GameState };
export default StoreSystem;