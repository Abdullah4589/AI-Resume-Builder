import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox / WebKit binaries are installed; enable if cross-browser coverage is wanted.
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
  ],

  /*
   * Client (5173) and API (3001) are started separately so Playwright waits for
   * BOTH to be reachable. Waiting only on 5173 lets tests start before the
   * Express server is listening, which fails the /api/pdf export tests.
   */
  webServer: [
    {
      command: 'npm run dev:client',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      // serve:server, not dev:server — `tsx watch` never boots the server when
      // Playwright pipes its stdio, so the readiness probe times out.
      command: 'npm run serve:server',
      // 127.0.0.1, not localhost: Node resolves localhost to ::1 first and the
      // Express server binds IPv4 only, so the readiness probe never succeeds.
      url: 'http://127.0.0.1:3001/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
