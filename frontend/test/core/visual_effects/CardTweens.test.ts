import { describe, expect, it } from 'vitest';
import {
  noneTween,
  hoverTween,
  unhoverTween,
  slideToTween,
  moveToTween,
  previewInZoneSlotTween,
  SLIDE_TO_DURATION,
  MOVE_TO_DURATION,
  PREVIEW_IN_ZONE_SLOT_DURATION
} from '@/core/visual_effects/CardTweens';
import type CardView from '@/game/cards/CardView';

describe('CardTweens', () => {
  const createMockCard = (scaleX = 1, scaleY = 1): CardView => {
    return {
      getOriginalScale: () => ({ scaleX, scaleY })
    } as unknown as CardView;
  };

  describe('noneTween', () => {
    it('returns 0 duration tween preserving original scale', () => {
      const card = createMockCard(1.5, 2.0);
      const tween = noneTween(card);

      expect(tween.targets).toBe(card);
      expect(tween.scaleX).toBe(1.5);
      expect(tween.scaleY).toBe(2.0);
      expect(tween.duration).toBe(0);
      expect(tween.ease).toBe('Linear');
    });
  });

  describe('hoverTween', () => {
    it('scales up card by 3.5%', () => {
      const card = createMockCard(1.0, 1.0);
      const tween = hoverTween(card);

      expect(tween.targets).toBe(card);
      expect(tween.scaleX).toBeCloseTo(1.035, 5);
      expect(tween.scaleY).toBeCloseTo(1.035, 5);
      expect(tween.duration).toBe(150);
      expect(tween.ease).toBe('Power1');
    });

    it('handles uniform scale fallback if scaleY is missing', () => {
      const card = {
        getOriginalScale: () => ({ scaleX: 2.0 })
      } as unknown as CardView;
      const tween = hoverTween(card);

      expect(tween.scaleX).toBeCloseTo(2.07, 5);
      expect(tween.scaleY).toBeCloseTo(2.07, 5);
    });
  });

  describe('unhoverTween', () => {
    it('restores card to original scale', () => {
      const card = createMockCard(1.2, 1.4);
      const tween = unhoverTween(card);

      expect(tween.targets).toBe(card);
      expect(tween.scaleX).toBe(1.2);
      expect(tween.scaleY).toBe(1.4);
      expect(tween.duration).toBe(150);
    });
  });

  describe('slideToTween', () => {
    it('configures x and y target coordinates with slide duration', () => {
      const card = createMockCard();
      const tween = slideToTween(card, [100, 250]);

      expect(tween.targets).toBe(card);
      expect(tween.x).toBe(100);
      expect(tween.y).toBe(250);
      expect(tween.duration).toBe(SLIDE_TO_DURATION);
      expect(tween.ease).toBe('Power1');
    });
  });

  describe('moveToTween', () => {
    it('configures target coordinates with delay and completeDelay', () => {
      const card = createMockCard();
      const tween = moveToTween(card, [300, 400, 50]);

      expect(tween.targets).toBe(card);
      expect(tween.x).toBe(300);
      expect(tween.y).toBe(400);
      expect(tween.delay).toBe(50);
      expect(tween.duration).toBe(MOVE_TO_DURATION);
      expect(tween.completeDelay).toBe(100);
    });
  });

  describe('previewInZoneSlotTween', () => {
    it('handles numeric uniform scale', () => {
      const card = createMockCard();
      const tween = previewInZoneSlotTween(card, [50, 80, 0.6, 15]);

      expect(tween.targets).toBe(card);
      expect(tween.x).toBe(50);
      expect(tween.y).toBe(80);
      expect(tween.scaleX).toBe(0.6);
      expect(tween.scaleY).toBe(0.6);
      expect(tween.angle).toBe(15);
      expect(tween.duration).toBe(PREVIEW_IN_ZONE_SLOT_DURATION);
    });

    it('handles scale object with x and y dimensions', () => {
      const card = createMockCard();
      const tween = previewInZoneSlotTween(card, [120, 220, { x: 0.7, y: 0.8 }, 0]);

      expect(tween.scaleX).toBe(0.7);
      expect(tween.scaleY).toBe(0.8);
      expect(tween.angle).toBe(0);
    });
  });
});
