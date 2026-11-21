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

/** Depth of the message about a rejected action: above the cards. */
export const REJECTION_MESSAGE_DEPTH = 20000;

/** Time in milliseconds a notice of a new round or turn stays fully visible (VIEW-15). */
export const TURN_NOTICE_HOLD_MS = 1000;

/** Font size of the notice of a new round or turn (VIEW-15). */
export const TURN_NOTICE_FONT_SIZE = '40px';

/** Padding in pixels between the text of the notice of a new round or turn and its panel (VIEW-15). */
export const TURN_NOTICE_PADDING = { x: 28, y: 12 };

/** Depth of the notice of a new round or turn: above the cards. */
export const TURN_NOTICE_DEPTH = 20000;

/** Size of the selected attacker while it is lifted, relative to its rest size (VIEW-4). */
export const ATTACKER_LIFT_SCALE = 1.12;

/** Offset down on the screen of the shadow of the lifted attacker, as a fraction of the height of the card (VIEW-4). */
export const ATTACKER_SHADOW_OFFSET = 0.06;

/** Size of the rival card under the pointer while an attacker is selected, relative to its rest size (VIEW-4). */
export const TARGET_LIFT_SCALE = 1.06;

/** Offset down on the screen of the shadow of the lifted rival card, as a fraction of the height of the card (VIEW-4). */
export const TARGET_SHADOW_OFFSET = 0.03;

/** Opacity of the black shadow of a lifted card, between 0 and 1 (VIEW-4). */
export const LIFT_SHADOW_ALPHA = 0.35;

/** Diameter in board-space units of the crossed circle of a rival card that cannot be attacked, which is 32 px on the screen at 1920 by 1080 and zoom 1 (VIEW-4). */
export const FORBIDDEN_ICON_DIAMETER = 32;

/** Duration in milliseconds of one pulse of the frame of an own card that can attack now (VIEW-17). */
export const SLOT_MARKER_READY_PULSE_PERIOD_MS = 2400;

/** Lowest alpha of the pulse of the frame of an own card that can attack now, between 0 and 1 (VIEW-17). */
export const SLOT_MARKER_READY_MIN_ALPHA = 0.5;


/** Distance in pixels from the edges of the screen to the turn indicator and the buttons of the game HUD (UI-3). */
export const HUD_MARGIN = 24;

/** Font size of the turn indicator and the buttons of the game HUD. */
export const HUD_FONT_SIZE = '24px';

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
export const LEADER_INTRO_START_SCALE = 1.5;

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

/** Alpha of the veil that covers the board while the result is shown (WIN-4). */
export const GAME_RESULT_VEIL_ALPHA = 0.7;

/** Size in pixels of the panel behind the texts of the result of the game (VIEW-23). */
export const GAME_RESULT_PANEL_SIZE = { width: 760, height: 240 };

/** Alpha of the panel behind the texts of the result of the game, high enough for the slots not to show through (VIEW-23). */
export const GAME_RESULT_PANEL_ALPHA = 0.95;

/** Duration in milliseconds of one pulse of the end turn button when nothing is left to do (VIEW-38). */
export const END_TURN_PULSE_PERIOD_MS = 1600;

/** Share of white the background of the end turn button is mixed with at the high point of its pulse, between 0 and 1 (VIEW-38). */
export const END_TURN_PULSE_WHITE_SHARE = 0.2;

/** Distance in pixels between two HUD buttons. */
export const HUD_BUTTON_GAP = 16;

/** Padding in pixels around the text of a HUD button. */
export const HUD_BUTTON_PADDING = { x: 12, y: 6 };

/** Depth of the game HUD: above the cards and below the messages about rejected actions. */
export const HUD_DEPTH = 15000;

/** Depth of the result of the game: above the HUD and its dialogs. */
export const GAME_RESULT_DEPTH = HUD_DEPTH + 10;

/** Width and height in pixels of the dialog that asks for confirmation (UI-15). */
export const CONFIRM_DIALOG_SIZE = { width: 520, height: 200 };

/** Width in pixels of the border of the confirmation dialog. */
export const CONFIRM_DIALOG_BORDER_WIDTH = 2;

/** Opacity of the black layer between the background of the window and the board, so the board stands out over it (VIEW-45). */
export const GAME_BACKGROUND_DIM_ALPHA = 0.55;

/** Alpha of the veil that covers the game behind the dialog that asks for confirmation. */
export const CONFIRM_VEIL_ALPHA = 0.6;


/** Amplitude in board units of the first swing of the shake of a card hit by an attack, which goes down to 0 (VIEW-5). */
export const HIT_SHAKE_AMPLITUDE = 6;

/** Times the shake of a card hit by an attack goes from side to side (VIEW-5). */
export const HIT_SHAKE_SWINGS = 3;

/** Fraction of the long side of the card hit that the floating text with what it lost measures (VIEW-6). */
export const DAMAGE_TEXT_SIZE_FRACTION = 0.4;

/** Smallest height in pixels of the floating text, with the window at 1920 by 1080 (VIEW-6). */
export const DAMAGE_TEXT_MIN_SIZE = 24;

/** Distance in pixels the floating text rises, with the window at 1920 by 1080 (VIEW-6). */
export const DAMAGE_TEXT_RISE = 40;

/** Width of the black outline of the floating text and its icon, as a fraction of the height of the text (VIEW-6). */
export const DAMAGE_TEXT_OUTLINE_FRACTION = 0.15;

/** Space between the icon and the number of the floating text, as a fraction of the height of the text. */
export const DAMAGE_TEXT_ICON_GAP_FRACTION = 0.25;

/** Depth of the floating text with the damage: above the cards and below the messages about rejected actions. */
export const DAMAGE_TEXT_DEPTH = 14000;

/** Milliseconds every animation of the hit of a dead leader stops at the impact (VIEW-7). */
export const LEADER_FREEZE_MS = 150;

/** Milliseconds a dead leader stays still and dark grey before it shrinks (VIEW-7). */
export const LEADER_STILL_MS = 400;

/** Opacity of the dark grey that covers a dead leader, between 0 and 1 (VIEW-7). */
export const LEADER_DEATH_TINT_ALPHA = 0.85;

/** Scale a dead card or leader shrinks to before it disappears, relative to its own scale; not 0 so its matrix stays valid (VIEW-7). */
export const DEATH_END_SCALE = 0.01;

/** Width in board-space units of the border that every slot draws around itself, and of every frame that covers it: the marks of an attack and a drop, of the cards that can attack and of the leader with the turn (VIEW-4, VIEW-17, VIEW-20). */
export const SLOT_BORDER_WIDTH = 2;

/** Width in board-space units of the near black edge on each side of a colored mark, so it is seen against any slot or card (VIEW-40). */
export const MARK_EDGE_WIDTH = 2;

/** Alpha of the frame at the low point of its pulse, between 0 and 1 (VIEW-20). */
export const TURN_GLOW_MIN_ALPHA = 0.45;

/** Duration in milliseconds of one pulse of the frame around the leader of the player with the turn (VIEW-20). */
export const TURN_GLOW_PULSE_PERIOD_MS = 2400;

/** Alpha of the veil over each slot of the zone of an eliminated player (VIEW-11). */
export const ELIMINATED_VEIL_ALPHA = 0.8;

/** Width in board-space units of the border around each veiled slot of the zone of an eliminated player (VIEW-11). */
export const ELIMINATED_VEIL_BORDER_WIDTH = 3;

/** Height in pixels of the label "Eliminado" over the zone of an eliminated player, with the window at 1920 by 1080 and zoom 1 (VIEW-11). */
export const ELIMINATED_LABEL_SIZE = 24;

/** Font size of the label "Eliminado" over the zone of an eliminated player (VIEW-11). */
export const ELIMINATED_LABEL_FONT_SIZE = `${ELIMINATED_LABEL_SIZE}px`;

/** Thickness of the black outline of the label "Eliminado", as a fraction of the height of the text (VIEW-11). */
export const ELIMINATED_LABEL_OUTLINE_FRACTION = 0.14;

/** Milliseconds the dark red and the label of an eliminated zone take to fade in; an exception to the scale of `VIEW-30` (VIEW-11). */
export const ELIMINATION_VEIL_MS = 800;

/** Milliseconds between the end of the veil and the start of the notice of the elimination (VIEW-11). */
export const ELIMINATION_NOTICE_DELAY_MS = 400;

/** Milliseconds the notice of the elimination takes to fade in, and again to fade out; an exception to the scale of `VIEW-30` (VIEW-11). */
export const ELIMINATION_NOTICE_FADE_MS = 1000;

/** Milliseconds the notice of the elimination stays fully visible (VIEW-11). */
export const ELIMINATION_NOTICE_HOLD_MS = 1000;

/** Depth of the button to leave the game: above the result, so a spectator can still leave while it is shown (UI-8). */
export const LEAVE_BUTTON_DEPTH = GAME_RESULT_DEPTH + 1;

/** Depth of the dialog that asks for confirmation: above every other element of the game (UI-15). */
export const CONFIRM_DIALOG_DEPTH = GAME_RESULT_DEPTH + 2;

/** Fraction of the width and the height of a card that the Displacement filter can move a pixel, in each direction (VIEW-1). Smaller means a finer map, because it has 256 steps. */
export const WARP_DISPLACEMENT_AMOUNT = 0.5;

/** Pixels around a card that the filter keeps when it draws the card inside the quad of its slot (VIEW-1). */
export const WARP_PADDING = 8;

/** Size in pixels of the panel behind the bar and the texts of the loading screen (VIEW-29). */
export const LOAD_PANEL_SIZE = { width: 560, height: 220 };

/** Width in pixels of the border of the panel of the loading screen (VIEW-29). */
export const LOAD_PANEL_BORDER_WIDTH = 2;

/** Width and height in pixels of the frame of the progress bar of the loading screen, and the room left around its fill (VIEW-29). */
export const LOAD_BAR_SIZE = { width: 468, height: 32 };
export const LOAD_BAR_FILL_MARGIN = 4;

/** Distance in pixels from the vertical center of the window to the center of the bar, and from the bar to the status text and to the retry button of the loading screen (VIEW-29). */
export const LOAD_BAR_OFFSET_Y = 0;
export const LOAD_STATUS_OFFSET_Y = 56;
export const LOAD_RETRY_OFFSET_Y = 104;

/** How far down from the center of the window the panel of the loading screen sits, so it holds the bar, the text and the button (VIEW-29). */
export const LOAD_PANEL_OFFSET_Y = 40;

/** Duration in milliseconds of the board fading in over the loading screen, which fades out at the same time (VIEW-29). */
export const LOAD_TRANSITION_MS = 400;

/** Ease of the fades from the loading screen to the board. Not one of the four curves of `VIEW-31`: Phase 11.4 changes it. */
export const LOAD_TRANSITION_EASE = { ease: 'Linear' };

/** Key of the scene of the loading screen. */
export const LOAD_SCENE_KEY = 'GameLoad';

/** Diagonal lines drawn over each slot of the own zone while the extra marks are on (VIEW-39). */
export const OWN_ZONE_LINES_PER_SLOT = 9;

/** Width in board-space units of the diagonal lines of the own zone while the extra marks are on (VIEW-39). */
export const OWN_ZONE_LINE_WIDTH = 4;

/** Length of each arm of the L's of a card that can attack, as a fraction of the edge it follows (VIEW-39). */
export const READY_CORNER_ARM_FRACTION = 0.3;

/** Width in board-space units of the L's of a card that can attack and of the dashes of the source slot (VIEW-39). */
export const EXTRA_MARK_FRAME_WIDTH = 8;

/** Dashes on each horizontal edge of the frame of the slot a dragged card comes from (VIEW-39). */
export const SOURCE_DASHES_PER_HORIZONTAL_EDGE = 5;

/** Dashes on each vertical edge of the frame of the slot a dragged card comes from (VIEW-39). */
export const SOURCE_DASHES_PER_VERTICAL_EDGE = 7;

/** Fraction of each stretch of an edge that its dash covers, centered in the stretch (VIEW-39). */
export const SOURCE_DASH_FRACTION = 0.6;

/** Diameter in board-space units of the dark disc of the crown of the leader with the turn, chosen by the product owner on 2026-11-19 (VIEW-39). */
export const TURN_CROWN_DIAMETER = 44;

/** Width in board-space units of the frame of the button of the confirmation dialog that has the keyboard focus (VIEW-42). */
export const FOCUS_FRAME_WIDTH = 3;

/** Units between the button that has the keyboard focus and its frame (VIEW-42). */
export const FOCUS_FRAME_MARGIN = 4;

/** Code of the key that ends the turn (UI-32). */
export const END_TURN_KEY_CODE = 'Space';

/** Font size in px on the screen of the labels with the values of a card of the board (VIEW-46). */
export const CARD_VALUE_LABEL_FONT_SIZE = '18px';

/** Units in px on the screen between the texts of a label of card values, and between its edge and them (VIEW-47). */
export const CARD_VALUE_LABEL_GAP = 8;

/** Units in px on the screen between a card and the label of its values (VIEW-47). */
export const CARD_VALUE_LABEL_CARD_GAP = 4;

/** Units in px on the screen between the edge of a label of card values and its texts (VIEW-47). */
export const CARD_VALUE_LABEL_PADDING = 6;

/** How many pixels the game canvas draws for each pixel of the window, so what is shrunk by the perspective and the zoom stays sharp. The browser shrinks the canvas back to the size of the window. */
export const RENDER_SCALE = 2;

/** Font size in px on the screen of the label with the name of the player of a zone (VIEW-49). */
export const ZONE_LABEL_FONT_SIZE = '18px';

/** Widest a label with a name can be, in px on the screen: a longer name ends with an ellipsis (VIEW-49). */
export const ZONE_NAME_MAX_WIDTH = 120;

/** Units in px on the screen between the edge of a label of a zone and its text (VIEW-49). */
export const ZONE_LABEL_PADDING = 6;

/** Units in px on the screen between the zone and the health bar of its leader (VIEW-50). */
export const ZONE_BAR_GAP = 8;

/** Thickness in px on the screen of the health bar of a leader (VIEW-50). */
export const ZONE_BAR_THICKNESS = 14;

/** Width in px on the screen of the border of the health bar of a leader (VIEW-50). */
export const ZONE_BAR_BORDER_WIDTH = 1;

/** Units in px on the screen between the health bar of a leader and the label with the name of its zone (VIEW-49). */
export const ZONE_NAME_GAP = 6;

/** The bar is green above this share of the health of the leader, and yellow above the next one (VIEW-50). */
export const ZONE_BAR_HIGH_ABOVE = 0.6;
export const ZONE_BAR_MEDIUM_ABOVE = 0.3;

/** What goes before the name of the player who plays next, and what ends a name that was cut (VIEW-51, VIEW-49). */
export const ZONE_NEXT_MARK = '▶ ';
export const ZONE_NAME_ELLIPSIS = '…';
