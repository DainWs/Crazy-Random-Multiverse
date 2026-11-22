# Draw order

What is drawn over what in the game screen and over it. Each layer is drawn over the ones under it. Proposed on 2026-11-22 from what was drawn that day; the changes below were decided by the product owner on 2026-11-22. How it is built is in `.claude/skills/frontend-conventions/SKILL.md`, section 11.

- **VIEW-68** The parts of the interface are drawn in this order, from the top down:

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

  - **The result on top of the canvas.** The result goes over every layer of the canvas. The HUD is hidden during the result (`VIEW-23`), so the button to leave and the confirmation dialog are not seen then.
  - **The dialogs over the notices.** A dialog that asks for an answer is never covered: the confirmation dialog is over the notices and the message of a rejected action. Decided by the product owner on 2026-11-22.
  - **The hand under the HUD.** The buttons of the HUD can always be pressed, also when the hand is under them. Decided by the product owner on 2026-11-22.
