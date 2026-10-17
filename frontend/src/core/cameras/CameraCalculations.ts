import { Corners2D, Point2D } from "@/domain/Geometry";

/**
 * Pure camera math functions, independent of Phaser runtime.
 * Used by CameraSystem to compute HUD positions and camera corners.
 */

interface CameraViewport {
  scrollX: number;
  scrollY: number;
  zoom: number;
  screenWidth: number;
  screenHeight: number;
}

function calculateHUDPosition(viewport: CameraViewport, screenX: number, screenY: number): Point2D {
  const centerX = viewport.screenWidth / 2;
  const centerY = viewport.screenHeight / 2;

  return {
    x: viewport.scrollX + (screenX - centerX) / viewport.zoom + centerX,
    y: viewport.scrollY + (screenY - centerY) / viewport.zoom + centerY
  };
}

function calculateCameraCorners(viewport: CameraViewport): Corners2D {
  const width = viewport.screenWidth / viewport.zoom;
  const height = viewport.screenHeight / viewport.zoom;
  const x = (viewport.screenWidth - width) / 2;
  const y = (viewport.screenHeight - height) / 2;

  return {
    tl: { x, y },
    tr: { x: x + width, y },
    bl: { x, y: y + height },
    br: { x: x + width, y: y + height }
  };
}

type MaxPlayersPerSide = number;
type CameraConfiguration = {
  zoom: number;
  yOffset: number;
};

const DEFAULT_CAMERA_CONFIGURATION: CameraConfiguration = { zoom: 0.40, yOffset: 0 };

const CAMERA_CONFIGURATIONS = new Map<MaxPlayersPerSide, CameraConfiguration>();
CAMERA_CONFIGURATIONS.set(1, { zoom: 1.1, yOffset: -100 });
CAMERA_CONFIGURATIONS.set(2, { zoom: 0.85, yOffset: -60 });
CAMERA_CONFIGURATIONS.set(3, { zoom: 0.65, yOffset: 50 });
CAMERA_CONFIGURATIONS.set(4, { zoom: 0.52, yOffset: 180 });

function resolveCameraConfiguration(maxPlayersPerSide: number): CameraConfiguration {
  return CAMERA_CONFIGURATIONS.get(maxPlayersPerSide) || DEFAULT_CAMERA_CONFIGURATION;
}

export type { CameraViewport, CameraConfiguration };
export { calculateHUDPosition, calculateCameraCorners, resolveCameraConfiguration, DEFAULT_CAMERA_CONFIGURATION, CAMERA_CONFIGURATIONS };
