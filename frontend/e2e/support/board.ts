import type { Page } from '@playwright/test';
import type BackendDouble from '@/support/BackendDouble';
import type { PreparedGame } from '@/support/preparedGame';
import { expect } from '@playwright/test';
import { createPreparedGame } from '@/support/preparedGame';

interface Point {
    x: number;
    y: number;
}

interface Area extends Point {
    width: number;
    height: number;
}

/** The camera zooms around the center of the fixed viewport of `playwright.config.ts`. */
const VIEW_CENTER: Point = { x: 960, y: 540 };
const INITIAL_ZOOM = 1.1;
const WHEEL_DOWN_DELTA = 100;
const WHEEL_UP_DELTA = -100;
const STILL_FRAME_TIMEOUT_MS = 10000;
const DRAG_STEPS = 12;
const ARROW_RED_MIN_VALUE = 180;

/** Where the cards of the prepared game of two players are drawn at the initial zoom. */
const OWN_WARRIOR: Point = { x: 872, y: 670 };
const RIVAL_WARRIOR: Point = { x: 1029, y: 207 };
const HAND_CARD: Point = { x: 830, y: 1050 };
const SOLE_HAND_CARD: Point = { x: 960, y: 1050 };
const EMPTY_OWN_SLOT: Point = { x: 960, y: 672 };
const EMPTY_TABLE: Point = { x: 1250, y: 450 };

/** Where the cards of the left rival of the prepared game of three players are drawn, in a rotated zone. */
const SIDE_RIVAL_WARRIOR: Point = { x: 705, y: 348 };
const EMPTY_SIDE_RIVAL_SLOT: Point = { x: 787, y: 412 };

const TABLE_AREA: Area = { x: 370, y: 40, width: 1180, height: 970 };
const TOOLTIP_AREA: Area = { x: 1440, y: 0, width: 480, height: 1080 };
const EXPANDED_HAND_AREA: Area = { x: 700, y: 840, width: 520, height: 200 };
const SIDE_ZONE_AREA: Area = { x: 540, y: 300, width: 320, height: 230 };
const OWN_SLOT_AREA: Area = { x: 925, y: 622, width: 70, height: 100 };

function openBoard(page: Page, backend: BackendDouble, playerCount: number = 2): Promise<void> {
    return openGame(page, backend, createPreparedGame(playerCount));
}

async function openGame(page: Page, backend: BackendDouble, prepared: PreparedGame): Promise<void> {
    backend.prepare(prepared);

    await page.goto('/');
    await expect(page.locator('#game-container')).toBeVisible();
    await backend.waitForBoardDrawn();
    await waitForStillFrame(page);
}

/** The canvas has no DOM to wait on, so two equal frames in a row mean that the animations have ended. */
async function waitForStillFrame(page: Page, differentFrom?: Buffer): Promise<void> {
    let previous: Buffer | undefined;

    await expect
        .poll(
            async () => {
                const frame = await page.screenshot();
                const isStill = previous?.equals(frame) === true && differentFrom?.equals(frame) !== true;
                previous = frame;
                return isStill;
            },
            { timeout: STILL_FRAME_TIMEOUT_MS }
        )
        .toBe(true);
}

async function zoomOut(page: Page, steps: number): Promise<void> {
    await page.mouse.move(VIEW_CENTER.x, VIEW_CENTER.y);

    for (let step = 0; step < steps; step += 1) {
        const before = await page.screenshot();
        await page.mouse.wheel(0, WHEEL_DOWN_DELTA);
        await waitForStillFrame(page, before);
    }
}

async function zoomIn(page: Page, steps: number): Promise<void> {
    await page.mouse.move(VIEW_CENTER.x, VIEW_CENTER.y);

    for (let step = 0; step < steps; step += 1) {
        const before = await page.screenshot();
        await page.mouse.wheel(0, WHEEL_UP_DELTA);
        await waitForStillFrame(page, before);
    }
}

type PanButton = 'right' | 'middle';

/** Presses the button that pans the camera (VIEW-19) and moves the pointer by the given amount in steps. */
async function pan(page: Page, button: PanButton, from: Point, delta: Point): Promise<void> {
    await hover(page, from);
    await page.mouse.down({ button });
    await page.mouse.move(from.x + delta.x, from.y + delta.y, { steps: DRAG_STEPS });
    await waitForStillFrame(page);
    await page.mouse.up({ button });
    await waitForStillFrame(page);
}

/** Share of the screen that is dark. The table is dark and the background behind it is bright. */
async function darkShare(page: Page): Promise<number> {
    const frame = await page.screenshot();

    return page.evaluate(measureDarkShare, frame.toString('base64'));
}

async function measureDarkShare(base64: string): Promise<number> {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();

    const width = 192;
    const height = 108;
    const context = new OffscreenCanvas(width, height).getContext('2d')!;
    context.drawImage(image, 0, 0, width, height);

    const pixels = context.getImageData(0, 0, width, height).data;
    let dark = 0;
    for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index] + pixels[index + 1] + pixels[index + 2] < 200) {
            dark += 1;
        }
    }

    return dark / (width * height);
}

async function hover(page: Page, point: Point): Promise<void> {
    await page.mouse.move(point.x, point.y);
    await waitForStillFrame(page);
}

async function dragTo(page: Page, from: Point, to: Point): Promise<void> {
    await hover(page, from);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: DRAG_STEPS });
    await waitForStillFrame(page);
    await page.mouse.up();
    await waitForStillFrame(page);
}

function frameOf(page: Page, clip: Area): Promise<Buffer> {
    return page.screenshot({ clip });
}

async function isArrowGreenBetween(page: Page, from: Point, to: Point): Promise<boolean> {
    const [red, green, blue] = await readArrowMiddle(page, from, to);

    return green > red && green > blue;
}

/** The table is dark and reddish, so only the strong red of the arrow passes. */
async function isArrowRedBetween(page: Page, from: Point, to: Point): Promise<boolean> {
    const [red, green] = await readArrowMiddle(page, from, to);

    return red > ARROW_RED_MIN_VALUE && green < red / 2;
}

/** The arrow is straight, so its middle is halfway between the attacker and the pointer. */
async function readArrowMiddle(page: Page, from: Point, to: Point): Promise<number[]> {
    const clip = { x: Math.round((from.x + to.x) / 2), y: Math.round((from.y + to.y) / 2), width: 1, height: 1 };
    const pixel = await page.screenshot({ clip });

    return page.evaluate(readPixel, pixel.toString('base64'));
}

async function readPixel(base64: string): Promise<number[]> {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();

    const context = new OffscreenCanvas(1, 1).getContext('2d')!;
    context.drawImage(image, 0, 0);

    return Array.from(context.getImageData(0, 0, 1, 1).data);
}

function atZoom(point: Point, zoom: number): Point {
    const ratio = zoom / INITIAL_ZOOM;

    return {
        x: VIEW_CENTER.x + (point.x - VIEW_CENTER.x) * ratio,
        y: VIEW_CENTER.y + (point.y - VIEW_CENTER.y) * ratio
    };
}

export type { Area, PanButton, Point };
export {
    EMPTY_OWN_SLOT,
    EMPTY_SIDE_RIVAL_SLOT,
    EMPTY_TABLE,
    EXPANDED_HAND_AREA,
    SIDE_ZONE_AREA,
    HAND_CARD,
    SOLE_HAND_CARD,
    INITIAL_ZOOM,
    OWN_SLOT_AREA,
    OWN_WARRIOR,
    RIVAL_WARRIOR,
    SIDE_RIVAL_WARRIOR,
    TABLE_AREA,
    TOOLTIP_AREA,
    VIEW_CENTER,
    WHEEL_UP_DELTA,
    atZoom,
    darkShare,
    dragTo,
    frameOf,
    hover,
    isArrowGreenBetween,
    isArrowRedBetween,
    openBoard,
    openGame,
    pan,
    waitForStillFrame,
    zoomIn,
    zoomOut
};
