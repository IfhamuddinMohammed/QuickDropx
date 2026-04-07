// tests/smoke/login.test.js

import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import DashboardPage from '../../pages/DashboardPage.js';
import ENV from '../../constants/env.js';

test('Verify user can login successfully', async ({ page }) => {
  const login = new LoginPage(page);
  const dashboard = new DashboardPage(page);

  await login.open();
  await login.login(
    ENV.defaultUserEmail,
    ENV.defaultUserPassword
  );

  // "Here's what's happening..." is a <p>, not a heading — use the actual <h1> instead.
  await expect(
    page.getByRole('heading', { name: /Welcome back,/i })
  ).toBeVisible();
});
