import type { PlayerCode } from "@/domain/Player";
import type { UserCode } from "@/domain/User";
import type Player from "@/domain/Player";
import type User from "@/domain/User";
import type Zone from "@/domain/Zone";
import type GameConfiguration from "@/domain/GameConfiguration";
import type Card from "@/domain/Card";
import type Battlefield from "@/domain/Battlefield";
import { localStorageApi as ExternalStoreApi } from "@/api";

type SessionCode = UserCode | PlayerCode;

type PlayerHand = Card[];
type PlayerZone = Zone;

type GameState = {
  gameConfiguration: GameConfiguration;
  battlefield: Battlefield;
  turn: number; // TODO manage turns
  round: number; // TODO manage round

  zones: Zone[];
  player: Player;
  playerZone: PlayerZone;
  playerHand: PlayerHand;
}

type Store = {
  user?: User;
  gameState?: GameState;
}

const store: Store = {};

function initializeGame(gameState: GameState) {
  store.gameState = gameState;
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

function getPlayer(): Player {
  if (!store.gameState?.player) {
    throw new Error('Game not initialized');
  }

  return store.gameState.player;
}

function getPlayerHand(): PlayerHand {
  if (!store.gameState?.playerHand) {
    throw new Error('Game not initialized');
  }

  return store.gameState.playerHand;
}

function setPlayerHand(playerHand: PlayerHand): void {
  store.gameState!.playerHand = playerHand;
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
  initializeGame,
  getSessionCode,
  isSessionCode,
  getUser,
  setUser,
  getGameConfiguration,
  getPlayer,
  getPlayerZone,
  setPlayerZone,
  getPlayerHand,
  setPlayerHand,
  getZones,
  setZones,
  getBattlefield
}

export type { GameState };
export default StoreSystem;