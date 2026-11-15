// Reference only, not production code: the Playwright configuration of capture.spec.ts, from frontend/prototypes/.
import { defineConfig } from '@playwright/test';
import base from '../playwright.config';

export default defineConfig({
    ...base,
    testDir: '.',
    testMatch: 'capture.spec.ts',
    outputDir: './results',
    timeout: 120000,
    use: {
        ...base.use,
        reducedMotion: 'no-preference'
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...base.projects![0].use,
                launchOptions: { args: ['--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-gpu'] }
            }
        }
    ],
    webServer: { ...(base.webServer as object), cwd: '..' } as never
});
