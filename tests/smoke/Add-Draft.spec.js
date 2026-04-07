// tests/smoke/Add-Draft.spec.js
import { test, expect } from '@playwright/test';
import LoginPage      from '../../pages/LoginPage.js';
import AddProductPage from '../../pages/AddProductPage.js';
import DashboardPage  from '../../pages/DashboardPage.js';
import ENV            from '../../constants/env.js';
import productUrls    from '../../fixtures/productsUrls.json' assert { type: 'json' };

test('login → add draft from Amazon Italy', async ({ page }) => {
  test.setTimeout(120_000); // login + import (can be slow)
  const login      = new LoginPage(page);
  const addProduct = new AddProductPage(page);
  const dashboard  = new DashboardPage(page);

  // Step 1: Login
  await login.open();
  await login.login(ENV.defaultUserEmail, ENV.defaultUserPassword);

  // Step 2: Open Add Product dialog and import from Amazon Italy
  await dashboard.openAddProduct();

  // Try multiple Amazon Italy candidate URLs from fixtures until one imports successfully.
  const candidates = Object.values(productUrls).filter(u => typeof u === 'string' && u.includes('amazon.it'));
  let added = false;
  for (const candidate of candidates) {
    try {
      await addProduct.addDraftFromAmazon(candidate);
      added = true;
      break;
    } catch (err) {
      if (err.message === 'DuplicateProductError') {
        // product already present — try next candidate
        continue;
      }
      throw err;
    }
  }
  if (!added) throw new Error('Unable to add any Amazon Italy product — all candidates were duplicates or failed to import.');

  // Step 3: Confirm draft appears in Drafts page
  await dashboard.goToDrafts();
  await expect(page).toHaveURL(/drafts/, { timeout: 10_000 });
});
