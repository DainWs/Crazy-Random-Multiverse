/**
 * Minimum distance in pixels that the mouse must move for Phaser 
 * to consider the action as a drag start instead of a click.
 */
export const DRAG_DISTANCE_THRESHOLD = 10;

/**
 * Maximum time in milliseconds that the mouse must be pressed for Phaser 
 * to consider the action as a drag start instead of a click.
 */
export const DRAG_TIME_THRESHOLD = 150;

/** The only mouse button that acts on cards. The others pan the camera (VIEW-19). */
export const PRIMARY_BUTTON = 0;
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

/** Time in milliseconds a notice of a new round or turn takes to fade in, and again to fade out (VIEW-15). */
export const TURN_NOTICE_FADE_MS = 200;

/** Time in milliseconds a notice of a new round or turn stays fully visible (VIEW-15). */
export const TURN_NOTICE_HOLD_MS = 1100;

/** Distance from the top edge of the screen to the notice of a new round or turn, as a fraction of the screen height (VIEW-15). */
export const TURN_NOTICE_TOP_RATIO = 0.2;

/** Font size of the notice of a new round or turn (VIEW-15). */
export const TURN_NOTICE_FONT_SIZE = '40px';

/** Color of the text of the notice of a new round or turn (VIEW-15). */
export const TURN_NOTICE_COLOR = '#ffffff';

/** Color of the panel behind the notice of a new round or turn (VIEW-15). */
export const TURN_NOTICE_BACKGROUND = '#1b2631';

/** Padding in pixels between the text of the notice of a new round or turn and its panel (VIEW-15). */
export const TURN_NOTICE_PADDING = { x: 28, y: 12 };

/** Depth of the notice of a new round or turn: above the cards. */
export const TURN_NOTICE_DEPTH = 20000;

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

/** Distance in board-space units between the tip of the attack arrow and the card of the valid target it points at (UI-5). */
export const ATTACK_ARROW_TARGET_GAP = 8;

/** Color of the frame of a valid target or drop slot, the green of the arrow (UI-5, VIEW-4). */
export const SLOT_MARKER_VALID_COLOR = ATTACK_ARROW_VALID_COLOR;

/** Color of the frame of the slot of the attacker or the origin of a drag, the red of the arrow (UI-5, VIEW-4). */
export const SLOT_MARKER_SOURCE_COLOR = ATTACK_ARROW_INVALID_COLOR;

/** Color of the frame of an own card that can attack now (VIEW-17). */
export const SLOT_MARKER_READY_COLOR = 0x00e5ff;

/** Duration in milliseconds of one pulse of the frame of an own card that can attack now (VIEW-17). */
export const SLOT_MARKER_READY_PULSE_PERIOD_MS = 1600;

/** Lowest alpha of the pulse of the frame of an own card that can attack now, between 0 and 1 (VIEW-17). */
export const SLOT_MARKER_READY_MIN_ALPHA = 0.5;

/** Fill color of the slots of the zone of the local player, at rest (VIEW-27). */
export const OWN_SLOT_COLOR = 0x9fd8ff;

/** Border color of the slots of the zone of the local player, at rest (VIEW-27). */
export const OWN_SLOT_BORDER_COLOR = 0x3d9bff;

/** Depth of the attack arrow, above the cards and the hand. */
export const ATTACK_ARROW_DEPTH = 20000;


/** Distance in pixels from the edges of the screen to the turn indicator and the buttons of the game HUD (UI-3). */
export const HUD_MARGIN = 24;

/** Font size of the turn indicator and the buttons of the game HUD. */
export const HUD_FONT_SIZE = '24px';

/** Text color of the game HUD. */
export const HUD_COLOR = '#ffffff';

/** Text color of the turn indicator while it is the turn of the local player (UI-3). */
export const HUD_OWN_TURN_COLOR = '#2ecc71';

/** Separator between the round and the turn in the turn indicator of the game HUD (UI-3). */
export const HUD_TURN_SEPARATOR = ' · ';

/** Alpha of a HUD button that cannot be used now (UI-4). */
export const HUD_DISABLED_ALPHA = 0.4;

/** Total milliseconds the leaders take to be placed when the board is first shown (VIEW-12). */
export const LEADER_INTRO_TOTAL_MS = 2000;

/** Fewest milliseconds the placement of one leader takes, so it is still seen with many players (VIEW-12). */
export const LEADER_INTRO_MIN_MS = 120;

/** Most milliseconds the placement of one leader takes, so it does not drag with few players (VIEW-12). */
export const LEADER_INTRO_MAX_MS = 500;

/** How many times its size a leader starts at before shrinking into its slot (VIEW-12). */
export const LEADER_INTRO_START_SCALE = 1.6;

/** Seconds the result stays on screen before the party unlocks: the default of `crm.game.result-duration` (WIN-4, WIN-5). */
export const GAME_RESULT_COUNTDOWN_SECONDS = 15;

/** Milliseconds between two ticks of the countdown of the result (WIN-4). */
export const GAME_RESULT_TICK_MS = 1000;

/** Font size of the title of the result (victory or defeat). */
export const GAME_RESULT_TITLE_FONT_SIZE = '64px';

/** Font size of the winner and the countdown of the result. */
export const GAME_RESULT_DETAIL_FONT_SIZE = '28px';

/** Vertical distance in pixels between two lines of the result. */
export const GAME_RESULT_LINE_GAP = 48;

/** Text color of the title of a victory. */
export const GAME_RESULT_VICTORY_COLOR = '#2ecc71';

/** Text color of the title of a defeat. */
export const GAME_RESULT_DEFEAT_COLOR = '#e74c3c';

/** Alpha of the veil that covers the board while the result is shown (WIN-4). */
export const GAME_RESULT_VEIL_ALPHA = 0.7;

/** Size in pixels of the panel behind the texts of the result of the game (VIEW-23). */
export const GAME_RESULT_PANEL_SIZE = { width: 760, height: 240 };

/** Alpha of the panel behind the texts of the result of the game, high enough for the slots not to show through (VIEW-23). */
export const GAME_RESULT_PANEL_ALPHA = 0.95;

/** Distance in pixels between two HUD buttons. */
export const HUD_BUTTON_GAP = 16;

/** Padding in pixels around the text of a HUD button. */
export const HUD_BUTTON_PADDING = { x: 12, y: 6 };

/** Background color of a HUD button. */
export const HUD_BUTTON_BACKGROUND = '#34495e';

/** Depth of the game HUD: above the cards and below the messages about rejected actions. */
export const HUD_DEPTH = 15000;

/** Depth of the result of the game: above the HUD and its dialogs. */
export const GAME_RESULT_DEPTH = HUD_DEPTH + 10;

/** Width and height in pixels of the dialog that asks for confirmation (UI-15). */
export const CONFIRM_DIALOG_SIZE = { width: 520, height: 200 };

/** Background color of the dialog that asks for confirmation. */
export const CONFIRM_DIALOG_BACKGROUND = 0x1b2631;

/** Color of the veil that covers the game behind the dialog that asks for confirmation. */
export const CONFIRM_VEIL_COLOR = 0x000000;

/** Alpha of the veil that covers the game behind the dialog that asks for confirmation. */
export const CONFIRM_VEIL_ALPHA = 0.6;


/** Scale the attacker grows to while it attacks, relative to its own scale (VIEW-5). */
export const ATTACK_PULSE_SCALE = 1.25;

/** Milliseconds the attacker takes to grow to its attack scale; shrinking back takes the same (VIEW-5). */
export const ATTACK_PULSE_DURATION_MS = 180;

/** Distance in pixels a card hit by an attack moves to each side while it shakes (VIEW-5). */
export const HIT_SHAKE_DISTANCE = 10;

/** Milliseconds of each movement of the shake of a card hit by an attack (VIEW-5). */
export const HIT_SHAKE_DURATION_MS = 50;

/** Times the shake of a card hit by an attack goes back and forth (VIEW-5). */
export const HIT_SHAKE_REPEATS = 3;

/** Color of the flash over the slot of a card hit by an attack (VIEW-5). */
export const HIT_FLASH_COLOR = 0xff0000;

/** Milliseconds the flash over a hit card takes to fade out (VIEW-5). */
export const HIT_FLASH_DURATION_MS = 350;

/** Font size of the floating text with the damage a card received (VIEW-6). */
export const DAMAGE_TEXT_FONT_SIZE = '48px';

/** Color of the floating text with the armor a card lost (VIEW-6). */
export const ARMOR_DAMAGE_TEXT_COLOR = '#5dade2';

/** Color of the floating text with the health a card lost (VIEW-6). */
export const HEALTH_DAMAGE_TEXT_COLOR = '#e74c3c';

/** Milliseconds the armor and the health of a card take to count down to their new values (VIEW-6). */
export const STATISTIC_COUNT_DURATION_MS = 500;

/** Color of the outline of the floating text with the damage, so it reads over any card (VIEW-6). */
export const DAMAGE_TEXT_STROKE_COLOR = '#000000';

/** Width in pixels of the outline of the floating text with the damage (VIEW-6). */
export const DAMAGE_TEXT_STROKE_WIDTH = 6;

/** Distance in pixels the floating text with the damage rises (VIEW-6). */
export const DAMAGE_TEXT_RISE = 120;

/** Distance in pixels between the floating texts of the armor and the health lost by the same card (VIEW-6). */
export const DAMAGE_TEXT_GAP = 60;

/** Milliseconds the floating text with the damage takes to rise and fade out (VIEW-6). */
export const DAMAGE_TEXT_DURATION_MS = 900;

/** Depth of the floating text with the damage: above the cards and below the messages about rejected actions. */
export const DAMAGE_TEXT_DEPTH = 14000;

/** Milliseconds a dead card takes to shrink and fade out (VIEW-7). */
export const DEATH_DURATION_MS = 500;

/** Scale a dead card shrinks to, relative to its own scale (VIEW-7). */
export const DEATH_SCALE = 0.6;

/** Milliseconds a dead leader takes to shrink and fade out, after shaking: longer than a warrior (VIEW-7). */
export const LEADER_DEATH_DURATION_MS = 1200;

/** Scale a dead leader shrinks to, relative to its own scale (VIEW-7). */
export const LEADER_DEATH_SCALE = 0.3;

/** Times a dead leader shakes back and forth before it fades out (VIEW-7). */
export const LEADER_DEATH_SHAKE_REPEATS = 8;

/** Color of the frame around the leader of the player with the turn (VIEW-20). */
export const TURN_GLOW_COLOR = 0xf1c40f;

/** Width in board-space units of the border that every slot draws around itself, and of every frame that covers it: the marks of an attack and a drop, of the cards that can attack and of the leader with the turn (VIEW-4, VIEW-17, VIEW-20). */
export const SLOT_BORDER_WIDTH = 2;

/** Alpha of the frame at the low point of its pulse, between 0 and 1 (VIEW-20). */
export const TURN_GLOW_MIN_ALPHA = 0.45;

/** Duration in milliseconds of one pulse of the frame around the leader of the player with the turn (VIEW-20). */
export const TURN_GLOW_PULSE_PERIOD_MS = 2400;

/** Color of the veil over each slot of the zone of an eliminated player: a dark red (VIEW-11). */
export const ELIMINATED_VEIL_COLOR = 0x3b0a0a;

/** Alpha of the veil over each slot of the zone of an eliminated player (VIEW-11). */
export const ELIMINATED_VEIL_ALPHA = 0.8;

/** Color of the border drawn around each veiled slot of the zone of an eliminated player (VIEW-11). */
export const ELIMINATED_VEIL_BORDER_COLOR = 0x1a0000;

/** Width in board-space units of the border around each veiled slot of the zone of an eliminated player (VIEW-11). */
export const ELIMINATED_VEIL_BORDER_WIDTH = 3;

/** Font size in board-space units of the label "Eliminado" over the zone of an eliminated player (VIEW-11). */
export const ELIMINATED_LABEL_FONT_SIZE = '72px';

/** Color of the label over the zone of an eliminated player (VIEW-11). */
export const ELIMINATED_LABEL_COLOR = '#ff5a4d';

/** Color of the outline of the label over the zone of an eliminated player (VIEW-11). */
export const ELIMINATED_LABEL_STROKE_COLOR = '#000000';

/** Thickness in board-space units of the outline of the label over the zone of an eliminated player (VIEW-11). */
export const ELIMINATED_LABEL_STROKE_WIDTH = 10;

/** Depth of the button to leave the game: above the result, so a spectator can still leave while it is shown (UI-8). */
export const LEAVE_BUTTON_DEPTH = GAME_RESULT_DEPTH + 1;

/** Depth of the dialog that asks for confirmation: above every other element of the game (UI-15). */
export const CONFIRM_DIALOG_DEPTH = GAME_RESULT_DEPTH + 2;
