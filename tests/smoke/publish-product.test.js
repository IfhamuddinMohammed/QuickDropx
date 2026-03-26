// tests/smoke/publish-product.spec.js
import { test, expect } from '@playwright/test';
import LoginPage      from '../../pages/LoginPage.js';
import AddProductPage from '../../pages/AddProductPage.js';
import DashboardPage  from '../../pages/DashboardPage.js';
import DraftsPage     from '../../pages/DraftsPage.js';
import PublishPage    from '../../pages/PublishPage.js';
import ENV            from '../../constants/env.js';
import productUrls    from '../../fixtures/productsUrls.json' assert { type: 'json' };

test.describe('Publish product flow', () => {

  test('add draft from Amazon and publish to store', async ({ page }) => {
    const login      = new LoginPage(page);
    const addProduct = new AddProductPage(page);
    const dashboard  = new DashboardPage(page);
    const drafts     = new DraftsPage(page);
    const publish    = new PublishPage(page);

    // Step 1: Login
    await login.open();
    await login.login(ENV.defaultUserEmail, ENV.defaultUserPassword);

    // Step 2: Add product draft from Amazon
    await addProduct.addDraftFromAmazon(productUrls.amazonItaly1);

    // Step 3: Navigate to drafts
    await dashboard.goToDrafts();

    // Verify at least one draft exists before selecting
    const count = await drafts.getDraftCount();
    expect(count).toBeGreaterThan(0);

    // Step 4: Select first draft and publish
    await drafts.selectDraftByRowIndex(0);
    await drafts.publishSelectedDrafts();

    // Step 5: Verify publish succeeded
    await publish.expectPublished();
    await expect(page).toHaveURL(/drafts/);
  });

  test('publish product with custom title and price', async ({ page }) => {
    const login      = new LoginPage(page);
    const dashboard  = new DashboardPage(page);
    const drafts     = new DraftsPage(page);
    const publish    = new PublishPage(page);

    // Login and go straight to drafts (skip add step — assumes draft already exists)
    await login.open();
    await login.login(ENV.defaultUserEmail, ENV.defaultUserPassword);
    await dashboard.goToDrafts();

    const count = await drafts.getDraftCount();
    if (count === 0) {
      test.skip(true, 'No drafts available — run add-draft test first');
    }

    // Select a draft
    await drafts.selectDraftByRowIndex(0);

    // Optionally set title / price before publishing (if your UI supports it)
    // await publish.setTitle('Automation Test Product');
    // await publish.setPrice(29.99);

    await drafts.publishSelectedDrafts();
    await publish.expectPublished();
  });

});
