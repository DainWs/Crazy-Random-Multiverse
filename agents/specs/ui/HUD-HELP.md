# HUD: help panel

The look of the help button and of its panel (`UI-34`), with the legend of the marks of the board and the summary of the rules (`UI-35`). The marks are those of `MARKS-PAIRS.md`, and their colors those of `PALETTE.md`. Decided with the product owner on 2026-11-22.

- **VIEW-58** The help button, the panel and its legend:
  - **Button.** 48 by 48 px, 16 px from the top edge of the screen and 12 px to the left of the settings button (`UI-33`), with its look: background `#34495e`, `#46627f` under the pointer and while the panel is open, a border of `#34495e` 2 px thick and corners rounded 8 px. It shows a white "?" in bold, 32 px tall.
  - **Panel.** A black veil at 70% opacity covers the window, as with the settings screen, and the panel is centered over it. The panel is 720 px wide and at most 90% of the height of the window, with the fill `#1b2631`, a border of `#34495e` 2 px thick, corners rounded 8 px and a padding of 24 px at the top and the bottom and 32 px at the sides. From the top it has the title "Ayuda", the section "Marcas del tablero", the section "Reglas" (`UI-35`) and the button "Cerrar". The title and the button stay in place, and the two sections scroll between them when they do not fit.
  - **Texts.** The title and the names of the sections are at the body level of `VIEW-55`, in bold, and the texts of the legend and of the rules at the label level, in white. The titles of the paragraphs of the rules and the names of the marks are in bold. The button "Cerrar" has the look of the buttons of the confirmation dialog (`VIEW-43`, `VIEW-28`), its text at the body level.
  - **Legend.** One row for each mark, in this order, with its sample on the left and, on the right, the name of the mark in bold, the line "Color: <color>" and its meaning. With the extra signals on (`UI-31`), the row also has the line "Señal: <signal>".

    | Mark | Name | Color | Meaning | Signal |
    |---|---|---|---|---|
    | Own zone (`VIEW-27`) | Tu zona | azul | Los huecos de tu zona. | líneas diagonales |
    | Card that can attack (`VIEW-17`) | Puede atacar | cian | Esta carta tuya puede atacar ahora. | esquinas en L |
    | Leader with the turn (`VIEW-20`) | Turno | dorado | El líder del jugador que tiene el turno. | corona |
    | Slot where the dragged card can go (`VIEW-32`) | Hueco válido | verde | La carta que arrastras puede ir aquí. | relleno sólido |
    | Slot the dragged card comes from (`VIEW-32`) | Origen | naranja | De aquí viene la carta que arrastras. | marco discontinuo |
    | Valid target (`VIEW-4`) | Objetivo válido | verde | Con un atacante elegido, puedes atacar esta carta. | ninguna |
    | Target that cannot be attacked (`VIEW-4`) | Objetivo no válido | rojo | Con un atacante elegido, no puedes atacar esta carta: está protegida o es un líder con guerreros delante. | círculo tachado |
    | Eliminated zone (`VIEW-11`) | Eliminado | rojo oscuro | La zona de un jugador eliminado. | la etiqueta «Eliminado» |

  - **Samples.** Each sample is an empty slot of the board, drawn flat and scaled so it is 60 px wide, every part of it keeping its share of the slot. It is drawn as the board draws that mark at that moment, with the colors of the mode (`UI-31`, `VIEW-40`) and with the second signal only while the extra signals are on (`VIEW-39`):
    - **Tu zona.** The tint of the own zone, with the diagonal lines.
    - **Puede atacar.** The neutral slot with the cyan frame, or with the L's.
    - **Turno.** The neutral slot with the gold frame, and with the crown.
    - **Hueco válido.** The neutral slot with the green frame and the fill of a valid slot.
    - **Origen.** The neutral slot with the orange frame and its fill, or with the dashed frame.
    - **Objetivo válido.** The neutral slot with the green frame.
    - **Objetivo no válido.** The neutral slot with the red frame and the crossed circle, also with the extra signals off, as on the board.
    - **Eliminado.** The veil of an eliminated zone, without the label.

    The samples do not pulse and have no card.
  - **Effects** (`UI-26`). The button and the panel have no animation: the panel appears and disappears at once.

## Scenarios

**Legend in the base game**
- Given the page opened without the parameters of `UI-31`
- When the player opens the help panel
- Then each row shows its sample with the color of its mark, its name, its color and its meaning, and no line "Señal"

**Legend with the extra signals**
- Given the page opened with `extraMarks=1`
- When the player opens the help panel
- Then the sample of "Puede atacar" shows the cyan L's, the one of "Turno" the crown, and each row has its line "Señal"
