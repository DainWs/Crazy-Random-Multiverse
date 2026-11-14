# Motion base

Shared rules of every animation of the interface. The rule of each animation, in its own file of this folder, follows them unless it says otherwise. The files of this folder describe what is seen and how it behaves, never how it is built.

- **VIEW-30** Every animation lasts one of three durations, or is a sequence of them, with the waits between them given by its rule:
  - Fast, 150 ms: the reactions to the pointer and to a click, such as lifting a card.
  - Medium, 250 ms: a card that travels from one place to another, a panel that opens or closes, and a shake.
  - Slow, 400 ms: a layer that covers the screen or a large part of it appearing or disappearing, such as a fade or a veil.

  Until they are reviewed with the rest of the animations, `VIEW-12` and `VIEW-15` keep their own durations.
- **VIEW-31** No animation goes beyond its final size, position or opacity before settling: none bounces. Each one follows one of four curves, and ends exactly at its final value:
  - It slows down at the end: for what appears, enters the screen or settles, such as a card that lifts or arrives.
  - It starts slowly and speeds up: for what disappears or leaves the screen.
  - It is slow at both ends: for what is already on the screen and travels from one place to another.
  - It speeds up until it stops: for what travels to hit something, such as the lunge of an attacker (`VIEW-5`).

  A shake or a pulse goes back and forth by nature: its rule describes it, and it ends exactly at its rest value.
