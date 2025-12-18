
//tetsts/smoke/signup.test.js

import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import RegisterPage from '../../pages/RegisterPage.js';
import DashboardPage from '../../pages/DashboardPage.js';
import ENV from '../../constants/env.js';

test('signup and onboarding flows (POM)', async ({ page }) => {
  const login = new LoginPage(page);
  const register = new RegisterPage(page);
  const dashboard = new DashboardPage(page);

  // // Open login page
  // await login.open();

  // // Go to Register
  // await page.getByText('Register').click();

  // //Instead of opening login, and clicking Register, can go directly:
  await page.goto('/signup');


  const user = {
    email: `auto_${Date.now()}@yopmail.com`,
    fullName: ENV.defaultFullName,
    password: ENV.defaultUserPassword
  };

  // Register → Choose Store
  const chooseStore = await register.register(user);

  // Choose Store → Choose Package
  const choosePackage = await chooseStore.chooseStore(ENV.chooseStore);

  // Choose Package → Payment
  const payment = await choosePackage.choosePackage(ENV.choosePackage);

  // Fill payment details
  await payment.fillStripeCard({
    number: ENV.defaultCardNumber,
    exp: ENV.expdate,
    cvc: ENV.cvc
  });

  await payment.continue();

  // Confirmation
  await expect(
    page.getByText('Your QuickdropX trial plan is')
  ).toBeVisible();

  await page.getByRole('button', { name: 'Go to Dashboard' }).click();

  // Dashboard
  await dashboard.expectOverviewVisible();
});
