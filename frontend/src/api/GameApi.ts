import type { GameResources } from "@/domain/Resources";
import type { GameCode } from "@/domain/GameConfiguration";
import type Action from "@/domain/Action";
import { toBase64UrlSafe } from "@/api/models/Codification";

const sendPassTurnAction = async (gameCode: GameCode) => {
  console.log(`Sending pass turn action: ${gameCode}`);

  // await sendAction(null);
}

const sendAction = async (action: Action) => {
  console.log(`Sending action: ${action}`);
}

const loadGameResourceManifest = async (gameCode: GameCode): Promise<GameResources> => {
  const response = await fetch(`/game/${toBase64UrlSafe(gameCode)}/resources`);
  return await response.json();
}

const sendReady = async (gameCode: GameCode) => {
  await fetch(`/game/${gameCode}/ready`, { method: 'POST' });
}

export {
  sendAction,
  sendPassTurnAction,
  sendReady,
  loadGameResourceManifest
};