import Phaser from 'phaser';
import { clampScrollToBounds } from '@/core/cameras/CameraCalculations';
import type { Bounds2D } from '@/core/cameras/CameraCalculations';


const ZOOM_STEP = 0.15;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 1.5;
const ZOOM_DURATION = 50;
// Phaser drag states: 3 = the pointer meets the drag criteria, 4 = dragging, 5 = released
const DRAG_STARTED_STATE = 3;

/**
 * Pure zoom calculation functions, independent of Phaser runtime.
 */

type ZoomConfig = {
  step: number;
  min: number;
  max: number;
};

const DEFAULT_ZOOM_CONFIG: ZoomConfig = {
  step: ZOOM_STEP,
  min: MIN_ZOOM,
  max: MAX_ZOOM
};

function isDragging(dragState: number): boolean {
  return dragState >= DRAG_STARTED_STATE;
}

function calculateNewZoom(currentZoom: number, deltaY: number, config: ZoomConfig = DEFAULT_ZOOM_CONFIG): number | null {
  const zoomChange = deltaY > 0 ? -config.step : config.step;
  const newZoom = currentZoom + zoomChange;
  if (newZoom >= config.min && newZoom <= config.max) {
    return newZoom;
  }
  return null;
}

type Camera = Phaser.Cameras.Scene2D.Camera;

function initialize(scene: Phaser.Scene, camera: Camera, getBounds: () => Bounds2D | undefined) {
  // Zoom out (scroll down = deltaY > 0) or zoom in (scroll up = deltaY < 0)
  scene.input.on('wheel', (
    pointer: Phaser.Input.Pointer,
    _gameObjects: Phaser.GameObjects.GameObject[],
    _deltaX: number,
    deltaY: number,
    _deltaZ: number
  ) => onWheel(scene, camera, pointer, deltaY));

  // Drag to pan with middle or right button
  scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => onPointerMove(scene, camera, pointer, getBounds()));

  // Disable context menu for right click
  scene.input.mouse?.disableContextMenu();
}

function onWheel(scene: Phaser.Scene, camera: Camera, pointer: Phaser.Input.Pointer, deltaY: number) {
  if (isDragging(scene.input.getDragState(pointer))) return;

  const newZoom = calculateNewZoom(camera.zoom, deltaY);
  if (newZoom !== null) {
    camera.zoomTo(newZoom, ZOOM_DURATION);
    setTimeout(() => onZoomComplete(camera, newZoom), ZOOM_DURATION + 100);
  }
}

function onZoomComplete(camera: Camera, newZoom: number) {
  camera.emit(Phaser.Cameras.Scene2D.Events.ZOOM_COMPLETE, camera, newZoom);
}

function onPointerMove(scene: Phaser.Scene, camera: Camera, pointer: Phaser.Input.Pointer, bounds: Bounds2D | undefined) {
  if (!pointer.isDown) return;
  if (pointer.middleButtonDown() || pointer.rightButtonDown()) {
    camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
    camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
    keepInsideBounds(scene, camera, bounds);
  }
}

/** Zooming scales around the center of the screen, so only a pan can take it out of the board. */
function keepInsideBounds(scene: Phaser.Scene, camera: Camera, bounds: Bounds2D | undefined) {
  if (!bounds) return;

  const { width, height } = scene.scale;
  const scroll = clampScrollToBounds({ scrollX: camera.scrollX, scrollY: camera.scrollY, zoom: camera.zoom, screenWidth: width, screenHeight: height }, bounds);
  camera.setScroll(scroll.x, scroll.y);
}

const CameraMovementManager = {
  zoomStep: ZOOM_STEP,
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  zoonDuration: ZOOM_DURATION,
  
  initialize
}

export type { ZoomConfig };
export { calculateNewZoom, isDragging, DEFAULT_ZOOM_CONFIG };
export default CameraMovementManager;