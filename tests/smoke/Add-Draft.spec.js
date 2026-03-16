import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import DashboardPage from '../../pages/DashboardPage.js';
import AddProductPage from '../../pages/AddProductPage.js';
import DraftsPage from '../../pages/DraftsPage.js';
import ENV from '../../constants/env.js';
import productUrls from '../../fixtures/productsUrls.json' assert { type: 'json' };

test('login, add draft from Amazon, publish it', async ({ page }) => {
  const login = new LoginPage(page);
  const dashboard = new DashboardPage(page);
  const addProduct = new AddProductPage(page);
  const drafts = new DraftsPage(page);

  await login.open();
  await login.login(ENV.defaultUserEmail, ENV.defaultUserPassword);

  await dashboard.openAddProduct();
  await addProduct.addDraftFromAmazon(productUrls.amazonItalySample);

  await dashboard.goToDrafts();
  await drafts.selectDraftByRowIndex(0);
  await drafts.publishSelectedDrafts();

  await expect(page).toHaveURL(/drafts/);
});
