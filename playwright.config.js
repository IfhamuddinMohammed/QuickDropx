import { defineConfig } from '@playwright/test';
import ENV from './constants/env.js';

export default defineConfig({
  testDir: './tests',
  timeout: ENV.timeout,

  use: {
    baseURL: ENV.baseUrl,
    headless: false,
    actionTimeout: ENV.timeout,
    navigationTimeout: ENV.timeout,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ]
});
