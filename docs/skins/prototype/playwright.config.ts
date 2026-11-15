import { defineConfig } from '@playwright/test';
import base from '../playwright.config';

const VIEWPORT = { width: 1920, height: 1080 };

export default defineConfig({
    ...base,
    testDir: '.',
    testMatch: '*.record.spec.ts',
    outputDir: './results',
    timeout: 120000,
    use: {
        ...base.use,
        reducedMotion: 'no-preference',
        video: { mode: 'on', size: VIEWPORT }
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
