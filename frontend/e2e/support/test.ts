import { expect, test as base } from '@playwright/test';
import BackendDouble from '@/support/BackendDouble';

/** Automatic, so that no test can reach the Vite proxy and through it a real backend. */
const test = base.extend<{ backend: BackendDouble }>({
    backend: [
        async ({ page }, use) => {
            const backend = new BackendDouble(page);
            await backend.install();

            await use(backend);

            expect(backend.unexpectedRequests).toEqual([]);
        },
        { auto: true }
    ]
});

export { expect, test };
