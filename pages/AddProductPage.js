// pages/AddProductPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class AddProductPage extends BasePage {
  constructor(page) {
    super(page);

    this.addProductNav    = page.getByRole('button', { name: /Add Product/i });
    this.singleProductTab = page.getByText('Single Product', { exact: true });
    this.urlInput         = page.getByRole('textbox', { name: /Enter URL|Enter URL or Product ID/i });
    this.addDraftButton   = page.getByRole('button', { name: /Add Draft/i });
    this.detectedSupplier = page.getByText(/Amazon/i);
    this.detectedRegion   = page.getByText(/Italy/i);
  }

  async addDraftFromAmazon(url) {
    // Navigate to Add Product page via sidebar button
    await this.addProductNav.click();

    await expect(this.singleProductTab).toBeVisible({ timeout: 30_000 });
    await this.singleProductTab.click();

    await expect(this.urlInput).toBeVisible();
    await this.urlInput.fill(url);
    await this.urlInput.press('Enter');

    // Wait for supplier detection (single check — no duplicate)
    await expect(this.detectedSupplier).toBeVisible({ timeout: 20_000 });
    await expect(this.detectedRegion).toBeVisible({ timeout: 10_000 });

    // Wait until Add Draft button is enabled (API scrape complete)
    await expect(this.addDraftButton).toBeEnabled({ timeout: 20_000 });
    await this.addDraftButton.click();
  }
}
