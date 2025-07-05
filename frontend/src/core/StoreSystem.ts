import Player from "@/domain/Player";
import User from "@/domain/User";
import Zone from "@/domain/Zone";
import * as ExternalStoreApi from "@/api/LocalStorageApi";
import GameCode from "@/domain/GameCode";
import Card from "@/domain/Card";

type PlayerHand = Card[];
type PlayerZone = Zone;
type Zones = Zone[];

type Store = {
  user?: User;
  player?: Player;
  playerHand?: PlayerHand;
  playerZone?: PlayerZone;
  zones?: Zones;
  currentGameCode?: GameCode;
}

const store: Store = {};

function getGameCode(): GameCode | null {
  return store.currentGameCode || null;
}

function setGameCode(gameCode: GameCode): void {
  store.currentGameCode = gameCode;
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

function getPlayer(): Player {
  if (!store.player) {
    const user = getUser();
    store.player = new Player(user.code, user.name);
  }

  return store.player;
}

function getPlayerHand(): PlayerHand {
  if (!store.playerHand) {
    store.playerHand = ExternalStoreApi.loadHand();
  }

  return store.playerHand;
}

function setPlayerHand(hand: PlayerHand): void {
  store.playerHand = hand;
  ExternalStoreApi.saveHand(hand);
}

function getPlayerZone(): PlayerZone {
  if (!store.playerZone) {
    const player = getPlayer();
    store.playerZone = new Zone(player, 'BASE');
  }

  return store.playerZone;
}

function setPlayerZone(zone: PlayerZone): void {
  store.playerZone = zone;
}

function getZones(): Zones {
  if (!store.zones) {
    store.zones = [];
  }

  return store.zones;
}

function setZones(zones: Zones): void {
  store.zones = zones;
}

const StoreSystem = {
  getGameCode,
  setGameCode,
  getUser,
  setUser,
  getPlayer,
  getPlayerHand,
  setPlayerHand,
  getPlayerZone,
  setPlayerZone,
  getZones,
  setZones
}

export default StoreSystem;