import { describe, expect, it } from 'vitest';
import {
  calculateHUDPosition,
  calculateCameraCorners,
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
