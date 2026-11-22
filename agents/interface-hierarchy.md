# Interface hierarchy

Which part of the interface belongs to which, and which system of the frontend creates it. Draft for the review of the product owner, 2026-11-22: once reviewed, it may move to `FRONTEND-CODESTYLE.md`. The rules of what each part looks like stay in `VIEW-SPECS.md` and `specs/ui/`.

## Tree

Every part of the interface has one place in this tree, and a part that is added is placed here. The tree says what a part belongs to and who creates it, not where it is drawn or what is drawn over it: the marks of the board belong to the HUD, are created by `HudSystem` and are drawn on the slots (`VIEW-24`). The animations, the sounds and the effects are not parts of the tree (`FX-22`).

The two elements with skins (`FX-10`) hang from the system that creates their parts: the battlefield from `ScenerySystem` and the HUD from `HudSystem`. The rest of the game screen is created by its own views, with no skin, and nothing drawn by Vue has a skin: with a skin chosen, the HUD changes and the panels of Vue keep their look, a limitation accepted by the product owner on 2026-11-22 (`FX-10`).

```
Interface
├── Vue, with no skin
│   ├── Main menu (UI-1)
│   ├── Party screen (UI-17)
│   └── Panels over the game screen
│       ├── Game menu (UI-36, VIEW-60)
│       ├── Settings screen (UI-33)
│       ├── Help panel (UI-34, VIEW-58)
│       └── Notices of the session and the connection (UI-9, UI-10, UI-24)
└── Phaser
    └── Game screen (UI-17)
        ├── ScenerySystem ── BattlefieldSkin
        │   └── Battlefield (FX-10)
        │       ├── Surroundings: what is seen around the table
        │       ├── Effect layer behind the table, with no skin (FX-23)
        │       ├── Table: its surface, its edge and its grid (VIEW-26)
        │       └── Effect layer over the table, with no skin (FX-23)
        ├── HudSystem ── HudSkin
        │   ├── HUD (VIEW-62)
        │   │   ├── Buttons
        │   │   │   ├── End turn and surrender (VIEW-43)
        │   │   │   ├── Leave, of a spectator (UI-8)
        │   │   │   └── Game menu (VIEW-60)
        │   │   ├── Label of a spectator (VIEW-28)
        │   │   ├── Round and turn (VIEW-44)
        │   │   ├── Side panel of a card (VIEW-14)
        │   │   ├── Notices of turn, round and elimination (VIEW-15, VIEW-11)
        │   │   ├── Message of a rejected action (UI-6)
        │   │   ├── Confirmation dialog (UI-15)
        │   │   ├── Labels of a zone
        │   │   │   ├── Name (VIEW-49)
        │   │   │   ├── Health bar of the leader (VIEW-50)
        │   │   │   └── Mark of who plays next (VIEW-51)
        │   │   └── Marks of the board (VIEW-58)
        │   │       ├── Own zone (VIEW-27)
        │   │       ├── Card that can attack (VIEW-17)
        │   │       ├── Leader with the turn (VIEW-20)
        │   │       ├── Slot where the dragged card can go (VIEW-32)
        │   │       ├── Slot the dragged card comes from (VIEW-32)
        │   │       ├── Valid target (VIEW-4)
        │   │       ├── Target that cannot be attacked (VIEW-4)
        │   │       └── Eliminated zone, with its veil and its label (VIEW-11)
        │   └── Result (VIEW-23), not part of the HUD
        ├── Board, with no skin
        │   └── Zones (VIEW-13)
        │       └── Slots
        │           └── Cards
        │               └── Equipment (VIEW-36)
        └── Hand (VIEW-16), with no skin
            └── Cards
```

**[OPEN]** Who draws the loading screen (`VIEW-29`), which the pending task about `GameLoad.ts` of `ROADMAP.md` finds out, and the darkening of the background of the accessible mode (`VIEW-45`). Each one goes in the tree when it is known. Whether the cards become an element with skins of its own is open in `FX-10`.

## Draw order

The tree says who creates each part; this says what is drawn over what. Each layer is drawn over the ones under it and has a name, instead of the depths spread over `core/Constants.ts`. Proposed from the depths of today on 2026-11-22: making it is a pending task of `ROADMAP.md`, which checks first what the `Layer` of Phaser 4 allows with containers (`PHASER4-SPECS.md`).

```
Page
├── Panels of Vue, over the whole canvas
│   ├── Notice of a lost connection (UI-9), over the other panels
│   └── Game menu, settings screen or help panel, never two at once (UI-34)
└── Canvas of Phaser, from the top down
    ├── Result: veil and panel (VIEW-23)
    ├── Dialogs: confirmation dialog (UI-15)
    ├── Notices: turn, round and elimination (VIEW-15, VIEW-11), and the message of a rejected action (UI-6)
    ├── Side panel of a card (VIEW-14)
    ├── HUD fixed on the screen: round and turn, buttons, label of a spectator
    ├── Hand (VIEW-16)
    └── Board, which moves with the camera, from the top down
        ├── Texts of combat (VIEW-6)
        ├── Labels of the zones (VIEW-49 to VIEW-51)
        ├── Zones, slots, cards and their marks, the attacking card over every other card (VIEW-4)
        ├── Effect layer over the table (FX-23)
        ├── Table (FX-10)
        ├── Darkening of the accessible mode (VIEW-45)
        ├── Effect layer behind the table (FX-23)
        └── Surroundings of the table (FX-10)
```

- **The result on top of the canvas.** Today the button to leave and the confirmation dialog are drawn over the result (`LEAVE_BUTTON_DEPTH`, `CONFIRM_DIALOG_DEPTH`). The HUD is hidden during the result (`VIEW-23`), so none of them is seen then, and the result goes over every layer of the canvas.
- **`hide()` stays.** The order of the layers puts the result over the HUD, but `VIEW-23` asks that the HUD is not drawn at all, not that it is under the veil.

- **Two changes from today.** The dialogs are over the notices, so a dialog that asks for an answer is never covered, while today the notices and the message of a rejected action (`TURN_NOTICE_DEPTH`, `REJECTION_MESSAGE_DEPTH`) are over the confirmation dialog. The hand is under the HUD, so the buttons can always be pressed, while today each card of the hand takes its depth in `HandView`. Decided by the product owner on 2026-11-22.

## The two systems

`HudSystem` (`core/HudSystem.ts`) and `ScenerySystem` (`core/ScenerySystem.ts`) are systems of `core/` that always exist, as the other systems (`FRONTEND-CODESTYLE.md`, section 3). Each one holds the active skin of its element, `DEFAULT_HUD_SKIN` and the default battlefield skin until Phase 15, and the skin chosen in the settings is given to it with `setSkin` (`FX-12`, `UI-27`), also when no game is shown. Each one is the only one that creates the parts of its element: a view that shows one of them asks the system for it, and never creates it with `scene.add` and a style of its own. `core/` already imports views of `game/` (`CameraSystem`, `core/interactions/`), so both follow an existing pattern. Decided by the product owner on 2026-11-22.

```
core
├── HudSystem ── HudSkin
│   ├── createButton / createPanel / createText / createFocusFrame / createMark(scene, options)
│   │     → a SkinnedPart of the HUD or of the result
│   ├── hide() / show()  → the parts of the HUD, not those of the result
│   └── setSkin(skin)  → restyles every part it created
└── ScenerySystem ── BattlefieldSkin
    ├── createBattlefield(scene, options)  → the SkinnedPart of each part of the battlefield, and its two effect layers
    ├── effectLayer(place) / battlefieldArea()  → where an effect of the battlefield draws, and inside what
    └── setSkin(skin)  → restyles every part it created
```

- **Creating.** One method for each kind of piece, never one for each part: what tells one part from another of the same kind goes in the options the method receives, so a new part does not add a method. A button to leave is `createButton(scene, { text: getText('ui.game.leave'), role: 'NEUTRAL' })`, not `createLeaveButton(scene)`, and its text comes from `core/Texts.ts`, as every text. The method receives the scene, because the system exists before any scene, and returns the container of a `SkinnedPart`.
  - For the HUD: `createButton`, `createPanel`, `createText`, `createFocusFrame` and `createMark`. `createMark` receives which mark of the legend of `VIEW-58` it is, as a key of a literal union (`FRONTEND-CODESTYLE.md`), and the corners of its slot: `ZoneSlotView` asks `HudSystem.createMark(this.scene, { mark: 'ATTACK_NOT_ALLOWED', corners: this.corners })` and keeps the mark as a child.
  - For the battlefield: `createBattlefield(scene, { battlefield })`, whose mode picks how it is drawn.

  The view adds the container as its child, places it with its `XLayout`, and decides when it is seen.
- **What a system receives.** The shape of the part, from the view, and it draws only inside it (`FX-18`). It does not place, does not animate and does not know the game state.
- **Keeping the parts.** Each system keeps the `SkinnedPart`s it created and forgets one when it is destroyed (the `DESTROY` event): the board is drawn again on every change (`GameScene.renderZones`), and its marks and its table with it. A part taken out of its view without being destroyed would be kept forever, so a test draws the board several times and checks that the system keeps as many parts as one drawing creates.
- **`setSkin(skin)`.** Every part kept takes the style of the new skin, so no view takes part. The skin only gives the style of a part: its colors, alphas, fonts, frames and thicknesses, and the look of each mark, which is a style too. What a part shows is of the view, which changes it on the part at any time: the text of a button or of the turn panel, the fill of a health bar, the corners of the slot of a mark. So a new style never brings back an old text or an old shape. Decided by the product owner on 2026-11-22.
- **Animations.** The view animates its part: the pulse of the end turn button (`VIEW-38`) and of the frame of a card that can attack (`VIEW-17`) stay in their views (`FX-22`).

### `SkinnedPart`

One part drawn with a skin. A concrete class, generic over the type of the skin, used by composition from both systems, with no interface and no inheritance (`CODESTYLE.md`, section 3).

- **Two layers.** It has a container of the view, whose place, visibility, alpha and tweens are of the view. Inside, the layer it draws, which only the `SkinnedPart` touches. So showing the HUD again does not show a mark that the view had hidden, such as the frame of a card lifted as the attacker (`VIEW-4`).
- **Style.** It keeps the function that gives the style of the skin to its layer. `restyle(skin)` calls it again with the new skin over what the layer shows at that moment: a text keeps its text and takes the font and the color of the skin, and a mark is drawn again over the corners it has, with the look of the skin.
- **Hidden.** `setHidden(hidden)` hides or shows its layer, and disables or enables the input of every interactive object in it, so a hidden button cannot be clicked.

### `HudSystem`

- **The HUD and the result.** It keeps the parts of the HUD apart from those of the result, which is drawn with the same pieces (`FX-10`) but is not part of the HUD: `setSkin` restyles both, and `hide()` and `show()` only touch the parts of the HUD.
- **`hide()` and `show()`.** Every part of the HUD is hidden or shown at once, and a part of the HUD created while it is hidden is created hidden. The result calls `hide()` when its veil starts (`VIEW-23`). `GameScene` calls `show()` when it is created, so the HUD hidden by the result of a game is not hidden in the next one.

### `ScenerySystem`

- **Its parts.** The parts of the battlefield of `FX-10`: the surface under the zones, its edge, its grid and what is seen around it. The zones, the slots and the cards are not its parts, since the battlefield does not change them (`FX-10`).
- **Mode and skin.** The mode of the board picks how the battlefield is drawn, with `BattlefieldViewStrategy` and its dispatcher (`FRONTEND-CODESTYLE.md`, section 3), and the skin only gives its values. The mode is `battlefieldType`, which stays in `domain/Battlefield` with the value it has today, while the skin leaves the domain: it is a preference of the player, not game state (`FX-12`).
- **No `hide()` nor `show()`**: no rule hides the battlefield, and the result leaves it under its veil (`VIEW-23`).

### Strategy of a skin

Until Phase 15 both systems draw every piece from the data of the skin, with no interface: `CODESTYLE.md` asks for an interface only with two implementations that exist today. The drawing by the code a skin carries for a piece (`FX-18`) becomes a strategy in Phase 15, with the first skin that needs it (`docs/skins/huds/fantasy/` for the HUD, the scenes of `docs/skins/battlefields/` for the battlefield). Decided by the product owner on 2026-11-22.

## Effects over a skinned element

An effect changes how an element is seen for a while, without changing its skin nor its layout (`FX-10`, `FX-15`): it is drawn over the parts of the element by the effects of `core/visual_effects/`, and the system of the element only gives it the place to draw.

```
Event confirmed by the server (CON-17)
└── queue of AnimationSystem (CON-12)
    └── animation of the event
        └── effect of the card (FX-22), or else of its rarity (FX-1, FX-16), described by data (FX-3)
            ├── effectLayer() of the system of the element  → where it draws, over the parts of the element
            ├── area of the element  → the shape it draws inside
            └── draws, plays, and empties the layer
```

- **The two effect layers of the battlefield.** `createBattlefield` creates, besides the surroundings and the table, two empty layers with no skin: one behind the table and over its surroundings, and one over the table and under the zones. An effect says in its data which one it draws in, and asks for it with `effectLayer('BEHIND_TABLE')` or `effectLayer('OVER_TABLE')`. `ScenerySystem` keeps both with the battlefield shown and creates them again with it (`GameScene.renderZones`). It never draws in them: only the effects do, so the zones, the slots and the cards stay over every effect of the battlefield (`FX-23`).
- **The darkening of the accessible mode** (`VIEW-45`) is over the layer behind the table, so an effect there is darkened as the surroundings are, and the board keeps standing out over it.
- **The skin stays under the effect.** The parts of the element are not changed, and a `setSkin` during an effect restyles them under it. When the effect ends, its layer is empty and the element shows its skin again, with nothing to restore.
- **The effect is data.** Which effect plays is found from the card (`FX-22`), then from its rarity (`FX-1`), with no branch in the code of each card (`FX-3`). An effect of a new kind adds its code once to `core/visual_effects/`, and any card or rarity uses it by data.
- **Settings.** The effects are non-essential (`FX-2`): with low quality or reduced motion they do not play (`FX-13`).
- **The HUD.** The same scheme gives an effect layer to `HudSystem` when an effect of the interface needs one (`FX-2`). None is specified yet, so it is not created.

## Migration

The steps from the code of today to these systems are pending tasks of `ROADMAP.md`, in order, read on 2026-11-22.
