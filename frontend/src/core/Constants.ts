/**
 * Minimum distance in pixels that the mouse must move for Phaser 
 * to consider the action as a drag start instead of a click.
 */
export const DRAG_DISTANCE_THRESHOLD = 10;

/**
 * Maximum time in milliseconds that the mouse must be pressed for Phaser 
 * to consider the action as a drag start instead of a click.
 */
export const DRAG_TIME_THRESHOLD = 100;

// ── Battlefield Layout ──────────────────────────────────────
export const MAX_PLAYERS_PER_BATTLEFIELD_SIDE = 4;
export const PLAYER_SPACING = 900;

export const BASE_BOARD_HALF_WIDTH = 1550;
export const BASE_BOARD_NEAR = 1550;
export const BASE_BOARD_FAR = -1550;


const extraSpace = (MAX_PLAYERS_PER_BATTLEFIELD_SIDE - 1) * PLAYER_SPACING;

export const BOARD_HALF_WIDTH = BASE_BOARD_HALF_WIDTH + extraSpace / 2;
export const BOARD_NEAR = BASE_BOARD_NEAR + extraSpace / 2;
export const BOARD_FAR = BASE_BOARD_FAR - extraSpace / 2;

/** Margin from the table edge for player zones */
export const BATTLEFIELD_ZONE_MARGIN = 100;


// ── Camera ──────────────────────────────────────────────────
export const CAMERA_DEFAULT_ZOOM = 0.55;