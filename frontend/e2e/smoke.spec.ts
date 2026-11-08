import { expect, test } from '@/support/test';

function hasWebGlContext(): boolean {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;

    return Boolean(canvas.getContext('webgl') ?? canvas.getContext('webgl2'));
}

test.describe('Phaser', () => {
    test('starts with a WebGL context', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('canvas')).toBeAttached();

        expect(await page.evaluate(hasWebGlContext)).toBe(true);
    });
});
