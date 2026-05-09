import Player from "@/domain/Player";
import User from "@/domain/User";
import Zone from "@/domain/Zone";
import * as ExternalStoreApi from "@/api/LocalStorageApi";
import GameConfiguration from "@/domain/GameConfiguration";
import Card from "@/domain/Card";
import Battlefield from "@/domain/Battlefield";


type PlayerHand = Card[];
type PlayerZone = Zone;

type GameState = {
  gameConfiguration: GameConfiguration;
  battlefield: Battlefield;
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