import type { GameResource } from "@/domain/Resources";
import { RESOURCE_LOAD_TIMEOUT_MS } from "@/core/Constants";

/** A manifest image that does not arrive in time counts as failed (LOAD-7). */
const IMAGE_XHR_SETTINGS: Phaser.Types.Loader.XHRSettingsObject = { responseType: 'blob', timeout: RESOURCE_LOAD_TIMEOUT_MS };

const dynamicUrls = new Map<string, string>();
const downloads = new Map<string, Promise<boolean>>();

/** Keeps where each dynamic image of the game is, to download it when a card needs it (UI-21). */
const registerDynamic = (resources: GameResource[]) => {
  dynamicUrls.clear();
  for (const resource of resources) {
    if (resource.type === 'IMAGE') {
      dynamicUrls.set(resource.key, resource.url);
    }
  }
};

/**
 * Makes sure the image of a card is in the scene, downloading it if it is not there yet (UI-21).
 * Resolves with whether it is available: an image the manifest does not list, or that fails to download, is not, and the next request tries again.
 */
const loadImage = (scene: Phaser.Scene, key: string): Promise<boolean> => {
  const url = dynamicUrls.get(key);
  let request = downloads.get(key);

  if (scene.textures.exists(key)) {
    request = Promise.resolve(true);
  } else if (url === undefined) {
    request = Promise.resolve(false);
  } else if (request === undefined) {
    request = download(scene, key, url).finally(() => downloads.delete(key));
    downloads.set(key, request);
  }

  return request;
};

function download(scene: Phaser.Scene, key: string, url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const finish = (loaded: boolean) => {
      scene.load.off(fileCompleteEvent(key), onComplete);
      scene.load.off('loaderror', onError);
      scene.events.off('shutdown', onShutdown);
      resolve(loaded);
    };
    const onComplete = () => finish(true);
    const onError = (file: Phaser.Loader.File) => {
      if (file.key === key) {
        finish(false);
      }
    };
    const onShutdown = () => finish(false);

    scene.load.on(fileCompleteEvent(key), onComplete);
    scene.load.on('loaderror', onError);
    scene.events.once('shutdown', onShutdown);
    scene.load.image(key, url, IMAGE_XHR_SETTINGS);
    scene.load.start();
  });
}

/** Name of the event Phaser emits when the image with that key has been loaded. */
function fileCompleteEvent(key: string): string {
  return `filecomplete-image-${key}`;
}

const ResourceSystem = {
  registerDynamic,
  loadImage
};

export { IMAGE_XHR_SETTINGS };
export default ResourceSystem;
