# Minimum text size

The minimum size of the texts of the interface on the screen (Phase 11.1). Decided by the product owner on 2026-11-19, after measuring the size of every text of the list.

- **VIEW-41** The texts of the HUD (`UI-3`, `VIEW-28`), the notices (`VIEW-15`, and those of `UI-9`, `UI-10` and `UI-24`), the side panel (`VIEW-14`), the result (`VIEW-23`), the loading screen (`VIEW-29`), the dialogs (`UI-15`) and the help panel (`VIEW-58`) are 18 px or more on the screen, with the window at 1920 by 1080 and the zoom of the camera at 1 (`VIEW-24`). The HUD and the side panel keep their size on the screen at any zoom, so the minimum holds at any zoom. The texts of the cards on the board are not covered: see Phase 11.3 of `ROADMAP.md`. Nor are the floating texts of the values (`VIEW-6`).

The sizes of every text are the four levels of `TYPOGRAPHY.md` (`VIEW-55`) since 2026-11-21, and all of them are 18 px or more.

## Measured on 2026-11-19

The size in pixels of each text of the list at 1920 by 1080, zoom 1. Everything was at 18 px or more except the button of the notices of the session (`UI-10`), which was 16 px and is now 18 px.

- Round and turn, spectator label, buttons and dialogs: 24 px. Turn and round notices: 40 px. Result: 64 px the title and 28 px the details. Loading screen: 20 px the status and 24 px the retry button.
- Side panel: the name 28 px, the description 20 px, the equipment name 22 px and the values 20 px.
- Notices of the connection (`UI-9`, `UI-24`): 24 px. Notice of the session (`UI-10`): 18 px the text and 18 px the button.

## Scenarios

**Notice of the session**
- Given the window at 1920 by 1080
- When a notice of the session is shown
- Then its text and its button are 18 px or more
