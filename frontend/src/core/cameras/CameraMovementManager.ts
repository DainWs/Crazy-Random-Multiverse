

const ZOOM_STEP = 0.15;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 1.5;
const ZOOM_DURATION = 50;

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

function calculateNewZoom(currentZoom: number, deltaY: number, config: ZoomConfig = DEFAULT_ZOOM_CONFIG): number | null {
  const zoomChange = deltaY > 0 ? -config.step : config.step;
  const newZoom = currentZoom + zoomChange;
  if (newZoom >= config.min && newZoom <= config.max) {
    return newZoom;
  }
  return null;
}

type Camera = Phaser.Cameras.Scene2D.Camera;

function initialize(scene: Phaser.Scene, camera: Camera) {
  // Zoom out (scroll down = deltaY > 0) or zoom in (scroll up = deltaY < 0)
  scene.input.on('wheel', (
    _pointer: Phaser.Input.Pointer,
    _gameObjects: Phaser.GameObjects.GameObject[],
    _deltaX: number,
    deltaY: number,
    _deltaZ: number
  ) => onWheel(camera, deltaY));

  // Drag to pan with middle or right button
  scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => onPointerMove(camera, pointer));

  // Disable context menu for right click
  scene.input.mouse?.disableContextMenu();
}

function onWheel(camera: Camera, deltaY: number) {
  const newZoom = calculateNewZoom(camera.zoom, deltaY);
  if (newZoom !== null) {
    camera.zoomTo(newZoom, ZOOM_DURATION);
    setTimeout(() => onZoomComplete(camera, newZoom), ZOOM_DURATION + 100);
  }
}

function onZoomComplete(camera: Camera, newZoom: number) {
  camera.emit(Phaser.Cameras.Scene2D.Events.ZOOM_COMPLETE, camera, newZoom);
}

function onPointerMove(camera: Camera, pointer: Phaser.Input.Pointer) {
  if (!pointer.isDown) return;
  if (pointer.middleButtonDown() || pointer.rightButtonDown()) {
    camera.scrollX -= (pointer.x - pointer.prevPosition.x) / camera.zoom;
    camera.scrollY -= (pointer.y - pointer.prevPosition.y) / camera.zoom;
  }
}

const CameraMovementManager = {
  zoomStep: ZOOM_STEP,
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  zoonDuration: ZOOM_DURATION,
  
  initialize
}

export type { ZoomConfig };
export { calculateNewZoom, DEFAULT_ZOOM_CONFIG };
export default CameraMovementManager;