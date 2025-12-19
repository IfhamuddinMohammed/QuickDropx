// pages/AddProductPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class AddProductPage extends BasePage {
  constructor(page) {
    super(page);

    // Ensure we are on the correct screen
    this.addProductNav = page.getByRole('button', { name: /add product/i });

    // Tabs are usually buttons or tabs, not headings
    this.singleProductTab =
      page.getByRole('tab', { name: /single product/i })
        .or(page.getByRole('button', { name: /single product/i }))
        .first();

    this.urlInput = page.getByRole('textbox', {
      name: /enter url|enter url or product id/i
    });

    this.addDraftButton = page.getByRole('button', { name: /add draft/i });

    // More specific + less noisy than div:has-text
    this.detectedSupplier = page.getByText(/amazon/i);
    this.detectedRegion = page.getByText(/italy/i);
  }

  async addDraftFromAmazon(url) {
    //go to Add Product page if not already there
    if (await this.addProductNav.isVisible().catch(() => false)) {
      await this.addProductNav.click();
    }

    await expect(this.singleProductTab).toBeVisible({ timeout: 30_000 });
    await this.singleProductTab.click();

    await expect(this.urlInput).toBeVisible();
    await this.urlInput.fill(url);

    await expect(this.detectedSupplier).toBeVisible({ timeout: 15_000 });
    await expect(this.detectedRegion).toBeVisible({ timeout: 15_000 });

    await expect(this.addDraftButton).toBeEnabled();
    await this.addDraftButton.click();
  }
}
