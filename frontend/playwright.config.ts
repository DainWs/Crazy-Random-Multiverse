import { defineConfig, devices } from '@playwright/test';

const E2E_PORT = 4173;
const E2E_ORIGIN = `http://localhost:${E2E_PORT}`;
const VIEWPORT = { width: 1920, height: 1080 };

export default defineConfig({
    testDir: './e2e',
    snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{testFilePath}/{arg}{ext}',
    // Software WebGL uses the whole CPU, and a starved frame would change the screenshots.
    workers: 1,
    forbidOnly: true,
    reporter: 'list',
    use: {
        baseURL: E2E_ORIGIN,
        // A pulse would keep the frames from ever being still, so the images and the wait for a still frame need it off.
        reducedMotion: 'reduce',
        trace: 'retain-on-failure'
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: VIEWPORT,
                deviceScaleFactor: 1,
                launchOptions: {
                    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
                }
            }
        }
    ],
    webServer: {
        command: `npx vite --config vite/config.dev.mjs --port ${E2E_PORT} --strictPort`,
        url: E2E_ORIGIN,
        reuseExistingServer: false
    }
});
