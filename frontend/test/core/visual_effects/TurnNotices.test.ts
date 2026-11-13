import 'phaser';
import { describe, expect, it, vi } from 'vitest';
import Player from '@/domain/Player';
import type { GameScene } from '@/scenes/Game';
import { describeNotices, playNotice } from '@/core/visual_effects/TurnNotices';

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

  it('fades in, holds and fades out with one tween', async () => {
    const { scene, tweens } = createScene();

    await playNotice(scene, 'Ronda 2');

    expect(tweens.add).toHaveBeenCalledWith(expect.objectContaining({ alpha: 1, yoyo: true }));
  });
});
