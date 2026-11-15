import type { Page } from '@playwright/test';
import { createPreparedGame } from '@/support/preparedGame';
import { test } from '@/support/test';

const VARIANTS = ['actual', 'fantasy', 'parchment', 'neon', 'sci-fi', 'arcade-blocks', 'wood'];
const FALLBACK: Record<string, { x: number; y: number }> = {
    pass: { x: 1830, y: 1036 },
    surrender: { x: 1840, y: 980 },
    yes: { x: 830, y: 590 },
    no: { x: 1090, y: 590 }
};
const AWAY = { x: 1450, y: 860 };
const STEPS = 15;

async function target(page: Page, name: string) {
    const found = await page.evaluate((n) => {
        const w = window as unknown as { __hudTargets?: Record<string, { x: number; y: number }> };
        return w.__hudTargets?.[n];
    }, name);
    return found ?? FALLBACK[name];
}

async function moveTo(page: Page, point: { x: number; y: number }, wait: number) {
    await page.mouse.move(point.x, point.y, { steps: STEPS });
    await page.waitForTimeout(wait);
}

for (const variant of VARIANTS) {
    test(`hud style ${variant}`, async ({ page, backend }) => {
        await page.addInitScript((name) => {
            (window as unknown as { __hudVariant: string }).__hudVariant = name;
        }, variant);
        // Headless video has no cursor: draw one
        await page.addInitScript(() => {
            window.addEventListener('DOMContentLoaded', () => {
                const cursor = document.createElement('div');
                cursor.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;z-index:99999;pointer-events:none;' +
                    'border-left:9px solid transparent;border-right:9px solid transparent;border-bottom:22px solid white;' +
                    'filter:drop-shadow(0 0 2px black);transform-origin:9px 0;';
                document.body.appendChild(cursor);
                window.addEventListener('mousemove', (e) => {
                    cursor.style.transform = `translate(${e.clientX - 9}px, ${e.clientY}px) rotate(-30deg)`;
                }, true);
            });
        });
        backend.prepare(createPreparedGame(2));
        await page.goto('/');
        await backend.waitForBoardDrawn();
        await page.waitForTimeout(4000);
        await page.mouse.move(AWAY.x, AWAY.y);
        await page.waitForTimeout(1500);

        await moveTo(page, await target(page, 'pass'), 1300);
        await moveTo(page, AWAY, 900);
        const surrender = await target(page, 'surrender');
        await moveTo(page, surrender, 1300);
        await page.mouse.down();
        await page.mouse.up();
        await page.waitForTimeout(1200);
        await moveTo(page, await target(page, 'no'), 1100);
        await moveTo(page, await target(page, 'yes'), 1100);
        const no = await target(page, 'no');
        await moveTo(page, no, 700);
        await page.mouse.down();
        await page.mouse.up();
        await page.waitForTimeout(1500);
    });
}
