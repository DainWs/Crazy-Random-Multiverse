import { beforeEach, describe, expect, it, vi } from 'vitest';
import Phaser from 'phaser';
import ResourceSystem, { IMAGE_XHR_SETTINGS } from '@/core/ResourceSystem';

// UI-21
describe('ResourceSystem', () => {
  let loaded: Set<string>;
  let load: Phaser.Events.EventEmitter & { image: ReturnType<typeof vi.fn>; start: ReturnType<typeof vi.fn> };
  let events: Phaser.Events.EventEmitter;
  let scene: Phaser.Scene;

  const completeFile = (key: string) => load.emit(`filecomplete-image-${key}`);
  const failFile = (key: string) => load.emit('loaderror', { key });

  beforeEach(() => {
    loaded = new Set();
    load = Object.assign(new Phaser.Events.EventEmitter(), { image: vi.fn(), start: vi.fn() });
    events = new Phaser.Events.EventEmitter();
    scene = { load, events, textures: { exists: (key: string) => loaded.has(key) } } as unknown as Phaser.Scene;

    ResourceSystem.registerDynamic([
      { key: 'warrior.rare.4', type: 'IMAGE', url: '/resources/cards/warrior/rare/4.png' },
      { key: 'warrior.rare.4.put', type: 'AUDIO', url: '/resources/cards/warrior/rare/4/put.mp3' }
    ]);
  });

  describe('loadImage', () => {
    it('resolves true without downloading an image that is already loaded', async () => {
      loaded.add('warrior.rare.4');

      const available = await ResourceSystem.loadImage(scene, 'warrior.rare.4');

      expect(available).toBe(true);
      expect(load.image).not.toHaveBeenCalled();
    });

    it('resolves false without downloading an image the manifest does not list', async () => {
      const available = await ResourceSystem.loadImage(scene, 'warrior.rare.9');

      expect(available).toBe(false);
      expect(load.image).not.toHaveBeenCalled();
    });

    it('downloads the image from the url of the manifest and starts the loader', async () => {
      const request = ResourceSystem.loadImage(scene, 'warrior.rare.4');

      expect(load.image).toHaveBeenCalledWith('warrior.rare.4', '/resources/cards/warrior/rare/4.png', IMAGE_XHR_SETTINGS);
      expect(load.start).toHaveBeenCalledTimes(1);

      completeFile('warrior.rare.4');
      await request;
    });

    it('resolves true when the file is loaded', async () => {
      const request = ResourceSystem.loadImage(scene, 'warrior.rare.4');

      completeFile('warrior.rare.4');

      expect(await request).toBe(true);
    });

    it('resolves false when the file fails', async () => {
      const request = ResourceSystem.loadImage(scene, 'warrior.rare.4');

      failFile('warrior.rare.4');

      expect(await request).toBe(false);
    });

    it('ignores the failure of another file', async () => {
      const request = ResourceSystem.loadImage(scene, 'warrior.rare.4');

      failFile('warrior.rare.9');
      completeFile('warrior.rare.4');

      expect(await request).toBe(true);
    });

    it('resolves false when the scene shuts down during the download', async () => {
      const request = ResourceSystem.loadImage(scene, 'warrior.rare.4');

      events.emit('shutdown');

      expect(await request).toBe(false);
    });

    it('shares one download between simultaneous requests', async () => {
      const first = ResourceSystem.loadImage(scene, 'warrior.rare.4');
      const second = ResourceSystem.loadImage(scene, 'warrior.rare.4');

      completeFile('warrior.rare.4');

      expect(await first).toBe(true);
      expect(await second).toBe(true);
      expect(load.image).toHaveBeenCalledTimes(1);
    });

    // UI-21
    it('does not request a failed image again', async () => {
      const failed = ResourceSystem.loadImage(scene, 'warrior.rare.4');
      failFile('warrior.rare.4');
      await failed;

      const again = await ResourceSystem.loadImage(scene, 'warrior.rare.4');

      expect([again, load.image.mock.calls.length]).toEqual([false, 1]);
    });

    it('requests a failed image again after retry', async () => {
      const failed = ResourceSystem.loadImage(scene, 'warrior.rare.4');
      failFile('warrior.rare.4');
      await failed;
      ResourceSystem.retry('warrior.rare.4');

      const again = ResourceSystem.loadImage(scene, 'warrior.rare.4');

      expect(load.image).toHaveBeenCalledTimes(2);

      completeFile('warrior.rare.4');
      await again;
    });

    it('stops listening to the loader once the download ends', async () => {
      const request = ResourceSystem.loadImage(scene, 'warrior.rare.4');
      completeFile('warrior.rare.4');
      await request;

      expect(load.listenerCount('loaderror')).toBe(0);
      expect(load.listenerCount('filecomplete-image-warrior.rare.4')).toBe(0);
      expect(events.listenerCount('shutdown')).toBe(0);
    });
  });

  // UI-21
  describe('trackBoard', () => {
    const failOnce = async () => {
      const failed = ResourceSystem.loadImage(scene, 'warrior.rare.4');
      failFile('warrior.rare.4');
      await failed;
    };

    it('does not retry a failed image while the board has the same copies', async () => {
      ResourceSystem.trackBoard(['warrior.rare.4']);
      await failOnce();

      ResourceSystem.trackBoard(['warrior.rare.4']);

      expect(await ResourceSystem.loadImage(scene, 'warrior.rare.4')).toBe(false);
    });

    it('retries a failed image when the board gets one more copy', async () => {
      ResourceSystem.trackBoard(['warrior.rare.4']);
      await failOnce();

      ResourceSystem.trackBoard(['warrior.rare.4', 'warrior.rare.4']);
      const again = ResourceSystem.loadImage(scene, 'warrior.rare.4');

      expect(load.image).toHaveBeenCalledTimes(2);
      completeFile('warrior.rare.4');
      await again;
    });

    it('retries a failed image when it appears on an empty board', async () => {
      await failOnce();

      ResourceSystem.trackBoard(['warrior.rare.4']);
      const again = ResourceSystem.loadImage(scene, 'warrior.rare.4');

      expect(load.image).toHaveBeenCalledTimes(2);
      completeFile('warrior.rare.4');
      await again;
    });

    it('does not retry a failed image when another card enters', async () => {
      ResourceSystem.trackBoard(['warrior.rare.4']);
      await failOnce();

      ResourceSystem.trackBoard(['warrior.rare.4', 'warrior.rare.5']);

      expect(await ResourceSystem.loadImage(scene, 'warrior.rare.4')).toBe(false);
    });
  });

  describe('registerDynamic', () => {
    it('does not download an audio', async () => {
      const available = await ResourceSystem.loadImage(scene, 'warrior.rare.4.put');

      expect(available).toBe(false);
    });

    it('forgets the resources of the previous game', async () => {
      ResourceSystem.registerDynamic([]);

      const available = await ResourceSystem.loadImage(scene, 'warrior.rare.4');

      expect(available).toBe(false);
    });
  });
});
