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
export const BOARD_HALF_WIDTH = 3000;
export const BOARD_NEAR = 1800;
export const BOARD_FAR = -2800;

/** Horizontal offset for left/right players on the logical board */
export const BATTLEFIELD_ZONE_OFFSET_X = 2200;
/** Depth offset for top/bottom players on the logical board */
export const BATTLEFIELD_ZONE_OFFSET_Y = 1200;
/** Margin from the table edge for player zones */
export const BATTLEFIELD_ZONE_MARGIN = 100;

// ── Camera ──────────────────────────────────────────────────
export const CAMERA_DEFAULT_ZOOM = 0.55;