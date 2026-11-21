import { computed, shallowRef } from 'vue';

/** The cameras the board can be seen with (VIEW-57). */
type BoardCamera = 'TOP_DOWN' | 'TILTED';

/** The cameras in the order the settings screen lists them. */
const BOARD_CAMERAS: readonly BoardCamera[] = ['TOP_DOWN', 'TILTED'];

/** The camera of a player who never chose one, and of a choice kept that is not a camera (UI-33). */
const DEFAULT_BOARD_CAMERA: BoardCamera = 'TOP_DOWN';

/** Where the browser keeps the camera: the preference stays on that device and is not sent anywhere (UI-27). */
const BOARD_CAMERA_STORAGE_KEY = 'crm.settings.boardCamera';

function isBoardCamera(value: unknown): value is BoardCamera {
  return BOARD_CAMERAS.some((camera) => camera === value);
}

/** Reads what was kept. A browser without storage, or with something else in it, gets the default camera (UI-33). */
function loadBoardCamera(): BoardCamera {
  try {
    const stored = window.localStorage.getItem(BOARD_CAMERA_STORAGE_KEY);

    return isBoardCamera(stored) ? stored : DEFAULT_BOARD_CAMERA;
  } catch {
    return DEFAULT_BOARD_CAMERA;
  }
}

function saveBoardCamera(camera: BoardCamera) {
  try {
    window.localStorage.setItem(BOARD_CAMERA_STORAGE_KEY, camera);
  } catch {
    // The choice still applies until the page is closed
  }
}

const currentBoardCamera = shallowRef<BoardCamera>(loadBoardCamera());
const currentPanelOpen = shallowRef(false);

/** Read-only views for Vue components; computed does not wrap the value in a proxy. */
const boardCamera = computed(() => currentBoardCamera.value);
const panelOpen = computed(() => currentPanelOpen.value);

function setBoardCamera(camera: BoardCamera) {
  currentBoardCamera.value = camera;
  saveBoardCamera(camera);
}

function openPanel() {
  currentPanelOpen.value = true;
}

function closePanel() {
  currentPanelOpen.value = false;
}

function togglePanel() {
  currentPanelOpen.value = !currentPanelOpen.value;
}

/** The settings of the player (UI-33): preferences of this browser, not game state nor part of the contract. */
const SettingsSystem = {
  boardCamera,
  panelOpen,
  setBoardCamera,
  openPanel,
  closePanel,
  togglePanel
};

export type { BoardCamera };
export { BOARD_CAMERAS, BOARD_CAMERA_STORAGE_KEY, DEFAULT_BOARD_CAMERA };
export default SettingsSystem;
