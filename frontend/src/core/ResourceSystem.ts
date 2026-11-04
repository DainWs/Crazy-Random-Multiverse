import type { GameResource } from "@/domain/Resources";
import { RESOURCE_LOAD_TIMEOUT_MS } from "@/core/Constants";

/** A manifest image that does not arrive in time counts as failed (LOAD-7). */
const IMAGE_XHR_SETTINGS: Phaser.Types.Loader.XHRSettingsObject = { responseType: 'blob', timeout: RESOURCE_LOAD_TIMEOUT_MS };

const dynamicUrls = new Map<string, string>();
const downloads = new Map<string, Promise<boolean>>();

/** Name of the event Phaser emits when the image with that key has been loaded. */
const fileCompleteEvent = (key: string) => `filecomplete-image-${key}`;

/** Keeps where each dynamic image of the game is, to download it when a card needs it (UI-21). */
const registerDynamic = (resources: GameResource[]) => {
  dynamicUrls.clear();
  for (const resource of resources) {
    if (resource.type === 'IMAGE') dynamicUrls.set(resource.key, resource.url);
  }
}

const download = (scene: Phaser.Scene, key: string, url: string): Promise<boolean> =>
  new Promise((resolve) => {
    const finish = (loaded: boolean) => {
      scene.load.off(fileCompleteEvent(key), onComplete);
      scene.load.off('loaderror', onError);
      scene.events.off('shutdown', onShutdown);
      resolve(loaded);
    };
    const onComplete = () => finish(true);
    const onError = (file: Phaser.Loader.File) => {
      if (file.key === key) finish(false);
    };
    const onShutdown = () => finish(false);

    scene.load.on(fileCompleteEvent(key), onComplete);
    scene.load.on('loaderror', onError);
    scene.events.once('shutdown', onShutdown);
    scene.load.image(key, url, IMAGE_XHR_SETTINGS);
    scene.load.start();
  });

/**
 * Makes sure the image of a card is in the scene, downloading it if it is not there yet (UI-21).
 * Resolves with whether it is available: an image the manifest does not list, or that fails to download, is not, and the next request tries again.
 */
const loadImage = (scene: Phaser.Scene, key: string): Promise<boolean> => {
  if (scene.textures.exists(key)) return Promise.resolve(true);

  const url = dynamicUrls.get(key);
  if (url === undefined) return Promise.resolve(false);

  const inFlight = downloads.get(key);
  if (inFlight) return inFlight;

  const request = download(scene, key, url).finally(() => downloads.delete(key));
  downloads.set(key, request);
  return request;
}

const ResourceSystem = {
  registerDynamic,
  loadImage
};

export { IMAGE_XHR_SETTINGS };
export default ResourceSystem;
