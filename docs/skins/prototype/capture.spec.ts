// Reference only, not production code: takes the captures of docs/skins/huds/<name>/ and docs/skins/battlefields/<name>/.
// Each element is captured with the other one as the game draws it, since they are chosen apart (FX-12).
import type { Page } from '@playwright/test';
import path from 'node:path';
import type BackendDouble from '@/support/BackendDouble';
import { createPreparedGame } from '@/support/preparedGame';
import { test } from '@/support/test';

const HUDS = ['fantasy', 'parchment', 'neon', 'sci-fi', 'arcade-blocks', 'wood'];
const BATTLEFIELDS = [
    'beach',
    'castle-moat',
    'desert',
    'sky-island',
    'snow',
    'volcano',
    'arcane-altar',
    'crypt',
    'throne-hall',
    'circuit-board',
    'dance-floor',
    'hexagons',
    'star-chart',
    'command-bridge',
    'space-hangar',
    'dojo',
    'river-raft',
    'tavern-table'
];
/** Run from frontend/, so the captures land next to the README of each skin. */
const OUTPUT = path.resolve(process.cwd(), '../docs/skins');
const AWAY = { x: 1450, y: 860 };
const CENTER = { x: 960, y: 540 };
const STEPS = 10;
const SETTLE_MS = 3000;
const HOVER_MS = 400;
const ZOOM_STEPS = 4;
const TURN = { x: 0, y: 0, width: 560, height: 140 };
const BUTTONS = { x: 1400, y: 860, width: 520, height: 220 };
const DIALOG = { x: 610, y: 390, width: 700, height: 300 };

type Clip = { x: number; y: number; width: number; height: number };

async function open(page: Page, backend: BackendDouble, choice: { __hudSkin?: string; __battlefieldSkin?: string }) {
    await page.addInitScript((c) => Object.assign(window, c), choice);
    backend.prepare(createPreparedGame(2));
    await page.goto('/');
    await backend.waitForBoardDrawn();
    await page.mouse.move(AWAY.x, AWAY.y);
    await page.waitForTimeout(SETTLE_MS);
}

function shooter(page: Page, folder: string) {
    return (file: string, clip?: Clip) =>
        page.screenshot({ path: path.join(OUTPUT, folder, file), clip, ...(file.endsWith('.jpg') ? { type: 'jpeg' as const, quality: 85 } : {}) });
}

async function target(page: Page, name: string) {
    const found = await page.evaluate((n) => (window as unknown as { __hudTargets?: Record<string, { x: number; y: number }> }).__hudTargets?.[n], name);
    if (!found) throw new Error(`The HUD did not publish ${name}`);
    return found;
}

async function hover(page: Page, point: { x: number; y: number }) {
    await page.mouse.move(point.x, point.y, { steps: STEPS });
    await page.waitForTimeout(HOVER_MS);
}

for (const hud of HUDS) {
    test(`capture the HUD ${hud}`, async ({ page, backend }) => {
        const shot = shooter(page, `huds/${hud}`);
        await open(page, backend, { __hudSkin: hud });
        await shot('overview.jpg');
        await shot('turn.png', TURN);
        await shot('buttons.png', BUTTONS);
        await hover(page, await target(page, 'pass'));
        await shot('buttons-hover-end-turn.png', BUTTONS);
        await hover(page, await target(page, 'surrender'));
        await shot('buttons-hover-surrender.png', BUTTONS);
        await page.mouse.down();
        await page.mouse.up();
        await page.waitForTimeout(HOVER_MS);
        await hover(page, await target(page, 'no'));
        await shot('dialog.png', DIALOG);
    });
}

for (const battlefield of BATTLEFIELDS) {
    test(`capture the battlefield ${battlefield}`, async ({ page, backend }) => {
        const shot = shooter(page, `battlefields/${battlefield}`);
        await open(page, backend, { __battlefieldSkin: battlefield });
        await shot('overview.jpg');
        await hover(page, CENTER);
        for (let i = 0; i < ZOOM_STEPS; i++) {
            await page.mouse.wheel(0, -100);
            await page.waitForTimeout(HOVER_MS);
        }
        await page.mouse.move(AWAY.x, 1070);
        await page.waitForTimeout(HOVER_MS);
        await shot('detail.jpg');
    });
}
