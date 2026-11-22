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
/** The zoom the top-down camera frames the table of two players with at 1920 by 1080 (VIEW-57). */
const INITIAL_ZOOM = 1.122;
const WHEEL_DOWN_DELTA = 100;
const WHEEL_UP_DELTA = -100;
const STILL_FRAME_TIMEOUT_MS = 20000;
const DRAG_STEPS = 12;
/** Equal frames in a row after the first: with every effect ending at once (`instantMotion`), a change lasts one frame. */
const STILL_FRAMES_REQUIRED = 1;

/** The side panel waits 150 ms and then takes 250 ms to close (VIEW-64), and the frames of that wait are equal. */
const TOOLTIP_CLOSE_MS = 450;

/** The veil, the wait and the notice of an elimination last 4200 ms (VIEW-11). The wait before the notice has equal frames. */
const ELIMINATION_DURATION_MS = 4500;

/** Where the cards of the prepared game of two players are drawn at the initial zoom, with the top-down camera. */
const OWN_WARRIOR: Point = { x: 880, y: 774 };
const RIVAL_WARRIOR: Point = { x: 1039, y: 305 };
const HAND_CARD: Point = { x: 830, y: 1050 };
const SOLE_HAND_CARD: Point = { x: 960, y: 1050 };
const EMPTY_OWN_SLOT: Point = { x: 960, y: 774 };
const EMPTY_TABLE: Point = { x: 1250, y: 450 };

/** Where the cards of the left rival of the prepared game of three players are drawn, in a rotated zone. */
const SIDE_RIVAL_WARRIOR: Point = { x: 691, y: 476 };
const EMPTY_SIDE_RIVAL_SLOT: Point = { x: 783, y: 540 };

const TABLE_AREA: Area = { x: 490, y: 60, width: 940, height: 950 };
const TOOLTIP_AREA: Area = { x: 1440, y: 0, width: 480, height: 1080 };
/** Where the side panel of a card in the right half of the screen opens (VIEW-14). */
const LEFT_TOOLTIP_AREA: Area = { x: 0, y: 0, width: 480, height: 1080 };
const EXPANDED_HAND_AREA: Area = { x: 700, y: 840, width: 520, height: 200 };
const SIDE_ZONE_AREA: Area = { x: 545, y: 440, width: 290, height: 200 };
const OWN_SLOT_AREA: Area = { x: 924, y: 720, width: 72, height: 108 };

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

/** The canvas has no DOM to wait on, so two frames in a row equal but for the noise of the GPU mean that the animations ended. */
async function waitForStillFrame(page: Page, differentFrom?: Buffer): Promise<void> {
    let previous: Buffer | undefined;
    let equalFrames = 0;

    await expect
        .poll(
            async () => {
                const frame = await page.screenshot();
                const still = previous !== undefined && (await sameFrame(page, previous, frame));
                equalFrames = still ? equalFrames + 1 : 0;
                previous = frame;
                const changed = differentFrom === undefined || !(await sameFrame(page, differentFrom, frame));
                return equalFrames >= STILL_FRAMES_REQUIRED && changed;
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

/** Largest step of a channel between two frames that is noise of the GPU and not a change: it rounds some pixels one level apart. */
const FRAME_NOISE_LEVEL = 2;

/** Whether two frames of the same area show the same: no pixel differs more than the noise of the GPU. */
async function sameFrame(page: Page, first: Buffer, second: Buffer): Promise<boolean> {
    if (first.equals(second)) {
        return true;
    }

    return page.evaluate(compareFrames, { first: first.toString('base64'), second: second.toString('base64'), noise: FRAME_NOISE_LEVEL });
}

async function compareFrames({ first, second, noise }: { first: string; second: string; noise: number }): Promise<boolean> {
    const decode = async (base64: string) => {
        const image = new Image();
        image.src = `data:image/png;base64,${base64}`;
        await image.decode();
        const context = new OffscreenCanvas(image.width, image.height).getContext('2d')!;
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height).data;
    };

    const [a, b] = await Promise.all([decode(first), decode(second)]);
    if (a.length !== b.length) {
        return false;
    }

    for (let index = 0; index < a.length; index++) {
        if (Math.abs(a[index] - b[index]) > noise) {
            return false;
        }
    }

    return true;
}

/** Share of the strongest steps of light between neighbor pixels that `edgeStrength` averages. */
const STRONGEST_EDGES_SHARE = 0.02;

/**
 * How sharp an area is: the mean of the strongest steps of light between neighbor pixels. A text enlarged from a texture
 * smaller than it is blurred, which lowers its strongest steps, while a text drawn at its size keeps them.
 */
async function edgeStrength(page: Page, clip: Area): Promise<number> {
    const frame = await page.screenshot({ clip });

    return page.evaluate(measureEdgeStrength, { base64: frame.toString('base64'), share: STRONGEST_EDGES_SHARE });
}

async function measureEdgeStrength({ base64, share }: { base64: string; share: number }): Promise<number> {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();

    const context = new OffscreenCanvas(image.width, image.height).getContext('2d')!;
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, image.width, image.height).data;
    const light = (x: number, y: number) => {
        const index = (y * image.width + x) * 4;
        return pixels[index] + pixels[index + 1] + pixels[index + 2];
    };

    const steps: number[] = [];
    for (let y = 0; y < image.height - 1; y++) {
        for (let x = 0; x < image.width - 1; x++) {
            steps.push(Math.abs(light(x + 1, y) - light(x, y)), Math.abs(light(x, y + 1) - light(x, y)));
        }
    }

    steps.sort((a, b) => b - a);
    const strongest = steps.slice(0, Math.max(1, Math.floor(steps.length * share)));
    return strongest.reduce((sum, step) => sum + step, 0) / strongest.length;
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
    await page.waitForTimeout(TOOLTIP_CLOSE_MS);
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

const CARD_AREA_MARGIN = 70;

/** The area of a card drawn around `center`, with room for its lift (VIEW-4). */
function cardArea(center: Point): Area {
    return {
        x: center.x - CARD_AREA_MARGIN,
        y: center.y - CARD_AREA_MARGIN,
        width: CARD_AREA_MARGIN * 2,
        height: CARD_AREA_MARGIN * 2
    };
}

function frameOf(page: Page, clip: Area): Promise<Buffer> {
    return page.screenshot({ clip });
}

/** The frames of the attack (VIEW-4): the strong green and red that the dark table and the art of the cards seldom have. */
type FrameColor = 'green' | 'red';

const FRAME_AREA_MARGIN = 80;
const FRAME_MIN_PIXELS = 60;

/** How many pixels around `center` have the color of a frame. */
async function countFramePixels(page: Page, center: Point, color: FrameColor): Promise<number> {
    const clip = { x: center.x - FRAME_AREA_MARGIN, y: center.y - FRAME_AREA_MARGIN, width: FRAME_AREA_MARGIN * 2, height: FRAME_AREA_MARGIN * 2 };
    const area = await page.screenshot({ clip });

    return page.evaluate(countPixels, { base64: area.toString('base64'), color });
}

/** Whether a frame of `color` has appeared around `center` since `before`, which is what `countFramePixels` gave then. */
async function hasFrameSince(page: Page, center: Point, color: FrameColor, before: number): Promise<boolean> {
    return (await countFramePixels(page, center, color)) - before > FRAME_MIN_PIXELS;
}

async function countPixels({ base64, color }: { base64: string; color: FrameColor }): Promise<number> {
    const matches = {
        green: (red: number, green: number, blue: number) => green > 150 && red < 100 && blue < 140,
        red: (red: number, green: number, blue: number) => red > 200 && green < 110 && blue < 100
    }[color];
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();

    const context = new OffscreenCanvas(image.width, image.height).getContext('2d')!;
    context.drawImage(image, 0, 0);
    const { data } = context.getImageData(0, 0, image.width, image.height);

    let count = 0;
    for (let index = 0; index < data.length; index += 4) {
        if (matches(data[index], data[index + 1], data[index + 2])) {
            count++;
        }
    }

    return count;
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
    ELIMINATION_DURATION_MS,
    EMPTY_OWN_SLOT,
    EMPTY_SIDE_RIVAL_SLOT,
    EMPTY_TABLE,
    EXPANDED_HAND_AREA,
    SIDE_ZONE_AREA,
    HAND_CARD,
    SOLE_HAND_CARD,
    INITIAL_ZOOM,
    LEFT_TOOLTIP_AREA,
    OWN_SLOT_AREA,
    OWN_WARRIOR,
    RIVAL_WARRIOR,
    SIDE_RIVAL_WARRIOR,
    TABLE_AREA,
    TOOLTIP_AREA,
    VIEW_CENTER,
    WHEEL_UP_DELTA,
    atZoom,
    cardArea,
    darkShare,
    edgeStrength,
    dragTo,
    frameOf,
    hover,
    countFramePixels,
    hasFrameSince,
    openBoard,
    openGame,
    pan,
    sameFrame,
    waitForStillFrame,
    zoomIn,
    zoomOut
};
