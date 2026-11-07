import type { ResourceManifest } from "@/domain/Resources";
import type { ResourceManifestDto } from "@/api/dtos/ResourceManifestDto";
import type { GameCode } from "@/domain/GameConfiguration";
import type Action from "@/domain/Action";
import type { ActionType } from "@/domain/Action";
import { toActionDto } from "@/api/dtos/ActionDto";
import { toResourceManifest } from "@/api/dtos/ResourceManifestDto";
import { toBase64UrlSafe } from "@/api/models/Codification";
import { checkResponse } from "@/api/models/ApiException";

/** Resolves once the server accepts the action; the state changes with its events (CON-17). */
const sendPlayerAction = async (actionType: ActionType, action: Action, rowCount: number) => {
  const gameCodePath = toBase64UrlSafe(action.game);
  const actionDto = toActionDto(actionType, action, rowCount);
  const body = JSON.stringify(actionDto);
  const response = await fetch(`/game/${gameCodePath}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });
  await checkResponse(response);
}

const loadGameResourceManifest = async (gameCode: GameCode): Promise<ResourceManifest> => {
  const response = await fetch(`/game/${toBase64UrlSafe(gameCode)}/resources`);
  await checkResponse(response);
  const body: ResourceManifestDto = await response.json();
  return toResourceManifest(body);
}

const sendReady = async (gameCode: GameCode) => {
  const response = await fetch(`/game/${toBase64UrlSafe(gameCode)}/ready`, { method: 'POST' });
  await checkResponse(response);
}

export {
  sendPlayerAction,
  sendReady,
  loadGameResourceManifest
};
