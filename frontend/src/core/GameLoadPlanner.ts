import type { CardCode } from "@/domain/Card";
import type { GameResource, ResourceManifest } from "@/domain/Resources";
import { ApiException, EXCEPTION_KEYS } from "@/api/models/ApiException";
import { cardImageKey } from "@/domain/ResourceKeys";

type LoadPlan = {
  /** The load fails if any of these is missing: the fixed resources. */
  required: GameResource[];
  /** Tried, but the load goes on without them: the images of the leaders. */
  optional: GameResource[];
};

const FINAL_REJECTION_KEYS: readonly string[] = [EXCEPTION_KEYS.GAME_NOT_FOUND, EXCEPTION_KEYS.WRONG_GAME, EXCEPTION_KEYS.USER_NOT_FOUND];

/** What the load of a game still has to download (LOAD-2). Anything already loaded is left out, so a retry repeats only what failed. */
const planLoad = (manifest: ResourceManifest, leaders: CardCode[], isLoaded: (key: string) => boolean): LoadPlan => {
  const leaderKeys = new Set(leaders.map((leader) => cardImageKey(leader.type, leader.code)));

  return {
    required: manifest.fixed.filter((resource) => !isLoaded(resource.key)),
    optional: manifest.dynamic.filter((resource) => leaderKeys.has(resource.key) && !isLoaded(resource.key))
  };
}

/** The game is gone, is not the user's, or the session expired: retrying cannot fix it (UI-12). */
const isFinalRejection = (error: unknown): boolean => error instanceof ApiException && FINAL_REJECTION_KEYS.includes(error.key);

export type { LoadPlan };
export { isFinalRejection, planLoad };
