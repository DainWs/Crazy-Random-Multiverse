import { describe, expect, it } from 'vitest';
import { calculateNewZoom, DEFAULT_ZOOM_CONFIG } from '@/core/cameras/CameraMovementManager';

describe('CameraMovementManager', () => {
  describe('calculateNewZoom', () => {
    it('zooms in (increases zoom) when deltaY is negative (scroll up)', () => {
      const result = calculateNewZoom(1.0, -1, DEFAULT_ZOOM_CONFIG);
      expect(result).toBeCloseTo(1.15, 5);
    });

    it('zooms out (decreases zoom) when deltaY is positive (scroll down)', () => {
      const result = calculateNewZoom(1.0, 1, DEFAULT_ZOOM_CONFIG);
      expect(result).toBeCloseTo(0.85, 5);
    });

    it('returns null when zoom would exceed max', () => {
      const result = calculateNewZoom(1.5, -1, DEFAULT_ZOOM_CONFIG);
      expect(result).toBeNull();
    });

    it('returns null when zoom would go below min', () => {
      const result = calculateNewZoom(0.2, 1, DEFAULT_ZOOM_CONFIG);
      expect(result).toBeNull();
    });

    it('allows zoom at exact boundary values', () => {
      // Use clean decimals to avoid IEEE 754 rounding: 0.5 - 0.25 = 0.25 exactly
      const config = { step: 0.25, min: 0.25, max: 2.0 };
      const result = calculateNewZoom(0.5, 1, config);
      expect(result).toBeCloseTo(0.25, 5);
    });

    it('respects custom zoom config', () => {
      const config = { step: 0.5, min: 0.1, max: 5.0 };
      const result = calculateNewZoom(2.0, -1, config);
      expect(result).toBeCloseTo(2.5, 5);
    });
  });
});
