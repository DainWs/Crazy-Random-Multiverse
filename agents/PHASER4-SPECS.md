# PHASER4-SPECS

Known effects of Phaser 4 on this project, as symptom, likely cause and where to look. Written during the migration of Phase 6, against Phaser 4.2.1. Read it first when something looks or behaves differently in the view.

## Sharpness of cards and texts

- **Symptom:** cards or texts look less sharp than expected, above all in rotated zones, in the hand or with the camera zoomed.
- **Likely cause:** `pixelArt: true` in `App.vue` still sets `roundPixels` to `true` and `antialias` to `false`, but Phaser 4 only rounds objects that are axis-aligned and not scaled. The default `GameObject#vertexRoundMode` is `safeAuto`. The cards of the rotated zones and the hand, which is scaled by `1 / zoom`, do not qualify.
- **Where to look:** the configuration in `App.vue` and `vertexRoundMode`. The `full` and `fullAuto` modes always round, and can make transformed objects wobble.

## Missing vertices in shapes

- **Symptom:** a shape drawn with `Graphics` loses detail or has odd corners.
- **Likely cause:** `pathDetailThreshold` is 1 px by default, and the WebGL renderer merges the points of a path that are closer than that.
- **Where to look:** `render.pathDetailThreshold` in the game configuration, or the property of the same name on the object. The shapes in use are `TableViewStrategy`, `ZoneSlotViewRenderer` and the arrow of `AttackTargetingPerspective`. None of them showed this at zooms from 0.5 to 1.1.

## `Phaser is not defined`

- **Symptom:** the application fails on load, or a test fails, with `ReferenceError: Phaser is not defined`.
- **Likely cause:** the ESM build, which Vite and Vitest use, does not define the `Phaser` global. `tsc` does not catch it, because the `Phaser` namespace of the types is ambient.
- **Where to look:** a file that uses `Phaser` as a value (`extends Phaser.GameObjects.Container`, `new Phaser.Geom.Rectangle`, `Phaser.Scenes.Events.SHUTDOWN`) needs `import Phaser from 'phaser'`. A file that only uses it in types does not.

## Hover, drag or the pinned hand stop working

- **Symptom:** the pointer no longer finds the objects under it, or the hand stops following the camera.
- **Likely cause:** the code depends on two details of the engine: `scene.input.manager.hitTest` in `InteractiveObjectManager` is not a public API of the scene, and `HandView` listens to the scene event `prerender`. Both worked unchanged on Phaser 4.2.1, so check them after updating Phaser.
- **Where to look:** `InputManager#hitTest` and `Phaser.Scenes.Events.PRE_RENDER` in the installed version.

## A test times out without a cache

- **Symptom:** a test that imports a view inside the test fails with `Test timed out in 5000ms`, only when there is no Vitest cache.
- **Likely cause:** loading the ESM build of Phaser takes over 5 s without a cache, and an `await import(...)` inside `it` counts towards the timeout.
- **Where to look:** add a static `import 'phaser';` at the top of the test file, as in `test/game/cards/CardView.test.ts`.
