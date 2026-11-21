import type { CameraFrame } from "@/core/cameras/BoardCameraStrategy";
import { Point2D, Size2D } from "@/domain/Geometry";

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
function calculateScreenFixedTransform(screenWidth: number, screenHeight: number, zoom: number, pixelRatio = 1): ScreenFixedTransform {
  return {
    x: pixelRatio * (screenWidth / 2) * (1 - 1 / zoom),
    y: pixelRatio * (screenHeight / 2) * (1 - 1 / zoom),
    scale: pixelRatio / zoom
  };
}

/** The size of the screen in the pixels the interface is written in, which are those of the window: the canvas has `pixelRatio` of its own for each one. */
function toLogicalScreen(screen: Size2D, pixelRatio: number): Size2D {
  return { width: screen.width / pixelRatio, height: screen.height / pixelRatio };
}

/** The scroll with which a camera of zoom `pixelRatio` shows the pixel (0, 0) of the window at the corner of the canvas, so a scene can be written in the pixels of the window. */
function calculateLogicalScroll(screen: Size2D, pixelRatio: number): Point2D {
  return { x: (screen.width / 2) * (1 / pixelRatio - 1), y: (screen.height / 2) * (1 / pixelRatio - 1) };
}

/** The screen the board and the camera configurations are tuned for. */
const REFERENCE_SCREEN: Size2D = { width: 1920, height: 1080 };
/** Where the battlefield sits on the reference screen, as a fraction of its height. */
const BOARD_ORIGIN_HEIGHT_RATIO = 0.3;

/** How much the zoom shrinks or grows so that what fits the reference screen also fits `screen` (VIEW-24). */
function calculateScreenFit(screen: Size2D): number {
  return Math.min(screen.width / REFERENCE_SCREEN.width, screen.height / REFERENCE_SCREEN.height);
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

/**
 * Room the top-down camera keeps above and below the table (VIEW-57). `top` and `bottom` are in px of the window, which do not
 * change with its size, like the hand at rest and the HUD. `labelDepth` is how far the labels of a zone can reach past its outer
 * edge, in px of the reference screen, which grow and shrink with the window like the labels (VIEW-49).
 */
interface TopDownReserves {
  top: number;
  bottom: number;
  labelDepth: number;
}

/** The table as the top-down camera draws it: `boardBounds` and `zoneEdgeMargin` in units of the world, `screen` in px of the canvas. */
interface TopDownFraming {
  screen: Size2D;
  boardBounds: Bounds2D;
  zoneEdgeMargin: number;
  pixelRatio: number;
  reserves: TopDownReserves;
}

/**
 * Frames the whole table and the labels of its zones between the reserves, centered (VIEW-57). The table is square and the
 * screen is wider than tall, so the height is what limits it. A label sticks out of the table when it reaches further than
 * the margin between the zones and the edge, which grows with the zoom.
 */
function calculateTopDownFrame({ screen, boardBounds, zoneEdgeMargin, pixelRatio, reserves }: TopDownFraming): CameraFrame {
  const labelReach = reserves.labelDepth * calculateScreenFit(screen);
  const top = reserves.top * pixelRatio;
  const bottom = reserves.bottom * pixelRatio;
  const available = screen.height - top - bottom;
  const tableHeight = boardBounds.bottom - boardBounds.top;

  const zoomWithoutOverflow = available / tableHeight;
  const labelsStickOut = labelReach > zoneEdgeMargin * zoomWithoutOverflow;
  const zoom = labelsStickOut ? (available - 2 * labelReach) / (tableHeight - 2 * zoneEdgeMargin) : zoomWithoutOverflow;

  // The middle of the room between the reserves is (top - bottom) / 2 px below the middle of the screen
  const tableCenter = { x: (boardBounds.left + boardBounds.right) / 2, y: (boardBounds.top + boardBounds.bottom) / 2 };
  return { zoom, center: { x: tableCenter.x, y: tableCenter.y - (top - bottom) / 2 / zoom } };
}

export type { Bounds2D, ScreenFixedTransform, CameraViewport, CameraConfiguration, TopDownReserves, TopDownFraming };
export {
  REFERENCE_SCREEN,
  BOARD_ORIGIN_HEIGHT_RATIO,
  calculateScreenFit,
  calculateHUDPosition,
  calculateScreenFixedTransform,
  calculateLogicalScroll,
  toLogicalScreen,
  calculateBoundsOfPoints,
  clampScrollToBounds,
  resolveCameraConfiguration,
  calculateTopDownFrame,
  DEFAULT_CAMERA_CONFIGURATION,
  CAMERA_CONFIGURATIONS
};
