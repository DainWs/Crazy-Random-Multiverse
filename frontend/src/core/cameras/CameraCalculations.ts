import { Point2D } from "@/domain/Geometry";

/**
 * Pure camera math functions, independent of Phaser runtime.
 * Used by CameraSystem to compute HUD positions and camera corners.
 */

interface Bounds2D {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

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

/** The smallest rectangle that holds the points, moved to where the board is drawn. */
function calculateBoundsOfPoints(points: Point2D[], origin: Point2D): Bounds2D {
  const xs = points.map((point) => origin.x + point.x);
  const ys = points.map((point) => origin.y + point.y);

  return { left: Math.min(...xs), top: Math.min(...ys), right: Math.max(...xs), bottom: Math.max(...ys) };
}

/** Moves the scroll the least needed so that the center of the screen stays inside the bounds (VIEW-19). */
function clampScrollToBounds(viewport: CameraViewport, bounds: Bounds2D): Point2D {
  const halfWidth = viewport.screenWidth / 2;
  const halfHeight = viewport.screenHeight / 2;
  const centerX = Math.min(Math.max(viewport.scrollX + halfWidth, bounds.left), bounds.right);
  const centerY = Math.min(Math.max(viewport.scrollY + halfHeight, bounds.top), bounds.bottom);

  return { x: centerX - halfWidth, y: centerY - halfHeight };
}

interface ScreenFixedTransform {
  x: number;
  y: number;
  scale: number;
}

/**
 * An object with scroll factor 0 is not moved by the camera but is still scaled by its zoom around the center
 * of the screen. Placing it at `x + screenX * scale` with that scale makes it show at screenX, at its own size.
 */
function calculateScreenFixedTransform(screenWidth: number, screenHeight: number, zoom: number): ScreenFixedTransform {
  const scale = 1 / zoom;

  return { 
    x: (screenWidth / 2) * (1 - scale), 
    y: (screenHeight / 2) * (1 - scale), 
    scale
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

export type { Bounds2D, ScreenFixedTransform, CameraViewport, CameraConfiguration };
export { calculateHUDPosition, calculateScreenFixedTransform, calculateBoundsOfPoints, clampScrollToBounds, resolveCameraConfiguration, DEFAULT_CAMERA_CONFIGURATION, CAMERA_CONFIGURATIONS };
