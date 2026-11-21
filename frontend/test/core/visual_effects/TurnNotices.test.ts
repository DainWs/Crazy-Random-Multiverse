import 'phaser';
import { describe, expect, it, vi } from 'vitest';
import Player from '@/domain/Player';
import type { GameScene } from '@/scenes/Game';
import { describeNotices, ELIMINATION_NOTICE_TIMING, playNotice } from '@/core/visual_effects/TurnNotices';

const local = new Player('p-1', 'One');
const rival = new Player('p-2', 'Two');
const players = [local, rival];

describe('describeNotices', () => {
  // VIEW-15
  it('announces a new round and then the turn that starts it', () => {
    const texts = describeNotices({ round: 1, playerWithTurn: 'p-2' }, { round: 2, playerWithTurn: 'p-1' }, 'p-1', players);

    expect(texts).toEqual(['Ronda 2', 'Tu turno']);
  });

  // VIEW-15
  it('announces the name of the rival whose turn starts', () => {
    const texts = describeNotices({ round: 1, playerWithTurn: 'p-1' }, { round: 1, playerWithTurn: 'p-2' }, 'p-1', players);

    expect(texts).toEqual(['Turno de Two']);
  });

  it('announces nothing when neither the round nor the turn changed', () => {
    expect(describeNotices({ round: 1, playerWithTurn: 'p-1' }, { round: 1, playerWithTurn: 'p-1' }, 'p-1', players)).toEqual([]);
  });

  // VIEW-15
  it('announces the first round and turn of a game, which arrive after it starts', () => {
    expect(describeNotices({}, { round: 1, playerWithTurn: 'p-1' }, 'p-1', players)).toEqual(['Ronda 1', 'Tu turno']);
  });

  it('announces nothing when the board has no round or turn yet', () => {
    expect(describeNotices({}, {}, 'p-1', players)).toEqual([]);
  });
});

describe('playNotice', () => {
  const createScene = () => {
    const label = {
      setOrigin: vi.fn(),
      setPadding: vi.fn(),
      setBackgroundColor: vi.fn(),
      setPosition: vi.fn(),
      setScale: vi.fn(),
      setScrollFactor: vi.fn(),
      setDepth: vi.fn(),
      setAlpha: vi.fn(),
      destroy: vi.fn()
    };
    const scene = {
      scale: { width: 1920, height: 1080 },
      cameraSystem: { getCamera: () => ({ zoom: 1 }) },
      add: { text: vi.fn(() => label) },
      events: { once: vi.fn(), off: vi.fn() },
      tweens: { add: vi.fn((config: { onComplete: () => void }) => config.onComplete()) }
    };

    return { label, scene: scene as unknown as GameScene, tweens: scene.tweens };
  };

  // VIEW-15
  it('resolves and removes the text when the tween ends', async () => {
    const { label, scene } = createScene();

    await playNotice(scene, 'Ronda 2');

    expect(label.destroy).toHaveBeenCalledOnce();
  });

  it('fades in for 250 ms, slowing down at the end, and holds for 1000 ms', async () => {
    const { scene, tweens } = createScene();

    await playNotice(scene, 'Ronda 2');

    expect(tweens.add).toHaveBeenNthCalledWith(1, expect.objectContaining({ alpha: 1, duration: 250, completeDelay: 1000, ease: 'Power1' }));
  });

  it('fades out for 250 ms, speeding up', async () => {
    const { scene, tweens } = createScene();

    await playNotice(scene, 'Ronda 2');

    expect(tweens.add).toHaveBeenNthCalledWith(2, expect.objectContaining({ alpha: 0, duration: 250, ease: 'Quad.easeIn' }));
  });

  // VIEW-11
  it('takes the times of the elimination, 1000 ms in, 1000 ms held and 1000 ms out', async () => {
    const { scene, tweens } = createScene();

    await playNotice(scene, 'Two eliminado', ELIMINATION_NOTICE_TIMING);

    expect(tweens.add).toHaveBeenNthCalledWith(1, expect.objectContaining({ duration: 1000, completeDelay: 1000 }));
    expect(tweens.add).toHaveBeenNthCalledWith(2, expect.objectContaining({ duration: 1000 }));
  });

  // VIEW-15
  it('is centered on the screen', async () => {
    const { label, scene } = createScene();

    await playNotice(scene, 'Ronda 2');

    expect(label.setPosition).toHaveBeenCalledWith(960, 540);
  });
});
