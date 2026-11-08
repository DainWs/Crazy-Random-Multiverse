import { expect, test } from '@playwright/test';

const SOCKET_URL = /\/socket\.io\//;
const NO_SESSION = { status: 400, json: { key: 'exception.user.not_found' } };
const REGISTERED_USER = { json: { id: 'user-1', username: 'Tester' } };

function hasWebGlContext(): boolean {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;

    return Boolean(canvas.getContext('webgl') ?? canvas.getContext('webgl2'));
}

test.describe('Phaser', () => {
    test('starts with a WebGL context', async ({ page }) => {
        await page.route('**/user', (route) => route.fulfill(NO_SESSION));
        await page.route('**/register', (route) => route.fulfill(REGISTERED_USER));
        await page.routeWebSocket(SOCKET_URL, () => undefined);

        await page.goto('/');
        await expect(page.locator('canvas')).toBeAttached();

        expect(await page.evaluate(hasWebGlContext)).toBe(true);
    });
});
