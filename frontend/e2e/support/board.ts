import type { Page } from '@playwright/test';
import type BackendDouble from '@/support/BackendDouble';
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
const STILL_FRAME_TIMEOUT_MS = 10000;
const DRAG_STEPS = 12;

/** Where the cards of the prepared game of two players are drawn at the initial zoom. */
const OWN_WARRIOR: Point = { x: 888, y: 715 };
const RIVAL_WARRIOR: Point = { x: 1014, y: 180 };
const HAND_CARD: Point = { x: 90, y: 1045 };
const EMPTY_OWN_SLOT: Point = { x: 960, y: 715 };
const EMPTY_TABLE: Point = { x: 1250, y: 450 };

/** Where the cards of the left rival of the prepared game of three players are drawn, in a rotated zone. */
const SIDE_RIVAL_WARRIOR: Point = { x: 705, y: 348 };
const EMPTY_SIDE_RIVAL_SLOT: Point = { x: 787, y: 412 };

const TOOLTIP_AREA: Area = { x: 1440, y: 0, width: 480, height: 1080 };
const EXPANDED_HAND_AREA: Area = { x: 0, y: 780, width: 570, height: 225 };
const OWN_SLOT_AREA: Area = { x: 930, y: 665, width: 60, height: 100 };

async function openBoard(page: Page, backend: BackendDouble, playerCount: number = 2): Promise<void> {
    backend.prepare(createPreparedGame(playerCount));

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

/** The arrow is straight, so its middle is halfway between the attacker and the pointer. */
async function isArrowGreenBetween(page: Page, from: Point, to: Point): Promise<boolean> {
    const clip = { x: Math.round((from.x + to.x) / 2), y: Math.round((from.y + to.y) / 2), width: 1, height: 1 };
    const pixel = await page.screenshot({ clip });

    return page.evaluate(isPixelGreen, pixel.toString('base64'));
}

async function isPixelGreen(base64: string): Promise<boolean> {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();

    const context = new OffscreenCanvas(1, 1).getContext('2d')!;
    context.drawImage(image, 0, 0);
    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;

    return green > red && green > blue;
}

function atZoom(point: Point, zoom: number): Point {
    const ratio = zoom / INITIAL_ZOOM;

    return {
        x: VIEW_CENTER.x + (point.x - VIEW_CENTER.x) * ratio,
        y: VIEW_CENTER.y + (point.y - VIEW_CENTER.y) * ratio
    };
}

export type { Area, Point };
export {
    EMPTY_OWN_SLOT,
    EMPTY_SIDE_RIVAL_SLOT,
    EMPTY_TABLE,
    EXPANDED_HAND_AREA,
    HAND_CARD,
    INITIAL_ZOOM,
    OWN_SLOT_AREA,
    OWN_WARRIOR,
    RIVAL_WARRIOR,
    SIDE_RIVAL_WARRIOR,
    TOOLTIP_AREA,
    atZoom,
    dragTo,
    frameOf,
    hover,
    isArrowGreenBetween,
    openBoard,
    waitForStillFrame,
    zoomOut
};
