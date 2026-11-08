import type { Page } from '@playwright/test';
import type BackendDouble from '@/support/BackendDouble';
import { waitForStillFrame } from '@/support/board';
import { createLoadingGame } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const LOADING_VIEW = { clip: { x: 270, y: 360, width: 490, height: 160 }, maxDiffPixels: 0 };
const RETRY_BUTTON = { x: 512, y: 488 };
const REQUIRED_TEXTURE = 'card.unknown';

async function openLoadWaitingForTexture(page: Page, backend: BackendDouble): Promise<void> {
    backend.holdTexture(REQUIRED_TEXTURE);

    await page.goto('/');
    await expect.poll(() => backend.textureRequests).toContain(REQUIRED_TEXTURE);
    await waitForStillFrame(page);
}

async function openLoadWithFailedTexture(page: Page, backend: BackendDouble): Promise<void> {
    backend.failTextureOnce(REQUIRED_TEXTURE);

    await page.goto('/');
    await expect.poll(() => backend.textureRequests).toContain(REQUIRED_TEXTURE);
    await waitForStillFrame(page);
}

test.describe('game load', () => {
    test.beforeEach(({ backend }) => {
        backend.prepareLoading(createLoadingGame(2));
    });

    // UI-22
    test('shows the progress of the downloads', async ({ page, backend }) => {
        await openLoadWaitingForTexture(page, backend);

        await expect(page).toHaveScreenshot('loading.png', LOADING_VIEW);
    });

    // LOAD-2
    test('sends no ready while a download is pending', async ({ page, backend }) => {
        await openLoadWaitingForTexture(page, backend);

        expect(backend.readyCalls).toBe(0);
    });

    // LOAD-2
    test('sends ready after the downloads', async ({ page, backend }) => {
        await openLoadWaitingForTexture(page, backend);

        await backend.releaseTextures();

        await expect.poll(() => backend.readyCalls).toBe(1);
    });

    // UI-22
    test('shows the wait for the other players', async ({ page, backend }) => {
        await openLoadWaitingForTexture(page, backend);

        await backend.releaseTextures();
        await expect.poll(() => backend.readyCalls).toBe(1);
        await waitForStillFrame(page);

        await expect(page).toHaveScreenshot('waiting.png', LOADING_VIEW);
    });

    // UI-12
    test('shows the failure of a download', async ({ page, backend }) => {
        await openLoadWithFailedTexture(page, backend);

        await expect(page).toHaveScreenshot('load-failed.png', LOADING_VIEW);
    });

    // UI-12
    test('sends no ready after a failed download', async ({ page, backend }) => {
        await openLoadWithFailedTexture(page, backend);

        expect(backend.readyCalls).toBe(0);
    });

    // UI-12
    test('retries only the download that failed', async ({ page, backend }) => {
        await openLoadWithFailedTexture(page, backend);
        const requestsBeforeRetry = backend.textureRequests.length;

        await page.mouse.click(RETRY_BUTTON.x, RETRY_BUTTON.y);
        await expect.poll(() => backend.readyCalls).toBe(1);

        expect(backend.textureRequests.slice(requestsBeforeRetry)).toEqual([REQUIRED_TEXTURE]);
    });
});
