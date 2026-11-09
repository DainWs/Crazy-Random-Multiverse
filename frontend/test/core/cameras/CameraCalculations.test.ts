import { describe, expect, it } from 'vitest';
import {
  calculateHUDPosition,
  calculateCameraCorners,
  clampScrollToBounds,
  calculateScreenFixedTransform,
  calculateBoundsOfPoints,
  resolveCameraConfiguration,
  DEFAULT_CAMERA_CONFIGURATION
} from '@/core/cameras/CameraCalculations';
import type { CameraViewport } from '@/core/cameras/CameraCalculations';

describe('CameraCalculations', () => {
  const defaultViewport: CameraViewport = {
    scrollX: 0,
    scrollY: 0,
    zoom: 1,
    screenWidth: 1920,
    screenHeight: 1080
  };

  describe('calculateHUDPosition', () => {
    it('returns screen center as-is when scroll is 0 and zoom is 1', () => {
      const result = calculateHUDPosition(defaultViewport, 960, 540);
      expect(result).toEqual({ x: 960, y: 540 });
    });

    it('offsets by scroll position', () => {
      const viewport: CameraViewport = { ...defaultViewport, scrollX: 100, scrollY: 200 };
      const result = calculateHUDPosition(viewport, 960, 540);
      expect(result).toEqual({ x: 1060, y: 740 });
    });

    it('compensates for zoom factor on off-center positions', () => {
      const viewport: CameraViewport = { ...defaultViewport, zoom: 2 };
      // screenX = 0 -> (0 - 960) / 2 + 960 = -480 + 960 = 480
      const result = calculateHUDPosition(viewport, 0, 0);
      expect(result.x).toBeCloseTo(480, 5);
      expect(result.y).toBeCloseTo(270, 5);
    });

    it('returns center unchanged regardless of zoom when screenX/Y are at center', () => {
      const viewport: CameraViewport = { ...defaultViewport, zoom: 0.5 };
      const result = calculateHUDPosition(viewport, 960, 540);
      expect(result).toEqual({ x: 960, y: 540 });
    });
  });

  // UI-3
  describe('calculateScreenFixedTransform', () => {
    it('does not move or scale anything at zoom 1', () => {
      expect(calculateScreenFixedTransform(1920, 1080, 1)).toEqual({ x: 0, y: 0, scale: 1 });
    });

    it('scales against the zoom', () => {
      expect(calculateScreenFixedTransform(1920, 1080, 0.5).scale).toBe(2);
    });

    it('keeps the center of the screen where it is', () => {
      const { x, y, scale } = calculateScreenFixedTransform(1920, 1080, 0.65);

      expect([x + 960 * scale, y + 540 * scale].map((value) => Math.round(value))).toEqual([960, 540]);
    });
  });

  // VIEW-19
  describe('calculateBoundsOfPoints', () => {
    const points = [{ x: -300, y: -200 }, { x: 300, y: -200 }, { x: -500, y: 400 }, { x: 500, y: 400 }];

    it('holds all the points', () => {
      expect(calculateBoundsOfPoints(points, { x: 0, y: 0 })).toEqual({ left: -500, top: -200, right: 500, bottom: 400 });
    });

    it('moves to where the board is drawn', () => {
      expect(calculateBoundsOfPoints(points, { x: 1000, y: 100 })).toEqual({ left: 500, top: -100, right: 1500, bottom: 500 });
    });
  });

  // VIEW-19
  describe('clampScrollToBounds', () => {
    const bounds = { left: -500, top: -300, right: 500, bottom: 300 };
    // The center of the screen is (scrollX + 960, scrollY + 540)
    const centeredOn = (x: number, y: number): CameraViewport => ({ ...defaultViewport, scrollX: x - 960, scrollY: y - 540 });

    it('keeps the scroll when the center is inside the bounds', () => {
      const result = clampScrollToBounds(centeredOn(100, -50), bounds);

      expect(result).toEqual({ x: 100 - 960, y: -50 - 540 });
    });

    it('keeps the scroll when the center is on the edge', () => {
      const result = clampScrollToBounds(centeredOn(500, 300), bounds);

      expect(result).toEqual({ x: 500 - 960, y: 300 - 540 });
    });

    it('moves the center back to the right edge when it goes past it', () => {
      const result = clampScrollToBounds(centeredOn(900, 0), bounds);

      expect(result.x).toBe(500 - 960);
    });

    it('moves the center back to the left edge when it goes past it', () => {
      const result = clampScrollToBounds(centeredOn(-900, 0), bounds);

      expect(result.x).toBe(-500 - 960);
    });

    it('moves the center back to the top and bottom edges', () => {
      const top = clampScrollToBounds(centeredOn(0, -900), bounds);
      const bottom = clampScrollToBounds(centeredOn(0, 900), bounds);

      expect([top.y, bottom.y]).toEqual([-300 - 540, 300 - 540]);
    });

    it('clamps each axis on its own', () => {
      const result = clampScrollToBounds(centeredOn(900, 100), bounds);

      expect(result.y).toBe(100 - 540);
    });

    it('does not depend on the zoom', () => {
      const result = clampScrollToBounds({ ...centeredOn(900, 0), zoom: 0.5 }, bounds);

      expect(result.x).toBe(500 - 960);
    });
  });

  describe('calculateCameraCorners', () => {
    it('returns full screen corners at zoom 1', () => {
      const corners = calculateCameraCorners(defaultViewport);
      expect(corners.tl).toEqual({ x: 0, y: 0 });
      expect(corners.tr).toEqual({ x: 1920, y: 0 });
      expect(corners.bl).toEqual({ x: 0, y: 1080 });
      expect(corners.br).toEqual({ x: 1920, y: 1080 });
    });

    it('expands visible area when zoomed out', () => {
      const viewport: CameraViewport = { ...defaultViewport, zoom: 0.5 };
      const corners = calculateCameraCorners(viewport);
      // width = 1920 / 0.5 = 3840, x = (1920 - 3840) / 2 = -960
      expect(corners.tl.x).toBeCloseTo(-960, 5);
      expect(corners.br.x).toBeCloseTo(2880, 5);
    });

    it('shrinks visible area when zoomed in', () => {
      const viewport: CameraViewport = { ...defaultViewport, zoom: 2 };
      const corners = calculateCameraCorners(viewport);
      // width = 1920 / 2 = 960, x = (1920 - 960) / 2 = 480
      expect(corners.tl.x).toBeCloseTo(480, 5);
      expect(corners.br.x).toBeCloseTo(1440, 5);
    });
  });

  describe('resolveCameraConfiguration', () => {
    it('returns specific config for known player counts', () => {
      const config1 = resolveCameraConfiguration(1);
      expect(config1.zoom).toBe(1.1);
      expect(config1.yOffset).toBe(-100);

      const config4 = resolveCameraConfiguration(4);
      expect(config4.zoom).toBe(0.52);
      expect(config4.yOffset).toBe(180);
    });

    it('returns default config for unknown player count', () => {
      const config = resolveCameraConfiguration(99);
      expect(config).toEqual(DEFAULT_CAMERA_CONFIGURATION);
    });
  });
});
