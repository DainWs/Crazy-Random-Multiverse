import { describe, expect, it } from 'vitest';
import resolveTween, { OverlayTween } from '@/core/visual_effects/OverlayTweens';

describe('OverlayTweens', () => {
  const mockOverlay = {} as Phaser.GameObjects.GameObject;

  it('generates appear tween with fade-in alpha', () => {
    const config = resolveTween(mockOverlay, 'appear');
    expect(config.targets).toBe(mockOverlay);
    expect(config.alpha).toEqual({ from: 0, to: 0.6 });
    expect(config.duration).toBe(200);
    expect(config.ease).toBe('Power1');
  });

  it('generates disappear tween with alpha 0', () => {
    const config = resolveTween(mockOverlay, 'disappear');
    expect(config.targets).toBe(mockOverlay);
    expect(config.alpha).toBe(0);
    expect(config.duration).toBe(500);
  });

  it('generates hover tween with 1.035 scale', () => {
    const config = resolveTween(mockOverlay, 'hover');
    expect(config.scale).toBe(1.035);
    expect(config.duration).toBe(150);
  });

  it('generates unhover tween with 1.0 scale', () => {
    const config = resolveTween(mockOverlay, 'unhover');
    expect(config.scale).toBe(1);
    expect(config.duration).toBe(150);
  });

  it('generates heartbeat tween with yoyo and infinite loop', () => {
    const config = resolveTween(mockOverlay, 'heartbeat');
    expect(config.alpha).toBe(1);
    expect(config.yoyo).toBe(true);
    expect(config.loop).toBe(Number.MAX_VALUE);
    expect(config.duration).toBe(2000);
  });

  it('falls back to noneTween when unknown tween type is given', () => {
    const config = resolveTween(mockOverlay, 'unknown' as OverlayTween);
    expect(config.targets).toBe(mockOverlay);
    expect(config.scale).toBe(1);
    expect(config.duration).toBe(0);
    expect(config.ease).toBe('Linear');
  });
});
