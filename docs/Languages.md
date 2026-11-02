# Languages

The MVP is only in Spanish (`UI-2`). English is Post-MVP.

The texts the player sees do not live in the backend. It sends keys, and the client translates them:

- Errors: `exception.*` (`agents/specs/CONTRACT.md`, `CON-18`).
- Cards: `card.<type>.<code>.name` and `card.<type>.<code>.description` (`agents/specs/CARDS.md`, `CARD-7`).
