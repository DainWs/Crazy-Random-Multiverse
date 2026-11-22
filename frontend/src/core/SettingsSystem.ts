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

/** The panels opened from the buttons of the top right corner; they are never open at once (UI-33, UI-34). */
type CornerPanel = 'SETTINGS' | 'HELP';

const currentBoardCamera = shallowRef<BoardCamera>(loadBoardCamera());
const currentOpenPanel = shallowRef<CornerPanel | undefined>(undefined);

/** Read-only views for Vue components; computed does not wrap the value in a proxy. */
const boardCamera = computed(() => currentBoardCamera.value);
const panelOpen = computed(() => currentOpenPanel.value === 'SETTINGS');
const helpOpen = computed(() => currentOpenPanel.value === 'HELP');
/** Either panel disables gameplay while it is open (UI-4). */
const anyPanelOpen = computed(() => currentOpenPanel.value !== undefined);

function setBoardCamera(camera: BoardCamera) {
  currentBoardCamera.value = camera;
  saveBoardCamera(camera);
}

function openPanel() {
  currentOpenPanel.value = 'SETTINGS';
}

function closePanel() {
  closeCornerPanel('SETTINGS');
}

function togglePanel() {
  toggleCornerPanel('SETTINGS');
}

function closeHelp() {
  closeCornerPanel('HELP');
}

function toggleHelp() {
  toggleCornerPanel('HELP');
}

function closeCornerPanel(panel: CornerPanel) {
  if (currentOpenPanel.value === panel) {
    currentOpenPanel.value = undefined;
  }
}

function toggleCornerPanel(panel: CornerPanel) {
  currentOpenPanel.value = currentOpenPanel.value === panel ? undefined : panel;
}

/** The settings of the player (UI-33), preferences of this browser and not game state nor part of the contract, and the panels
 * of the corner buttons (UI-33, UI-34). */
const SettingsSystem = {
  boardCamera,
  panelOpen,
  helpOpen,
  anyPanelOpen,
  setBoardCamera,
  openPanel,
  closePanel,
  togglePanel,
  closeHelp,
  toggleHelp
};

export type { BoardCamera };
export { BOARD_CAMERAS, BOARD_CAMERA_STORAGE_KEY, DEFAULT_BOARD_CAMERA };
export default SettingsSystem;
