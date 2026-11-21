# Typography

The typefaces and the sizes of the texts of the interface (Phase 11.5). Decided with the product owner on 2026-11-21. Before, every text was drawn with the monospaced typewriter face of the browser, in seven sizes with no scale.

- **VIEW-54** The texts of the cards of the board (the name, the values and the description of a card, `VIEW-1`) are drawn in Consolas bold, and the fallback is the monospaced face of the system. Every other text of the interface, the Vue panels included, is drawn in Atkinson Hyperlegible, regular unless this file says bold. Its file is part of the application, so the interface does not depend on what the system has. It has an open license (SIL OFL 1.1). The texts of the interface that are drawn on the canvas keep their sharpness at the resolution of the canvas, not at the one of the window, so they are not blurred (`PHASER4-SPECS.md`).
- **VIEW-55** The sizes of the texts of the interface are four levels, on the screen with the window at 1920 by 1080 and the zoom of the camera at 1 (`VIEW-24`), and the minimum of `VIEW-41` holds for all of them:

  | Level | Size | Used by |
  |---|---|---|
  | Title | 40 px, bold | The notices of the turn, of the round and of an elimination (`VIEW-15`, `VIEW-11`), the title of the result (`VIEW-23`) |
  | Body | 24 px | The round and the turn, the buttons of the HUD and of the dialogs (`UI-3`, `VIEW-28`), the rejection message (`UI-6`), the lines of the result under its title, the status and the retry button of the loading screen (`VIEW-29`), the notices of the connection (`UI-9`, `UI-24`), the label "Eliminado" (`VIEW-11`), and the name in the side panel, in bold (`VIEW-14`), the title, the names of the sections, in bold, and the button "Cerrar" of the help panel (`VIEW-58`) |
  | Label | 18 px | The label of a spectator (`VIEW-28`), the description and the equipment names in the side panel (`VIEW-14`), the name of the zone and the label of its health bar (`VIEW-49`, `VIEW-50`), the notice of the session and its button (`UI-10`), the line "Puede atacar este turno" of the side panel (`VIEW-59`), the texts of the legend and of the rules of the help panel (`VIEW-58`, `UI-35`) |
  | Numbers | 24 px, bold | The values that a piece of equipment adds or subtracts, in the side panel (`VIEW-14`) |

  The texts of the cards of the board and the floating texts of the values (`VIEW-6`) keep their size, which depends on the card and on the target. The size of a level does not change with the zoom for the texts of the HUD, the side panel and the labels of the board, as `VIEW-41` says.

## Scenarios

**A text of the interface**
- Given the window at 1920 by 1080
- When any text that is not on a card is shown
- Then it is drawn in Atkinson Hyperlegible, in the size of its level

**A text of a card**
- Given a card on the board
- When its name is drawn
- Then it is in Consolas bold
