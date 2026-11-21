import { expect, test as base } from '@playwright/test';
import BackendDouble from '@/support/BackendDouble';

interface TestOptions {
    /** Every animation and wait of an effect ends at once (`EffectSettings`), unless a test looks at an animation on its way. */
    instantMotion: boolean;
}

const test = base.extend<TestOptions & { backend: BackendDouble }>({
    instantMotion: [true, { option: true }],
    /** Automatic, so that no test can reach the Vite proxy and through it a real backend. */
    backend: [
        async ({ page, instantMotion }, use) => {
            if (instantMotion) {
                await page.addInitScript(() => {
                    window.crmInstantMotion = true;
                });
            }

            const backend = new BackendDouble(page);
            await backend.install();

            await use(backend);

            expect(backend.unexpectedRequests).toEqual([]);
        },
        { auto: true }
    ]
});

export { expect, test };
