import type { Page } from '@playwright/test';
import type BackendDouble from '@/support/BackendDouble';
import { openBoard, waitForStillFrame } from '@/support/board';
import { createLoadingGame } from '@/support/preparedGame';
import { expect, test } from '@/support/test';

const FIXED_TEXTURE = 'card.unknown';

function requestsOf(backend: BackendDouble, key: string): number {
    return backend.textureRequests.filter((requested) => requested === key).length;
}

async function reloadDuringTheGame(page: Page, backend: BackendDouble): Promise<void> {
    await backend.reloadPage();
    await backend.waitForBoardDrawn();
    await waitForStillFrame(page);
}

async function reloadDuringTheLoad(page: Page, backend: BackendDouble): Promise<void> {
    await backend.reloadPage();
    await expect.poll(() => requestsOf(backend, FIXED_TEXTURE)).toBe(2);
    await waitForStillFrame(page);
}

test.describe('page reload', () => {
    test.describe('during a game', () => {
        test.beforeEach(async ({ page, backend }) => {
            await openBoard(page, backend);
        });

        // CON-23
        test('shows the board again', async ({ page, backend }) => {
            const boardBeforeReload = await page.screenshot();

            await reloadDuringTheGame(page, backend);

            expect((await page.screenshot()).equals(boardBeforeReload)).toBe(true);
        });

        // LOAD-6
        test('downloads the fixed resources again', async ({ page, backend }) => {
            await reloadDuringTheGame(page, backend);

            expect(requestsOf(backend, FIXED_TEXTURE)).toBe(2);
        });

        // LOAD-6
        test('sends no ready', async ({ page, backend }) => {
            await reloadDuringTheGame(page, backend);

            expect(backend.readyCalls).toBe(0);
        });
    });

    test.describe('during the load', () => {
        test.beforeEach(async ({ page, backend }) => {
            backend.prepareLoading(createLoadingGame(2));
            backend.holdTexture(FIXED_TEXTURE);

            await page.goto('/');
            await expect.poll(() => requestsOf(backend, FIXED_TEXTURE)).toBe(1);
            await waitForStillFrame(page);
        });

        // CON-23
        test('goes back to the loading screen', async ({ page, backend }) => {
            const loadingBeforeReload = await page.screenshot();

            await reloadDuringTheLoad(page, backend);

            expect((await page.screenshot()).equals(loadingBeforeReload)).toBe(true);
        });

        // LOAD-2
        test('confirms ready after the downloads', async ({ page, backend }) => {
            await reloadDuringTheLoad(page, backend);

            await backend.releaseTextures();

            await expect.poll(() => backend.readyCalls).toBe(1);
        });
    });
});

// UI-9
test.describe('lost connection', () => {
    test.beforeEach(async ({ page, backend }) => {
        await openBoard(page, backend);
    });

    test('covers the game while the client reconnects and uncovers it when the state is back', async ({ page, backend }) => {
        const notice = page.getByRole('alert');

        backend.dropSocket();

        await expect(notice).toHaveText('Sin conexión. Reconectando...');
        await expect(notice).toBeHidden();
    });
});

// UI-24
test.describe('server unreachable at startup', () => {
    test('shows the main menu with a notice to reload the page', async ({ page, backend }) => {
        backend.makeUnreachable();

        await page.goto('/');

        await expect(page.getByRole('button', { name: 'Crear party' })).toBeVisible();
        await expect(page.getByRole('alert')).toContainText('Recarga la página');
    });
});
