// tests/smoke/Add-Draft.spec.js
import { test, expect } from '@playwright/test';
import LoginPage      from '../../pages/LoginPage.js';
import AddProductPage from '../../pages/AddProductPage.js';
import DashboardPage  from '../../pages/DashboardPage.js';
import DraftsPage     from '../../pages/DraftsPage.js';
import ENV            from '../../constants/env.js';
import productUrls    from '../../fixtures/productsUrls.json' assert { type: 'json' };

test('login → add draft from Amazon Italy → publish it', async ({ page }) => {
  const login      = new LoginPage(page);
  const addProduct = new AddProductPage(page);
  const dashboard  = new DashboardPage(page);
  const drafts     = new DraftsPage(page);

  // Step 1: Login
  await login.open();
  await login.login(ENV.defaultUserEmail, ENV.defaultUserPassword);

  // Step 2: Add draft from Amazon
  // NOTE: addDraftFromAmazon() handles its own navigation via sidebar click.
  // Do NOT call dashboard.openAddProduct() before this — it causes a double-navigation.
  await addProduct.addDraftFromAmazon(productUrls.amazonItaly1);

  // Step 3: Go to Drafts and publish the first draft
  await dashboard.goToDrafts();
  await drafts.selectDraftByRowIndex(0);
  await drafts.publishSelectedDrafts();

  // Step 4: Verify we're still on the drafts page after publish
  await expect(page).toHaveURL(/drafts/);
});
