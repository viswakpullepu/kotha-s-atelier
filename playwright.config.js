const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // run tests sequentially to avoid parallel resource conflicts
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8089',
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'node tests/server.js',
    url: 'http://localhost:8089',
    reuseExistingServer: true,
    timeout: 10000,
  },
});
