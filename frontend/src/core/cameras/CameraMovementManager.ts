


type Camera = Phaser.Cameras.Scene2D.Camera;

const DEFAULT_ZOOM = 0.55;
const ZOOM_STEP = 0.15;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 1.5;
const ZOOM_DURATION = 50;

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
  let zoomChange = ZOOM_STEP;
  if (deltaY > 0) {
    zoomChange = -ZOOM_STEP;
  }

  const newZoom = camera.zoom + zoomChange;
  if (newZoom >= MIN_ZOOM && newZoom <= MAX_ZOOM) {
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
  defaultZoom: DEFAULT_ZOOM,
  zoomStep: ZOOM_STEP,
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  zoonDuration: ZOOM_DURATION,
  
  initialize
}

export default CameraMovementManager;