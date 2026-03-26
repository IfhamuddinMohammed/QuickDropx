// playwright.config.js
import { defineConfig } from '@playwright/test';
import ENV from './constants/env.js';

export default defineConfig({
  testDir: './tests',
  timeout: ENV.timeout,

  use: {
    baseURL: ENV.baseUrl,

    // Headed locally, headless in CI automatically
    headless: process.env.CI === 'true',

    actionTimeout:     ENV.timeout,
    navigationTimeout: ENV.timeout,

    screenshot: 'only-on-failure',
    video:      'retain-on-failure',
    trace:      'on-first-retry'
  },

  // Retry flaky tests once in CI
  retries: process.env.CI === 'true' ? 1 : 0,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ]
});
