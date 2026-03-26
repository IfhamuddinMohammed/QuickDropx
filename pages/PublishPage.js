// pages/PublishPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

export default class PublishPage extends BasePage {
  constructor(page) {
    super(page);

    // Publish modal/drawer elements
    this.publishModal       = page.locator('[role="dialog"], [data-testid="publish-modal"]').first();
    this.platformDropdown   = page.getByRole('combobox', { name: /platform|store/i });
    this.publishConfirmBtn  = page.getByRole('button', { name: /^publish$/i });
    this.cancelBtn          = page.getByRole('button', { name: /cancel/i });

    // Success / error states
    this.successToast       = page.getByText(/published successfully|listed on/i);
    this.errorToast         = page.getByText(/publish failed|error/i);

    // Product detail fields visible before publishing
    this.productTitle       = page.locator('[data-testid="product-title"], input[name="title"]').first();
    this.productPrice       = page.locator('[data-testid="product-price"], input[name="price"]').first();
  }

  /**
   * Complete the publish flow from the Drafts page.
   * Call this AFTER selectDraftByRowIndex() in DraftsPage.
   * @param {object} options
   * @param {string} [options.platform]  - e.g. 'eBay', 'Shopify' (optional, uses default if not passed)
   */
  async publish({ platform } = {}) {
    // If a platform selector is present, choose the platform
    const platformVisible = await this.platformDropdown.isVisible().catch(() => false);
    if (platform && platformVisible) {
      await this.platformDropdown.selectOption({ label: platform });
    }

    // Click the publish confirm button
    await expect(this.publishConfirmBtn).toBeEnabled({ timeout: 10_000 });
    await this.publishConfirmBtn.click();

    // Wait for success confirmation
    await expect(this.successToast).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Verify the product is in a published/listed state after publishing.
   */
  async expectPublished() {
    await expect(this.successToast).toBeVisible({ timeout: 20_000 });
  }

  /**
   * Update the product title before publishing (optional pre-publish edit).
   */
  async setTitle(title) {
    await expect(this.productTitle).toBeVisible();
    await this.productTitle.clear();
    await this.productTitle.fill(title);
  }

  /**
   * Update the product price before publishing.
   */
  async setPrice(price) {
    await expect(this.productPrice).toBeVisible();
    await this.productPrice.clear();
    await this.productPrice.fill(String(price));
  }
}
