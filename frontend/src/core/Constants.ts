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
/** Event the Preloader emits on the Phaser game once the shared assets are loaded. */
export const PRELOADED_EVENT = 'preloaded';

/** Time in milliseconds a file of the game load may take before it counts as failed (LOAD-7). */
export const RESOURCE_LOAD_TIMEOUT_MS = 30000;

/** Capacity of a party created from the main menu (PARTY-2). */
export const DEFAULT_PARTY_MAX_USERS = 4;

/** Members a party needs before its owner can start a game (PARTY-9). */
export const MIN_PARTY_USERS_TO_START = 2;


/** Time in milliseconds a message about a rejected action stays on screen (UI-6). */
export const REJECTION_MESSAGE_DURATION_MS = 3000;

/** Distance in pixels from the top of the screen to the message about a rejected action. */
export const REJECTION_MESSAGE_TOP_OFFSET = 60;

/** Font size of the message about a rejected action. */
export const REJECTION_MESSAGE_FONT_SIZE = '28px';

/** Color of the message about a rejected action. */
export const REJECTION_MESSAGE_COLOR = '#ff6b6b';

/** Depth of the message about a rejected action: above the cards. */
export const REJECTION_MESSAGE_DEPTH = 20000;

/** Color of the attack arrow while the pointer is over a target the attack can reach (UI-5, VIEW-4). */
export const ATTACK_ARROW_VALID_COLOR = 0x2ecc71;

/** Color of the attack arrow while the pointer is not over a target the attack can reach (UI-5, VIEW-4). */
export const ATTACK_ARROW_INVALID_COLOR = 0xe74c3c;

/** Thickness in pixels of the attack arrow line. */
export const ATTACK_ARROW_LINE_WIDTH = 8;

/** Length in pixels of each side of the attack arrow head. */
export const ATTACK_ARROW_HEAD_LENGTH = 40;

/** Angle in radians between the attack arrow line and each side of its head. */
export const ATTACK_ARROW_HEAD_ANGLE = Math.PI / 7;

/** Depth of the attack arrow, above the cards and the hand. */
export const ATTACK_ARROW_DEPTH = 20000;
