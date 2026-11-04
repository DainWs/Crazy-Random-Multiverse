import ResourceSystem from "@/core/ResourceSystem";
import { UNKNOWN_CARD_KEY } from "@/domain/ResourceKeys";

/** Shows card.unknown until the image of the card arrives, and swaps it in when it does (UI-21). */
const createCardArtwork = (scene: Phaser.Scene, imageKey: string, x: number, y: number, size: number): Phaser.GameObjects.Image => {
  const isLoaded = scene.textures.exists(imageKey);

  const artwork = scene.add.image(x, y, isLoaded ? imageKey : UNKNOWN_CARD_KEY);
  artwork.setDisplaySize(size, size);
  artwork.setOrigin(0.5, 0.5);

  if (!isLoaded) {
    void ResourceSystem.loadImage(scene, imageKey).then((available) => {
      if (!available || !artwork.active) return;

      artwork.setTexture(imageKey);
      artwork.setDisplaySize(size, size);
    });
  }

  return artwork;
}

export { createCardArtwork };
